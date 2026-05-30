import { useState, useEffect } from "react";
import {
  Landmark,
  Banknote,
  Wallet,
  TrendingUp,
  Loader2,
  AlertCircle,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { getAccounts } from "../services/accountService";
import { getTransactions } from "../services/transactionService";
import { getCategories } from "../services/categoryService";
import type { Account } from "../types/account";
import type { Transaction } from "../types/transaction";
import type { Category } from "../types/category";
import TransactionTable from "../components/TransactionTable";
import { formatCurrency, t } from "../config/i18n";
import { useLang } from "../hooks/useLang";

const accountIcons: Record<string, typeof Landmark> = {
  bank: Landmark,
  cash: Banknote,
  wallet: Wallet,
};

const accountAccents: Record<string, string> = {
  bank: "from-blue-500 to-blue-600",
  cash: "from-emerald-500 to-emerald-600",
  wallet: "from-violet-500 to-violet-600",
};

const accountShadows: Record<string, string> = {
  bank: "shadow-blue-500/15",
  cash: "shadow-emerald-500/15",
  wallet: "shadow-violet-500/15",
};

const accountRings: Record<string, string> = {
  bank: "ring-blue-500/10",
  cash: "ring-emerald-500/10",
  wallet: "ring-violet-500/10",
};

export default function Dashboard() {
  useLang();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [accs, txs, cats] = await Promise.all([
          getAccounts(),
          getTransactions(),
          getCategories(),
        ]);
        setAccounts(accs);
        setTransactions(txs);
        setCategories(cats);
      } catch {
        setError(t("failedLoad"));
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const totalBalance = accounts.reduce((sum, a) => sum + a.balance, 0);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();
  const monthlyTxs = transactions.filter((tx) => {
    const d = new Date(tx.date);
    return d.getMonth() === currentMonth && d.getFullYear() === currentYear;
  });
  const monthlyIncome = monthlyTxs
    .filter((tx) => tx.type === "income")
    .reduce((s, tx) => s + tx.amount, 0);
  const monthlyExpense = monthlyTxs
    .filter((tx) => tx.type === "expense")
    .reduce((s, tx) => s + tx.amount, 0);

  const recentTransactions = [...transactions]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 10);

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2
            size={36}
            className="animate-spin text-amber-500 mx-auto"
          />
          <p className="text-sm text-zinc-500 mt-3">{t("loadingData")}</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <div className="w-14 h-14 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-3">
            <AlertCircle size={24} className="text-rose-400" />
          </div>
          <p className="text-rose-400 text-sm font-medium">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto gradient-mesh">
      <div className="p-8 max-w-[1200px] mx-auto space-y-8">
        <div className="animate-fade-in">
          <h1 className="text-[26px] font-extrabold text-zinc-100 tracking-tight">
            {t("dashboardTitle")}
          </h1>
          <p className="text-[14px] text-zinc-500 mt-1">
            {t("dashboardSubtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {accounts.map((account, i) => {
            const Icon = accountIcons[account.type] || Wallet;
            const grad = accountAccents[account.type] || "from-zinc-500 to-zinc-600";
            const shadow = accountShadows[account.type] || "shadow-zinc-500/15";
            const ring = accountRings[account.type] || "ring-zinc-500/10";
            return (
              <div
                key={account.id}
                className={`relative overflow-hidden bg-[#141414] rounded-2xl p-6 shadow-[var(--shadow-card)] ring-1 ${ring} hover:shadow-[var(--shadow-md)] transition-all duration-300 group animate-fade-in-scale`}
                style={{ animationDelay: `${i * 0.05}s` }}
              >
                <div className="flex items-center gap-3 mb-4">
                  <div
                    className={`w-10 h-10 rounded-xl bg-gradient-to-br ${grad} text-white flex items-center justify-center shadow-lg ${shadow}`}
                  >
                    <Icon size={18} />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-semibold text-zinc-300 truncate">
                      {account.name}
                    </p>
                    <p className="text-[11px] font-medium text-zinc-600 capitalize">
                      {t(account.type as "bank" | "cash" | "wallet")}
                    </p>
                  </div>
                </div>
                <p className="text-[20px] font-bold font-mono tracking-tight text-zinc-100 tabular-nums">
                  {formatCurrency(account.balance)}
                </p>
                <div className="absolute -right-4 -bottom-4 w-20 h-20 rounded-full bg-gradient-to-br from-current opacity-[0.03] group-hover:opacity-[0.06] transition-opacity" />
              </div>
            );
          })}

          <div className="relative overflow-hidden bg-gradient-to-br from-amber-500/15 to-[#141414] rounded-2xl p-6 shadow-xl shadow-amber-500/10 ring-1 ring-amber-500/15 animate-fade-in-scale"
            style={{ animationDelay: `${accounts.length * 0.05}s` }}
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/20">
                <TrendingUp size={18} className="text-white" />
              </div>
              <span className="text-[13px] font-semibold text-amber-400/70">
                {t("totalBalance")}
              </span>
            </div>
            <p className="text-[22px] font-extrabold font-mono tracking-tight text-amber-400 tabular-nums">
              {formatCurrency(totalBalance)}
            </p>
            <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-amber-500/5" />
            <div className="absolute right-8 bottom-8 w-16 h-16 rounded-full bg-amber-500/5" />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="relative overflow-hidden bg-[#141414] rounded-2xl p-5 shadow-[var(--shadow-card)] ring-1 ring-emerald-500/10 animate-fade-in-scale">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-zinc-500 mb-1">
                  {t("thisMonthIncome")}
                </p>
                <p className="text-[24px] font-bold font-mono text-emerald-400 tabular-nums">
                  {formatCurrency(monthlyIncome)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-emerald-500 to-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/20">
                <ArrowUpRight size={22} />
              </div>
            </div>
          </div>
          <div className="relative overflow-hidden bg-[#141414] rounded-2xl p-5 shadow-[var(--shadow-card)] ring-1 ring-rose-500/10 animate-fade-in-scale">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[13px] font-medium text-zinc-500 mb-1">
                  {t("thisMonthExpense")}
                </p>
                <p className="text-[24px] font-bold font-mono text-rose-400 tabular-nums">
                  {formatCurrency(monthlyExpense)}
                </p>
              </div>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-500 to-rose-600 text-white flex items-center justify-center shadow-lg shadow-rose-500/20">
                <ArrowDownRight size={22} />
              </div>
            </div>
          </div>
        </div>

        <div className="bg-[#141414] rounded-2xl shadow-[var(--shadow-card)] ring-1 ring-white/[0.06] overflow-hidden animate-fade-in">
          <div className="px-6 py-5 border-b border-white/[0.06]">
            <h2 className="text-[16px] font-bold text-zinc-100">
              {t("recentTransactions")}
            </h2>
            <p className="text-[12px] text-zinc-600 mt-0.5">
              {t("latestTransactions")}
            </p>
          </div>
          <TransactionTable
            transactions={recentTransactions}
            accounts={accounts}
            categories={categories}
          />
        </div>
      </div>
    </div>
  );
}
