import data from "./src/data.json" with { type: "json" };
// The fifteen category colours become Tailwind colours named after their key, so Tremor's
// colour props can take them (`color="cat-grocery"`). Tremor builds class names at runtime,
// which is why they are safelisted.
const cats = {};
for (const m of data.months) for (const c of m.categories) cats["cat-" + c.key.toLowerCase()] = c.color;
for (const p of data.plan) cats["plan-" + p.name.toLowerCase().replace(/\W+/g, "-")] = p.color;
const names = Object.keys(cats);
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}", "./node_modules/@tremor/**/*.{js,ts,jsx,tsx}"],
  theme: {
    transparent: "transparent", current: "currentColor",
    extend: {
      colors: {
        ...cats,
        tremor: {
          brand: { faint: "#eff6ff", muted: "#bfdbfe", subtle: "#60a5fa", DEFAULT: "#2a78d6", emphasis: "#1d4ed8", inverted: "#ffffff" },
          background: { muted: "#f6f5f1", subtle: "#efeee9", DEFAULT: "#ffffff", emphasis: "#374151" },
          border: { DEFAULT: "#e7e5df" }, ring: { DEFAULT: "#e7e5df" },
          content: { subtle: "#9ca3af", DEFAULT: "#75736d", emphasis: "#3b3a36", strong: "#111110", inverted: "#ffffff" },
        },
      },
      boxShadow: {
        "tremor-input": "0 1px 2px 0 rgb(0 0 0 / 0.05)",
        "tremor-card": "0 1px 3px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        "tremor-dropdown": "0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)",
      },
      borderRadius: { "tremor-small": "0.375rem", "tremor-default": "0.5rem", "tremor-full": "9999px" },
      fontSize: {
        "tremor-label": ["0.75rem", { lineHeight: "1rem" }],
        "tremor-default": ["0.875rem", { lineHeight: "1.25rem" }],
        "tremor-title": ["1.125rem", { lineHeight: "1.75rem" }],
        "tremor-metric": ["1.875rem", { lineHeight: "2.25rem" }],
      },
    },
  },
  safelist: [
    { pattern: /^(bg|text|border|ring|stroke|fill)-(blue|emerald|orange|red|amber|gray|slate)-(50|100|200|300|400|500|600|700)$/, variants: ["hover", "ui-selected"] },
    ...names.flatMap(n => ["bg-", "text-", "fill-", "stroke-", "border-", "ring-"].map(p => p + n)),
  ],
};
