from datetime import date, timedelta

from fastapi import APIRouter, Depends, Query

from app.core.config import settings
from app.models.schemas import UpcomingBillsResponse, DateRangeSchema
from app.repositories.json_repository import JsonRepository
from app.services.bills_service import get_upcoming_bills

router = APIRouter(prefix="/api", tags=["Bills"])


def get_repo() -> JsonRepository:
    return JsonRepository()


@router.get("/bills/upcoming", response_model=UpcomingBillsResponse)
def upcoming_bills(
    reference_date: date | None = Query(None, description="Optional reference date (defaults to current date)"),
    repo: JsonRepository = Depends(get_repo),
):
    bills = repo.get_bills()
    ref_date = settings.get_reference_date(reference_date)
    upcoming, late, total = get_upcoming_bills(bills, reference_date=ref_date, window_days=14)
    window_end = ref_date + timedelta(days=14)
    return UpcomingBillsResponse(
        upcoming_bills=upcoming,
        potentially_late_bills=late,
        total_upcoming=total,
        date_range=DateRangeSchema(start=ref_date, end=window_end),
    )
