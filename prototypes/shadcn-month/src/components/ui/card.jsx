import * as React from "react";
import { cn } from "@/lib/utils";
export const Card = React.forwardRef(({ className, ...p }, ref) =>
  <div ref={ref} className={cn("rounded-lg border bg-card text-card-foreground shadow-sm", className)} {...p} />);
export const CardHeader = React.forwardRef(({ className, ...p }, ref) =>
  <div ref={ref} className={cn("flex flex-col space-y-1.5 p-5 pb-0", className)} {...p} />);
export const CardTitle = React.forwardRef(({ className, ...p }, ref) =>
  <div ref={ref} className={cn("text-[10.5px] font-bold uppercase tracking-[.1em] text-muted-foreground", className)} {...p} />);
export const CardDescription = React.forwardRef(({ className, ...p }, ref) =>
  <div ref={ref} className={cn("text-sm text-muted-foreground", className)} {...p} />);
export const CardContent = React.forwardRef(({ className, ...p }, ref) =>
  <div ref={ref} className={cn("p-5 pt-3", className)} {...p} />);
