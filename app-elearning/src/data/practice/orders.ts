export interface PracticeOrder {
  orderid: string;
  customerName: string;
  amount: number;
  priority: "normal" | "high";
}

export const PRACTICE_ORDERS: PracticeOrder[] = [
  { orderid: "ord-001", customerName: "Contoso Norte", amount: 5000000, priority: "normal" },
  { orderid: "ord-002", customerName: "Fabrikam Andina", amount: 15000000, priority: "high" },
  { orderid: "ord-003", customerName: "Litware Capital", amount: 10000000, priority: "normal" },
];
