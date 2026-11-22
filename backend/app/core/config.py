import os
from datetime import date
from pathlib import Path


class Settings:
    APP_NAME: str = "Finley"
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://127.0.0.1:5173",
        "http://127.0.0.1:3000",
    ]
    DATA_PATH: Path = Path(__file__).resolve().parent.parent / "data" / "mock_data.json"

    def get_reference_date(self, override: date | None = None) -> date:
        if override is not None:
            return override
        env_val = os.getenv("FINLEY_REFERENCE_DATE")
        if env_val:
            try:
                return date.fromisoformat(env_val)
            except ValueError:
                pass
        try:
            from app.repositories.json_repository import JsonRepository
            return JsonRepository().get_today()
        except Exception:
            return date(2026, 11, 18)


settings = Settings()
