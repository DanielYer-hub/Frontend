const ROOT = import.meta.env.VITE_API_ROOT as string;

export function imgUrl(u?: string | null): string {
  if (!u) return "/content/avatar.webp";
  if (/^https?:\/\//i.test(u)) return u;
  return `${ROOT}${u.startsWith("/") ? "" : "/"}${u}`;
}