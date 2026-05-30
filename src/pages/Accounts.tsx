import { useState, useEffect, type FormEvent } from "react";
import {
  Loader2,
  AlertCircle,
  Plus,
  Pencil,
  Trash2,
  Landmark,
  Banknote,
  Wallet,
} from "lucide-react";
import {
  getAccounts,
  createAccount,
  updateAccount,
  deleteAccount,
} from "../services/accountService";
import type { Account, AccountFormData } from "../types/account";
import Modal from "../components/Modal";
import { formatCurrency, t } from "../config/i18n";
import { useLang } from "../hooks/useLang";

const accountIcons: Record<string, typeof Landmark> = {
  bank: Landmark,
  cash: Banknote,
  wallet: Wallet,
};

const accountGradients: Record<string, string> = {
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

export default function Accounts() {
  useLang();
  const [accounts, setAccounts] = useState<Account[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedAccount, setSelectedAccount] = useState<Account | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<AccountFormData>({ name: "", type: "bank", balance: 0 });

  const fetchAccounts = async () => {
    try {
      setLoading(true);
      setAccounts(await getAccounts());
    } catch {
      setError(t("failedLoad"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchAccounts(); }, []);

  const resetForm = () => setForm({ name: "", type: "bank", balance: 0 });

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createAccount(form);
      setAddModal(false);
      resetForm();
      await fetchAccounts();
    } catch { setError(t("failedLoad")); }
    finally { setSubmitting(false); }
  };

  const openEdit = (account: Account) => {
    setSelectedAccount(account);
    setForm({ name: account.name, type: account.type, balance: account.balance });
    setEditModal(true);
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedAccount) return;
    setSubmitting(true);
    try {
      await updateAccount(selectedAccount.id, form);
      setEditModal(false);
      resetForm();
      await fetchAccounts();
    } catch { setError(t("failedLoad")); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!selectedAccount) return;
    setSubmitting(true);
    try {
      await deleteAccount(selectedAccount.id);
      setDeleteModal(false);
      await fetchAccounts();
    } catch { setError(t("failedLoad")); }
    finally { setSubmitting(false); }
  };

  const inputClass =
    "w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-[13px] text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/30 transition-all";
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

  const formFields = (
    <>
      <div>
        <label className={labelClass}>{t("accountName")}</label>
        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          required className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>{t("accountType")}</label>
        <div className="grid grid-cols-3 gap-2">
          {(["bank", "cash", "wallet"] as const).map((type) => {
            const Icon = accountIcons[type];
            const grad = accountGradients[type];
            return (
              <button key={type} type="button" onClick={() => setForm({ ...form, type })}
                className={`flex flex-col items-center gap-2 py-4 rounded-xl border-2 text-[12px] font-bold transition-all ${
                  form.type === type
                    ? "border-amber-500/40 bg-amber-500/10 text-amber-400 shadow-md shadow-amber-500/10"
                    : "border-white/[0.06] text-zinc-500 hover:bg-white/[0.03] hover:border-white/[0.1]"
                }`}>
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${
                  form.type === type ? `bg-gradient-to-br ${grad} text-white shadow-md` : "bg-white/[0.05] text-zinc-500"
                }`}>
                  <Icon size={18} />
                </div>
                <span className="capitalize">{t(type)}</span>
              </button>
            );
          })}
        </div>
      </div>
      <div>
        <label className={labelClass}>{editModal ? t("balance") : t("initialBalance")}</label>
        <input type="number" step="0.01" value={form.balance}
          onChange={(e) => setForm({ ...form, balance: parseFloat(e.target.value) || 0 })}
          required className={`${inputClass} font-mono`} />
      </div>
    </>
  );

  return (
    <div className="flex-1 overflow-y-auto gradient-mesh">
      <div className="p-8 max-w-[1200px] mx-auto space-y-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-[26px] font-extrabold text-zinc-100 tracking-tight">{t("accountsTitle")}</h1>
            <p className="text-[14px] text-zinc-500 mt-1">{t("accountsSubtitle")}</p>
          </div>
          <button onClick={() => { resetForm(); setAddModal(true); }}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-[13px] px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98]">
            <Plus size={16} />
            {t("addAccount")}
          </button>
        </div>

        {error && (
          <div className="bg-rose-500/10 text-rose-400 text-[13px] font-medium px-4 py-3 rounded-xl ring-1 ring-rose-500/20 flex items-center gap-2 animate-fade-in">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {accounts.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-14 h-14 rounded-2xl bg-white/[0.04] flex items-center justify-center mx-auto mb-4">
              <Landmark size={24} className="text-zinc-600" />
            </div>
            <p className="text-sm font-medium text-zinc-500">{t("noAccounts")}</p>
            <p className="text-xs text-zinc-600 mt-1">{t("noAccountsDesc")}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {accounts.map((account, i) => {
              const Icon = accountIcons[account.type] || Wallet;
              const grad = accountGradients[account.type] || "from-zinc-500 to-zinc-600";
              const shadow = accountShadows[account.type] || "shadow-zinc-500/15";
              const ring = accountRings[account.type] || "ring-zinc-500/10";
              return (
                <div key={account.id}
                  className={`relative overflow-hidden bg-[#141414] rounded-2xl p-6 shadow-[var(--shadow-card)] ring-1 ${ring} hover:shadow-[var(--shadow-lg)] transition-all duration-300 group animate-fade-in-scale`}
                  style={{ animationDelay: `${i * 0.06}s` }}>
                  <div className="flex items-start justify-between mb-5">
                    <div className="flex items-center gap-3.5">
                      <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${grad} text-white flex items-center justify-center shadow-lg ${shadow}`}>
                        <Icon size={22} />
                      </div>
                      <div>
                        <p className="text-[14px] font-bold text-zinc-200">{account.name}</p>
                        <p className="text-[11px] font-medium text-zinc-600 capitalize">{t(account.type as "bank" | "cash" | "wallet")}</p>
                      </div>
                    </div>
                    <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-all duration-200">
                      <button onClick={() => openEdit(account)}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                        aria-label={t("edit")}><Pencil size={14} /></button>
                      <button onClick={() => { setSelectedAccount(account); setDeleteModal(true); }}
                        className="w-8 h-8 rounded-lg flex items-center justify-center text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                        aria-label={t("delete")}><Trash2 size={14} /></button>
                    </div>
                  </div>
                  <p className="text-[28px] font-extrabold font-mono text-zinc-100 tracking-tight tabular-nums">
                    {formatCurrency(account.balance)}
                  </p>
                  <div className="absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-gradient-to-br from-current opacity-[0.03] group-hover:opacity-[0.06] transition-opacity" />
                </div>
              );
            })}
          </div>
        )}
      </div>

      <Modal open={addModal} onClose={() => setAddModal(false)} title={t("addAccount")}>
        <form onSubmit={handleAdd} className="space-y-4">
          {formFields}
          <div className="flex gap-3 pt-3">
            <button type="button" onClick={() => setAddModal(false)}
              className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-[13px] font-semibold text-zinc-400 hover:bg-white/[0.04] transition-all">{t("cancel")}</button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[13px] font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20">
              {submitting && <Loader2 size={14} className="animate-spin" />} {t("save")}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={editModal} onClose={() => setEditModal(false)} title={t("editAccount")}>
        <form onSubmit={handleUpdate} className="space-y-4">
          {formFields}
          <div className="flex gap-3 pt-3">
            <button type="button" onClick={() => setEditModal(false)}
              className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-[13px] font-semibold text-zinc-400 hover:bg-white/[0.04] transition-all">{t("cancel")}</button>
            <button type="submit" disabled={submitting}
              className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 text-white text-[13px] font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md shadow-amber-500/20">
              {submitting && <Loader2 size={14} className="animate-spin" />} {t("save")}
            </button>
          </div>
        </form>
      </Modal>

      <Modal open={deleteModal} onClose={() => setDeleteModal(false)} title={t("delete")}>
        <div className="text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-500/10 flex items-center justify-center mx-auto mb-3">
            <AlertCircle size={22} className="text-rose-400" />
          </div>
          <p className="text-[14px] text-zinc-400">
            {t("deleteAccountConfirm")}
          </p>
        </div>
        <div className="flex gap-3">
          <button onClick={() => setDeleteModal(false)}
            className="flex-1 py-2.5 rounded-xl border border-white/[0.08] text-[13px] font-semibold text-zinc-400 hover:bg-white/[0.04] transition-all">{t("cancel")}</button>
          <button onClick={handleDelete} disabled={submitting}
            className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-rose-600 to-rose-500 text-white text-[13px] font-bold transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 shadow-md shadow-rose-500/20">
            {submitting && <Loader2 size={14} className="animate-spin" />} {t("delete")}
          </button>
        </div>
      </Modal>
    </div>
  );
}
