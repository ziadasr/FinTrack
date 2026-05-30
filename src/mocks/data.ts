import type { Account } from "../types/account";
import type { Category } from "../types/category";
import type { Transaction } from "../types/transaction";

export const mockAccounts: Account[] = [
  {
    id: "acc-1",
    name: "Main Checking",
    type: "bank",
    balance: 12480.5,
    createdAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "acc-2",
    name: "Savings",
    type: "bank",
    balance: 34250.0,
    createdAt: "2025-01-15T00:00:00Z",
  },
  {
    id: "acc-3",
    name: "Cash",
    type: "cash",
    balance: 520.0,
    createdAt: "2025-02-01T00:00:00Z",
  },
  {
    id: "acc-4",
    name: "Crypto Wallet",
    type: "wallet",
    balance: 8730.25,
    createdAt: "2025-03-10T00:00:00Z",
  },
];

export const mockCategories: Category[] = [
  { id: "cat-1", name: "Salary", type: "income", color: "#10b981" },
  { id: "cat-2", name: "Freelance", type: "income", color: "#06b6d4" },
  { id: "cat-3", name: "Investments", type: "income", color: "#8b5cf6" },
  { id: "cat-4", name: "Rent", type: "expense", color: "#f43f5e" },
  { id: "cat-5", name: "Groceries", type: "expense", color: "#f97316" },
  { id: "cat-6", name: "Transport", type: "expense", color: "#eab308" },
  { id: "cat-7", name: "Entertainment", type: "expense", color: "#ec4899" },
  { id: "cat-8", name: "Utilities", type: "expense", color: "#6366f1" },
  { id: "cat-9", name: "Shopping", type: "expense", color: "#14b8a6" },
  { id: "cat-10", name: "Healthcare", type: "expense", color: "#3b82f6" },
  { id: "cat-11", name: "Dining Out", type: "expense", color: "#a855f7" },
  { id: "cat-12", name: "Subscriptions", type: "expense", color: "#64748b" },
];

export const mockTransactions: Transaction[] = [
  {
    id: "tx-1",
    type: "income",
    amount: 5200.0,
    accountId: "acc-1",
    categoryId: "cat-1",
    note: "Monthly salary",
    date: "2026-05-01T00:00:00Z",
  },
  {
    id: "tx-2",
    type: "expense",
    amount: 1800.0,
    accountId: "acc-1",
    categoryId: "cat-4",
    note: "May rent payment",
    date: "2026-05-02T00:00:00Z",
  },
  {
    id: "tx-3",
    type: "expense",
    amount: 124.5,
    accountId: "acc-1",
    categoryId: "cat-5",
    note: "Weekly groceries",
    date: "2026-05-03T00:00:00Z",
  },
  {
    id: "tx-4",
    type: "expense",
    amount: 45.0,
    accountId: "acc-3",
    categoryId: "cat-6",
    note: "Uber rides",
    date: "2026-05-04T00:00:00Z",
  },
  {
    id: "tx-5",
    type: "income",
    amount: 1500.0,
    accountId: "acc-1",
    categoryId: "cat-2",
    note: "Web design project",
    date: "2026-05-05T00:00:00Z",
  },
  {
    id: "tx-6",
    type: "expense",
    amount: 89.99,
    accountId: "acc-1",
    categoryId: "cat-8",
    note: "Electric bill",
    date: "2026-05-06T00:00:00Z",
  },
  {
    id: "tx-7",
    type: "expense",
    amount: 32.0,
    accountId: "acc-3",
    categoryId: "cat-7",
    note: "Movie tickets",
    date: "2026-05-07T00:00:00Z",
  },
  {
    id: "tx-8",
    type: "expense",
    amount: 245.0,
    accountId: "acc-1",
    categoryId: "cat-9",
    note: "New headphones",
    date: "2026-05-10T00:00:00Z",
  },
  {
    id: "tx-9",
    type: "expense",
    amount: 67.5,
    accountId: "acc-3",
    categoryId: "cat-11",
    note: "Dinner with friends",
    date: "2026-05-12T00:00:00Z",
  },
  {
    id: "tx-10",
    type: "income",
    amount: 320.0,
    accountId: "acc-4",
    categoryId: "cat-3",
    note: "ETH staking rewards",
    date: "2026-05-14T00:00:00Z",
  },
  {
    id: "tx-11",
    type: "expense",
    amount: 15.99,
    accountId: "acc-1",
    categoryId: "cat-12",
    note: "Netflix subscription",
    date: "2026-05-15T00:00:00Z",
  },
  {
    id: "tx-12",
    type: "expense",
    amount: 55.0,
    accountId: "acc-1",
    categoryId: "cat-10",
    note: "Pharmacy",
    date: "2026-05-16T00:00:00Z",
  },
  {
    id: "tx-13",
    type: "expense",
    amount: 98.0,
    accountId: "acc-1",
    categoryId: "cat-5",
    note: "Costco haul",
    date: "2026-05-18T00:00:00Z",
  },
  {
    id: "tx-14",
    type: "income",
    amount: 800.0,
    accountId: "acc-1",
    categoryId: "cat-2",
    note: "Logo design gig",
    date: "2026-05-20T00:00:00Z",
  },
  {
    id: "tx-15",
    type: "expense",
    amount: 42.0,
    accountId: "acc-3",
    categoryId: "cat-6",
    note: "Gas station",
    date: "2026-05-22T00:00:00Z",
  },
  {
    id: "tx-16",
    type: "expense",
    amount: 130.0,
    accountId: "acc-1",
    categoryId: "cat-9",
    note: "Clothing store",
    date: "2026-05-24T00:00:00Z",
  },
  {
    id: "tx-17",
    type: "expense",
    amount: 28.5,
    accountId: "acc-3",
    categoryId: "cat-11",
    note: "Coffee and brunch",
    date: "2026-05-25T00:00:00Z",
  },
  {
    id: "tx-18",
    type: "expense",
    amount: 9.99,
    accountId: "acc-1",
    categoryId: "cat-12",
    note: "Spotify Premium",
    date: "2026-05-26T00:00:00Z",
  },
  {
    id: "tx-19",
    type: "income",
    amount: 5200.0,
    accountId: "acc-1",
    categoryId: "cat-1",
    note: "Monthly salary",
    date: "2026-04-01T00:00:00Z",
  },
  {
    id: "tx-20",
    type: "expense",
    amount: 1800.0,
    accountId: "acc-1",
    categoryId: "cat-4",
    note: "April rent",
    date: "2026-04-02T00:00:00Z",
  },
  {
    id: "tx-21",
    type: "expense",
    amount: 210.0,
    accountId: "acc-1",
    categoryId: "cat-5",
    note: "Groceries",
    date: "2026-04-05T00:00:00Z",
  },
  {
    id: "tx-22",
    type: "expense",
    amount: 75.0,
    accountId: "acc-1",
    categoryId: "cat-8",
    note: "Internet bill",
    date: "2026-04-08T00:00:00Z",
  },
  {
    id: "tx-23",
    type: "expense",
    amount: 350.0,
    accountId: "acc-1",
    categoryId: "cat-9",
    note: "New shoes",
    date: "2026-04-12T00:00:00Z",
  },
  {
    id: "tx-24",
    type: "income",
    amount: 2200.0,
    accountId: "acc-1",
    categoryId: "cat-2",
    note: "Consulting work",
    date: "2026-04-15T00:00:00Z",
  },
];

