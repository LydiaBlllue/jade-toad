import * as React from "react";
import { cn } from "@/lib/utils";
export const Table = React.forwardRef(({ className, ...p }, ref) =>
  <div className="relative w-full overflow-auto"><table ref={ref} className={cn("w-full caption-bottom text-sm", className)} {...p} /></div>);
export const TableHeader = React.forwardRef(({ className, ...p }, ref) => <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...p} />);
export const TableBody = React.forwardRef(({ className, ...p }, ref) => <tbody ref={ref} className={cn("[&_tr:last-child]:border-0", className)} {...p} />);
export const TableRow = React.forwardRef(({ className, ...p }, ref) =>
  <tr ref={ref} className={cn("border-b transition-colors hover:bg-muted/50", className)} {...p} />);
export const TableHead = React.forwardRef(({ className, ...p }, ref) =>
  <th ref={ref} className={cn("h-8 px-2 text-left align-middle text-[10.5px] font-semibold uppercase tracking-[.08em] text-muted-foreground", className)} {...p} />);
export const TableCell = React.forwardRef(({ className, ...p }, ref) => <td ref={ref} className={cn("px-2 py-2 align-middle", className)} {...p} />);
