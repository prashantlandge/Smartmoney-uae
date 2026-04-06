"""Rate forecasting using historical remittance_rate_history data."""

import logging
from datetime import datetime, timedelta
from app.db.connection import get_pool

logger = logging.getLogger(__name__)


async def fetch_historical_rates(
    send_currency: str = "AED",
    receive_currency: str = "INR",
    days: int = 90,
) -> list[dict]:
    """Fetch historical daily average rates."""
    pool = await get_pool()
    rows = await pool.fetch(
        """SELECT DATE(recorded_at) as rate_date,
                  AVG(exchange_rate) as avg_rate,
                  MIN(exchange_rate) as min_rate,
                  MAX(exchange_rate) as max_rate,
                  COUNT(*) as data_points
           FROM remittance_rate_history
           WHERE send_currency = $1 AND receive_currency = $2
             AND recorded_at >= NOW() - INTERVAL '%s days'
           GROUP BY DATE(recorded_at)
           ORDER BY rate_date""" % days,
        send_currency,
        receive_currency,
    )
    return [
        {
            "date": r["rate_date"],
            "avg_rate": float(r["avg_rate"]),
            "min_rate": float(r["min_rate"]),
            "max_rate": float(r["max_rate"]),
            "data_points": r["data_points"],
        }
        for r in rows
    ]


def forecast_sma(history: list[dict], periods: int = 7, window: int = 7) -> list[dict]:
    """Simple Moving Average forecast with confidence bands.

    Uses the last `window` days to predict the next `periods` days.
    Confidence bands are +-1 standard deviation of the window.
    """
    if not history:
        return []

    rates = [h["avg_rate"] for h in history]

    # Use last `window` points for SMA
    recent = rates[-window:] if len(rates) >= window else rates
    sma = sum(recent) / len(recent)

    # Standard deviation for confidence bands
    if len(recent) > 1:
        mean = sma
        variance = sum((r - mean) ** 2 for r in recent) / (len(recent) - 1)
        std = variance ** 0.5
    else:
        std = 0

    last_date = history[-1]["date"]
    forecasts = []
    for i in range(1, periods + 1):
        forecast_date = last_date + timedelta(days=i)
        forecasts.append({
            "date": forecast_date,
            "predicted_rate": round(sma, 6),
            "confidence_lower": round(sma - std, 6),
            "confidence_upper": round(sma + std, 6),
            "model_type": "sma",
        })

    return forecasts


def forecast_arima(history: list[dict], periods: int = 7) -> list[dict]:
    """ARIMA(1,1,1) forecast using statsmodels. Falls back to SMA if insufficient data."""
    if len(history) < 30:
        return forecast_sma(history, periods)

    try:
        import numpy as np
        from statsmodels.tsa.arima.model import ARIMA

        rates = np.array([h["avg_rate"] for h in history])

        model = ARIMA(rates, order=(1, 1, 1))
        fitted = model.fit()

        forecast = fitted.forecast(steps=periods)
        conf_int = fitted.get_forecast(steps=periods).conf_int(alpha=0.32)  # ~1 std dev

        last_date = history[-1]["date"]
        results = []
        for i in range(periods):
            forecast_date = last_date + timedelta(days=i + 1)
            results.append({
                "date": forecast_date,
                "predicted_rate": round(float(forecast[i]), 6),
                "confidence_lower": round(float(conf_int[i, 0]), 6),
                "confidence_upper": round(float(conf_int[i, 1]), 6),
                "model_type": "arima",
            })
        return results

    except Exception as e:
        logger.warning("ARIMA forecast failed, falling back to SMA: %s", e)
        return forecast_sma(history, periods)


async def compute_rate_forecasts() -> int:
    """Batch job: compute forecasts for all currency corridors."""
    pool = await get_pool()

    # Find all active corridors
    corridors = await pool.fetch(
        """SELECT DISTINCT send_currency, receive_currency
           FROM remittance_rate_history
           WHERE recorded_at >= NOW() - INTERVAL '30 days'"""
    )

    count = 0
    for corridor in corridors:
        send = corridor["send_currency"]
        recv = corridor["receive_currency"]

        history = await fetch_historical_rates(send, recv, days=90)
        if not history:
            continue

        # Try ARIMA first, falls back to SMA
        forecasts = forecast_arima(history)

        # Record model run
        run_id = await pool.fetchval(
            """INSERT INTO model_runs (model_name, started_at, records_processed, status)
               VALUES ('rate_forecast', NOW(), $1, 'success')
               RETURNING id""",
            len(history),
        )

        # Store forecasts
        for f in forecasts:
            await pool.execute(
                """INSERT INTO rate_forecasts
                   (send_currency, receive_currency, forecast_date, predicted_rate,
                    confidence_lower, confidence_upper, model_type, computed_at)
                   VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
                   ON CONFLICT DO NOTHING""",
                send,
                recv,
                f["date"],
                f["predicted_rate"],
                f["confidence_lower"],
                f["confidence_upper"],
                f["model_type"],
            )
            count += 1

    logger.info("Generated %d rate forecasts", count)
    return count


async def get_best_time_prediction(
    send_currency: str = "AED",
    receive_currency: str = "INR",
) -> dict:
    """Get predictive best time to send based on forecasts."""
    pool = await get_pool()

    rows = await pool.fetch(
        """SELECT forecast_date, predicted_rate, confidence_lower, confidence_upper
           FROM rate_forecasts
           WHERE send_currency = $1 AND receive_currency = $2
             AND forecast_date >= CURRENT_DATE
           ORDER BY forecast_date
           LIMIT 7""",
        send_currency,
        receive_currency,
    )

    if not rows:
        return {
            "has_forecast": False,
            "recommendation": "Not enough data for predictions yet.",
        }

    # Find best day
    best = max(rows, key=lambda r: float(r["predicted_rate"]))
    best_date = best["forecast_date"]
    best_rate = float(best["predicted_rate"])

    day_name = best_date.strftime("%A")
    today = datetime.utcnow().date()
    days_away = (best_date - today).days

    if days_away == 0:
        timing = "today"
    elif days_away == 1:
        timing = "tomorrow"
    else:
        timing = f"on {day_name}"

    return {
        "has_forecast": True,
        "best_date": str(best_date),
        "predicted_rate": best_rate,
        "confidence_lower": float(best["confidence_lower"]),
        "confidence_upper": float(best["confidence_upper"]),
        "recommendation": f"Rates are expected to be best {timing} ({best_rate:.4f}). "
        + ("Consider waiting." if days_away > 0 else "Now is a good time to send!"),
    }
