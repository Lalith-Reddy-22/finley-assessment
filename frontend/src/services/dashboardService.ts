import api from './api';
import type { DashboardData, SafeToSpendData } from '../types/dashboard';
import type { UpcomingBillsData } from '../types/bill';
import type { TransactionsData, TransactionFilterType } from '../types/transaction';

export const fetchDashboard = async (referenceDate?: string): Promise<DashboardData> => {
  const params = referenceDate ? { reference_date: referenceDate } : {};
  const response = await api.get<DashboardData>('/dashboard', { params });
  return response.data;
};

export const fetchSafeToSpend = async (referenceDate?: string): Promise<SafeToSpendData> => {
  const params = referenceDate ? { reference_date: referenceDate } : {};
  const response = await api.get<SafeToSpendData>('/safe-to-spend', { params });
  return response.data;
};

export const fetchUpcomingBills = async (referenceDate?: string): Promise<UpcomingBillsData> => {
  const params = referenceDate ? { reference_date: referenceDate } : {};
  const response = await api.get<UpcomingBillsData>('/bills/upcoming', { params });
  return response.data;
};

export const fetchTransactions = async (
  type?: TransactionFilterType,
): Promise<TransactionsData> => {
  const params: Record<string, string> = {};
  if (type && type !== 'All') {
    params.type = type;
  }
  const response = await api.get<TransactionsData>('/transactions', { params });
  return response.data;
};

export const checkHealth = async (): Promise<{ status: string; app_name: string; version: string }> => {
  const response = await api.get('/health');
  return response.data;
};
