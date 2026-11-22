import type { UpcomingBillsData } from './bill';
import type { TransactionsData } from './transaction';

export interface SafeToSpendData {
  monthly_income: number;
  bills_remaining: number;
  spent_this_month: number;
  safe_to_spend: number;
  daily_allowance: number;
  days_remaining: number;
  is_negative: boolean;
  over_by: number;
}

export interface DashboardData {
  safe_to_spend: SafeToSpendData;
  upcoming_bills: UpcomingBillsData;
  transactions: TransactionsData;
}
