import React, { useState } from "react";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Section, Stat, MetaList, BarRow } from "@/components/blocks";
import FlowChart from "@/components/FlowChart";
import { fmt, fmt2, signed } from "@/lib/format";
import { cn } from "@/lib/utils";
import data from "./data.json";

function FreeToSpend({ m }) {
  const alw = data.allowance, left = alw - m.everyday;
  const spent = Math.min(100, (m.everyday / alw) * 100), pace = (m.daysElapsed / m.daysInMonth) * 100;
  const daysLeft = m.daysInMonth - m.daysElapsed;
  const line = m.open
    ? (left > 0 && daysLeft > 0 ? `${fmt(left / daysLeft)} a day for ${daysLeft} days` : "Allowance used up")
    : (left >= 0 ? `${fmt(left)} left unspent` : `Over by ${fmt(-left)}`);
  return (
    <Section label="Free to spend">
      <div className="flex items-baseline gap-2">
        <span className={cn("text-[30px] font-bold leading-none tracking-tight", left < 0 && "text-destructive")}>{fmt(left)}</span>
        <span className="text-[13px] text-muted-foreground">of {fmt(alw)}</span>
      </div>
      <div className="relative mt-4 h-3 max-w-[720px] rounded-full bg-muted">
        <div className={cn("h-full rounded-full", left < 0 ? "bg-destructive" : "bg-[#eb6834]")} style={{ width: spent + "%" }} />
        {m.open && <div className="absolute -top-1 h-5 w-0.5 rounded bg-foreground/40" style={{ left: pace + "%" }} title="An even pace" />}
      </div>
      <p className="mt-3 text-[13px] text-muted-foreground">{line}</p>
    </Section>
  );
}

function CategoryDetail({ m, c }) {
  const share = m.total > 0 ? Math.round((c.total / m.total) * 100) : 0;
  const over = c.usual === null ? null : c.total - c.usual;
  return (
    <Section label={c.name}>
      <div className="mb-2 text-[26px] font-bold tracking-tight">{fmt2(c.total)}</div>
      <MetaList rows={[
        ["Share of the month", share + "%"],
        ["Purchases", c.items.length],
        ["Against a usual month", over === null ? "Needs three full months" : signed(over), over === null],
      ]} />
      <Table className="mt-3">
        <TableHeader><TableRow><TableHead>Date</TableHead><TableHead>Merchant</TableHead><TableHead className="text-right">Amount</TableHead></TableRow></TableHeader>
        <TableBody>
          {c.items.map((e, i) => (
            <TableRow key={i}>
              <TableCell className="text-muted-foreground">{e.date.slice(5)}</TableCell>
              <TableCell className="max-w-[260px] truncate">{e.merchant}{e.sub && <Badge variant="secondary" className="ml-2">repeats</Badge>}</TableCell>
              <TableCell className="text-right font-semibold tabular-nums">{fmt2(e.amount)}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Section>
  );
}

const NAV = [["", ["Home"]], ["Spending", ["This month", "Year", "Subscriptions"]], ["Income", ["Income", "Investment income"]],
  ["Investing", ["Portfolio", "Performance", "Holdings"]], ["Plan", ["Budget", "FIRE", "Drawdown & care", "Spending baseline"]],
  ["Records", ["Updates", "Accounts", "Statements"]]];

function SideNav() {
  return (
    <aside className="sticky top-9 w-[210px] shrink-0 self-start">
      <div className="mb-5 border-b px-2.5 pb-4 text-[21px] font-bold tracking-tight">Jade Toad</div>
      {NAV.map(([sec, items]) => (
        <div key={sec} className="mb-3">
          {sec && <p className="mb-1 ml-2.5 text-[10px] font-bold uppercase tracking-[.1em] text-muted-foreground">{sec}</p>}
          {items.map(it => (
            <div key={it} className={cn("rounded-lg px-2.5 py-1.5 text-[13.5px] text-secondary-foreground",
                                        it === "This month" && "bg-primary font-semibold text-primary-foreground")}>{it}</div>
          ))}
        </div>
      ))}
      <p className="mt-4 px-2.5 text-[10.5px] text-muted-foreground">React + shadcn/ui prototype</p>
    </aside>
  );
}

export default function App() {
  const [ym, setYm] = useState(data.months[data.months.length - 1].ym);
  const [sel, setSel] = useState(null);
  const m = data.months.find(x => x.ym === ym);
  const top = m.categories[0], diff = m.usual === null ? null : m.total - m.usual;
  const c = m.categories.find(x => x.key === sel) || top;
  const mx = Math.max(1, ...m.categories.map(x => Math.abs(x.total)));
  return (
    <div className="mx-auto flex max-w-[1760px] gap-7 px-7 py-9">
      <SideNav />
      <main className="min-w-0 flex-1 space-y-3">
        <div className="mb-5 border-b pb-4">
          <p className="text-[10.5px] font-bold uppercase tracking-[.11em] text-muted-foreground">Spending</p>
          <h2 className="mt-1 text-[25px] font-bold tracking-tight">This month</h2>
        </div>
        <Tabs value={ym} onValueChange={v => { setYm(v); setSel(null); }}>
          <TabsList>{data.months.map(x => <TabsTrigger key={x.ym} value={x.ym}>{x.label}</TabsTrigger>)}</TabsList>
        </Tabs>
        <FreeToSpend m={m} />
        <div className="grid grid-cols-3 gap-3">
          <Stat label={"Spent in " + m.label} value={fmt(m.total)} note={`${m.purchases} purchases in ${m.categories.length} categories`} />
          <Stat label="Biggest category" value={top ? top.name : "—"} note={top && `${fmt(top.total)}, ${Math.round((top.total / m.total) * 100)}% of the month`} />
          <Stat label="Against a usual month" value={diff === null ? "—" : signed(diff)}
                note={diff === null ? "Needs three full months" : `Median of the last ${m.window} full months`} />
        </div>
        <Section label="Where the paycheque went"><FlowChart flow={m.flow} sel={c && c.key} onPick={setSel} /></Section>
        {c && (
          <div className="grid grid-cols-2 items-start gap-3">
            <Section label="Spending by category">
              <div className="-mx-2">
                {m.categories.map(x => (
                  <BarRow key={x.key} color={x.color} name={x.name} value={fmt2(x.total)} pct={(Math.max(0, x.total) / mx) * 100}
                          selected={x.key === c.key} onClick={() => setSel(x.key)} />
                ))}
              </div>
            </Section>
            <CategoryDetail m={m} c={c} />
          </div>
        )}
        <Section label="Big buys">
          {m.bigBuys.length ? <MetaList rows={m.bigBuys.map(b => [b.merchant, fmt2(b.amount)])} />
                            : <p className="text-[13px] text-muted-foreground">None this month.</p>}
        </Section>
      </main>
    </div>
  );
}
