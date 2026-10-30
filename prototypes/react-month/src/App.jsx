import React, { useState } from "react";
import {
  Card, Metric, Text, Title, Flex, Grid, MarkerBar, BarList, TabGroup, TabList, Tab, Table, TableHead, TableHeaderCell, TableBody, TableRow, TableCell, Badge,
} from "@tremor/react";
import data from "./data.json";
import FlowChart from "./FlowChart.jsx";

// ---- formatting: the same rules as the page (whole dollars for headlines, cents in lists) ----
const fmt = v => (v < 0 ? "−" : "") + "$" + Math.abs(Math.round(v)).toLocaleString("en-CA");
const fmt2 = v => (v < 0 ? "−" : "") + "$" + Math.abs(v).toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const tw = s => s.toLowerCase().replace(/\W+/g, "-");
const catColor = k => "cat-" + k.toLowerCase();

// ---- the reusable pieces: every card on every page would be one of these ----
function Label({ children }) {
  return <p className="text-[10.5px] font-bold uppercase tracking-[.1em] text-tremor-content">{children}</p>;
}
function Section({ label, children, className = "" }) {
  return <Card className={"p-5 " + className}><Label>{label}</Label><div className="mt-3">{children}</div></Card>;
}
function Stat({ label, value, note, tone }) {
  return (
    <Card className="p-5">
      <Label>{label}</Label>
      <Metric className="mt-2 text-[26px]">{value}</Metric>
      {note && <Text className={"mt-1 " + (tone === "hi" ? "text-red-600" : "")}>{note}</Text>}
    </Card>
  );
}
function Row({ k, v, muted }) {
  return (
    <Flex className="border-b border-tremor-border py-2 last:border-0">
      <Text>{k}</Text><Text className={"font-semibold " + (muted ? "text-tremor-content" : "text-tremor-content-strong")}>{v}</Text>
    </Flex>
  );
}

// ---- the page ----
function FreeToSpend({ m }) {
  const alw = data.allowance, left = alw - m.everyday;
  const spentPct = Math.min(100, (m.everyday / alw) * 100), pace = (m.daysElapsed / m.daysInMonth) * 100;
  const daysLeft = m.daysInMonth - m.daysElapsed;
  const line = m.open
    ? (left > 0 && daysLeft > 0 ? `${fmt(left / daysLeft)} a day for ${daysLeft} days` : "Allowance used up")
    : (left >= 0 ? `${fmt(left)} left unspent` : `Over by ${fmt(-left)}`);
  return (
    <Section label="Free to spend">
      <Flex justifyContent="start" alignItems="baseline" className="gap-2">
        <Metric className={left < 0 ? "text-red-600" : ""}>{fmt(left)}</Metric>
        <Text>of {fmt(alw)}</Text>
      </Flex>
      <MarkerBar className="mt-4 max-w-2xl" value={m.open ? pace : 100} minValue={0} maxValue={spentPct}
                 color={left < 0 ? "red" : "orange"} />
      <Text className="mt-3">{line} · every purchase under {fmt(data.bigThreshold)}</Text>
    </Section>
  );
}

function Paycheque({ m, sel, setSel }) {
  return (
    <Section label="Where the paycheque went">
      <FlowChart flow={m.flow} sel={sel} onPick={setSel} />
    </Section>
  );
}

