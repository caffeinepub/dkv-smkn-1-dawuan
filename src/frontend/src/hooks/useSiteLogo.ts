import { useCallback, useEffect, useState } from "react";

const LOGO_KEY = "dkv_site_logo_url";
const DEFAULT_LOGO = "/assets/generated/dkv-logo-transparent.dim_200x200.png";

export function useSiteLogo() {
  const [logoUrl, setLogoUrl] = useState<string>(() => {
    return localStorage.getItem(LOGO_KEY) || DEFAULT_LOGO;
  });

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === LOGO_KEY) {
        setLogoUrl(e.newValue || DEFAULT_LOGO);
      }
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const updateLogo = useCallback((url: string) => {
    localStorage.setItem(LOGO_KEY, url);
    setLogoUrl(url);
    // Dispatch event so other tabs/components pick up the change
    window.dispatchEvent(
      new StorageEvent("storage", { key: LOGO_KEY, newValue: url }),
    );
  }, []);

  const resetLogo = useCallback(() => {
    localStorage.removeItem(LOGO_KEY);
    setLogoUrl(DEFAULT_LOGO);
    window.dispatchEvent(
      new StorageEvent("storage", { key: LOGO_KEY, newValue: null }),
    );
  }, []);

  return { logoUrl, updateLogo, resetLogo, isCustom: logoUrl !== DEFAULT_LOGO };
}
