"""Claude API integration for AI-powered financial advisor."""

import json
import anthropic
from app.config import settings
from app.features.advisor.prompts import SYSTEM_CHAT_EN, SYSTEM_CHAT_AR, SYSTEM_RECOMMEND
from app.features.advisor.schemas import (
    ChatResponse,
    ProviderRecommendation,
)
from app.features.remittance.engine import compare_rates
from app.db.connection import get_pool


def _get_client() -> anthropic.Anthropic:
    return anthropic.Anthropic(api_key=settings.anthropic_api_key)


async def _get_user_profile(session_id: str) -> dict | None:
    pool = await get_pool()
    row = await pool.fetchrow(
        "SELECT * FROM user_profiles WHERE session_id = $1", session_id
    )
    return dict(row) if row else None


async def _build_rate_context(send_amount: float = 1000, currency: str = "INR") -> str:
    """Build a text summary of current rates for Claude context."""
    try:
        result = await compare_rates(send_amount, currency)
        lines = [f"Current AED to {currency} rates for sending AED {send_amount}:"]
        for p in result.providers:
            lines.append(
                f"- {p.provider_name}: rate {p.exchange_rate}, fee AED {p.fee_aed}, "
                f"recipient gets {p.recipient_receives_inr} {currency}, speed: {p.transfer_speed}"
            )
        lines.append(f"Mid-market rate: {result.mid_market_rate}")
        return "\n".join(lines)
    except Exception:
        return "Rate data temporarily unavailable."


async def chat(
    session_id: str,
    message: str,
    language: str = "en",
) -> ChatResponse:
    """Handle a chat message using Claude API."""
    if not settings.anthropic_api_key:
        return ChatResponse(
            reply="AI advisor is not configured. Please set the ANTHROPIC_API_KEY.",
            suggestions=[],
        )

    client = _get_client()

    # Build context
    profile = await _get_user_profile(session_id)
    rate_context = await _build_rate_context()

    profile_text = ""
    if profile:
        profile_text = (
            f"\nUser profile: nationality={profile.get('nationality', 'unknown')}, "
            f"salary=AED {profile.get('monthly_salary_aed', 'unknown')}, "
            f"employer={profile.get('employer_category', 'unknown')}, "
            f"transfer_frequency={profile.get('transfer_frequency', 'unknown')}, "
            f"preferred_speed={profile.get('preferred_speed', 'unknown')}"
        )

    system_prompt = SYSTEM_CHAT_AR if language == "ar" else SYSTEM_CHAT_EN
    user_content = f"{rate_context}\n{profile_text}\n\nUser question: {message}"

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=system_prompt,
        messages=[{"role": "user", "content": user_content}],
    )

    reply = response.content[0].text

    # Generate follow-up suggestions
    suggestions = []
    if language == "en":
        suggestions = [
            "Which provider has the lowest fees?",
            "What credit cards can I get?",
            "When is the best time to send money?",
        ]
    else:
        suggestions = [
            "أي مزود لديه أقل رسوم؟",
            "ما البطاقات الائتمانية المتاحة لي؟",
            "متى أفضل وقت لتحويل الأموال؟",
        ]

    return ChatResponse(reply=reply, suggestions=suggestions)


async def get_recommendations(
    session_id: str,
    send_amount_aed: float = 1000,
    receive_currency: str = "INR",
) -> list[ProviderRecommendation]:
    """Get AI-scored provider recommendations based on user profile."""
    if not settings.anthropic_api_key:
        return []

    client = _get_client()

    profile = await _get_user_profile(session_id)
    rates = await compare_rates(send_amount_aed, receive_currency)

    profile_json = json.dumps(
        {
            "nationality": profile.get("nationality", "IN") if profile else "IN",
            "salary_aed": float(profile.get("monthly_salary_aed", 0)) if profile and profile.get("monthly_salary_aed") else None,
            "employer": profile.get("employer_category") if profile else None,
            "transfer_frequency": profile.get("transfer_frequency") if profile else None,
            "preferred_speed": profile.get("preferred_speed") if profile else None,
        },
        default=str,
    )

    providers_json = json.dumps(
        [
            {
                "name": p.provider_name,
                "rate": p.exchange_rate,
                "fee": p.fee_aed,
                "speed": p.transfer_speed,
                "recipient_gets": p.recipient_receives_inr,
            }
            for p in rates.providers
        ]
    )

    response = client.messages.create(
        model="claude-sonnet-4-20250514",
        max_tokens=1024,
        system=SYSTEM_RECOMMEND,
        messages=[
            {
                "role": "user",
                "content": f"User profile: {profile_json}\n\nProviders: {providers_json}",
            }
        ],
    )

    try:
        raw = response.content[0].text.strip()
        # Handle potential markdown code blocks
        if raw.startswith("```"):
            raw = raw.split("\n", 1)[1].rsplit("```", 1)[0].strip()
        recommendations = json.loads(raw)
        return [
            ProviderRecommendation(
                provider_name=r["provider_name"],
                score=r["score"],
                reason=r["reason"],
            )
            for r in recommendations
        ]
    except (json.JSONDecodeError, KeyError):
        return []
