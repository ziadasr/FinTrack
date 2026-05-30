import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Landmark,
  Tag,
  CalendarRange,
  LogOut,
  Globe,
} from "lucide-react";
import { logout } from "../services/authService";
import { t, getLang, setLang } from "../config/i18n";
import { useLang } from "../hooks/useLang";

const linkKeys = [
  { to: "/", key: "dashboard" as const, icon: LayoutDashboard },
  { to: "/transactions", key: "transactions" as const, icon: ArrowLeftRight },
  { to: "/accounts", key: "accounts" as const, icon: Landmark },
  { to: "/categories", key: "categories" as const, icon: Tag },
  { to: "/monthly-summary", key: "monthlySummary" as const, icon: CalendarRange },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const username = localStorage.getItem("username") || "User";
  const lang = useLang();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const toggleLang = () => {
    setLang(getLang() === "en" ? "ar" : "en");
  };

  return (
    <aside className="w-[272px] h-screen bg-[#111111] border-r border-white/[0.06] flex flex-col shrink-0 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-amber-500/[0.03] via-transparent to-transparent pointer-events-none" />

      <div className="relative px-6 py-6">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl shadow-lg shadow-amber-500/20 ring-1 ring-amber-400/20 overflow-hidden">
            <img src="/logo.png" alt="FinTrack" className="w-full h-full object-cover scale-[1.9]" />
          </div>
          <div>
            <h1 className="text-[15px] font-bold text-zinc-100 tracking-tight">
              FinTrack
            </h1>
            <p className="text-[11px] font-medium text-zinc-500 tracking-wide uppercase">
              Personal Finance
            </p>
          </div>
        </div>
      </div>

      <div className="relative px-3 mb-1">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <nav className="relative flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {linkKeys.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            end={link.to === "/"}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all duration-200 group relative ${
                isActive
                  ? "bg-gradient-to-r from-amber-500/15 to-amber-500/5 text-amber-400 ring-1 ring-amber-500/20"
                  : "text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center transition-colors ${
                    isActive
                      ? "bg-amber-500/15 text-amber-400"
                      : "bg-white/[0.04] text-zinc-500 group-hover:bg-white/[0.06] group-hover:text-zinc-400"
                  }`}
                >
                  <link.icon size={16} />
                </div>
                {t(link.key)}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="relative px-3">
        <div className="h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      </div>

      <div className="relative px-3 py-4 space-y-2">
        <div className="flex items-center gap-3 px-3.5 py-1.5">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-amber-500/15 to-amber-600/10 text-amber-400 flex items-center justify-center text-sm font-bold ring-1 ring-amber-500/15">
            {username.charAt(0).toUpperCase()}
          </div>
          <div className="min-w-0">
            <p className="text-[13px] font-semibold text-zinc-200 truncate">
              {username}
            </p>
            <p className="text-[11px] text-zinc-600">Active</p>
          </div>
        </div>
        <button
          onClick={toggleLang}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold text-zinc-500 hover:bg-white/[0.04] hover:text-zinc-300 transition-all duration-200 w-full group"
        >
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-white/[0.06] flex items-center justify-center transition-colors">
            <Globe size={15} />
          </div>
          {lang === "en" ? "العربية" : "English"}
        </button>
        <button
          onClick={handleLogout}
          className="flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-[13px] font-semibold text-zinc-500 hover:bg-rose-500/10 hover:text-rose-400 transition-all duration-200 w-full group"
        >
          <div className="w-8 h-8 rounded-lg bg-white/[0.04] group-hover:bg-rose-500/10 flex items-center justify-center transition-colors">
            <LogOut size={15} />
          </div>
          {t("logout")}
        </button>
      </div>
    </aside>
  );
}
