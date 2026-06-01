import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-white/10 bg-white/[0.04] text-muted-foreground backdrop-blur",
        cyan: "border-brand-cyan/30 bg-brand-cyan/10 text-brand-cyan",
        violet: "border-brand-violet/30 bg-brand-violet/10 text-brand-violet",
        fuchsia: "border-brand-fuchsia/30 bg-brand-fuchsia/10 text-brand-fuchsia",
      },
    },
    defaultVariants: { variant: "default" },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
