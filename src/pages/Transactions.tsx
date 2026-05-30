import { useState, useEffect, type FormEvent } from "react";
import {
  Loader2,
  AlertCircle,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
  SlidersHorizontal,
  ArrowUpDown,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import { getAccounts } from "../services/accountService";
import { getCategories } from "../services/categoryService";
import {
  getTransactions,
  createTransaction,
  updateTransaction,
  deleteTransaction,
} from "../services/transactionService";
import type { Account } from "../types/account";
import type { Category } from "../types/category";
import type { Transaction, TransactionFormData } from "../types/transaction";
import TransactionTable from "../components/TransactionTable";
import Modal from "../components/Modal";
import { t } from "../config/i18n";
import { useLang } from "../hooks/useLang";

export default function Transactions() {
  useLang();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [filterType, setFilterType] = useState<"all" | "income" | "expense">("all");
  const [filterAccount, setFilterAccount] = useState("");
  const [filterCategory, setFilterCategory] = useState("");
  const [filterMonth, setFilterMonth] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "amount">("date");
  const [sortDir, setSortDir] = useState<"asc" | "desc">("desc");
  const [page, setPage] = useState(1);
  const perPage = 25;

  const [formType, setFormType] = useState<"income" | "expense">("expense");
  const [formAmount, setFormAmount] = useState("");
  const [formAccountId, setFormAccountId] = useState("");
  const [formCategoryId, setFormCategoryId] = useState("");
  const [formDate, setFormDate] = useState(new Date().toISOString().split("T")[0]);
  const [formNote, setFormNote] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [editModal, setEditModal] = useState(false);
  const [editTx, setEditTx] = useState<Transaction | null>(null);
  const [editForm, setEditForm] = useState<TransactionFormData>({
    type: "expense",
    amount: 0,
    accountId: "",
    categoryId: "",
    note: "",
    date: "",
  });

  const [deleteModal, setDeleteModal] = useState(false);
  const [deleteTx, setDeleteTx] = useState<Transaction | null>(null);
  const [deleting, setDeleting] = useState(false);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [accs, cats, txs] = await Promise.all([
        getAccounts(),
        getCategories(),
        getTransactions(),
      ]);
      setAccounts(accs);
      setCategories(cats);
      setTransactions(txs);
    } catch {
      setError(t("failedLoad"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filteredCategories = categories.filter((c) => c.type === formType);

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createTransaction({
        type: formType,
        amount: parseFloat(formAmount),
        accountId: formAccountId,
        categoryId: formCategoryId,
        note: formNote,
        date: formDate,
      });
      setFormAmount("");
      setFormNote("");
      await fetchData();
    } catch {
      setError(t("failedLoad"));
    } finally {
      setSubmitting(false);
    }
  };

  const openEdit = (tx: Transaction) => {
    setEditTx(tx);
    setEditForm({
      type: tx.type,
      amount: tx.amount,
      accountId: tx.accountId,
      categoryId: tx.categoryId,
      note: tx.note,
      date: tx.date.split("T")[0],
    });
    setEditModal(true);
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!editTx) return;
    setSubmitting(true);
    try {
      await updateTransaction(editTx.id, editForm);
      setEditModal(false);
      await fetchData();
    } catch {
      setError(t("failedLoad"));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteTx) return;
    setDeleting(true);
    try {
      await deleteTransaction(deleteTx.id);
      setDeleteModal(false);
      await fetchData();
    } catch {
      setError(t("failedLoad"));
    } finally {
      setDeleting(false);
    }
  };

  const filtered = transactions
    .filter((tx) => {
      if (filterType !== "all" && tx.type !== filterType) return false;
      if (filterAccount && tx.accountId !== filterAccount) return false;
      if (filterCategory && tx.categoryId !== filterCategory) return false;
      if (filterMonth) {
        const d = new Date(tx.date);
        const txMonth = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
        if (txMonth !== filterMonth) return false;
      }
      return true;
    })
    .sort((a, b) => {
      const dir = sortDir === "asc" ? 1 : -1;
      if (sortBy === "date")
        return dir * (new Date(a.date).getTime() - new Date(b.date).getTime());
      return dir * (a.amount - b.amount);
    });

  const totalPages = Math.max(1, Math.ceil(filtered.length / perPage));
  const safePage = Math.min(page, totalPages);
  const paginated = filtered.slice((safePage - 1) * perPage, safePage * perPage);

  const availableMonths = Array.from(
    new Set(
      transactions.map((tx) => {
        const d = new Date(tx.date);
        return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
      })
    )
  ).sort((a, b) => b.localeCompare(a));

  const editFilteredCategories = categories.filter((c) => c.type === editForm.type);

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-[13px] text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/30 transition-all";
  const selectClass = `${inputClass} bg-[#1a1a1a]`;
  const labelClass = "block text-[12px] font-semibold text-zinc-500 mb-1.5 uppercase tracking-wider";

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

  return (
    <div className="flex-1 overflow-y-auto gradient-mesh">
      <div className="p-8 max-w-[1200px] mx-auto space-y-6">
        <div className="animate-fade-in">
          <h1 className="text-[26px] font-extrabold text-zinc-100 tracking-tight">
            {t("transactionsTitle")}
          </h1>
          <p className="text-[14px] text-zinc-500 mt-1">
            {t("transactionsSubtitle")}
          </p>
        </div>

        {error && (
          <div className="bg-rose-500/10 text-rose-400 text-[13px] font-medium px-4 py-3 rounded-xl ring-1 ring-rose-500/20 flex items-center gap-2 animate-fade-in">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form
          onSubmit={handleAdd}
          className="bg-[#141414] rounded-2xl shadow-[var(--shadow-card)] ring-1 ring-white/[0.06] p-6 animate-fade-in-scale"
        >
          <div className="flex items-center gap-2.5 mb-5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center shadow-md shadow-amber-500/20">
              <Plus size={15} className="text-white" />
            </div>
            <h2 className="text-[14px] font-bold text-zinc-100">
              {t("addTransaction")}
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-3 items-end">
            <div>
              <label className={labelClass}>{t("categoryType")}</label>
              <div className="flex rounded-xl border border-white/[0.08] overflow-hidden">
                <button
                  type="button"
                  onClick={() => setFormType("income")}
                  className={`flex-1 py-2.5 text-[12px] font-bold flex items-center justify-center gap-1 transition-all ${
                    formType === "income"
                      ? "bg-emerald-500 text-white shadow-inner"
                      : "bg-[#1a1a1a] text-zinc-500 hover:bg-white/[0.04]"
                  }`}
                >
                  <ArrowUpRight size={12} />
                  {t("income")}
                </button>
                <button
                  type="button"
                  onClick={() => setFormType("expense")}
                  className={`flex-1 py-2.5 text-[12px] font-bold flex items-center justify-center gap-1 transition-all border-l border-white/[0.08] ${
                    formType === "expense"
                      ? "bg-rose-500 text-white shadow-inner"
                      : "bg-[#1a1a1a] text-zinc-500 hover:bg-white/[0.04]"
                  }`}
                >
                  <ArrowDownRight size={12} />
                  {t("expense")}
                </button>
              </div>
            </div>
            <div>
              <label className={labelClass}>{t("amount")}</label>
              <input
                type="number"
                step="0.01"
                min="0.01"
                value={formAmount}
                onChange={(e) => setFormAmount(e.target.value)}
                required
                placeholder="0.00"
                className={`${inputClass} font-mono`}
              />
            </div>
            <div>
              <label className={labelClass}>{t("account")}</label>
              <select
                value={formAccountId}
                onChange={(e) => setFormAccountId(e.target.value)}
                required
                className={selectClass}
              >
                <option value="">...</option>
                {accounts.map((a) => (
                  <option key={a.id} value={a.id}>{a.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>{t("category")}</label>
              <select
                value={formCategoryId}
                onChange={(e) => setFormCategoryId(e.target.value)}
                required
                className={selectClass}
              >
                <option value="">...</option>
                {filteredCategories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className={labelClass}>{t("date")}</label>
              <input
                type="date"
                value={formDate}
                onChange={(e) => setFormDate(e.target.value)}
                required
                className={inputClass}
              />
            </div>
            <div>
              <label className={labelClass}>{t("note")}</label>
              <input
                type="text"
                value={formNote}
                onChange={(e) => setFormNote(e.target.value)}
                className={inputClass}
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-[13px] py-2.5 rounded-xl transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20 active:scale-[0.98]"
              >
                {submitting ? <Loader2 size={14} className="animate-spin" /> : <Plus size={14} />}
                {t("add")}
              </button>
            </div>
          </div>
        </form>

        <div className="bg-[#141414] rounded-2xl shadow-[var(--shadow-card)] ring-1 ring-white/[0.06] overflow-hidden animate-fade-in">
          <div className="px-6 py-4 border-b border-white/[0.06] flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 text-zinc-500 mr-1">
              <SlidersHorizontal size={14} />
              <span className="text-[12px] font-semibold uppercase tracking-wider">{t("sortBy")}</span>
            </div>
            {[
              { value: filterType, onChange: (v: string) => { setFilterType(v as "all"|"income"|"expense"); setPage(1); }, options: [["all", t("allTypes")],["income", t("income")],["expense", t("expense")]] },
              { value: filterAccount, onChange: (v: string) => { setFilterAccount(v); setPage(1); }, options: [["", t("allAccounts")], ...accounts.map(a => [a.id, a.name])] },
              { value: filterCategory, onChange: (v: string) => { setFilterCategory(v); setPage(1); }, options: [["", t("allCategories")], ...categories.map(c => [c.id, c.name])] },
              { value: filterMonth, onChange: (v: string) => { setFilterMonth(v); setPage(1); }, options: [["", t("date")], ...availableMonths.map(m => [m, new Date(m + "-01").toLocaleDateString(undefined, { year: "numeric", month: "short" })])] },
            ].map((f, i) => (
              <select
                key={i}
                value={f.value}
                onChange={(e) => f.onChange(e.target.value)}
                className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-[12px] font-medium bg-[#1a1a1a] text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              >
                {f.options.map(([val, label]) => (
                  <option key={val} value={val}>{label}</option>
                ))}
              </select>
            ))}
            <div className="ml-auto flex items-center gap-2">
              <ArrowUpDown size={14} className="text-zinc-500" />
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "date" | "amount")}
                className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-[12px] font-medium bg-[#1a1a1a] text-zinc-300 focus:outline-none focus:ring-2 focus:ring-amber-500/30"
              >
                <option value="date">{t("date")}</option>
                <option value="amount">{t("amount")}</option>
              </select>
              <button
                onClick={() => setSortDir(sortDir === "asc" ? "desc" : "asc")}
                className="px-3 py-1.5 rounded-lg border border-white/[0.08] text-[12px] font-bold bg-[#1a1a1a] text-zinc-300 hover:bg-white/[0.04] transition-all"
              >
                {sortDir === "asc" ? t("oldest") : t("newest")}
              </button>
            </div>
          </div>
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-sm font-medium text-zinc-500">{t("noMatchingTransactions")}</p>
              <p className="text-xs text-zinc-600 mt-1">{t("noMatchingTransactionsDesc")}</p>
            </div>
          ) : (
            <>
              <TransactionTable
                transactions={paginated}
                accounts={accounts}
                categories={categories}
                showActions
                onEdit={openEdit}
                onDelete={(tx) => { setDeleteTx(tx); setDeleteModal(true); }}
              />
              {totalPages > 1 && (
                <div className="px-6 py-4 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[12px] text-zinc-500">
                    {(safePage - 1) * perPage + 1}–{Math.min(safePage * perPage, filtered.length)} / {filtered.length}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPage(Math.max(1, safePage - 1))}
                      disabled={safePage <= 1}
                      className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:bg-white/[0.04] disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                      <ChevronLeft size={15} />
                    </button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button
                        key={p}
                        onClick={() => setPage(p)}
                        className={`w-8 h-8 rounded-lg text-[12px] font-bold transition-all ${
                          p === safePage
                            ? "bg-amber-500/15 text-amber-400 ring-1 ring-amber-500/20"
                            : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
                        }`}
                      >
                        {p}
                      </button>
                    ))}
                    <button
                      onClick={() => setPage(Math.min(totalPages, safePage + 1))}
                      disabled={safePage >= totalPages}
                      className="w-8 h-8 rounded-lg border border-white/[0.08] flex items-center justify-center text-zinc-400 hover:bg-white/[0.04] disabled:opacity-30 disabled:pointer-events-none transition-all"
                    >
                      <ChevronRight size={15} />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>

      <Modal open={editModal} onClose={() => setEditModal(false)} title={t("editTransaction")}>
        <form onSubmit={handleUpdate} className="space-y-4">
          <div>
            <label className={labelClass}>{t("categoryType")}</label>
            <div className="flex rounded-xl border border-white/[0.08] overflow-hidden">
              <button type="button" onClick={() => setEditForm({ ...editForm, type: "income", categoryId: "" })}
                className={`flex-1 py-2.5 text-[13px] font-bold transition-all ${editForm.type === "income" ? "bg-emerald-500 text-white" : "bg-[#1a1a1a] text-zinc-500"}`}>
                {t("income")}
              </button>
              <button type="button" onClick={() => setEditForm({ ...editForm, type: "expense", categoryId: "" })}
                className={`flex-1 py-2.5 text-[13px] font-bold transition-all border-l border-white/[0.08] ${editForm.type === "expense" ? "bg-rose-500 text-white" : "bg-[#1a1a1a] text-zinc-500"}`}>
                {t("expense")}
              </button>
            </div>
          </div>
          <div>
            <label className={labelClass}>{t("amount")}</label>
            <input type="number" step="0.01" min="0.01" value={editForm.amount}
              onChange={(e) => setEditForm({ ...editForm, amount: parseFloat(e.target.value) })}
              required className={`${inputClass} font-mono`} />
          </div>
          <div>
            <label className={labelClass}>{t("account")}</label>
            <select value={editForm.accountId} onChange={(e) => setEditForm({ ...editForm, accountId: e.target.value })}
              required className={selectClass}>
              <option value="">...</option>
              {accounts.map((a) => <option key={a.id} value={a.id}>{a.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>{t("category")}</label>
            <select value={editForm.categoryId} onChange={(e) => setEditForm({ ...editForm, categoryId: e.target.value })}
              required className={selectClass}>
              <option value="">...</option>
              {editFilteredCategories.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
          </div>
          <div>
            <label className={labelClass}>{t("date")}</label>
            <input type="date" value={editForm.date} onChange={(e) => setEditForm({ ...editForm, date: e.target.value })}
              required className={inputClass} />
          </div>
          <div>
            <label className={labelClass}>{t("note")}</label>
            <input type="text" value={editForm.note} onChange={(e) => setEditForm({ ...editForm, note: e.target.value })}
              className={inputClass} />
          </div>
          <div className="flex gap-3 pt-3">
            <button type="button" onClick={() => setEditModal(false)}
              className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-[13px] font-semibold text-zinc-400 hover:bg-white/[0.04] transition-all">
              {t("cancel")}
            </button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[13px] font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20">
              {submitting && <Loader2 size={14} className="animate-spin" />}
              {t("save")}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title={t("deleteTransaction")}>
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-3">
            <AlertCircle size={22} className="text-rose-400" />
          </div>
          <p className="text-[14px] text-zinc-400">
            {t("deleteTransactionConfirm")}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setDeleteModal(false)}
            className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-[13px] font-semibold text-zinc-400 hover:bg-white/[0.04] transition-all">
            {t("cancel")}
          </button>
          <button onClick={handleDelete} disabled={deleting}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white text-[13px] font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/20">
            {deleting && <Loader2 size={14} className="animate-spin" />}
            {t("delete")}
          </button>
        </div>
      </Modal>
    </div>
  );
}