let accounts = [...mockAccounts];
let categories = [...mockCategories];
let transactions = [...mockTransactions];
let nextId = 100;

const delay = (ms: number) => new Promise((r) => setTimeout(r, ms));

export const mockApi = {
  auth: {
    async login(username: string, _password: string) {
      await delay(400);
      return { token: "mock-jwt-token-" + Date.now(), username };
    },
  },

  accounts: {
    async getAll() {
      await delay(300);
      return [...accounts];
    },
    async create(data: Omit<Account, "id" | "createdAt">) {
      await delay(300);
      const account: Account = {
        ...data,
        id: `acc-${nextId++}`,
        createdAt: new Date().toISOString(),
      };
      accounts.push(account);
      return account;
    },
    async update(id: string, data: Omit<Account, "id" | "createdAt">) {
      await delay(300);
      const idx = accounts.findIndex((a) => a.id === id);
      if (idx === -1) throw new Error("Account not found");
      accounts[idx] = { ...accounts[idx], ...data };
      return accounts[idx];
    },
    async delete(id: string) {
      await delay(300);
      accounts = accounts.filter((a) => a.id !== id);
    },
  },

  categories: {
    async getAll() {
      await delay(300);
      return [...categories];
    },
    async create(data: Omit<Category, "id">) {
      await delay(300);
      const category: Category = { ...data, id: `cat-${nextId++}` };
      categories.push(category);
      return category;
    },
    async update(id: string, data: Omit<Category, "id">) {
      await delay(300);
      const idx = categories.findIndex((c) => c.id === id);
      if (idx === -1) throw new Error("Category not found");
      categories[idx] = { ...categories[idx], ...data };
      return categories[idx];
    },
    async delete(id: string) {
      await delay(300);
      categories = categories.filter((c) => c.id !== id);
    },
  },

  transactions: {
    async getAll() {
      await delay(300);
      return [...transactions];
    },
    async create(data: Omit<Transaction, "id">) {
      await delay(300);
      const transaction: Transaction = { ...data, id: `tx-${nextId++}` };
      transactions.push(transaction);
      return transaction;
    },
    async update(id: string, data: Omit<Transaction, "id">) {
      await delay(300);
      const idx = transactions.findIndex((t) => t.id === id);
      if (idx === -1) throw new Error("Transaction not found");
      transactions[idx] = { ...transactions[idx], ...data };
      return transactions[idx];
    },
    async delete(id: string) {
      await delay(300);
      transactions = transactions.filter((t) => t.id !== id);
    },
  },
};
