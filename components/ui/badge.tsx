import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/20",
        secondary: "border-transparent bg-white/5 text-white/70 border-white/10",
        destructive: "border-transparent bg-red-400/10 text-red-400 border-red-400/20",
        outline: "text-white border-white/20",
        hot: "border-transparent bg-orange-400/10 text-orange-400 border-orange-400/20",
        warm: "border-transparent bg-amber-400/10 text-amber-400 border-amber-400/20",
        cold: "border-transparent bg-slate-400/10 text-slate-400 border-slate-400/20",
        qualified: "border-transparent bg-purple-400/10 text-purple-400 border-purple-400/20",
        success: "border-transparent bg-green-400/10 text-green-400 border-green-400/20",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
