from datetime import date

from app.services.bills_service import get_upcoming_bills, get_bills_remaining_this_month
from app.utils.date_utils import generate_occurrences, days_remaining_in_month


class TestGenerateOccurrences:
    """Test occurrence generation for different frequencies."""

    def test_weekly_gym(self, reference_date):
        """Weekly: Gym (last 11-13) generates 11-20, 11-27 in [11-18, 12-02]."""
        last_charged = date(2026, 11, 13)
        window_end = date(2026, 12, 2)
        occs = generate_occurrences(last_charged, "weekly", window_end)
        assert date(2026, 11, 20) in occs
        assert date(2026, 11, 27) in occs

    def test_biweekly_music_app(self, reference_date):
        """Biweekly: Music App (last 11-10) generates 11-24 in [11-18, 12-02]."""
        last_charged = date(2026, 11, 10)
        window_end = date(2026, 12, 2)
        occs = generate_occurrences(last_charged, "biweekly", window_end)
        assert date(2026, 11, 24) in occs

    def test_monthly_phone(self, reference_date):
        """Monthly: Phone (last 10-25) generates 11-25 in [11-18, 12-02]."""
        last_charged = date(2026, 10, 25)
        window_end = date(2026, 12, 2)
        occs = generate_occurrences(last_charged, "monthly", window_end)
        assert date(2026, 11, 25) in occs

    def test_monthly_end_of_month_car_loan(self, reference_date):
        """Monthly end-of-month: Car Loan (last 10-31) → 11-30 (not 11-31)."""
        last_charged = date(2026, 10, 31)
        window_end = date(2026, 12, 2)
        occs = generate_occurrences(last_charged, "monthly", window_end)
        assert date(2026, 11, 30) in occs

    def test_monthly_preserves_original_31st_across_short_months(self):
        """A bill on Jan 31 should hit Feb 28, then Mar 31, then Apr 30, then May 31."""
        last_charged = date(2025, 1, 31)
        window_end = date(2025, 5, 31)
        occs = generate_occurrences(last_charged, "monthly", window_end)
        assert occs == [
            date(2025, 2, 28),
            date(2025, 3, 31),
            date(2025, 4, 30),
            date(2025, 5, 31),
        ]

    def test_annual_car_insurance(self, reference_date):
        """Annual: Car Insurance (last 2025-11-30) → 2026-11-30."""
        last_charged = date(2025, 11, 30)
        window_end = date(2026, 12, 2)
        occs = generate_occurrences(last_charged, "annually", window_end)
        assert date(2026, 11, 30) in occs

    def test_leap_year_annual(self, reference_date):
        """Leap year: bill last charged 2024-02-29 annually → 2025-02-28."""
        last_charged = date(2024, 2, 29)
        window_end = date(2025, 3, 1)
        occs = generate_occurrences(last_charged, "annually", window_end)
        assert date(2025, 2, 28) in occs

    def test_multiple_occurrences_weekly(self, reference_date):
        """Multiple occurrences: Gym has 2 hits in 14-day window."""
        last_charged = date(2026, 11, 13)
        window_end = date(2026, 12, 2)
        occs = generate_occurrences(last_charged, "weekly", window_end)
        # From 11-13: 11-20, 11-27 (both within window)
        in_window = [o for o in occs if o >= date(2026, 11, 18)]
        assert len(in_window) == 2


class TestGetUpcomingBills:
    """Test upcoming bills logic."""

    def test_bill_due_today(self, reference_date):
        """A bill whose next occurrence IS today should be included."""
        bills = [
            {"id": "BT", "name": "Test", "amount": 10.0, "frequency": "weekly",
             "last_charged": date(2026, 11, 11)},
        ]
        # 11-11 + 7 = 11-18 = today
        upcoming, late, total = get_upcoming_bills(bills, reference_date)
        dates = [b["expected_date"] for b in upcoming]
        assert date(2026, 11, 18) in dates

    def test_bill_on_last_day_of_window(self, reference_date):
        """Bill on last day of window should be included (window is inclusive)."""
        # Window end = 11-18 + 14 = 12-02
        bills = [
            {"id": "BW", "name": "WindowEnd", "amount": 5.0, "frequency": "monthly",
             "last_charged": date(2026, 11, 2)},
        ]
        # Next = 12-02, which is window_end
        upcoming, late, total = get_upcoming_bills(bills, reference_date, window_days=14)
        dates = [b["expected_date"] for b in upcoming]
        assert date(2026, 12, 2) in dates

    def test_potentially_late_internet(self, sample_bills, reference_date):
        """Internet (last 10-10) → next 11-10 < today 11-18 → LATE."""
        upcoming, late, total = get_upcoming_bills(sample_bills, reference_date)
        late_names = [b["name"] for b in late]
        assert "Internet" in late_names
        internet = [b for b in late if b["name"] == "Internet"][0]
        assert internet["is_late"] is True
        assert internet["expected_date"] == date(2026, 11, 10)

    def test_upcoming_bills_sorted(self, sample_bills, reference_date):
        """Upcoming bills should be sorted by date."""
        upcoming, late, total = get_upcoming_bills(sample_bills, reference_date)
        dates = [b["expected_date"] for b in upcoming]
        assert dates == sorted(dates)

    def test_gym_two_occurrences(self, sample_bills, reference_date):
        """Gym should have 2 occurrences in 14-day window."""
        upcoming, late, total = get_upcoming_bills(sample_bills, reference_date)
        gym_bills = [b for b in upcoming if b["name"] == "Gym"]
        assert len(gym_bills) == 2


class TestBillsRemainingThisMonth:
    """Test bills remaining in current month."""

    def test_total_remaining(self, sample_bills, reference_date):
        """Bills remaining this month total should be $1,529."""
        remaining, total = get_bills_remaining_this_month(sample_bills, reference_date)
        # Phone $45 + Gym $12×2 + Car Insurance $1200 + Car Loan $250 + Music App $10 = $1529
        assert total == 1529.0

    def test_rent_not_in_remaining(self, sample_bills, reference_date):
        """Rent next occurrence is 12-01, should NOT be in remaining this month."""
        remaining, total = get_bills_remaining_this_month(sample_bills, reference_date)
        names = [b["name"] for b in remaining]
        assert "Rent" not in names

    def test_remaining_bills_names(self, sample_bills, reference_date):
        """Check that the right bills are in remaining."""
        remaining, total = get_bills_remaining_this_month(sample_bills, reference_date)
        names = [b["name"].lower() for b in remaining]
        assert "phone" in names
        assert "gym" in names
        assert "car insurance" in names
        assert "car loan" in names
        assert "music app" in names


class TestDaysRemaining:
    """Test days remaining in month."""

    def test_days_remaining_nov_18(self, reference_date):
        """Nov 18 through Nov 30 inclusive = 13 days."""
        assert days_remaining_in_month(reference_date) == 13
