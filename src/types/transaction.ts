export interface Transaction {
  id: string;
  type: "income" | "expense";
  amount: number;
  accountId: string;
  accountName?: string;
  categoryId: string;
  categoryName?: string;
  categoryColor?: string;
  note: string;
  date: string;
}

export interface TransactionFormData {
  type: "income" | "expense";
  amount: number;
  accountId: string;
  categoryId: string;
  note: string;
  date: string;
}
