import { useState } from "react";
import { Landmark, Tag, ArrowLeftRight, ChevronRight, Sparkles } from "lucide-react";
import { t } from "../config/i18n";
import { useLang } from "../hooks/useLang";

interface OnboardingProps {
  onComplete: () => void;
}

const steps = [
  { key: "onboardStep1", icon: Landmark, color: "from-blue-500 to-blue-600", shadow: "shadow-blue-500/20" },
  { key: "onboardStep2", icon: Tag, color: "from-amber-500 to-amber-600", shadow: "shadow-amber-500/20" },
  { key: "onboardStep3", icon: ArrowLeftRight, color: "from-emerald-500 to-emerald-600", shadow: "shadow-emerald-500/20" },
] as const;

export default function Onboarding({ onComplete }: OnboardingProps) {
  useLang();
  const [step, setStep] = useState(0);

  const isWelcome = step === 0;
  const stepIndex = step - 1;
  const isLastStep = step === steps.length;

  const handleNext = () => {
    if (isLastStep) {
      localStorage.setItem("onboarded", "true");
      onComplete();
    } else {
      setStep(step + 1);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm" style={{ animation: "fade-in 0.2s ease-out" }}>
      <div className="w-full max-w-md mx-4 animate-slide-up">
        {isWelcome ? (
          <div className="bg-[#1a1a1a] rounded-2xl ring-1 ring-white/[0.08] p-8 text-center">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-amber-600 flex items-center justify-center mx-auto mb-5 shadow-xl shadow-amber-500/25">
              <Sparkles size={28} className="text-white" />
            </div>
            <h2 className="text-[22px] font-extrabold text-zinc-100 mb-2">
              {t("welcomeTitle")}
            </h2>
            <p className="text-[14px] text-zinc-400 mb-8">
              {t("welcomeDesc")}
            </p>
            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-[14px] py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98]"
            >
              {t("onboardNext")}
              <ChevronRight size={16} />
            </button>
          </div>
        ) : (
          <div className="bg-[#1a1a1a] rounded-2xl ring-1 ring-white/[0.08] p-8">
            <div className="flex items-center gap-2 mb-6">
              {steps.map((_, i) => (
                <div
                  key={i}
                  className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                    i <= stepIndex ? "bg-amber-500" : "bg-white/[0.06]"
                  }`}
                />
              ))}
            </div>

            <div className="text-center">
              <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${steps[stepIndex].color} flex items-center justify-center mx-auto mb-5 shadow-xl ${steps[stepIndex].shadow}`}>
                {(() => { const Icon = steps[stepIndex].icon; return <Icon size={24} className="text-white" />; })()}
              </div>
              <h3 className="text-[18px] font-bold text-zinc-100 mb-2">
                {t(`${steps[stepIndex].key}Title` as any)}
              </h3>
              <p className="text-[14px] text-zinc-400 leading-relaxed mb-8">
                {t(`${steps[stepIndex].key}Desc` as any)}
              </p>
            </div>

            <button
              onClick={handleNext}
              className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-bold text-[14px] py-3 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg shadow-amber-500/20 active:scale-[0.98]"
            >
              {isLastStep ? t("onboardGetStarted") : t("onboardNext")}
              <ChevronRight size={16} />
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
