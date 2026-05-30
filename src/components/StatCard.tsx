import type { ReactNode } from "react";

interface StatCardProps {
  title: string;
  value: string;
  icon: ReactNode;
  variant?: "default" | "income" | "expense";
  subtitle?: string;
}

export default function StatCard({
  title,
  value,
  icon,
  variant = "default",
  subtitle,
}: StatCardProps) {
  const styles = {
    default: {
      card: "from-amber-500/[0.06] to-[#141414]",
      iconBg: "from-amber-500 to-amber-600",
      iconShadow: "shadow-amber-500/20",
      value: "text-zinc-100",
      ring: "ring-amber-500/10",
    },
    income: {
      card: "from-emerald-500/[0.06] to-[#141414]",
      iconBg: "from-emerald-500 to-emerald-600",
      iconShadow: "shadow-emerald-500/20",
      value: "text-emerald-400",
      ring: "ring-emerald-500/10",
    },
    expense: {
      card: "from-rose-500/[0.06] to-[#141414]",
      iconBg: "from-rose-500 to-rose-600",
      iconShadow: "shadow-rose-500/20",
      value: "text-rose-400",
      ring: "ring-rose-500/10",
    },
  };

  const s = styles[variant];

  return (
    <div
      className={`relative overflow-hidden bg-gradient-to-br ${s.card} rounded-2xl p-5 shadow-[var(--shadow-card)] ring-1 ${s.ring} hover:shadow-[var(--shadow-md)] transition-all duration-300 group`}
    >
      <div className="flex items-start justify-between mb-4">
        <div
          className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.iconBg} text-white flex items-center justify-center shadow-lg ${s.iconShadow}`}
        >
          {icon}
        </div>
      </div>
      <p className="text-[13px] font-medium text-zinc-500 mb-1">{title}</p>
      <p className={`text-[26px] font-bold font-mono tracking-tight ${s.value}`}>
        {value}
      </p>
      {subtitle && (
        <p className="text-[11px] font-medium text-zinc-600 mt-1.5">
          {subtitle}
        </p>
      )}
      <div className="absolute -right-6 -bottom-6 w-24 h-24 rounded-full bg-gradient-to-br from-current opacity-[0.03] group-hover:opacity-[0.06] transition-opacity" />
    </div>
  );
}
