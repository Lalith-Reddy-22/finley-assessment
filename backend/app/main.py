from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.core.config import settings
from app.api.dashboard import router as dashboard_router
from app.api.bills import router as bills_router
from app.api.transactions import router as transactions_router

app = FastAPI(title="Finley", version="1.0.0")

app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(dashboard_router)
app.include_router(bills_router)
app.include_router(transactions_router)
