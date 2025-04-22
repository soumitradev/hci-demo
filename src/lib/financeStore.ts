import { create } from "zustand";
import { subDays, subWeeks, subMonths, startOfMonth, endOfMonth, isWithinInterval } from "date-fns";

export type PaymentProvider = "Cash" | "SWD Pay";
export type Category = "Food" | "Entertainment" | "Shopping" | "Transport" | "Others";
export type TimePeriod = "day" | "week" | "month";

export type Transaction = {
  id: string;
  amount: number;
  timestamp: Date;
  secondParty: string;
  paymentProvider: PaymentProvider;
  category: Category;
};

type MonthlyReport = {
  [key in Category]: number;
};

type BarGraphData = {
  label: string;
  value: number;
};

export type FinanceStore = {
  transactions: Transaction[];
  calculateMonthlyReport: (month: Date, provider?: PaymentProvider) => MonthlyReport;
  calculateBarGraphs: (period: TimePeriod) => BarGraphData[];
  calculateCurrentMonthSpending: () => number;
  calculateLastMonthSpending: () => number;
  categoryBudgets: Record<Category, number>;
  setCategoryBudget: (category: Category, amount: number) => void;
  getTotalBudget: () => number;
};

// Helper to generate random transactions for a date range
const generateTransactions = (startDate: Date, endDate: Date): Transaction[] => {
  const swdVendors = ["ANC 1", "ANC 2", "ANC 1 Juice Shop", "ANC 2 Shawarma", "ANC 2 Juice Shop"];
  const otherVendors = ["Amazon", "Flipkart", "Movie Theater", "Local Store", "Uber", "Ola", "Stationery Shop"];
  const transactions: Transaction[] = [];

  // Generate 1-3 transactions per day (some days might have no transactions)
  let currentDate = new Date(startDate);
  while (currentDate <= endDate) {
    // 85% chance of having transactions on a given day
    if (Math.random() < 0.85) {
      const numTransactions = Math.floor(Math.random() * 3) + 1; // 1-3 transactions
      
      for (let i = 0; i < numTransactions; i++) {
        // More balanced category distribution
        const categoryRoll = Math.random();
        let category: Category;
        if (categoryRoll < 0.35) { // 35% food
          category = "Food";
        } else if (categoryRoll < 0.5) { // 15% entertainment
          category = "Entertainment";
        } else if (categoryRoll < 0.65) { // 15% shopping
          category = "Shopping";
        } else if (categoryRoll < 0.8) { // 15% transport
          category = "Transport";
        } else { // 20% others
          category = "Others";
        }

        const isSWDPay = category === "Food" && Math.random() < 0.8; // 80% of food is SWD Pay
        
        // Occasionally have larger expenses (10% chance)
        const isLargeExpense = Math.random() < 0.1;
        
        let amount: number;
        switch (category) {
          case "Food":
            amount = Math.floor(Math.random() * 50) + 30; // 30-80 for food
            break;
          case "Entertainment":
            amount = Math.floor(Math.random() * 100) + 100; // 100-200 for entertainment
            break;
          case "Transport":
            amount = Math.floor(Math.random() * 60) + 20; // 20-80 for transport
            break;
          default: // Shopping and Others
            amount = isLargeExpense
              ? Math.floor(Math.random() * 300) + 200 // 200-500 for occasional big purchases
              : Math.floor(Math.random() * 150) + 50; // 50-200 for regular expenses
        }
        
        transactions.push({
          id: Math.random().toString(36).substring(7),
          amount,
          timestamp: new Date(
            currentDate.getFullYear(),
            currentDate.getMonth(),
            currentDate.getDate(),
            Math.floor(Math.random() * 14) + 8, // 8 AM to 10 PM
            Math.floor(Math.random() * 60)
          ),
          secondParty: category === "Food"
            ? swdVendors[Math.floor(Math.random() * swdVendors.length)]
            : otherVendors[Math.floor(Math.random() * otherVendors.length)],
          paymentProvider: isSWDPay ? "SWD Pay" : "Cash",
          category
        });
      }
    }
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return transactions;
};

// Create store with sample data
export const useFinanceStore = create<FinanceStore>((set, get) => ({
  // Generate transactions up to current date
  transactions: generateTransactions(
    new Date(2024, 1, 1), // Feb 1, 2024
    new Date() // Current date
  ),
  categoryBudgets: {
    'Food': 2000,
    'Entertainment': 1000,
    'Shopping': 1000,
    'Transport': 500,
    'Others': 500
  },
  setCategoryBudget: (category: Category, amount: number) => {
    set((state) => ({
      categoryBudgets: {
        ...state.categoryBudgets,
        [category]: amount
      }
    }));
  },
  getTotalBudget: () => {
    return Object.values(get().categoryBudgets).reduce((sum, amount) => sum + amount, 0);
  },
  calculateMonthlyReport: (month: Date, provider?: PaymentProvider) => {
    const transactions = get().transactions.filter(t => 
      isWithinInterval(t.timestamp, {
        start: startOfMonth(month),
        end: endOfMonth(month)
      }) &&
      (provider ? t.paymentProvider === provider : true)
    );

    return transactions.reduce((acc, t) => ({
      ...acc,
      [t.category]: (acc[t.category] || 0) + t.amount
    }), {
      Food: 0,
      Entertainment: 0,
      Shopping: 0,
      Transport: 0,
      Others: 0
    } as MonthlyReport);
  },
  calculateBarGraphs: (period: TimePeriod) => {
    const now = new Date();
    const data: BarGraphData[] = [];

    // Calculate start dates for each period
    for (let i = 4; i >= 0; i--) {
      let start: Date, end: Date, label: string;
      
      switch (period) {
        case "day":
          start = subDays(now, i);
          end = subDays(now, i);
          label = start.toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
          break;
        case "week":
          end = subWeeks(now, i);
          start = new Date(end);
          start.setDate(end.getDate() - end.getDay());
          end = new Date(start);
          end.setDate(start.getDate() + 6);
          label = `Week ${5-i}`;
          break;
        case "month":
          start = startOfMonth(subMonths(now, i));
          end = endOfMonth(subMonths(now, i));
          label = start.toLocaleDateString(undefined, { month: 'short' });
          break;
      }

      const periodTransactions = get().transactions.filter(t =>
        isWithinInterval(t.timestamp, { 
          start: new Date(start.getFullYear(), start.getMonth(), start.getDate(), 0, 0, 0),
          end: new Date(end.getFullYear(), end.getMonth(), end.getDate(), 23, 59, 59)
        })
      );

      const total = periodTransactions.reduce((sum, t) => sum + t.amount, 0);
      
      data.push({
        label,
        value: total
      });
    }

    return data;
  },
  calculateCurrentMonthSpending: () => {
    const now = new Date();
    const transactions = get().transactions.filter(t => 
      isWithinInterval(t.timestamp, {
        start: startOfMonth(now),
        end: now
      })
    );

    return transactions.reduce((total, t) => total + t.amount, 0);
  },
  calculateLastMonthSpending: () => {
    const now = new Date();
    const lastMonth = subMonths(now, 1);
    const transactions = get().transactions.filter(t => 
      isWithinInterval(t.timestamp, {
        start: startOfMonth(lastMonth),
        end: endOfMonth(lastMonth)
      })
    );

    return transactions.reduce((total, t) => total + t.amount, 0);
  }
}));
