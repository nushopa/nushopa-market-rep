const MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID || "G-E6GH98VGEN";
let initialized = false;

declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function initializeAnalytics() {
  if (typeof window === "undefined" || initialized) return;

  initialized = true;
  window.dataLayer = window.dataLayer || [];
  window.gtag = (...args) => window.dataLayer.push(args);
  window.gtag("js", new Date());
  window.gtag("config", MEASUREMENT_ID);

  const script = document.createElement("script");
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${MEASUREMENT_ID}`;
  document.head.appendChild(script);
}
