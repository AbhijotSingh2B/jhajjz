import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Ref callback for <input type="date">: no past dates. Set on the client so server and client HTML match. */
export function minToday(el: HTMLInputElement | null) {
  if (el) el.min = new Date().toLocaleDateString("en-CA");
}

/** "2026-12-05" (a date input's value) → "05/12/2026", the way dates are written in India. */
export function formatDate(iso: string) {
  const [y, m, d] = iso.split("-");
  return d ? `${d}/${m}/${y}` : iso;
}
