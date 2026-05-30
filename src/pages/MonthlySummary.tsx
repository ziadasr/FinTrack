import { useState, useEffect, useMemo } from "react";
import {
  Loader2,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Scale,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
  Legend,
} from "recharts";
import { getTransactions } from "../services/transactionService";
import { getCategories } from "../services/categoryService";
import type { Transaction } from "../types/transaction";
import type { Category } from "../types/category";
import StatCard from "../components/StatCard";
import { formatCurrency, t, getLang } from "../config/i18n";
import { useLang } from "../hooks/useLang";

const MONTHS_EN = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const MONTHS_AR = [
  "يناير", "فبراير", "مارس", "أبريل", "مايو", "يونيو",
  "يوليو", "أغسطس", "سبتمبر", "أكتوبر", "نوفمبر", "ديسمبر",
];

export default function MonthlySummary() {
  useLang();
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const MONTHS = getLang() === "ar" ? MONTHS_AR : MONTHS_EN;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [txs, cats] = await Promise.all([getTransactions(), getCategories()]);
        setTransactions(txs);
        setCategories(cats);
      } catch { setError(t("failedLoad")); }
      finally { setLoading(false); }
    };
    fetchData();
  }, []);

  const monthlyTxs = useMemo(
    () => transactions.filter((tx) => {
      const d = new Date(tx.date);
      return d.getMonth() === month && d.getFullYear() === year;
    }),
    [transactions, month, year],
  );

  const totalIncome = monthlyTxs.filter((tx) => tx.type === "income").reduce((s, tx) => s + tx.amount, 0);
  const totalExpense = monthlyTxs.filter((tx) => tx.type === "expense").reduce((s, tx) => s + tx.amount, 0);
  const netBalance = totalIncome - totalExpense;

  const expenseByCategory = useMemo(() => {
    const map = new Map<string, number>();
    monthlyTxs.filter((tx) => tx.type === "expense").forEach((tx) => {
      map.set(tx.categoryId, (map.get(tx.categoryId) || 0) + tx.amount);
    });
    return Array.from(map.entries())
      .map(([categoryId, amount]) => {
        const cat = categories.find((c) => c.id === categoryId);
        return {
          categoryId,
          name: cat?.name || "Unknown",
          color: cat?.color || "#71717a",
          amount,
          percentage: totalExpense > 0 ? (amount / totalExpense) * 100 : 0,
        };
      })
      .sort((a, b) => b.amount - a.amount);
  }, [monthlyTxs, categories, totalExpense]);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(year - 1); }
    else setMonth(month - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(year + 1); }
    else setMonth(month + 1);
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={36} className="animate-spin text-amber-500 mx-auto" />
          <p className="text-sm text-zinc-500 mt-3">{t("loading")}</p>
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
      <div className="p-8 max-w-[1200px] mx-auto space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-[26px] font-extrabold text-zinc-100 tracking-tight">{t("monthlySummaryTitle")}</h1>
          <p className="text-[14px] text-zinc-500 mt-1">{t("monthlySummarySubtitle")}</p>
        </div>

        <div className="flex items-center gap-3 animate-fade-in">
          <button onClick={prevMonth}
            className="w-10 h-10 rounded-xl border border-white/[0.08] bg-[#141414] hover:bg-white/[0.04] transition-all flex items-center justify-center"
            aria-label="Previous month">
            <ChevronLeft size={18} className="text-zinc-400" />
          </button>
          <div className="flex items-center gap-2">
            <select value={month} onChange={(e) => setMonth(parseInt(e.target.value))}
              className="px-4 py-2.5 rounded-xl border border-white/[0.08] text-[14px] font-bold bg-[#141414] text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30">
              {MONTHS.map((m, i) => <option key={i} value={i}>{m}</option>)}
            </select>
            <select value={year} onChange={(e) => setYear(parseInt(e.target.value))}
              className="px-4 py-2.5 rounded-xl border border-white/[0.08] text-[14px] font-bold bg-[#141414] text-zinc-200 focus:outline-none focus:ring-2 focus:ring-amber-500/30">
              {Array.from({ length: 10 }, (_, i) => now.getFullYear() - 5 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
          </div>
          <button onClick={nextMonth}
            className="w-10 h-10 rounded-xl border border-white/[0.08] bg-[#141414] hover:bg-white/[0.04] transition-all flex items-center justify-center"
            aria-label="Next month">
            <ChevronRight size={18} className="text-zinc-400" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 animate-fade-in-scale">
          <StatCard title={t("thisMonthIncome")} value={formatCurrency(totalIncome)} icon={<TrendingUp size={20} />} variant="income" />
          <StatCard title={t("thisMonthExpense")} value={formatCurrency(totalExpense)} icon={<TrendingDown size={20} />} variant="expense" />
          <StatCard title={t("netBalance")} value={formatCurrency(netBalance)} icon={<Scale size={20} />}
            variant={netBalance >= 0 ? "income" : "expense"} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-[#141414] rounded-2xl shadow-[var(--shadow-card)] ring-1 ring-white/[0.06] p-6 animate-fade-in">
            <h2 className="text-[16px] font-bold text-zinc-100 mb-5">{t("expenseBreakdown")}</h2>
            {expenseByCategory.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-64">
                <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mb-3">
                  <TrendingDown size={22} className="text-zinc-600" />
                </div>
                <p className="text-[13px] font-medium text-zinc-500">{t("noData")}</p>
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={320}>
                <PieChart>
                  <Pie
                    data={expenseByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={75}
                    outerRadius={120}
                    paddingAngle={4}
                    dataKey="amount"
                    nameKey="name"
                    strokeWidth={0}
                    cornerRadius={6}
                  >
                    {expenseByCategory.map((entry) => (
                      <Cell key={entry.categoryId} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => formatCurrency(Number(value ?? 0))}
                    contentStyle={{
                      borderRadius: "12px",
                      border: "1px solid rgba(255,255,255,0.08)",
                      background: "#1a1a1a",
                      boxShadow: "0 10px 15px -3px rgb(0 0 0 / 0.4)",
                      fontSize: "13px",
                      fontWeight: 600,
                      padding: "8px 14px",
                      color: "#e4e4e7",
                    }}
                  />
                  <Legend
                    verticalAlign="bottom"
                    iconType="circle"
                    iconSize={8}
                    wrapperStyle={{ fontSize: "12px", fontWeight: 600, paddingTop: "16px", color: "#a1a1aa" }}
                  />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>

          <div className="bg-[#141414] rounded-2xl shadow-[var(--shadow-card)] ring-1 ring-white/[0.06] overflow-hidden animate-fade-in">
            <div className="px-6 py-5 border-b border-white/[0.06]">
              <h2 className="text-[16px] font-bold text-zinc-100">{t("categoryDetails")}</h2>
            </div>
            {expenseByCategory.length === 0 ? (
              <div className="py-16 text-center">
                <p className="text-[13px] font-medium text-zinc-500">{t("noData")}</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/[0.06]">
                      <th className="text-start text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-6 py-3.5">{t("category")}</th>
                      <th className="text-end text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-6 py-3.5">{t("amount")}</th>
                      <th className="text-end text-[11px] font-semibold text-zinc-500 uppercase tracking-wider px-6 py-3.5">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {expenseByCategory.map((item, i) => (
                      <tr key={item.categoryId}
                        className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors duration-150"
                        style={{ animation: `fade-in 0.2s ease-out ${i * 0.04}s both` }}>
                        <td className="px-6 py-3.5">
                          <div className="flex items-center gap-3">
                            <div className="w-3 h-3 rounded-lg shrink-0 shadow-sm"
                              style={{ backgroundColor: item.color }} />
                            <span className="text-[13px] font-semibold text-zinc-300">{item.name}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3.5 text-end text-[13px] font-mono font-bold text-zinc-200 tabular-nums">
                          {formatCurrency(item.amount)}
                        </td>
                        <td className="px-6 py-3.5 text-end">
                          <div className="flex items-center justify-end gap-3">
                            <div className="w-20 h-2 bg-white/[0.05] rounded-full overflow-hidden">
                              <div className="h-full rounded-full transition-all duration-500 ease-out"
                                style={{ width: `${item.percentage}%`, backgroundColor: item.color }} />
                            </div>
                            <span className="text-[12px] font-bold text-zinc-500 font-mono w-14 text-end tabular-nums">
                              {item.percentage.toFixed(1)}%
                            </span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
