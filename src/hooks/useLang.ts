import { useState, useEffect } from "react";
import { getLang, subscribe, type Lang } from "../config/i18n";

export function useLang(): Lang {
  const [lang, setLangState] = useState<Lang>(getLang());

  useEffect(() => {
    const unsub = subscribe(() => setLangState(getLang()));
    return () => void unsub();
  }, []);

  return lang;
}
