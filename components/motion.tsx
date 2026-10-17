"use client";

import { MotionConfig, motion, type HTMLMotionProps } from "motion/react";

const ease = [0.2, 0.7, 0.2, 1] as const;

/** Respects the visitor's "reduce motion" setting for every animation below. */
export function MotionProvider({ children }: { children: React.ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

/** Fades and lifts its children into place the first time they scroll into view. */
export function Reveal({
  delay = 0,
  y = 24,
  className,
  children,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-80px" }}
      transition={{ duration: 0.8, ease, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Same as Reveal but animates on page load (for content above the fold). */
export function Enter({
  delay = 0,
  y = 24,
  className,
  children,
  ...props
}: HTMLMotionProps<"div"> & { delay?: number; y?: number }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.9, ease, delay }}
      {...props}
    >
      {children}
    </motion.div>
  );
}

/** Children reveal one after another — use with <StaggerItem>. */
export function Stagger({ className, children, gap = 0.08 }: { className?: string; children: React.ReactNode; gap?: number }) {
  return (
    <motion.div
      className={className}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-80px" }}
      variants={{ hidden: {}, show: { transition: { staggerChildren: gap } } }}
    >
      {children}
    </motion.div>
  );
}

export function StaggerItem({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      className={className}
      variants={{
        hidden: { opacity: 0, y: 20 },
        show: { opacity: 1, y: 0, transition: { duration: 0.7, ease } },
      }}
    >
      {children}
    </motion.div>
  );
}
