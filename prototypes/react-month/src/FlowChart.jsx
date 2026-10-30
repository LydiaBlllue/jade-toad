import React, { useState } from "react";

const fmt = v => (v < 0 ? "−" : "") + "$" + Math.abs(Math.round(v)).toLocaleString("en-CA");

// The plan drawn as flows, then where the allowance went in the month on screen. The same layout
// as the page's drawFlow(): every band at its real size, nothing scaled to fit, and each node laid
// out in a slot tall enough for its two-line label.
const W = 980, PAD = 10, NW = 10, GAP = 8, SLOT = 34, X = [150, 470, 790];

function layout(flow) {
  const left = flow.left.map(n => ({ ...n })), mid = flow.mid.map(n => ({ ...n })), right = flow.right.map(n => ({ ...n }));
  const k = 220 / left[0].v;
  const place = (col, top) => {
    let y = top;
    col.forEach(n => { n.h = Math.max(1.5, n.v * k); n.y = y + Math.max(0, SLOT - n.h) / 2; y += Math.max(n.h, SLOT) + GAP; });
    return y - GAP;
  };
  let H = Math.max(place(left, PAD), place(mid, PAD));
  const a = mid.find(n => n.alw);
  if (a && right.length) {
    const span = right.reduce((s, n) => s + Math.max(n.v * k, SLOT) + GAP, -GAP);
    H = Math.max(H, place(right, Math.max(PAD, a.y + a.h / 2 - span / 2)));
  }
  return { left, mid, right, a, k, H: H + PAD };
}

function Band({ x0, y0, x1, y1, h, color, tip, onTip, onClick, on }) {
  const m = (x0 + x1) / 2;
  const d = `M${x0} ${y0} C${m} ${y0} ${m} ${y1} ${x1} ${y1} L${x1} ${y1 + h} C${m} ${y1 + h} ${m} ${y0 + h} ${x0} ${y0 + h} Z`;
  return (
    <path d={d} fill={color} opacity={on ? 0.75 : 0.42} className={onClick ? "cursor-pointer transition-opacity hover:opacity-75" : "transition-opacity hover:opacity-60"}
          onMouseMove={e => onTip({ x: e.clientX, y: e.clientY, text: tip })} onMouseLeave={() => onTip(null)} onClick={onClick} />
  );
}

function Node({ n, x, anchor, name, value, onClick }) {
  const lx = anchor === "end" ? x - 8 : x + NW + 8, cy = n.y + n.h / 2;
  return (
    <g onClick={onClick} className={onClick ? "cursor-pointer" : ""}>
      <rect x={x} y={n.y} width={NW} height={n.h} rx={2} fill={n.c} />
      <text x={lx} y={cy - 1} textAnchor={anchor} className="fill-tremor-content-strong text-[12px]">{name}</text>
      <text x={lx} y={cy + 13} textAnchor={anchor} className="fill-tremor-content text-[11.5px] tabular-nums">{value}</text>
    </g>
  );
}

export default function FlowChart({ flow, sel, onPick }) {
  const [tip, setTip] = useState(null);
  const { left, mid, right, a, k, H } = layout(flow);
  const ALW = flow.allowance;
  const bands = [];
  let off = 0;
  // take-home fans out to every middle node; refunds and an overspend feed the allowance alone
  mid.forEach(n => {
    const v = n.alw ? ALW : n.v, h = v * k;
    if (h > 0) bands.push(<Band key={"m" + n.k} x0={X[0] + NW} y0={left[0].y + off} x1={X[1]} y1={n.y} h={h} color={n.c}
                                tip={`${n.k} · ${fmt(v)} a month`} onTip={setTip} />);
    off += h;
  });
  let into = a ? a.y + ALW * k : 0;
  left.slice(1).forEach(n => {
    bands.push(<Band key={"l" + n.k} x0={X[0] + NW} y0={n.y} x1={X[1]} y1={into} h={n.v * k} color={n.c} tip={`${n.k} · ${fmt(n.v)}`} onTip={setTip} />);
    into += n.v * k;
  });
  let o = 0;
  right.forEach(n => {
    bands.push(<Band key={"r" + n.k} x0={X[1] + NW} y0={a.y + o} x1={X[2]} y1={n.y} h={n.h} color={n.c} on={n.k === sel}
                     tip={`${n.n || n.k} · ${fmt(n.v)}`} onTip={setTip} onClick={n.rest ? undefined : () => onPick(n.k)} />);
    o += n.h;
  });
  return (
    <div className="relative">
      <svg viewBox={`0 0 ${W} ${H}`} className="block w-full max-w-[980px]" role="img" aria-label="How take-home pay splits, and where the allowance went">
        {bands}
        {left.map(n => <Node key={n.k} n={n} x={X[0]} anchor="end" name={n.k} value={fmt(n.v)} />)}
        {mid.map(n => <Node key={n.k} n={n} x={X[1]} anchor="start" name={n.k}
                            value={n.alw ? `${fmt(ALW)} planned · ${fmt(flow.spent)} spent` : fmt(n.v)} />)}
        {right.map(n => <Node key={n.k} n={n} x={X[2]} anchor="start" name={n.n || n.k} value={fmt(n.v)}
                              onClick={n.rest ? undefined : () => onPick(n.k)} />)}
      </svg>
      {tip && (
        <div className="pointer-events-none fixed z-10 rounded-md bg-tremor-content-strong px-2.5 py-1.5 text-xs text-white shadow-tremor-dropdown"
             style={{ left: tip.x + 12, top: tip.y - 34 }}>{tip.text}</div>
      )}
      {flow.over > 0 && <p className="mt-2 text-sm text-red-600">Over the allowance by {fmt(flow.over)}</p>}
    </div>
  );
}