function Categories({ m, sel, setSel }) {
  const c = m.categories.find(x => x.key === sel) || m.categories[0];
  if (!c) return <Section label="Spending by category"><Text>No spending recorded.</Text></Section>;
  const share = m.total > 0 ? Math.round((c.total / m.total) * 100) : 0;
  const over = c.usual === null ? null : c.total - c.usual;
  return (
    <Grid numItems={2} className="gap-3">
      <Section label="Spending by category">
        <BarList data={m.categories.map(x => ({ name: x.name, value: x.total, color: catColor(x.key), key: x.key }))}
                 valueFormatter={fmt2} onValueChange={it => setSel(it.key)} className="mt-1" />
      </Section>
      <Section label={c.name}>
        <Metric>{fmt2(c.total)}</Metric>
        <div className="mt-3">
          <Row k="Share of the month" v={share + "%"} />
          <Row k="Purchases" v={c.items.length} />
          <Row k="Against a usual month" v={over === null ? "Needs three full months" : (over >= 0 ? "+" : "−") + fmt(Math.abs(over))} muted={over === null} />
        </div>
        <Table className="mt-4">
          <TableHead><TableRow><TableHeaderCell>Date</TableHeaderCell><TableHeaderCell>Merchant</TableHeaderCell><TableHeaderCell className="text-right">Amount</TableHeaderCell></TableRow></TableHead>
          <TableBody>
            {c.items.map((e, i) => (
              <TableRow key={i}>
                <TableCell>{e.date.slice(5)}</TableCell>
                <TableCell className="max-w-[220px] truncate">{e.merchant}{e.sub && <Badge size="xs" className="ml-2">repeats</Badge>}</TableCell>
                <TableCell className="text-right font-medium text-tremor-content-strong">{fmt2(e.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Section>
    </Grid>
  );
}

const NAV = [["", ["Home"]], ["Spending", ["This month", "Year", "Subscriptions"]], ["Income", ["Income", "Investment income"]],
  ["Investing", ["Portfolio", "Performance", "Holdings"]], ["Plan", ["Budget", "FIRE", "Drawdown & care", "Spending baseline"]],
  ["Records", ["Updates", "Accounts", "Statements"]]];

export default function App() {
  const [ix, setIx] = useState(data.months.length - 1);
  const [sel, setSel] = useState(null);
  const m = data.months[ix];
  const top = m.categories[0];
  const diff = m.usual === null ? null : m.total - m.usual;
  return (
    <div className="mx-auto flex max-w-[1760px] gap-8 px-7 py-9">
      <aside className="sticky top-9 w-[210px] shrink-0 self-start">
        <div className="mb-5 border-b border-tremor-border px-2 pb-4 text-[21px] font-bold tracking-tight">Jade Toad</div>
        {NAV.map(([sec, items]) => (
          <div key={sec} className="mb-3">
            {sec && <p className="mb-1 ml-2 text-[10px] font-bold uppercase tracking-[.1em] text-tremor-content">{sec}</p>}
            {items.map(it => (
              <div key={it} className={"rounded-lg px-2 py-1.5 text-[13.5px] " + (it === "This month" ? "bg-tremor-content-strong font-semibold text-white" : "text-tremor-content-emphasis")}>{it}</div>
            ))}
          </div>
        ))}
        <p className="mt-4 text-[10.5px] text-tremor-content">React + Tremor prototype</p>
      </aside>
      <main className="min-w-0 flex-1 space-y-3">
        <div className="mb-5 border-b border-tremor-border pb-4">
          <Label>Spending</Label>
          <Title className="mt-1 text-[25px] font-bold text-tremor-content-strong">This month</Title>
        </div>
        <TabGroup index={ix} onIndexChange={i => { setIx(i); setSel(null); }}>
          <TabList variant="solid">{data.months.map(x => <Tab key={x.ym}>{x.label}</Tab>)}</TabList>
        </TabGroup>
        <FreeToSpend m={m} />
        <Grid numItems={3} className="gap-3">
          <Stat label={"Spent in " + m.label} value={fmt(m.total)} note={`${m.purchases} purchases in ${m.categories.length} categories`} />
          <Stat label="Biggest category" value={top ? top.name : "—"} note={top && `${fmt(top.total)}, ${Math.round((top.total / m.total) * 100)}% of the month`} />
          <Stat label="Against a usual month" value={diff === null ? "—" : (diff >= 0 ? "+" : "−") + fmt(Math.abs(diff))}
                note={diff === null ? "Needs three full months" : `Median of the last ${m.window} full months`} tone={diff > 0 ? "hi" : ""} />
        </Grid>
        <Paycheque m={m} sel={sel} setSel={setSel} />
        <Categories m={m} sel={sel} setSel={setSel} />
        <Section label="Big buys">
          {m.bigBuys.length
            ? m.bigBuys.map((b, i) => <Row key={i} k={b.merchant} v={fmt2(b.amount)} />)
            : <Text>None this month.</Text>}
        </Section>
      </main>
    </div>
  );
}
