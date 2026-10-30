import animate from "tailwindcss-animate";
// shadcn/ui's theme: every colour is a CSS variable in src/index.css, so the palette is changed
// in one place and the components never name a colour themselves.
const v = n => `hsl(var(--${n}))`;
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        border: v("border"), input: v("input"), ring: v("ring"), background: v("background"), foreground: v("foreground"),
        primary: { DEFAULT: v("primary"), foreground: v("primary-foreground") },
        secondary: { DEFAULT: v("secondary"), foreground: v("secondary-foreground") },
        muted: { DEFAULT: v("muted"), foreground: v("muted-foreground") },
        accent: { DEFAULT: v("accent"), foreground: v("accent-foreground") },
        destructive: { DEFAULT: v("destructive"), foreground: v("destructive-foreground") },
        card: { DEFAULT: v("card"), foreground: v("card-foreground") },
      },
      borderRadius: { lg: "var(--radius)", md: "calc(var(--radius) - 2px)", sm: "calc(var(--radius) - 4px)" },
    },
  },
  plugins: [animate],
};
