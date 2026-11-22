from datetime import date, timedelta

from fastapi import APIRouter, Depends, Query

from app.core.config import settings
from app.models.schemas import (
    DashboardResponse,
    HealthResponse,
    SafeToSpendResponse,
    UpcomingBillsResponse,
    TransactionsResponse,
    DateRangeSchema,
)
from app.repositories.json_repository import JsonRepository
from app.services.bills_service import get_upcoming_bills
from app.services.dashboard_service import calculate_safe_to_spend
from app.services.transaction_service import get_transactions_summary

router = APIRouter(prefix="/api", tags=["Dashboard"])


def get_repo() -> JsonRepository:
    return JsonRepository()


@router.get("/health", response_model=HealthResponse)
def health():
    return HealthResponse(status="healthy", app_name="Finley", version="1.0.0")


@router.get("/safe-to-spend", response_model=SafeToSpendResponse)
def safe_to_spend(
    reference_date: date | None = Query(None, description="Optional reference date (defaults to 2026-11-18)"),
    repo: JsonRepository = Depends(get_repo),
):
    ref_date = settings.get_reference_date(reference_date)
    income_sources = repo.get_income_sources()
    bills = repo.get_bills()
    spent = repo.get_spent_this_month()
    result = calculate_safe_to_spend(income_sources, bills, spent, reference_date=ref_date)
    return SafeToSpendResponse(**result)


@router.get("/dashboard", response_model=DashboardResponse)
def dashboard(
    reference_date: date | None = Query(None, description="Optional reference date (defaults to 2026-11-18)"),
    repo: JsonRepository = Depends(get_repo),
):
    ref_date = settings.get_reference_date(reference_date)
    income_sources = repo.get_income_sources()
    bills = repo.get_bills()
    spent = repo.get_spent_this_month()
    transactions = repo.get_transactions()
    own_accounts = repo.get_own_accounts()

    # Safe to spend
    sts = calculate_safe_to_spend(income_sources, bills, spent, reference_date=ref_date)

    # Upcoming bills
    upcoming, late, total = get_upcoming_bills(bills, reference_date=ref_date, window_days=14)
    window_end = ref_date + timedelta(days=14)
    bills_response = UpcomingBillsResponse(
        upcoming_bills=upcoming,
        potentially_late_bills=late,
        total_upcoming=total,
        date_range=DateRangeSchema(start=ref_date, end=window_end),
    )

    # Transactions
    txn_summary = get_transactions_summary(transactions, own_accounts)

    return DashboardResponse(
        safe_to_spend=SafeToSpendResponse(**sts),
        upcoming_bills=bills_response,
        transactions=TransactionsResponse(**txn_summary),
    )
