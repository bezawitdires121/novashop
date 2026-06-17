import { create } from "zustand";
import { persist } from "zustand/middleware";

type Currency = "USD" | "EUR" | "GBP" | "ETB";
type Language = "en" | "fr" | "ar" | "am";

type PreferencesStore = {
  currency: Currency;
  language: Language;
  setCurrency: (c: Currency) => void;
  setLanguage: (l: Language) => void;
};

export const CURRENCIES: Record<Currency, { symbol: string; rate: number; label: string }> = {
  USD: { symbol: "$", rate: 1, label: "USD" },
  EUR: { symbol: "€", rate: 0.92, label: "EUR" },
  GBP: { symbol: "£", rate: 0.79, label: "GBP" },
  ETB: { symbol: "ETB", rate: 137.5, label: "ETB" },
};

export const LANGUAGES: Record<Language, string> = {
  en: "English",
  fr: "Français",
  ar: "العربية",
  am: "አማርኛ",
};

export const usePreferencesStore = create<PreferencesStore>()(
  persist(
    (set) => ({
      currency: "USD",
      language: "en",
      setCurrency: (currency) => set({ currency }),
      setLanguage: (language) => set({ language }),
    }),
    { name: "novashop-preferences" }
  )
);

export function formatCurrency(amount: number, currency: Currency): string {
  const { symbol, rate, label } = CURRENCIES[currency];
  const converted = amount * rate;
  if (currency === "ETB") {
    return label + " " + converted.toFixed(2);
  }
  return symbol + converted.toFixed(2);
}