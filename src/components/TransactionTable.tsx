import {
  ArrowUpRight,
  ArrowDownRight,
  Pencil,
  Trash2,
  Receipt,
} from "lucide-react";
import type { Transaction } from "../types/transaction";
import type { Account } from "../types/account";
import type { Category } from "../types/category";
import { formatCurrency, formatDate, t } from "../config/i18n";
import { useLang } from "../hooks/useLang";

interface TransactionTableProps {
  transactions: Transaction[];
  accounts: Account[];
  categories: Category[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (transaction: Transaction) => void;
  showActions?: boolean;
}

export default function TransactionTable({
  transactions,
  accounts,
  categories,
  onEdit,
  onDelete,
  showActions = false,
}: TransactionTableProps) {
  useLang();
  const getAccount = (id: string) => accounts.find((a) => a.id === id);
  const getCategory = (id: string) => categories.find((c) => c.id === id);

  if (transactions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
          <Receipt size={24} className="text-zinc-600" />
        </div>
        <p className="text-sm font-medium text-zinc-500">
          {t("noTransactions")}
        </p>
        <p className="text-xs text-zinc-600 mt-1">
          {t("noTransactionsDesc")}
        </p>
      </div>
    );
  }

  const headers = [
    { key: "date", label: t("date"), align: "start" },
    { key: "category", label: t("category"), align: "start" },
    { key: "account", label: t("account"), align: "start" },
    { key: "type", label: t("categoryType"), align: "start" },
    { key: "amount", label: t("amount"), align: "end" },
    { key: "note", label: t("note"), align: "start" },
  ];

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead>
          <tr className="border-b border-white/[0.06]">
            {headers.map((h) => (
              <th
                key={h.key}
                className={`text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3.5 ${
                  h.align === "end" ? "text-end" : "text-start"
                }`}
              >
                {h.label}
              </th>
            ))}
            {showActions && (
              <th className="text-end text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-5 py-3.5">
                {t("edit")}
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {transactions.map((tx, i) => {
            const category = getCategory(tx.categoryId);
            const account = getAccount(tx.accountId);
            return (
              <tr
                key={tx.id}
                className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors duration-150 group"
                style={{
                  animation: `fade-in 0.2s ease-out ${i * 0.03}s both`,
                }}
              >
                <td className="px-5 py-3.5 text-[13px] text-zinc-500 font-mono tabular-nums">
                  {formatDate(tx.date)}
                </td>
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-2.5">
                    {category && (
                      <div
                        className="w-2 h-2 rounded-full shrink-0 shadow-sm"
                        style={{ backgroundColor: category.color }}
                      />
                    )}
                    <span className="text-[13px] font-medium text-zinc-300">
                      {tx.categoryName || category?.name || "Unknown"}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-[13px] text-zinc-500">
                  {tx.accountName || account?.name || "Unknown"}
                </td>
                <td className="px-5 py-3.5">
                  {tx.type === "income" ? (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-lg ring-1 ring-emerald-500/20">
                      <ArrowUpRight size={11} />
                      {t("income")}
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-400 bg-rose-500/10 px-2.5 py-1 rounded-lg ring-1 ring-rose-500/20">
                      <ArrowDownRight size={11} />
                      {t("expense")}
                    </span>
                  )}
                </td>
                <td
                  className={`px-5 py-3.5 text-[13px] font-mono font-bold text-end tabular-nums ${
                    tx.type === "income"
                      ? "text-emerald-400"
                      : "text-rose-400"
                  }`}
                >
                  {tx.type === "income" ? "+" : "-"}
                  {formatCurrency(tx.amount)}
                </td>
                <td className="px-5 py-3.5 text-[13px] text-zinc-600 max-w-[180px] truncate">
                  {tx.note || "—"}
                </td>
                {showActions && (
                  <td className="px-5 py-3.5 text-end">
                    <div className="flex items-center justify-end gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      <button
                        onClick={() => onEdit?.(tx)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                        aria-label={t("edit")}
                      >
                        <Pencil size={14} />
                      </button>
                      <button
                        onClick={() => onDelete?.(tx)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        aria-label={t("delete")}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
