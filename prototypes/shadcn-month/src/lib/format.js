// The page's number rules: whole dollars for a headline, cents in a list.
export const fmt = v => (v < 0 ? "−" : "") + "$" + Math.abs(Math.round(v)).toLocaleString("en-CA");
export const fmt2 = v => (v < 0 ? "−" : "") + "$" + Math.abs(v).toLocaleString("en-CA", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
export const signed = v => (v >= 0 ? "+" : "−") + fmt(Math.abs(v));
