import json
from datetime import date
from app.core.config import settings


class JsonRepository:
    def __init__(self):
        self._cache = None

    def _load(self) -> dict:
        if self._cache is None:
            with open(settings.DATA_PATH, "r") as f:
                self._cache = json.load(f)
        return self._cache

    def reload(self):
        self._cache = None

    def get_today(self) -> date:
        data = self._load()
        today_str = data.get("today")
        if today_str:
            try:
                return date.fromisoformat(today_str)
            except ValueError:
                pass
        return date.today()

    def get_income_sources(self) -> list[dict]:
        data = self._load()
        raw_sources = data.get("incomeSources") or data.get("income_sources", [])
        sources = []
        for s in raw_sources:
            cadence = s.get("cadence") or s.get("frequency")
            sources.append({
                "name": s["name"],
                "amount": float(s["amount"]),
                "frequency": cadence,
                "cadence": cadence,
            })
        return sources

    def get_spent_this_month(self) -> float:
        data = self._load()
        if "spentThisMonth" in data:
            return float(data["spentThisMonth"])
        return float(data.get("spent_this_month", 0.0))

    def get_bills(self) -> list[dict]:
        data = self._load()
        bills = []
        raw_bills = data.get("bills", [])
        for idx, b in enumerate(raw_bills):
            last_charged_str = b.get("lastCharged") or b.get("last_charged")
            frequency = b.get("cadence") or b.get("frequency")
            bill_id = b.get("id") or f"B{idx + 1}"
            bills.append({
                "id": bill_id,
                "name": b["name"],
                "amount": float(b["amount"]),
                "frequency": frequency,
                "cadence": frequency,
                "last_charged": date.fromisoformat(last_charged_str),
            })
        return bills

    def get_own_accounts(self) -> list[str]:
        data = self._load()
        return data.get("ownAccounts") or data.get("own_accounts", [])

    def get_transactions(self) -> list[dict]:
        data = self._load()
        transactions = []
        raw_txns = data.get("transactions", [])
        for t in raw_txns:
            to_acc = t.get("toAccount") if "toAccount" in t else t.get("to_account")
            transactions.append({
                "id": t["id"],
                "date": date.fromisoformat(t["date"]),
                "description": t["description"],
                "category": t["category"],
                "amount": float(t["amount"]),
                "status": t["status"],
                "to_account": to_acc,
            })
        return transactions
