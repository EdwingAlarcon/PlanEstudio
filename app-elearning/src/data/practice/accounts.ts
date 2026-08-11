export interface PracticeAccount {
  accountid: string;
  name: string;
  city: string;
  revenue: number;
  status: "active" | "inactive";
}

export const PRACTICE_ACCOUNTS: PracticeAccount[] = [
  { accountid: "acc-001", name: "Contoso Norte", city: "Bogota", revenue: 5000000, status: "active" },
  { accountid: "acc-002", name: "Fabrikam Andina", city: "Medellin", revenue: 15000000, status: "active" },
  { accountid: "acc-003", name: "Litware Capital", city: "Bogota", revenue: 22000000, status: "active" },
  { accountid: "acc-004", name: "Northwind Servicios", city: "Cali", revenue: 9000000, status: "inactive" },
];
