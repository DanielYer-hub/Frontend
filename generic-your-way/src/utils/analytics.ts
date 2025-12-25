export type AnalyticsProps = Record<string, string | number | boolean | null>;

declare global {
  interface Window {
    plausible?: (
      eventName: string,
      options?: {
        props?: AnalyticsProps;
        callback?: () => void;
      }
    ) => void;
  }
}

export function track(eventName: string, props?: AnalyticsProps): void {
  if (typeof window === "undefined") return;

  const fn = window.plausible;
  if (typeof fn !== "function") return;

  if (props && Object.keys(props).length > 0) {
    fn(eventName, { props });
  } else {
    fn(eventName);
  }
}

