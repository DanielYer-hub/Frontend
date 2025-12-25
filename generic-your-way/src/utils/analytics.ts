export type AnalyticsProps = Record<string, string | number | boolean | null>;

declare global {
  interface Window {
    plausible?: (eventName: string, options?: { props?: Record<string, string | number | boolean> }) => void;
  }
}
export {};

export function track(eventName: string, props?: Record<string, string | number | boolean>) {
  try {
    if (typeof window === "undefined") return;
    if (typeof window.plausible !== "function") return;
 
    window.plausible(eventName, props ? { props } : undefined);
  } catch {
    
  }
}
