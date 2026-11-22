from datetime import date

from app.services.bills_service import get_bills_remaining_this_month
from app.utils.date_utils import days_remaining_in_month


def calculate_monthly_income(income_sources: list[dict]) -> float:
    """Calculate total monthly income from all sources."""
    total = 0.0
    for source in income_sources:
        amount = source["amount"]
        frequency = source["frequency"]
        if frequency == "weekly":
            total += amount * 52 / 12
        elif frequency == "biweekly":
            total += amount * 26 / 12
        elif frequency == "semi-monthly":
            total += amount * 2
        elif frequency == "monthly":
            total += amount
        elif frequency == "annually":
            total += amount / 12
    return round(total, 2)


def calculate_safe_to_spend(
    income_sources: list[dict],
    bills: list[dict],
    spent_this_month: float,
    reference_date: date | None = None,
) -> dict:
    """Calculate safe-to-spend and daily allowance."""
    today = reference_date or date.today()

    monthly_income = calculate_monthly_income(income_sources)
    _, bills_remaining_total = get_bills_remaining_this_month(bills, today)
    days_rem = days_remaining_in_month(today)

    raw = round(monthly_income - bills_remaining_total - spent_this_month, 2)
    is_negative = raw < 0
    over_by = round(abs(raw), 2) if is_negative else 0.0
    safe_to_spend = round(max(raw, 0), 2)
    daily_allowance = round(safe_to_spend / days_rem, 2) if days_rem > 0 else 0.0

    return {
        "monthly_income": monthly_income,
        "bills_remaining": bills_remaining_total,
        "spent_this_month": round(spent_this_month, 2),
        "safe_to_spend": safe_to_spend,
        "daily_allowance": daily_allowance,
        "days_remaining": days_rem,
        "is_negative": is_negative,
        "over_by": over_by,
    }
