import pytest
from datetime import date

from app.services.dashboard_service import calculate_monthly_income, calculate_safe_to_spend
from app.utils.date_utils import days_remaining_in_month


class TestCalculateMonthlyIncome:
    """Test monthly income calculation."""

    def test_salary_biweekly(self):
        """Salary biweekly $2000 → $4333.33."""
        sources = [{"name": "Salary", "amount": 2000.00, "frequency": "biweekly"}]
        result = calculate_monthly_income(sources)
        assert result == round(2000.00 * 26 / 12, 2)
        assert result == 4333.33

    def test_freelance_monthly(self):
        """Freelance monthly $600 → $600."""
        sources = [{"name": "Freelance", "amount": 600.00, "frequency": "monthly"}]
        result = calculate_monthly_income(sources)
        assert result == 600.00

    def test_total_income(self, income_sources):
        """Total monthly income: $4333.33 + $600 = $4933.33."""
        result = calculate_monthly_income(income_sources)
        assert result == 4933.33

    def test_weekly_frequency(self):
        """Weekly: amount × 52 / 12."""
        sources = [{"name": "Test", "amount": 100.00, "frequency": "weekly"}]
        result = calculate_monthly_income(sources)
        assert result == round(100.00 * 52 / 12, 2)

    def test_semi_monthly_frequency(self):
        """Semi-monthly: amount × 2."""
        sources = [{"name": "Test", "amount": 1500.00, "frequency": "semi-monthly"}]
        result = calculate_monthly_income(sources)
        assert result == 3000.00

    def test_annually_frequency(self):
        """Annually: amount / 12."""
        sources = [{"name": "Test", "amount": 12000.00, "frequency": "annually"}]
        result = calculate_monthly_income(sources)
        assert result == 1000.00


class TestCalculateSafeToSpend:
    """Test safe to spend calculation."""

    def test_safe_to_spend(self, income_sources, sample_bills, reference_date):
        """Safe to Spend: 4933.33 - 1529.00 - 2950.00 = 454.33."""
        result = calculate_safe_to_spend(income_sources, sample_bills, 2950.00, reference_date)
        assert result["monthly_income"] == 4933.33
        assert result["bills_remaining"] == 1529.0
        assert result["spent_this_month"] == 2950.00
        assert result["safe_to_spend"] == 454.33
        assert result["is_negative"] is False
        assert result["over_by"] == 0.0

    def test_days_remaining(self, reference_date):
        """Days remaining on 11-18: 13 (Nov 18 through Nov 30 inclusive)."""
        assert days_remaining_in_month(reference_date) == 13

    def test_daily_allowance(self, income_sources, sample_bills, reference_date):
        """Daily allowance: 454.33 / 13 ≈ 34.95."""
        result = calculate_safe_to_spend(income_sources, sample_bills, 2950.00, reference_date)
        assert result["daily_allowance"] == round(454.33 / 13, 2)
        assert result["daily_allowance"] == 34.95
        assert result["days_remaining"] == 13

    def test_negative_safe_to_spend(self, income_sources, sample_bills, reference_date):
        """Negative safe to spend: safe_to_spend=0, is_negative=True, over_by=positive."""
        # Set spent very high
        result = calculate_safe_to_spend(income_sources, sample_bills, 10000.00, reference_date)
        assert result["safe_to_spend"] == 0.0
        assert result["is_negative"] is True
        assert result["over_by"] > 0
        assert result["daily_allowance"] == 0.0
        # Exact: 4933.33 - 1529.00 - 10000.00 = -6595.67
        assert result["over_by"] == 6595.67
