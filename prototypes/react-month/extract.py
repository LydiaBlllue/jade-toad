"""Write src/data.json: This month's numbers for the newest months, computed by the built page's
own functions, so the prototype shows exactly what the page shows. Run after rebuild.py."""
import sys, json, asyncio, os
from playwright.async_api import async_playwright
HERE = os.path.dirname(os.path.abspath(__file__))
PAGE = os.path.join(HERE, "..", "..", "dashboards", "finance_dashboard.html")
JS = r"""() => {
  const css = v => { const m = /var\((--[\w-]+)\)/.exec(v); return m ? getComputedStyle(document.documentElement).getPropertyValue(m[1]).trim() : v; };
  const out = {owner: PROFILE.name || "", today: TODAY, allowance: ALW, bigThreshold: PLAN.bigThreshold,
    plan: planAlloc().map(a => ({name:a.k, amount:a.v, color:css(a.c)})), months: []};
  const flowOf = ym => {
    const open = ym > covEnd;
    const alloc = planAlloc(), used = alloc.reduce((s,a) => s + a.v, 0), rest = PLAN.takeHome - used;
    const segs = alloc.filter(a => a.v > 0).concat(rest > 0 ? [UNALLOC(rest)] : []);
    const ev = monthOf(ym).filter(e => inAllowance(e) && !isBig(e));
    const net = CATS.map(c => ({k:c.k, n:c.n, c:c.c, v:ev.filter(e => e.category === c.k).reduce((s,e) => s + e.amount, 0)}));
    const byCat = net.filter(c => c.v > 0.5);
    const back = -net.filter(c => c.v < 0).reduce((s,c) => s + c.v, 0);
    const spent = byCat.reduce((s,c) => s + c.v, 0) - back;
    const alw = segs.find(a => a.pk === "alw"), over = alw && spent > ALW ? spent - ALW : 0;
    const left = [{k:"Take-home", v:Math.max(PLAN.takeHome, used), c:"var(--ink)"}];
    if(alw && back > 0.5) left.push({k:"Refunds", v:back, c:"#9a9890"});
    if(over) left.push({k:"From " + (BFUND.key ? BFUND.name : "savings"), v:over, c:"#c98500"});
    const mid = segs.map(a => ({k:a.k, v: a === alw ? a.v + back + over : a.v, c:a.c, alw: a === alw}));
    const right = !alw || !byCat.length ? [] : byCat.map(c => ({k:c.k, n:c.n, v:c.v, c:c.c})).concat(spent < ALW
        ? [{k:open ? "Not spent yet" : "Left over, into the funds", v:ALW - spent, c:"var(--pill)", rest:true}] : []);
    const fix = n => Object.assign(n, {c: css(n.c)});
    return {allowance: ALW, spent, over, left: left.map(fix), mid: mid.map(fix), right: right.map(fix)};
  };
  for (const ym of MONTHS.slice(-4)) {
    const es = monthOf(ym), ed = everydayOf(ym), [Y,M] = ym.split("-").map(Number);
    const rows = CATS.map(c => {
      const items = es.filter(e => e.category === c.k).sort((a,b) => b.amount - a.amount);
      return {key:c.k, name:c.n, color:css(c.c), total:items.reduce((s,e)=>s+e.amount,0), usual:catMedian(c.k, ym),
        items: items.map(e => ({date:e.date, merchant:merchantOf(e.note), amount:e.amount, sub:!!e.sub}))};
    }).filter(r => r.items.length).sort((a,b) => b.total - a.total);
    out.months.push({ym, label: ymFull(ym), everyday: ed, open: ym >= TODAY.slice(0,7),
      daysElapsed: daysElapsed(ym), daysInMonth: new Date(Y, M, 0).getDate(),
      total: es.reduce((s,e)=>s+e.amount,0), purchases: es.length, usual: monthMedian(ym), window: catWindow(ym).length,
      bigBuys: bigOf(ym).map(e => ({merchant: merchantOf(e.note), amount: e.amount})), categories: rows,
      flow: flowOf(ym)});
  }
  return out;
}"""
async def main():
    async with async_playwright() as p:
        b = await p.chromium.launch(); pg = await b.new_page()
        await pg.goto("file://" + os.path.abspath(PAGE))
        data = await pg.evaluate(JS); await b.close()
    json.dump(data, open(os.path.join(HERE, "src", "data.json"), "w"), indent=1)
    print(len(data["months"]), "months:", [m["ym"] for m in data["months"]])
asyncio.run(main())
