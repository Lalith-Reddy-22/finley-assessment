# Finley – Personal Finance Dashboard

[![FastAPI](https://img.shields.io/badge/FastAPI-0.115+-009688.svg?style=flat&logo=fastapi&logoColor=white)](https://fastapi.tiangolo.com)
[![React](https://img.shields.io/badge/React-19-61DAFB.svg?style=flat&logo=react&logoColor=black)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6.svg?style=flat&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC.svg?style=flat&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Pytest](https://img.shields.io/badge/Pytest-98%25_Coverage-brightgreen.svg?style=flat&logo=pytest&logoColor=white)](https://docs.pytest.org/)

**Finley** is a modern, production-grade personal finance dashboard inspired by fintech leaders like Stripe, Linear, and modern banking platforms. It combines dynamic financial intelligence, precise cash-flow forecasting, automated transaction classification, and a responsive interface with zero hardcoded metrics.

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [Architecture Explanation](#architecture-explanation)
4. [Folder Structure](#folder-structure)
5. [Business Logic & Mathematical Rules](#business-logic--mathematical-rules)
6. [API Documentation](#api-documentation)
7. [Installation & Setup](#installation--setup)
   - [Prerequisites](#prerequisites)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
   - [Running Both Applications](#running-both-applications)
8. [Testing & Verification](#testing--verification)
9. [Assumptions & Edge Cases](#assumptions--edge-cases)

---

## Project Overview

Finley delivers real-time visibility into your personal financial health with three core pillars:

1. **Safe to Spend**: Calculates the exact amount of discretionary cash remaining for the current month after accounting for normalized income, upcoming unpaid bills, and month-to-date spending. Also computes a dynamic per-day spending allowance. If the budget is exceeded, it prevents displaying negative spend and provides an alert banner indicating the exact over-budget amount.
2. **Upcoming Bills & Forecasting**: Computes bill recurrence schedules across weekly, biweekly, monthly, and annual cadences within an inclusive 14-day window. Accurately handles month-end boundaries (e.g. 31st mapping to the last day of shorter months while preserving the original day for subsequent months) and flags potentially late bills in a dedicated warning section.
3. **Transaction Ledger & Rule-Based Classification**: Evaluates transactions through an exact priority hierarchy (Internal Transfers &rarr; Income &rarr; Refunds &rarr; Bank Fees &rarr; Discretionary Spend), including pending items in all financial totals with real-time category filtering.

---

## Technology Stack

### Backend
- **Python 3.12+**: Modern Python runtime.
- **FastAPI**: Asynchronous web framework with automatic OpenAPI/Swagger documentation.
- **Pydantic v2**: Strict schema validation, type enforcement, and serialization.
- **Uvicorn**: High-performance ASGI web server.
- **Pytest & Pytest-Cov**: Comprehensive test suite with 98% test coverage across 51 test cases.
- **HTTPX**: Fast asynchronous HTTP client for end-to-end API client testing.

### Frontend
- **React 19 with Vite**: Rapid HMR and optimized production bundling.
- **TypeScript**: Strict type checking with shared interfaces.
- **Tailwind CSS v4**: Utility-first CSS engine with a refined fintech aesthetic.
- **React Router**: Client-side routing.
- **Axios**: Configured HTTP client with timeout and interceptor support.
- **Lucide React**: Modern iconography.

### Storage
- **JSON Repository**: File-backed storage with strict separation of the data-access layer (`JsonRepository`), allowing transparent migration to PostgreSQL or SQLAlchemy without touching business logic or API endpoints.

---

## Architecture Explanation

Finley adheres to clean architecture principles and strict separation of concerns:

```
[ React 19 Client ]
        │
   Axios HTTP / REST
        │
        ▼
[ FastAPI API Layer (app/api/) ]
        │
        ▼
[ Service Layer / Business Logic (app/services/) ]
        │                              │
        ▼                              ▼
[ Domain Utilities (app/utils/) ]   [ Repository Layer (app/repositories/) ]
                                               │
                                               ▼
                                      [ Mock JSON Storage ]
```

- **API Routers (`app/api/`)**: Handle HTTP serialization, query parameter extraction, and status codes. Never contain business logic.
- **Service Layer (`app/services/`)**: Implements pure business logic for financial calculations, date projections, and classification trees. Pure functions with dependency injection for testability.
- **Repository Layer (`app/repositories/`)**: Abstracts data persistence. Returns immutable data objects.
- **Domain Utilities (`app/utils/`)**: Robust date arithmetic, leap year adjustments, and month-end clamping.

---

## Folder Structure

```
finley/
├── backend/
│   ├── app/
│   │   ├── __init__.py
│   │   ├── main.py                  # FastAPI application factory & CORS configuration
│   │   ├── api/                     # Route definitions
│   │   │   ├── __init__.py
│   │   │   ├── dashboard.py         # /api/dashboard, /api/safe-to-spend, /api/health
│   │   │   ├── bills.py             # /api/bills/upcoming
│   │   │   └── transactions.py      # /api/transactions
│   │   ├── core/                    # App configuration & settings
│   │   │   ├── __init__.py
│   │   │   └── config.py
│   │   ├── data/                    # JSON mock data
│   │   │   └── mock_data.json
│   │   ├── models/                  # Pydantic v2 models & schemas
│   │   │   ├── __init__.py
│   │   │   └── schemas.py
│   │   ├── repositories/            # Data-access abstraction
│   │   │   ├── __init__.py
│   │   │   └── json_repository.py
│   │   ├── services/                # Pure business logic services
│   │   │   ├── __init__.py
│   │   │   ├── bills_service.py     # Occurrence generator & window filtering
│   │   │   ├── dashboard_service.py # Income normalization & Safe-to-Spend
│   │   │   └── transaction_service.py # 5-rule classification & totals
│   │   └── utils/                   # Reusable date utilities
│   │       ├── __init__.py
│   │       └── date_utils.py
│   ├── tests/                       # Pytest test suite (51 tests)
│   │   ├── __init__.py
│   │   ├── conftest.py              # Test fixtures & mock data
│   │   ├── test_api.py              # FastAPI endpoint integration tests
│   │   ├── test_bills.py            # Recurrence & boundary tests
│   │   ├── test_dashboard.py        # Safe-to-spend & income normalization tests
│   │   └── test_transactions.py     # Classification priority & ledger tests
│   ├── requirements.txt
│   └── run.py                       # Backend server entrypoint
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── common/              # Reusable UI components
│   │   │   │   ├── ErrorMessage.tsx
│   │   │   │   ├── Loading.tsx
│   │   │   │   ├── StatusBadge.tsx
│   │   │   │   └── TypeBadge.tsx
│   │   │   ├── dashboard/           # Core dashboard cards
│   │   │   │   ├── SafeToSpendCard.tsx
│   │   │   │   ├── SummaryMetric.tsx
│   │   │   │   ├── TransactionsCard.tsx
│   │   │   │   └── UpcomingBillsCard.tsx
│   │   │   └── layout/              # Structural components
│   │   │       ├── DashboardLayout.tsx
│   │   │       └── Header.tsx
│   │   ├── hooks/
│   │   │   └── useDashboard.ts      # Custom hook managing state, loading, errors & filters
│   │   ├── pages/
│   │   │   └── Dashboard.tsx        # Main view composition
│   │   ├── services/
│   │   │   ├── api.ts               # Axios instance configuration
│   │   │   └── dashboardService.ts  # API client functions
│   │   ├── types/                   # TypeScript interfaces
│   │   │   ├── bill.ts
│   │   │   ├── dashboard.ts
│   │   │   └── transaction.ts
│   │   ├── utils/                   # Formatting helpers
│   │   │   ├── currency.ts
│   │   │   └── date.ts
│   │   ├── App.tsx
│   │   ├── index.css                # Tailwind CSS v4 design tokens
│   │   └── main.tsx
│   ├── index.html
│   ├── package.json
│   ├── tsconfig.json
│   └── vite.config.ts               # Vite configuration with API proxying
│
└── README.md
```

---

## Business Logic & Mathematical Rules

### 1. Monthly Income Normalization
Income sources can arrive on varying schedules. Finley normalizes all cadences to an accurate monthly baseline:
- **Weekly**: $\text{amount} \times 52 / 12$
- **Biweekly**: $\text{amount} \times 26 / 12$
- **Semi-monthly**: $\text{amount} \times 2$
- **Monthly**: $\text{amount}$
- **Annually**: $\text{amount} / 12$

*Example with Mock Data:*
- Salary: \$2,000 biweekly $\rightarrow 2000 \times 26 / 12 = \$4,333.33$
- Freelance: \$600 monthly $\rightarrow \$600.00$
- **Total Monthly Income** = \$4,933.33

### 2. Bills Due This Month & Safe to Spend
- **Bills Due This Month**: Identifies all bill occurrences between the reference date (`2026-11-18`) and the end of the month (`2026-11-30`) inclusive.
  - Phone: \$45.00 (Nov 25)
  - Gym: \$12.00 (Nov 20) + \$12.00 (Nov 27) = \$24.00
  - Car Insurance: \$1,200.00 (Nov 30)
  - Car Loan: \$250.00 (Nov 30)
  - Music App: \$10.00 (Nov 24)
  - *Rent (\$1,500 due Dec 01) is excluded from the current month calculation.*
  - **Total Bills Due This Month** = \$1,529.00
- **Spent This Month**: \$2,950.00
- **Safe to Spend**:
  $$\text{Safe to Spend} = \text{Monthly Income} - \text{Bills Due This Month} - \text{Spent This Month}$$
  $$\text{Safe to Spend} = \$4,933.33 - \$1,529.00 - \$2,950.00 = \$454.33$$
- **Daily Allowance**:
  $$\text{Days Remaining} = (\text{Last Day of Month} - \text{Current Day}) + 1 = (30 - 18) + 1 = 13 \text{ days}$$
  $$\text{Daily Allowance} = \frac{\$454.33}{13} \approx \$34.95 / \text{day}$$
- **Negative Cap Rule**: If $\text{Safe to Spend} < 0$, display **\$0.00** as the spending capacity and render an emphasized warning: `"Over by $X"`.

### 3. Next Bill Occurrence & 14-Day Window
Calculates all bill occurrences between `today` and `today + 14 days` inclusive:
- **Weekly**: $+7\text{ days}$ iteratively
- **Biweekly**: $+14\text{ days}$ iteratively
- **Monthly**: Same day in subsequent months. If the day does not exist (e.g. Feb 31), clamps to the month's final day while preserving the original day for future months.
- **Annually**: Same month/day next year (Feb 29 maps to Feb 28 in non-leap years).
- **Potentially Late**: Any expected occurrence prior to `today` where no newer charge has been logged (e.g. Internet due Nov 10).

### 4. Transaction Classification Engine
Rules execute in **strict sequential order**, stopping at the first match:
1. `to_account` $\in \text{own\_accounts} \implies$ **Transfer**
2. $\text{amount} < 0 \land \text{category} == \text{"Income"} \implies$ **Income**
3. $\text{amount} < 0 \implies$ **Refund**
4. $\text{category} == \text{"Bank Fees"} \implies$ **Fee**
5. Otherwise $\implies$ **Spend**

*Ledger Summary:*
- **Total Spend** = $\sum \text{amount}(\text{Spend}) = \$82.40\text{ (T1)} + \$28.75\text{ (T7)} + \$60.00\text{ (T8)} = \mathbf{\$171.15}$
- **Total Refunds** = $\sum |\text{amount}|(\text{Refund}) = \$12.40\text{ (T4)} = \mathbf{\$12.40}$
- **Net Spend** = $\text{Total Spend} - \text{Total Refunds} = \$171.15 - \$12.40 = \mathbf{\$158.75}$
- *(Pending transactions such as T7 Pizza Place are fully included in all calculation totals; T8 Payment to Alex classifies as Spend because "Alex" is not in ownAccounts).*

---

## API Documentation

FastAPI provides interactive OpenAPI documentation:
- **Swagger UI**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **ReDoc**: [http://localhost:8000/redoc](http://localhost:8000/redoc)

### Endpoints

#### 1. Application Health
- **Endpoint**: `GET /api/health`
- **Response**:
```json
{
  "status": "healthy",
  "app_name": "Finley",
  "version": "1.0.0"
}
```

#### 2. Safe to Spend
- **Endpoint**: `GET /api/safe-to-spend`
- **Query Parameters**: `reference_date` (optional, `YYYY-MM-DD`, defaults to `2026-11-18`)
- **Response**:
```json
{
  "monthly_income": 4933.33,
  "bills_remaining": 1529.0,
  "spent_this_month": 2950.0,
  "safe_to_spend": 454.33,
  "daily_allowance": 34.95,
  "days_remaining": 13,
  "is_negative": false,
  "over_by": 0.0
}
```

#### 3. Upcoming Bills
- **Endpoint**: `GET /api/bills/upcoming`
- **Query Parameters**: `reference_date` (optional)
- **Response**:
```json
{
  "upcoming_bills": [
    {
      "id": "B3",
      "name": "Gym",
      "amount": 12.0,
      "frequency": "weekly",
      "expected_date": "2026-11-20",
      "is_late": false
    },
    {
      "id": "B7",
      "name": "Music App",
      "amount": 10.0,
      "frequency": "biweekly",
      "expected_date": "2026-11-24",
      "is_late": false
    },
    {
      "id": "B2",
      "name": "Phone",
      "amount": 45.0,
      "frequency": "monthly",
      "expected_date": "2026-11-25",
      "is_late": false
    },
    {
      "id": "B3",
      "name": "Gym",
      "amount": 12.0,
      "frequency": "weekly",
      "expected_date": "2026-11-27",
      "is_late": false
    },
    {
      "id": "B5",
      "name": "Car Insurance",
      "amount": 1200.0,
      "frequency": "annually",
      "expected_date": "2026-11-30",
      "is_late": false
    },
    {
      "id": "B6",
      "name": "Car Loan",
      "amount": 250.0,
      "frequency": "monthly",
      "expected_date": "2026-11-30",
      "is_late": false
    },
    {
      "id": "B1",
      "name": "Rent",
      "amount": 1500.0,
      "frequency": "monthly",
      "expected_date": "2026-12-01",
      "is_late": false
    }
  ],
  "potentially_late_bills": [
    {
      "id": "B4",
      "name": "Internet",
      "amount": 60.0,
      "frequency": "monthly",
      "expected_date": "2026-11-10",
      "is_late": true
    }
  ],
  "total_upcoming": 3029.0,
  "date_range": {
    "start": "2026-11-18",
    "end": "2026-12-02"
  }
}
```

#### 4. Transactions Ledger
- **Endpoint**: `GET /api/transactions`
- **Query Parameters**: `type` (optional: `Spend`, `Income`, `Transfer`, `Refund`, `Fee`)
- **Example Call**: `GET /api/transactions?type=Spend`
- **Response**:
```json
{
  "transactions": [
    {
      "id": "T1",
      "date": "2026-11-02",
      "description": "Grocery Mart",
      "category": "Groceries",
      "amount": 82.4,
      "status": "posted",
      "to_account": null,
      "type": "Spend"
    },
    {
      "id": "T7",
      "date": "2026-11-10",
      "description": "Pizza Place",
      "category": "Dining",
      "amount": 28.75,
      "status": "pending",
      "to_account": null,
      "type": "Spend"
    },
    {
      "id": "T8",
      "date": "2026-11-12",
      "description": "Payment to Alex",
      "category": "Transfer",
      "amount": 60.0,
      "status": "posted",
      "to_account": "Alex",
      "type": "Spend"
    }
  ],
  "total_spend": 171.15,
  "total_refunds": 12.4,
  "net_spend": 158.75,
  "filter_type": "Spend"
}
```

#### 5. Full Dashboard
- **Endpoint**: `GET /api/dashboard`
- **Description**: Returns all three domain views combined into a single payload for fast cold-start hydration.

---

## Installation & Setup

### Prerequisites
- **Python 3.12+**
- **Node.js 18+** & **npm 9+**

### Backend Setup

```bash
cd backend

# Create and activate a virtual environment (optional but recommended)
python3 -m venv .venv
source .venv/bin/activate  # On Windows: .venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the backend server
python3 run.py
```
The backend starts at **`http://localhost:8000`**.

### Frontend Setup

```bash
cd frontend

# Install npm dependencies
npm install

# Start the Vite development server
npm run dev
```
The frontend is available at **`http://localhost:5173`**.

---

## Testing & Verification

The backend includes 51 unit and integration tests covering all business rules, edge cases, date boundaries, and API routes.

```bash
cd backend

# Run the complete test suite
python3 -m pytest tests/ -v

# Run tests with detailed code coverage report
python3 -m pytest tests/ --cov=app --cov-report=term-missing
```

### Coverage Highlights
- **Bills Service**: 100%
- **Dashboard Service**: 100%
- **Transaction Service**: 100%
- **Date Utilities**: 100%
- **API Routers**: 100%
- **Overall Project Coverage**: **98%**

---

## Assumptions & Edge Cases

1. **Reference Date Anchor**: The mock data specifies an initial date of `2026-11-18`. All backend services anchor to this date by default via `FINLEY_REFERENCE_DATE` environment configuration or the optional `?reference_date=` query parameter.
2. **Inclusive Windows**: All calendar windows (`today` through `today + 14 days`, and `today` through `end of month`) are inclusive of both boundary dates.
3. **Leap Year & Month-End Day Clamping**:
   - Monthly bills initiated on the 31st (e.g. Oct 31) clamp to the 30th in November and 28th in February, but restore to the 31st for December and March.
   - Annual bills initiated on Feb 29 map to Feb 28 in non-leap years.
4. **Multiple Bill Occurrences**: Weekly and biweekly bills can and do appear multiple times within the 14-day window (e.g. Gym recurring on Nov 20 and Nov 27).
5. **Pending Transactions**: Pending transactions are treated as committed liabilities and are included in all calculations.
6. **Negative Safe to Spend**: Negative amounts are capped at \$0.00 to avoid negative spending limits, with an explicit over-budget alert banner.
