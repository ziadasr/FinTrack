import { useState, useEffect, type FormEvent } from "react";
import {
  Loader2,
  AlertCircle,
  Plus,
  Pencil,
  Trash2,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/categoryService";
import type { Category, CategoryFormData } from "../types/category";
import Modal from "../components/Modal";
import { t } from "../config/i18n";
import { useLang } from "../hooks/useLang";

const PRESET_COLORS = [
  "#6366f1", "#8b5cf6", "#a855f7", "#ec4899",
  "#f43f5e", "#f97316", "#eab308", "#84cc16",
  "#22c55e", "#10b981", "#14b8a6", "#06b6d4",
  "#0ea5e9", "#3b82f6", "#64748b", "#78716c",
];

export default function Categories() {
  useLang();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [addModal, setAddModal] = useState(false);
  const [editModal, setEditModal] = useState(false);
  const [deleteModal, setDeleteModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState<CategoryFormData>({ name: "", type: "expense", color: PRESET_COLORS[0] });

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setCategories(await getCategories());
    } catch { setError(t("failedLoad")); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchCategories(); }, []);

  const resetForm = () => setForm({ name: "", type: "expense", color: PRESET_COLORS[0] });

  const handleAdd = async (e: FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await createCategory(form);
      setAddModal(false);
      resetForm();
      await fetchCategories();
    } catch { setError(t("failedLoad")); }
    finally { setSubmitting(false); }
  };

  const openEdit = (cat: Category) => {
    setSelectedCategory(cat);
    setForm({ name: cat.name, type: cat.type, color: cat.color });
    setEditModal(true);
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    if (!selectedCategory) return;
    setSubmitting(true);
    try {
      await updateCategory(selectedCategory.id, form);
      setEditModal(false);
      resetForm();
      await fetchCategories();
    } catch { setError(t("failedLoad")); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async () => {
    if (!selectedCategory) return;
    setSubmitting(true);
    try {
      await deleteCategory(selectedCategory.id);
      setDeleteModal(false);
      await fetchCategories();
    } catch { setError(t("failedLoad")); }
    finally { setSubmitting(false); }
  };

  const incomeCategories = categories.filter((c) => c.type === "income");
  const expenseCategories = categories.filter((c) => c.type === "expense");

  const inputClass = "w-full px-3.5 py-2.5 rounded-xl border border-white/[0.08] bg-white/[0.03] text-[13px] text-zinc-100 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/30 transition-all";
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
        <label className={labelClass}>{t("categoryName")}</label>
        <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
          required className={inputClass} />
      </div>
      <div>
        <label className={labelClass}>{t("categoryType")}</label>
        <div className="flex rounded-xl border border-white/[0.08] overflow-hidden">
          <button type="button" onClick={() => setForm({ ...form, type: "income" })}
            className={`flex-1 py-2.5 text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all ${
              form.type === "income" ? "bg-emerald-500 text-white" : "bg-[#1a1a1a] text-zinc-500 hover:bg-white/[0.04]"}`}>
            <ArrowUpRight size={14} /> {t("income")}
          </button>
          <button type="button" onClick={() => setForm({ ...form, type: "expense" })}
            className={`flex-1 py-2.5 text-[13px] font-bold flex items-center justify-center gap-1.5 transition-all border-l border-white/[0.08] ${
              form.type === "expense" ? "bg-rose-500 text-white" : "bg-[#1a1a1a] text-zinc-500 hover:bg-white/[0.04]"}`}>
            <ArrowDownRight size={14} /> {t("expense")}
          </button>
        </div>
      </div>
      <div>
        <label className={labelClass}>{t("color")}</label>
        <div className="grid grid-cols-8 gap-2.5 mb-3">
          {PRESET_COLORS.map((color) => (
            <button key={color} type="button" onClick={() => setForm({ ...form, color })}
              className={`w-8 h-8 rounded-xl transition-all duration-200 ${
                form.color === color ? "ring-2 ring-offset-2 ring-offset-[#1a1a1a] ring-amber-500 scale-110 shadow-md" : "hover:scale-105"
              }`}
              style={{ backgroundColor: color }} />
          ))}
        </div>
        <div className="flex items-center gap-3 p-2.5 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <input type="color" value={form.color} onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent" />
          <span className="text-[12px] text-zinc-500 font-mono font-medium">{form.color}</span>
          <div className="ml-auto flex items-center gap-2">
            <span className="text-[11px] text-zinc-600">{t("customColor")}:</span>
            <div className="w-5 h-5 rounded-full shadow-sm" style={{ backgroundColor: form.color }} />
          </div>
        </div>
      </div>
    </>
  );

  const renderCategoryList = (cats: Category[], title: string, icon: typeof ArrowUpRight, accentColor: string) => (
    <div className="bg-[#141414] rounded-2xl shadow-[var(--shadow-card)] ring-1 ring-white/[0.06] overflow-hidden">
      <div className="px-6 py-4 border-b border-white/[0.06] flex items-center gap-2.5">
        <div className={`w-7 h-7 rounded-lg flex items-center justify-center ${accentColor}`}>
          {icon === ArrowUpRight ? <ArrowUpRight size={14} /> : <ArrowDownRight size={14} />}
        </div>
        <h2 className="text-[14px] font-bold text-zinc-100">{title}</h2>
        <span className="ml-auto text-[11px] font-bold text-zinc-500 bg-white/[0.05] px-2 py-0.5 rounded-md">
          {cats.length}
        </span>
      </div>
      {cats.length === 0 ? (
        <div className="py-12 text-center">
          <p className="text-[13px] font-medium text-zinc-500">{t("noCategories")}</p>
          <p className="text-[11px] text-zinc-600 mt-1">{t("noCategoriesDesc")}</p>
        </div>
      ) : (
        <div className="divide-y divide-white/[0.03]">
          {cats.map((cat, i) => (
            <div key={cat.id} className="flex items-center px-6 py-3.5 hover:bg-white/[0.02] transition-colors duration-150 group animate-fade-in"
              style={{ animationDelay: `${i * 0.03}s` }}>
              <div className="w-4 h-4 rounded-lg shrink-0 mr-4 shadow-sm"
                style={{ backgroundColor: cat.color }} />
              <span className="text-[13px] font-semibold text-zinc-300 flex-1">{cat.name}</span>
              <span className={`text-[11px] font-bold px-2.5 py-1 rounded-lg mr-3 ${
                cat.type === "income" ? "bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/20" : "bg-rose-500/10 text-rose-400 ring-1 ring-rose-500/20"
              }`}>{cat.type === "income" ? t("income") : t("expense")}</span>
              <div className="flex gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                <button onClick={() => openEdit(cat)}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-amber-400 hover:bg-amber-500/10 transition-all"
                  aria-label={t("edit")}><Pencil size={13} /></button>
                <button onClick={() => { setSelectedCategory(cat); setDeleteModal(true); }}
                  className="w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-rose-400 hover:bg-rose-500/10 transition-all"
                  aria-label={t("delete")}><Trash2 size={13} /></button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  return (
    <div className="flex-1 overflow-y-auto gradient-mesh">
      <div className="p-8 max-w-[1200px] mx-auto space-y-6">
        <div className="flex items-center justify-between animate-fade-in">
          <div>
            <h1 className="text-[26px] font-extrabold text-zinc-100 tracking-tight">{t("categoriesTitle")}</h1>
            <p className="text-[14px] text-zinc-500 mt-1">{t("categoriesSubtitle")}</p>
          </div>
          <button onClick={() => { resetForm(); setAddModal(true); }}
            className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-[13px] px-5 py-2.5 rounded-xl transition-all flex items-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98]">
            <Plus size={16} /> {t("addCategory")}
          </button>
        </div>

        {error && (
          <div className="bg-rose-500/10 text-rose-400 text-[13px] font-medium px-4 py-3 rounded-xl ring-1 ring-rose-500/20 flex items-center gap-2 animate-fade-in">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {renderCategoryList(expenseCategories, t("expenseCategories"), ArrowDownRight, "bg-rose-500/10 text-rose-400")}
          {renderCategoryList(incomeCategories, t("incomeCategories"), ArrowUpRight, "bg-emerald-500/10 text-emerald-400")}
        </div>
      </div>

      <Modal open={addModal} onClose={() => setAddModal(false)} title={t("addCategory")}>
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

      <Modal open={editModal} onClose={() => setEditModal(false)} title={t("editCategory")}>
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
            {t("deleteCategoryConfirm")}
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
