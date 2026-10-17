import { ViewTransition } from "react";

/**
 * Soft fade-and-lift between pages (browser View Transitions; CSS in globals.css).
 * Wrap each page's <main>, not the layout: layouts persist, so they never enter or exit.
 */
export function PageTransition({ children }: { children: React.ReactNode }) {
  return (
    <ViewTransition enter="page-enter" exit="page-exit" default="none">
      {children}
    </ViewTransition>
  );
}
