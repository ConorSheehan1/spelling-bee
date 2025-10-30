import en from "../locales/en.json";

type TranslationKey = keyof typeof en | `points.${string}` | `rank.${number}`;

export const useTranslation = () => {
  const t = (key: string, count?: number): string => {
    // Handle nested keys like "points.good" or "rank.0"
    const keys = key.split(".");
    let value: any = en;

    for (const k of keys) {
      value = value?.[k];
    }

    if (typeof value === "string") {
      // Handle pluralization for "foundWords"
      if (key === "foundWords" && count !== undefined) {
        const forms = value.split(" | ");
        if (count === 0) return forms[0].replace("{n}", String(count));
        if (count === 1) return forms[1].replace("{n}", String(count));
        return forms[2].replace("{n}", String(count));
      }
      return value;
    }

    return key; // Return key if translation not found
  };

  return { t };
};
