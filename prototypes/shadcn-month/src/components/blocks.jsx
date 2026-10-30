import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

// The four shapes every page is made of. A new card on any page is one of these.

/** A card with a small uppercase label. */
export function Section({ label, children, className, action }) {
  return (
    <Card className={className}>
      <CardHeader className="flex-row items-center justify-between space-y-0"><CardTitle>{label}</CardTitle>{action}</CardHeader>
      <CardContent>{children}</CardContent>
    </Card>
  );
}

/** One headline number with a line under it. */
export function Stat({ label, value, note, tone }) {
  return (
    <Section label={label}>
      <div className="text-[26px] font-bold leading-tight tracking-tight">{value}</div>
      {note && <p className={cn("mt-1 text-[13px] text-muted-foreground", tone === "hi" && "text-destructive")}>{note}</p>}
    </Section>
  );
}

/** A label and its value, one per line, ruled between. */
export function MetaList({ rows }) {
  return (
    <dl className="divide-y">
      {rows.map(([k, v, muted]) => (
        <div key={k} className="flex items-center justify-between py-2 text-[13px]">
          <dt className="text-muted-foreground">{k}</dt>
          <dd className={cn("font-semibold tabular-nums", muted && "font-normal text-muted-foreground")}>{v}</dd>
        </div>
      ))}
    </dl>
  );
}

/** A row in a ranked list: colour, name, a bar to scale, the amount. */
export function BarRow({ color, name, value, pct, selected, onClick }) {
  return (
    <button onClick={onClick}
            className={cn("grid w-full grid-cols-[10px_140px_1fr_96px] items-center gap-3 rounded-md px-2 py-1.5 text-left text-[13px] transition-colors hover:bg-muted",
                          selected && "bg-muted font-semibold")}>
      <span className="h-[9px] w-[9px] rounded-[3px]" style={{ background: color }} />
      <span className="truncate">{name}</span>
      <span className="h-2 overflow-hidden rounded-full bg-muted"><span className="block h-full rounded-full" style={{ width: pct + "%", background: color }} /></span>
      <span className="text-right font-semibold tabular-nums">{value}</span>
    </button>
  );
}
