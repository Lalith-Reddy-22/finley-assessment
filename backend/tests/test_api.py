class TestHealthEndpoint:
    """Test /api/health endpoint."""

    def test_health(self, client):
        response = client.get("/api/health")
        assert response.status_code == 200
        data = response.json()
        assert data["status"] == "healthy"
        assert data["app_name"] == "Finley"
        assert data["version"] == "1.0.0"


class TestDashboardEndpoint:
    """Test /api/dashboard endpoint."""

    def test_dashboard(self, client):
        response = client.get("/api/dashboard")
        assert response.status_code == 200
        data = response.json()
        assert "safe_to_spend" in data
        assert "upcoming_bills" in data
        assert "transactions" in data


class TestSafeToSpendEndpoint:
    """Test /api/safe-to-spend endpoint."""

    def test_safe_to_spend(self, client):
        response = client.get("/api/safe-to-spend")
        assert response.status_code == 200
        data = response.json()
        assert "monthly_income" in data
        assert "bills_remaining" in data
        assert "safe_to_spend" in data
        assert "daily_allowance" in data
        assert "days_remaining" in data
        assert "is_negative" in data
        assert "over_by" in data


class TestBillsEndpoint:
    """Test /api/bills/upcoming endpoint."""

    def test_upcoming_bills(self, client):
        response = client.get("/api/bills/upcoming")
        assert response.status_code == 200
        data = response.json()
        assert "upcoming_bills" in data
        assert "potentially_late_bills" in data
        assert "total_upcoming" in data
        assert "date_range" in data


class TestTransactionsEndpoint:
    """Test /api/transactions endpoint."""

    def test_transactions(self, client):
        response = client.get("/api/transactions")
        assert response.status_code == 200
        data = response.json()
        assert "transactions" in data
        assert len(data["transactions"]) == 8
        assert "total_spend" in data
        assert "total_refunds" in data
        assert "net_spend" in data

    def test_transactions_filter_spend(self, client):
        response = client.get("/api/transactions?type=Spend")
        assert response.status_code == 200
        data = response.json()
        assert all(t["type"] == "Spend" for t in data["transactions"])

    def test_transactions_invalid_type(self, client):
        response = client.get("/api/transactions?type=Invalid")
        assert response.status_code == 400
