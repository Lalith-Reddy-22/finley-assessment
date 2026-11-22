export type TransactionType = 'Spend' | 'Income' | 'Transfer' | 'Refund' | 'Fee';
export type TransactionFilterType = 'All' | TransactionType;

export interface Transaction {
  id: string;
  date: string;
  description: string;
  category: string;
  amount: number;
  status: 'completed' | 'pending' | string;
  to_account: string | null;
  type: TransactionType;
}

export interface TransactionsData {
  transactions: Transaction[];
  total_spend: number;
  total_refunds: number;
  net_spend: number;
  filter_type: string | null;
}
