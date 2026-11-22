import pytest
from datetime import date
from fastapi.testclient import TestClient

from app.main import app


@pytest.fixture
def reference_date():
    return date(2026, 11, 18)


@pytest.fixture
def sample_bills():
    return [
        {"id": "B1", "name": "Rent", "amount": 1500.00, "frequency": "monthly", "last_charged": date(2026, 11, 1)},
        {"id": "B2", "name": "Phone", "amount": 45.00, "frequency": "monthly", "last_charged": date(2026, 10, 25)},
        {"id": "B3", "name": "Gym", "amount": 12.00, "frequency": "weekly", "last_charged": date(2026, 11, 13)},
        {"id": "B4", "name": "Internet", "amount": 60.00, "frequency": "monthly", "last_charged": date(2026, 10, 10)},
        {"id": "B5", "name": "Car insurance", "amount": 1200.00, "frequency": "annually", "last_charged": date(2025, 11, 30)},
        {"id": "B6", "name": "Car loan", "amount": 250.00, "frequency": "monthly", "last_charged": date(2026, 10, 31)},
        {"id": "B7", "name": "Music app", "amount": 10.00, "frequency": "biweekly", "last_charged": date(2026, 11, 10)},
    ]


@pytest.fixture
def sample_transactions():
    return [
        {"id": "T1", "date": date(2026, 11, 2), "description": "Grocery Mart", "category": "Groceries", "amount": 82.40, "status": "posted", "to_account": None},
        {"id": "T2", "date": date(2026, 11, 3), "description": "Acme Corp payroll", "category": "Income", "amount": -2000.00, "status": "posted", "to_account": None},
        {"id": "T3", "date": date(2026, 11, 5), "description": "Transfer to savings", "category": "Transfer", "amount": 300.00, "status": "posted", "to_account": "My Savings"},
        {"id": "T4", "date": date(2026, 11, 6), "description": "Grocery Mart return", "category": "Groceries", "amount": -12.40, "status": "posted", "to_account": None},
        {"id": "T5", "date": date(2026, 11, 8), "description": "Overdraft fee", "category": "Bank Fees", "amount": 35.00, "status": "posted", "to_account": None},
        {"id": "T6", "date": date(2026, 11, 9), "description": "Visa card payment", "category": "Credit Card Payment", "amount": 450.00, "status": "posted", "to_account": "My Visa Card"},
        {"id": "T7", "date": date(2026, 11, 10), "description": "Pizza Place", "category": "Dining", "amount": 28.75, "status": "pending", "to_account": None},
        {"id": "T8", "date": date(2026, 11, 12), "description": "Payment to Alex", "category": "Transfer", "amount": 60.00, "status": "posted", "to_account": "Alex"},
    ]


@pytest.fixture
def own_accounts():
    return ["My Savings", "My Visa Card"]


@pytest.fixture
def income_sources():
    return [
        {"name": "Salary", "amount": 2000.00, "frequency": "biweekly"},
        {"name": "Freelance", "amount": 600.00, "frequency": "monthly"},
    ]


@pytest.fixture
def client():
    return TestClient(app)
