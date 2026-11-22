from datetime import date
from typing import Optional
from pydantic import BaseModel


class HealthResponse(BaseModel):
    status: str
    app_name: str
    version: str


class IncomeSourceSchema(BaseModel):
    name: str
    amount: float
    frequency: str


class UpcomingBillSchema(BaseModel):
    id: str
    name: str
    amount: float
    frequency: str
    expected_date: date
    is_late: bool = False


class DateRangeSchema(BaseModel):
    start: date
    end: date


class ClassifiedTransactionSchema(BaseModel):
    id: str
    date: date
    description: str
    category: str
    amount: float
    status: str
    to_account: Optional[str] = None
    type: str


class SafeToSpendResponse(BaseModel):
    monthly_income: float
    bills_remaining: float
    spent_this_month: float
    safe_to_spend: float
    daily_allowance: float
    days_remaining: int
    is_negative: bool
    over_by: float


class UpcomingBillsResponse(BaseModel):
    upcoming_bills: list[UpcomingBillSchema]
    potentially_late_bills: list[UpcomingBillSchema]
    total_upcoming: float
    date_range: DateRangeSchema


class TransactionsResponse(BaseModel):
    transactions: list[ClassifiedTransactionSchema]
    total_spend: float
    total_refunds: float
    net_spend: float
    filter_type: Optional[str] = None


class DashboardResponse(BaseModel):
    safe_to_spend: SafeToSpendResponse
    upcoming_bills: UpcomingBillsResponse
    transactions: TransactionsResponse
