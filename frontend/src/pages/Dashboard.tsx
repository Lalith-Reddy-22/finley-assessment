import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { Header } from '../components/layout/Header';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { SafeToSpendCard } from '../components/dashboard/SafeToSpendCard';
import { UpcomingBillsCard } from '../components/dashboard/UpcomingBillsCard';
import { TransactionsCard } from '../components/dashboard/TransactionsCard';

export const Dashboard: React.FC = () => {
  const {
    safeToSpend,
    upcomingBills,
    transactions,
    loading,
    errors,
    transactionFilter,
    setTransactionFilter,
    isRefreshing,
    refreshAll,
    retrySafeToSpend,
    retryBills,
    retryTransactions,
  } = useDashboard();

  return (
    <>
      <Header
        onRefresh={refreshAll}
        isRefreshing={isRefreshing}
        currentDate="2026-11-18"
      />
      <DashboardLayout>
        {/* Top Section: Safe to Spend + Upcoming Bills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SafeToSpendCard
            data={safeToSpend}
            loading={loading.safeToSpend}
            error={errors.safeToSpend}
            onRetry={retrySafeToSpend}
          />

          <UpcomingBillsCard
            data={upcomingBills}
            loading={loading.bills}
            error={errors.bills}
            onRetry={retryBills}
          />
        </div>

        {/* Bottom Section: Full-Width Transactions Card */}
        <TransactionsCard
          data={transactions}
          loading={loading.transactions}
          error={errors.transactions}
          filter={transactionFilter}
          onFilterChange={setTransactionFilter}
          onRetry={retryTransactions}
        />
      </DashboardLayout>
    </>
  );
};
