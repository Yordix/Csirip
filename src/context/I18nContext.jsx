import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { getLocalization } from "../api/client";
import { translations } from "../i18n/translations";

const I18nContext = createContext(null);

function resolve(obj, key) {
  return key.split(".").reduce((acc, part) => (acc ? acc[part] : undefined), obj);
}

function mergeDeep(base, patch) {
  if (!patch || typeof patch !== "object" || Array.isArray(patch)) {
    return base;
  }

  const out = { ...base };
  Object.keys(patch).forEach((key) => {
    const baseVal = out[key];
    const patchVal = patch[key];
    if (baseVal && typeof baseVal === "object" && !Array.isArray(baseVal) && patchVal && typeof patchVal === "object" && !Array.isArray(patchVal)) {
      out[key] = mergeDeep(baseVal, patchVal);
    } else {
      out[key] = patchVal;
    }
  });
  return out;
}

export function I18nProvider({ children }) {
  const [language, setLanguage] = useState(localStorage.getItem("lang") || "hu");
  const [customTranslations, setCustomTranslations] = useState({ hu: {}, en: {} });

  useEffect(() => {
    getLocalization()
      .then((data) => setCustomTranslations(data || { hu: {}, en: {} }))
      .catch(() => setCustomTranslations({ hu: {}, en: {} }));
  }, []);

  function setLang(next) {
    setLanguage(next);
    localStorage.setItem("lang", next);
  }

  function t(key, fallbackValue = key) {
    const mergedCurrent = mergeDeep(translations[language] || {}, customTranslations[language] || {});
    const mergedHu = mergeDeep(translations.hu || {}, customTranslations.hu || {});

    const primary = resolve(mergedCurrent, key);
    if (primary !== undefined) return primary;

    const fallback = resolve(mergedHu, key);
    return fallback !== undefined ? fallback : fallbackValue;
  }

  const value = useMemo(() => ({ language, setLanguage: setLang, t }), [language, customTranslations]);
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  return useContext(I18nContext);
}
