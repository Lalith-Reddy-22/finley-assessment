from datetime import date
import calendar


def get_last_day_of_month(year: int, month: int) -> int:
    """Return the last day of the given month/year."""
    return calendar.monthrange(year, month)[1]


def get_end_of_month(d: date) -> date:
    """Return the last date of the month containing d."""
    last_day = get_last_day_of_month(d.year, d.month)
    return date(d.year, d.month, last_day)


def days_remaining_in_month(reference_date: date) -> int:
    """Count days remaining in the month, counting today as remaining (inclusive)."""
    end = get_end_of_month(reference_date)
    return (end - reference_date).days + 1


def _add_months(start: date, months: int, original_day: int) -> date:
    """Add months to a date, preserving the original day-of-month."""
    month = start.month - 1 + months
    year = start.year + month // 12
    month = month % 12 + 1
    day = min(original_day, get_last_day_of_month(year, month))
    return date(year, month, day)


def generate_occurrences(last_charged: date, frequency: str, window_end: date) -> list[date]:
    """Generate ALL payment occurrences after last_charged up to and including window_end."""
    occurrences: list[date] = []
    original_day = last_charged.day

    if frequency == "weekly":
        from datetime import timedelta
        current = last_charged + timedelta(days=7)
        while current <= window_end:
            occurrences.append(current)
            current += timedelta(days=7)

    elif frequency == "biweekly":
        from datetime import timedelta
        current = last_charged + timedelta(days=14)
        while current <= window_end:
            occurrences.append(current)
            current += timedelta(days=14)

    elif frequency == "monthly":
        months_added = 1
        while True:
            current = _add_months(last_charged, months_added, original_day)
            if current > window_end:
                break
            occurrences.append(current)
            months_added += 1

    elif frequency == "annually":
        years_added = 1
        while True:
            year = last_charged.year + years_added
            month = last_charged.month
            day = original_day
            # Handle Feb 29 in non-leap years
            if month == 2 and day == 29:
                if not calendar.isleap(year):
                    day = 28
            else:
                day = min(day, get_last_day_of_month(year, month))
            current = date(year, month, day)
            if current > window_end:
                break
            occurrences.append(current)
            years_added += 1

    return occurrences
