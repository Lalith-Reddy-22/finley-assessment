export interface UpcomingBill {
  id: string;
  name: string;
  amount: number;
  frequency: 'weekly' | 'biweekly' | 'monthly' | 'annually' | string;
  expected_date: string;
  is_late: boolean;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface UpcomingBillsData {
  upcoming_bills: UpcomingBill[];
  potentially_late_bills: UpcomingBill[];
  total_upcoming: number;
  date_range: DateRange;
}
