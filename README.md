# Finley – Personal Finance Dashboard

Finley is a personal finance dashboard with real-time Safe-to-Spend calculations, recurring bill forecasting, and transaction classification.

---

## Prerequisites

- **Python 3.10+**
- **Node.js 18+** & **npm**

---

## Setup & Running

### 1. Backend (FastAPI)

```bash
cd backend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Start backend server
python3 run.py
```

The API will run at **http://localhost:8000**  
Interactive API Docs (Swagger): **http://localhost:8000/docs**

---

### 2. Frontend (React 19 + Vite)

Open a separate terminal:

```bash
cd frontend

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will run at **http://localhost:5173**

---

## Running Tests & Linting

### Backend Tests (51 Unit Tests)
```bash
cd backend
python3 -m pytest tests/ -v
```

### Frontend Lint & Build
```bash
cd frontend
npm run lint
npm run build
```

---

## Features

- **Safe to Spend**: Dynamic calculation of discretionary cash remaining, daily allowance, and remaining month days.
- **Date Switcher**: Compact reverse switch in the top bar to toggle between **Current Date** (live system date) and **PDF Benchmark Date** (Nov 18, 2026).
- **Upcoming Bills**: Forecasts recurrence across weekly, biweekly, monthly, and annual cadences within a 14-day window.
- **Categorized Transactions**: Sequential classification hierarchy (Internal Transfers → Income → Refunds → Bank Fees → Spend).
