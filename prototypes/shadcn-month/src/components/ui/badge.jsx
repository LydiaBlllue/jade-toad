import * as React from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";
const badgeVariants = cva("inline-flex items-center rounded-md border px-1.5 py-0 text-[10.5px] font-semibold transition-colors", {
  variants: { variant: {
    default: "border-transparent bg-primary text-primary-foreground",
    secondary: "border-transparent bg-secondary text-secondary-foreground",
    destructive: "border-transparent bg-destructive text-destructive-foreground",
    outline: "text-foreground",
  } },
  defaultVariants: { variant: "default" },
});
export function Badge({ className, variant, ...p }) { return <span className={cn(badgeVariants({ variant }), className)} {...p} />; }
