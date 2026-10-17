import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Ref callback for <input type="date">: no past dates. Set on the client so server and client HTML match. */
export function minToday(el: HTMLInputElement | null) {
  if (el) el.min = new Date().toLocaleDateString("en-CA");
}
