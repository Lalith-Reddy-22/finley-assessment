import { useState, useEffect, useCallback } from 'react';
import type { SafeToSpendData } from '../types/dashboard';
import type { UpcomingBillsData } from '../types/bill';
import type { TransactionsData, TransactionFilterType } from '../types/transaction';
import {
  fetchSafeToSpend,
  fetchUpcomingBills,
  fetchTransactions,
} from '../services/dashboardService';

interface LoadingState {
  safeToSpend: boolean;
  bills: boolean;
  transactions: boolean;
}

interface ErrorState {
  safeToSpend: string | null;
  bills: string | null;
  transactions: string | null;
}

export function useDashboard(referenceDate?: string) {
  const [safeToSpend, setSafeToSpend] = useState<SafeToSpendData | null>(null);
  const [upcomingBills, setUpcomingBills] = useState<UpcomingBillsData | null>(null);
  const [transactions, setTransactions] = useState<TransactionsData | null>(null);

  const [loading, setLoading] = useState<LoadingState>({
    safeToSpend: true,
    bills: true,
    transactions: true,
  });

  const [errors, setErrors] = useState<ErrorState>({
    safeToSpend: null,
    bills: null,
    transactions: null,
  });

  const [transactionFilter, setTransactionFilter] = useState<TransactionFilterType>('All');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const loadSafeToSpend = useCallback(async () => {
    setLoading((prev) => ({ ...prev, safeToSpend: true }));
    try {
      const data = await fetchSafeToSpend(referenceDate);
      setSafeToSpend(data);
      setErrors((prev) => ({ ...prev, safeToSpend: null }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load spending data';
      setErrors((prev) => ({ ...prev, safeToSpend: msg }));
    } finally {
      setLoading((prev) => ({ ...prev, safeToSpend: false }));
    }
  }, [referenceDate]);

  const loadBills = useCallback(async () => {
    setLoading((prev) => ({ ...prev, bills: true }));
    try {
      const data = await fetchUpcomingBills(referenceDate);
      setUpcomingBills(data);
      setErrors((prev) => ({ ...prev, bills: null }));
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load upcoming bills';
      setErrors((prev) => ({ ...prev, bills: msg }));
    } finally {
      setLoading((prev) => ({ ...prev, bills: false }));
    }
  }, [referenceDate]);

  const loadTransactions = useCallback(
    async (filter: TransactionFilterType = transactionFilter) => {
      setLoading((prev) => ({ ...prev, transactions: true }));
      try {
        const data = await fetchTransactions(filter);
        setTransactions(data);
        setErrors((prev) => ({ ...prev, transactions: null }));
      } catch (err: unknown) {
        const msg = err instanceof Error ? err.message : 'Failed to load transactions';
        setErrors((prev) => ({ ...prev, transactions: msg }));
      } finally {
        setLoading((prev) => ({ ...prev, transactions: false }));
      }
    },
    [transactionFilter],
  );

  const refreshAll = useCallback(async () => {
    setIsRefreshing(true);
    await Promise.allSettled([
      loadSafeToSpend(),
      loadBills(),
      loadTransactions(transactionFilter),
    ]);
    setIsRefreshing(false);
  }, [loadSafeToSpend, loadBills, loadTransactions, transactionFilter]);

  // Initial load
  useEffect(() => {
    let isMounted = true;
    const fetchInitial = async () => {
      setLoading({ safeToSpend: true, bills: true, transactions: true });
      try {
        const [sts, bills, txns] = await Promise.allSettled([
          fetchSafeToSpend(referenceDate),
          fetchUpcomingBills(referenceDate),
          fetchTransactions('All'),
        ]);
        if (!isMounted) return;
        if (sts.status === 'fulfilled') {
          setSafeToSpend(sts.value);
          setErrors((prev) => ({ ...prev, safeToSpend: null }));
        } else {
          setErrors((prev) => ({ ...prev, safeToSpend: 'Failed to load spending data' }));
        }
        if (bills.status === 'fulfilled') {
          setUpcomingBills(bills.value);
          setErrors((prev) => ({ ...prev, bills: null }));
        } else {
          setErrors((prev) => ({ ...prev, bills: 'Failed to load upcoming bills' }));
        }
        if (txns.status === 'fulfilled') {
          setTransactions(txns.value);
          setErrors((prev) => ({ ...prev, transactions: null }));
        } else {
          setErrors((prev) => ({ ...prev, transactions: 'Failed to load transactions' }));
        }
      } finally {
        if (isMounted) {
          setLoading({ safeToSpend: false, bills: false, transactions: false });
        }
      }
    };

    fetchInitial();
    return () => {
      isMounted = false;
    };
  }, [referenceDate]);

  // Reload transactions when filter changes (skip 'All' on initial mount since fetchInitial handles it)
  useEffect(() => {
    let isMounted = true;
    const fetchFiltered = async () => {
      setLoading((prev) => ({ ...prev, transactions: true }));
      try {
        const txns = await fetchTransactions(transactionFilter);
        if (!isMounted) return;
        setTransactions(txns);
        setErrors((prev) => ({ ...prev, transactions: null }));
      } catch (err: unknown) {
        if (!isMounted) return;
        const msg = err instanceof Error ? err.message : 'Failed to load transactions';
        setErrors((prev) => ({ ...prev, transactions: msg }));
      } finally {
        if (isMounted) {
          setLoading((prev) => ({ ...prev, transactions: false }));
        }
      }
    };

    fetchFiltered();
    return () => {
      isMounted = false;
    };
  }, [transactionFilter]);

  return {
    safeToSpend,
    upcomingBills,
    transactions,
    loading,
    errors,
    transactionFilter,
    setTransactionFilter,
    isRefreshing,
    refreshAll,
    retrySafeToSpend: loadSafeToSpend,
    retryBills: loadBills,
    retryTransactions: () => loadTransactions(transactionFilter),
  };
}
