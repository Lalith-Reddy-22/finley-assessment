import React from 'react';
import { useDashboard } from '../hooks/useDashboard';
import { Header } from '../components/layout/Header';
import { DashboardLayout } from '../components/layout/DashboardLayout';
import { SafeToSpendCard } from '../components/dashboard/SafeToSpendCard';
import { UpcomingBillsCard } from '../components/dashboard/UpcomingBillsCard';
import { TransactionsCard } from '../components/dashboard/TransactionsCard';

function getCurrentMonth(): string {
  try {
    return new Date().toLocaleDateString('en-US', { month: 'long' });
  } catch {
    return 'this month';
  }
}

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

  const currentMonth = getCurrentMonth();

  return (
    <>
      <Header
        onRefresh={refreshAll}
        isRefreshing={isRefreshing}
      />
      <DashboardLayout>
        {/* Top Section: Safe to Spend + Upcoming Bills Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SafeToSpendCard
            data={safeToSpend}
            loading={loading.safeToSpend}
            error={errors.safeToSpend}
            onRetry={retrySafeToSpend}
            monthName={currentMonth}
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
