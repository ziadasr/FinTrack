import { useState, useEffect, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff, Lock, User, ArrowLeft, KeyRound } from "lucide-react";
import { login, register, checkStatus, resetPassword } from "../services/authService";
import { createCategory } from "../services/categoryService";
import { t } from "../config/i18n";
import { useLang } from "../hooks/useLang";

const DEFAULT_CATEGORIES: { name: string; type: "income" | "expense"; color: string }[] = [
  { name: "Food & Dining", type: "expense", color: "#f97316" },
  { name: "Transport", type: "expense", color: "#3b82f6" },
  { name: "Shopping", type: "expense", color: "#ec4899" },
  { name: "Bills & Utilities", type: "expense", color: "#8b5cf6" },
  { name: "Entertainment", type: "expense", color: "#f43f5e" },
  { name: "Health", type: "expense", color: "#14b8a6" },
  { name: "Education", type: "expense", color: "#6366f1" },
  { name: "Other Expense", type: "expense", color: "#64748b" },
  { name: "Salary", type: "income", color: "#10b981" },
  { name: "Freelance", type: "income", color: "#22c55e" },
  { name: "Gifts", type: "income", color: "#eab308" },
  { name: "Other Income", type: "income", color: "#84cc16" },
];

export default function Login() {
  const navigate = useNavigate();
  useLang();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [isSetup, setIsSetup] = useState<boolean | null>(null);

  // Forgot password state
  const [showReset, setShowReset] = useState(false);
  const [resetUsername, setResetUsername] = useState("");
  const [resetNewPass, setResetNewPass] = useState("");
  const [showResetPass, setShowResetPass] = useState(false);

  useEffect(() => {
    checkStatus()
      .then((status) => setIsSetup(status.isSetupComplete))
      .catch(() => setIsSetup(false));
  }, []);

  const seedCategories = async () => {
    for (const cat of DEFAULT_CATEGORIES) {
      try {
        await createCategory(cat);
      } catch { /* ignore if fails */ }
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      if (isSetup) {
        const auth = await login({ username, password });
        localStorage.setItem("token", auth.token);
        localStorage.setItem("username", auth.username);
        navigate("/");
      } else {
        const auth = await register({ username, password });
        localStorage.setItem("token", auth.token);
        localStorage.setItem("username", auth.username);
        // Seed default categories for new user
        await seedCategories();
        // Mark as new user for onboarding
        localStorage.removeItem("onboarded");
        navigate("/");
      }
    } catch (err: unknown) {
      const message =
        err instanceof Error ? err.message : "Invalid credentials";
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as Record<string, unknown>).response === "object"
      ) {
        const resp = (err as { response: { data?: { message?: string } } })
          .response;
        setError(resp.data?.message || message);
      } else {
        setError(message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: FormEvent) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const auth = await resetPassword(resetUsername, resetNewPass);
      localStorage.setItem("token", auth.token);
      localStorage.setItem("username", auth.username);
      navigate("/");
    } catch (err: unknown) {
      if (
        typeof err === "object" &&
        err !== null &&
        "response" in err &&
        typeof (err as Record<string, unknown>).response === "object"
      ) {
        const resp = (err as { response: { data?: { message?: string } } })
          .response;
        setError(resp.data?.message || "Reset failed");
      } else {
        setError("Reset failed");
      }
    } finally {
      setLoading(false);
    }
  };

  if (isSetup === null) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0d0d0d]">
        <Loader2 size={32} className="animate-spin text-amber-500" />
      </div>
    );
  }

  const inputWrap = "relative";
  const inputIcon = "absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600";
  const inputStyle =
    "w-full pl-11 pr-4 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-[14px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/40 transition-all";

  return (
    <div className="min-h-screen relative overflow-hidden flex items-center justify-center px-4 bg-[#0d0d0d]">
      <div className="absolute inset-0">
        <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] rounded-full bg-gradient-to-br from-amber-500/[0.06] to-amber-700/[0.02] blur-3xl" />
        <div className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] rounded-full bg-gradient-to-tr from-zinc-800/40 to-zinc-900/20 blur-3xl" />
      </div>

      <div className="absolute inset-0 opacity-[0.02]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, #fbbf24 1px, transparent 0)`,
        backgroundSize: '32px 32px',
      }} />

      <div className="relative w-full max-w-[400px] animate-fade-in-scale">
        <div className="text-center mb-8">
          <div className="relative inline-flex mb-5">
            <div className="w-16 h-16 rounded-2xl shadow-xl shadow-amber-500/25 ring-1 ring-amber-400/30 overflow-hidden">
              <img src="/logo.png" alt="FinTrack" className="w-full h-full object-cover scale-[1.9]" />
            </div>
            <div className="absolute -inset-1 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 opacity-20 blur-lg" />
          </div>

          {showReset ? (
            <>
              <h1 className="text-[28px] font-extrabold text-zinc-100 tracking-tight">
                {t("resetPassword")}
              </h1>
              <p className="text-[14px] text-zinc-500 mt-1.5">
                {t("chooseNewPassword")}
              </p>
            </>
          ) : (
            <>
              <h1 className="text-[28px] font-extrabold text-zinc-100 tracking-tight">
                {isSetup ? t("welcomeBack") : t("createAccount")}
              </h1>
              <p className="text-[14px] text-zinc-500 mt-1.5">
                {isSetup ? t("signInSubtitle") : t("setupSubtitle")}
              </p>
            </>
          )}
        </div>

        {showReset ? (
          <form
            onSubmit={handleReset}
            className="glass-strong rounded-2xl shadow-xl ring-1 ring-white/[0.06] p-7 space-y-5"
          >
            {error && (
              <div className="bg-rose-500/10 text-rose-400 text-[13px] font-medium px-4 py-3 rounded-xl ring-1 ring-rose-500/20 flex items-center gap-2 animate-fade-in">
                <div className="w-5 h-5 rounded-full bg-rose-500/15 flex items-center justify-center shrink-0">
                  <span className="text-rose-400 text-xs font-bold">!</span>
                </div>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="reset-user" className="block text-[13px] font-semibold text-zinc-400 mb-2">
                {t("username")}
              </label>
              <div className={inputWrap}>
                <div className={inputIcon}><User size={16} /></div>
                <input
                  id="reset-user"
                  type="text"
                  value={resetUsername}
                  onChange={(e) => setResetUsername(e.target.value)}
                  required
                  autoFocus
                  className={inputStyle}
                  placeholder={t("enterUsername")}
                />
              </div>
            </div>

            <div>
              <label htmlFor="reset-pass" className="block text-[13px] font-semibold text-zinc-400 mb-2">
                {t("newPassword")}
              </label>
              <div className={inputWrap}>
                <div className={inputIcon}><KeyRound size={16} /></div>
                <input
                  id="reset-pass"
                  type={showResetPass ? "text" : "password"}
                  value={resetNewPass}
                  onChange={(e) => setResetNewPass(e.target.value)}
                  required
                  minLength={6}
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-[14px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/40 transition-all"
                  placeholder={t("chooseNewPassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowResetPass(!showResetPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.05] transition-all"
                >
                  {showResetPass ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold text-[14px] py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98]"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading ? t("resetting") : t("resetBtn")}
            </button>

            <button
              type="button"
              onClick={() => { setShowReset(false); setError(""); }}
              className="w-full text-[13px] font-medium text-zinc-500 hover:text-zinc-300 transition-colors flex items-center justify-center gap-1.5 pt-1"
            >
              <ArrowLeft size={14} />
              {t("backToLogin")}
            </button>
          </form>
        ) : (
          <form
            onSubmit={handleSubmit}
            className="glass-strong rounded-2xl shadow-xl ring-1 ring-white/[0.06] p-7 space-y-5"
          >
            {error && (
              <div className="bg-rose-500/10 text-rose-400 text-[13px] font-medium px-4 py-3 rounded-xl ring-1 ring-rose-500/20 flex items-center gap-2 animate-fade-in">
                <div className="w-5 h-5 rounded-full bg-rose-500/15 flex items-center justify-center shrink-0">
                  <span className="text-rose-400 text-xs font-bold">!</span>
                </div>
                {error}
              </div>
            )}

            <div>
              <label htmlFor="username" className="block text-[13px] font-semibold text-zinc-400 mb-2">
                {t("username")}
              </label>
              <div className={inputWrap}>
                <div className={inputIcon}><User size={16} /></div>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  autoFocus
                  className={inputStyle}
                  placeholder={isSetup ? t("enterUsername") : t("chooseUsername")}
                />
              </div>
            </div>

            <div>
              <label htmlFor="password" className="block text-[13px] font-semibold text-zinc-400 mb-2">
                {t("password")}
              </label>
              <div className={inputWrap}>
                <div className={inputIcon}><Lock size={16} /></div>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-11 pr-11 py-3 rounded-xl border border-white/[0.08] bg-white/[0.03] text-[14px] text-zinc-100 placeholder:text-zinc-600 focus:outline-none focus:ring-2 focus:ring-amber-500/30 focus:border-amber-500/40 transition-all"
                  placeholder={isSetup ? t("enterPassword") : t("choosePassword")}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 w-7 h-7 rounded-lg flex items-center justify-center text-zinc-600 hover:text-zinc-400 hover:bg-white/[0.05] transition-all"
                >
                  {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-semibold text-[14px] py-3 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98]"
            >
              {loading && <Loader2 size={16} className="animate-spin" />}
              {loading
                ? isSetup ? t("signingIn") : t("creatingAccount")
                : isSetup ? t("signIn") : t("createAccountBtn")}
            </button>

            {isSetup && (
              <button
                type="button"
                onClick={() => { setShowReset(true); setError(""); }}
                className="w-full text-[13px] font-medium text-zinc-500 hover:text-amber-400 transition-colors pt-1"
              >
                {t("forgotPassword")}
              </button>
            )}
          </form>
        )}

        <p className="text-center text-[12px] text-zinc-600 mt-6">
          {t("secured")}
        </p>
      </div>
    </div>
  );
}
