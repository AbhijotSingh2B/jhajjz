import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap text-[15px] font-semibold transition-[background-color,color,border-color,transform] duration-200 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        gold: "bg-gold text-ink hover:bg-[#d3b48f]",
        ink: "bg-ink text-cream hover:bg-ink-soft",
        light: "bg-cream text-ink hover:bg-white",
        outlineLight: "border border-white/50 text-cream hover:border-cream hover:bg-white/10 font-medium",
        outline: "border border-ink/30 text-ink hover:border-ink hover:bg-ink/5 font-medium",
        link: "h-auto px-0 text-ink underline-offset-4 hover:underline font-medium",
      },
      size: {
        default: "h-12 px-6",
        lg: "h-[52px] px-6",
        sm: "h-10 px-4 text-sm",
        icon: "size-11",
      },
    },
    defaultVariants: { variant: "gold", size: "lg" },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

export function Button({ className, variant, size, asChild = false, ...props }: ButtonProps) {
  const Comp = asChild ? Slot : "button";
  return <Comp data-slot="button" className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}

export { buttonVariants };
