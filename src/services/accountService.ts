import api from "../config/api";
import type { Account, AccountFormData } from "../types/account";

export async function getAccounts(): Promise<Account[]> {
  const res = await api.get("/accounts");
  return res.data;
}

export async function createAccount(data: AccountFormData): Promise<Account> {
  const res = await api.post("/accounts", data);
  return res.data;
}

export async function updateAccount(
  id: string,
  data: AccountFormData,
): Promise<Account> {
  const res = await api.put(`/accounts/${id}`, data);
  return res.data;
}

export async function deleteAccount(id: string): Promise<void> {
  await api.delete(`/accounts/${id}`);
}
