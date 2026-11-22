from app.services.transaction_service import (
    classify_transaction,
    classify_transactions,
    calculate_totals,
    filter_transactions,
)


class TestClassifyTransaction:
    """Test transaction classification rules on T1–T8."""

    def test_t1_grocery_mart_spend(self, sample_transactions, own_accounts):
        """T1: Grocery Mart $82.40 → Spend (Rule 5)."""
        txn = sample_transactions[0]
        result = classify_transaction(txn, set(own_accounts))
        assert result == "Spend"

    def test_t2_acme_payroll_income(self, sample_transactions, own_accounts):
        """T2: Acme Corp payroll -$2000.00, category Income → Income (Rule 2)."""
        txn = sample_transactions[1]
        result = classify_transaction(txn, set(own_accounts))
        assert result == "Income"

    def test_t3_transfer_to_savings(self, sample_transactions, own_accounts):
        """T3: Transfer to savings $300.00, toAccount 'My Savings' → Transfer (Rule 1)."""
        txn = sample_transactions[2]
        result = classify_transaction(txn, set(own_accounts))
        assert result == "Transfer"

    def test_t4_grocery_mart_return_refund(self, sample_transactions, own_accounts):
        """T4: Grocery Mart return -$12.40, category Groceries → Refund (Rule 3)."""
        txn = sample_transactions[3]
        result = classify_transaction(txn, set(own_accounts))
        assert result == "Refund"

    def test_t5_overdraft_fee(self, sample_transactions, own_accounts):
        """T5: Overdraft fee $35.00, category Bank Fees → Fee (Rule 4)."""
        txn = sample_transactions[4]
        result = classify_transaction(txn, set(own_accounts))
        assert result == "Fee"

    def test_t6_visa_card_payment_transfer(self, sample_transactions, own_accounts):
        """T6: Visa card payment $450.00, toAccount 'My Visa Card' → Transfer (Rule 1)."""
        txn = sample_transactions[5]
        result = classify_transaction(txn, set(own_accounts))
        assert result == "Transfer"

    def test_t7_pizza_place_spend_pending(self, sample_transactions, own_accounts):
        """T7: Pizza Place $28.75, status pending → Spend (Rule 5)."""
        txn = sample_transactions[6]
        result = classify_transaction(txn, set(own_accounts))
        assert result == "Spend"

    def test_t8_payment_to_alex_spend(self, sample_transactions, own_accounts):
        """T8: Payment to Alex $60.00, toAccount 'Alex' (not in ownAccounts) → Spend (Rule 5)."""
        txn = sample_transactions[7]
        result = classify_transaction(txn, set(own_accounts))
        assert result == "Spend"

    def test_priority_transfer_over_refund(self, own_accounts):
        """Priority: txn with negative amount AND to_account in own_accounts → Transfer (rule 1 wins over rule 3)."""
        txn = {"id": "TP1", "amount": -100, "category": "Other", "to_account": "My Savings"}
        result = classify_transaction(txn, set(own_accounts))
        assert result == "Transfer"

    def test_priority_refund_over_fee(self, own_accounts):
        """Priority: txn with amount < 0, category 'Bank Fees' → Refund (rule 3 wins over rule 4)."""
        txn = {"id": "TP2", "amount": -50, "category": "Bank Fees", "to_account": None}
        result = classify_transaction(txn, set(own_accounts))
        assert result == "Refund"


class TestClassifyTransactions:
    """Test batch classification."""

    def test_all_classified(self, sample_transactions, own_accounts):
        """All 8 transactions should be classified."""
        classified = classify_transactions(sample_transactions, own_accounts)
        assert len(classified) == 8
        assert all("type" in t for t in classified)


class TestCalculateTotals:
    """Test totals calculation."""

    def test_totals(self, sample_transactions, own_accounts):
        """
        Total Spend = 82.40 (T1) + 28.75 (T7) + 60.00 (T8) = 171.15
        Total Refunds = 12.40 (T4)
        Net Spend = 171.15 - 12.40 = 158.75
        """
        classified = classify_transactions(sample_transactions, own_accounts)
        total_spend, total_refunds, net_spend = calculate_totals(classified)
        assert total_spend == 171.15
        assert total_refunds == 12.40
        assert net_spend == 158.75

    def test_pending_included(self, sample_transactions, own_accounts):
        """T7 is pending, still counted in totals."""
        classified = classify_transactions(sample_transactions, own_accounts)
        t7 = [t for t in classified if t["id"] == "T7"][0]
        assert t7["type"] == "Spend"
        assert t7["status"] == "pending"
        assert t7["amount"] == 28.75


class TestFilterTransactions:
    """Test filtering transactions by type."""

    def test_filter_spend(self, sample_transactions, own_accounts):
        classified = classify_transactions(sample_transactions, own_accounts)
        spend_txns = filter_transactions(classified, "Spend")
        assert len(spend_txns) == 3
        assert {t["id"] for t in spend_txns} == {"T1", "T7", "T8"}

    def test_filter_transfer(self, sample_transactions, own_accounts):
        classified = classify_transactions(sample_transactions, own_accounts)
        transfer_txns = filter_transactions(classified, "Transfer")
        assert len(transfer_txns) == 2
        assert {t["id"] for t in transfer_txns} == {"T3", "T6"}

    def test_filter_all(self, sample_transactions, own_accounts):
        classified = classify_transactions(sample_transactions, own_accounts)
        all_txns = filter_transactions(classified, "All")
        assert len(all_txns) == 8

    def test_filter_none(self, sample_transactions, own_accounts):
        classified = classify_transactions(sample_transactions, own_accounts)
        all_txns = filter_transactions(classified, None)
        assert len(all_txns) == 8
