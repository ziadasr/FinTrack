import api from "../config/api";
import type { Transaction, TransactionFormData } from "../types/transaction";

export async function getTransactions(): Promise<Transaction[]> {
  const res = await api.get("/transactions");
  return res.data;
}

export async function createTransaction(
  data: TransactionFormData,
): Promise<Transaction> {
  const res = await api.post("/transactions", data);
  return res.data;
}

export async function updateTransaction(
  id: string,
  data: TransactionFormData,
): Promise<Transaction> {
  const res = await api.put(`/transactions/${id}`, data);
  return res.data;
}

export async function deleteTransaction(id: string): Promise<void> {
  await api.delete(`/transactions/${id}`);
}
