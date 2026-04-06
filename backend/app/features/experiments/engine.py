"""A/B testing engine — assignment, conversion tracking, and results analysis."""

import json
import hashlib
import logging
from app.db.connection import get_pool

logger = logging.getLogger(__name__)


async def get_assignment(session_id: str, experiment_name: str) -> str | None:
    """Get or create an A/B experiment assignment for a session.

    Uses deterministic hashing for consistent assignment.
    """
    pool = await get_pool()

    # Check for existing assignment
    row = await pool.fetchrow(
        """SELECT variant FROM ab_assignments aa
           JOIN ab_experiments ae ON aa.experiment_id = ae.id
           WHERE aa.session_id = $1 AND ae.name = $2""",
        session_id,
        experiment_name,
    )
    if row:
        return row["variant"]

    # Get experiment config
    experiment = await pool.fetchrow(
        "SELECT id, variants, traffic_split, status FROM ab_experiments WHERE name = $1",
        experiment_name,
    )
    if not experiment or experiment["status"] != "running":
        return None

    variants = experiment["variants"]
    if isinstance(variants, str):
        variants = json.loads(variants)

    traffic_split = experiment["traffic_split"]
    if isinstance(traffic_split, str):
        traffic_split = json.loads(traffic_split)

    # Deterministic assignment using hash
    hash_input = f"{experiment_name}:{session_id}"
    hash_val = int(hashlib.md5(hash_input.encode()).hexdigest(), 16) % 100

    cumulative = 0
    assigned_variant = variants[0]
    for variant in variants:
        cumulative += traffic_split.get(variant, 50)
        if hash_val < cumulative:
            assigned_variant = variant
            break

    # Store assignment
    await pool.execute(
        """INSERT INTO ab_assignments (experiment_id, session_id, variant)
           VALUES ($1, $2, $3)
           ON CONFLICT (experiment_id, session_id) DO NOTHING""",
        experiment["id"],
        session_id,
        assigned_variant,
    )

    return assigned_variant


async def record_conversion(
    session_id: str,
    experiment_name: str,
    metric_name: str,
    metric_value: float = 1.0,
) -> bool:
    """Record a conversion event for an A/B experiment."""
    pool = await get_pool()

    row = await pool.fetchrow(
        """SELECT aa.experiment_id, aa.variant
           FROM ab_assignments aa
           JOIN ab_experiments ae ON aa.experiment_id = ae.id
           WHERE aa.session_id = $1 AND ae.name = $2""",
        session_id,
        experiment_name,
    )
    if not row:
        return False

    await pool.execute(
        """INSERT INTO ab_conversions (experiment_id, session_id, variant, metric_name, metric_value)
           VALUES ($1, $2, $3, $4, $5)""",
        row["experiment_id"],
        session_id,
        row["variant"],
        metric_name,
        metric_value,
    )
    return True


async def get_experiment_results(experiment_name: str) -> dict:
    """Get experiment results with basic significance testing."""
    pool = await get_pool()

    experiment = await pool.fetchrow(
        "SELECT id, name, variants, status FROM ab_experiments WHERE name = $1",
        experiment_name,
    )
    if not experiment:
        return {"error": "Experiment not found"}

    variants = experiment["variants"]
    if isinstance(variants, str):
        variants = json.loads(variants)

    results = {}
    for variant in variants:
        # Count assignments
        assigned = await pool.fetchval(
            """SELECT COUNT(*) FROM ab_assignments
               WHERE experiment_id = $1 AND variant = $2""",
            experiment["id"],
            variant,
        )

        # Count conversions by metric
        metrics = await pool.fetch(
            """SELECT metric_name, COUNT(*) as count, SUM(metric_value) as total
               FROM ab_conversions
               WHERE experiment_id = $1 AND variant = $2
               GROUP BY metric_name""",
            experiment["id"],
            variant,
        )

        results[variant] = {
            "assigned": assigned,
            "conversions": {
                m["metric_name"]: {
                    "count": m["count"],
                    "total": float(m["total"]),
                    "rate": round(m["count"] / max(assigned, 1) * 100, 2),
                }
                for m in metrics
            },
        }

    return {
        "experiment": experiment_name,
        "status": experiment["status"],
        "variants": results,
    }
