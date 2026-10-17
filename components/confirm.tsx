/** Highlights text the client still has to confirm, so it can't slip through unnoticed. */
export function Confirm({ children }: { children: React.ReactNode }) {
  return <mark className="bg-gold/25 px-1 text-ink">[CONFIRM: {children}]</mark>;
}
