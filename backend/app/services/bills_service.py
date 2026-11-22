from datetime import date, timedelta

from app.utils.date_utils import generate_occurrences, get_end_of_month


def get_upcoming_bills(
    bills: list[dict],
    reference_date: date | None = None,
    window_days: int = 14,
) -> tuple[list[dict], list[dict], float]:
    """
    Returns (upcoming_list, late_list, total_upcoming_amount).
    Window is [today, today + window_days] INCLUSIVE on both ends.
    Occurrences BEFORE today -> potentially late.
    """
    today = reference_date or date.today()
    window_end = today + timedelta(days=window_days)

    upcoming_list: list[dict] = []
    late_list: list[dict] = []

    for bill in bills:
        occurrences = generate_occurrences(bill["last_charged"], bill["frequency"], window_end)
        for occ in occurrences:
            entry = {
                "id": bill["id"],
                "name": bill["name"],
                "amount": bill["amount"],
                "frequency": bill["frequency"],
                "expected_date": occ,
            }
            if occ < today:
                entry["is_late"] = True
                late_list.append(entry)
            else:
                entry["is_late"] = False
                upcoming_list.append(entry)

    upcoming_list.sort(key=lambda x: x["expected_date"])
    total = round(sum(b["amount"] for b in upcoming_list), 2)
    return upcoming_list, late_list, total


def get_bills_remaining_this_month(
    bills: list[dict],
    reference_date: date | None = None,
) -> tuple[list[dict], float]:
    """
    Window is [today, end_of_month] INCLUSIVE.
    Returns (remaining_list, total_amount).
    """
    today = reference_date or date.today()
    month_end = get_end_of_month(today)

    remaining_list: list[dict] = []

    for bill in bills:
        occurrences = generate_occurrences(bill["last_charged"], bill["frequency"], month_end)
        for occ in occurrences:
            if occ >= today:
                entry = {
                    "id": bill["id"],
                    "name": bill["name"],
                    "amount": bill["amount"],
                    "frequency": bill["frequency"],
                    "expected_date": occ,
                    "is_late": False,
                }
                remaining_list.append(entry)

    remaining_list.sort(key=lambda x: x["expected_date"])
    total = round(sum(b["amount"] for b in remaining_list), 2)
    return remaining_list, total
