def classify_transaction(txn: dict, own_accounts_set: set) -> str:
    """Classify a transaction. Rules checked in order, first match wins."""
    # Rule 1: Transfer to own account
    if txn.get("to_account") and txn["to_account"] in own_accounts_set:
        return "Transfer"
    # Rule 2: Negative amount with Income category
    if txn["amount"] < 0 and txn.get("category") == "Income":
        return "Income"
    # Rule 3: Negative amount (refund)
    if txn["amount"] < 0:
        return "Refund"
    # Rule 4: Bank Fees
    if txn.get("category") == "Bank Fees":
        return "Fee"
    # Rule 5: Everything else
    return "Spend"


def classify_transactions(transactions: list[dict], own_accounts: list[str]) -> list[dict]:
    """Classify all transactions, adding a 'type' field to each."""
    own_accounts_set = set(own_accounts)
    result = []
    for txn in transactions:
        classified = dict(txn)
        classified["type"] = classify_transaction(txn, own_accounts_set)
        result.append(classified)
    return result


def calculate_totals(classified: list[dict]) -> tuple[float, float, float]:
    """
    Returns (total_spend, total_refunds, net_spend).
    Total Spend = sum of amounts where type=="Spend"
    Total Refunds = sum of ABSOLUTE amounts where type=="Refund"
    Net Spend = Total Spend - Total Refunds
    Pending transactions ARE included.
    """
    total_spend = round(sum(t["amount"] for t in classified if t["type"] == "Spend"), 2)
    total_refunds = round(sum(abs(t["amount"]) for t in classified if t["type"] == "Refund"), 2)
    net_spend = round(total_spend - total_refunds, 2)
    return total_spend, total_refunds, net_spend


def filter_transactions(classified: list[dict], filter_type: str | None = None) -> list[dict]:
    """Filter transactions by type. If None or 'All', return all."""
    if filter_type is None or filter_type == "All":
        return classified
    return [t for t in classified if t["type"] == filter_type]


def get_transactions_summary(
    transactions: list[dict],
    own_accounts: list[str],
    filter_type: str | None = None,
) -> dict:
    """Get classified transactions with totals and optional filtering."""
    classified = classify_transactions(transactions, own_accounts)
    total_spend, total_refunds, net_spend = calculate_totals(classified)
    filtered = filter_transactions(classified, filter_type)
    return {
        "transactions": filtered,
        "total_spend": total_spend,
        "total_refunds": total_refunds,
        "net_spend": net_spend,
        "filter_type": filter_type,
    }
