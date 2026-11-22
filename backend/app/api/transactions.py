from fastapi import APIRouter, Depends, HTTPException, Query

from app.models.schemas import TransactionsResponse
from app.repositories.json_repository import JsonRepository
from app.services.transaction_service import get_transactions_summary

router = APIRouter(prefix="/api", tags=["Transactions"])

VALID_TYPES = {"Spend", "Income", "Transfer", "Refund", "Fee"}


def get_repo() -> JsonRepository:
    return JsonRepository()


@router.get("/transactions", response_model=TransactionsResponse)
def transactions(
    type: str | None = Query(None),
    repo: JsonRepository = Depends(get_repo),
):
    if type is not None and type not in VALID_TYPES:
        raise HTTPException(status_code=400, detail=f"Invalid transaction type: {type}. Valid types: {', '.join(sorted(VALID_TYPES))}")

    transactions_data = repo.get_transactions()
    own_accounts = repo.get_own_accounts()
    summary = get_transactions_summary(transactions_data, own_accounts, type)
    return TransactionsResponse(**summary)
