import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui CSS-variable tokens
        border:      "hsl(var(--border))",
        input:       "hsl(var(--input))",
        ring:        "hsl(var(--ring))",
        background:  "hsl(var(--background))",
        foreground:  "hsl(var(--foreground))",
        primary: {
          DEFAULT:    "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT:    "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT:    "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT:    "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT:    "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        card: {
          DEFAULT:    "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT:    "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        // Nivel semantic colors (used in badges and sidebar dots)
        nivel: {
          basico:     "#22c55e",
          intermedio: "#0078D4",   // MS blue
          avanzado:   "#f97316",
          arquitecto: "#D13438",   // MS danger red
        },
        // Microsoft palette — directly usable as bg-ms-blue, text-ms-blue, etc.
        ms: {
          blue:       "#0078D4",
          "blue-hover":"#106EBE",
          "blue-light":"#EFF6FC",
          success:    "#107C10",
          warning:    "#FFB900",
          danger:     "#D13438",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        // System fonts — no remote download, matches Fluent UI / MS Learn
        sans: ["Segoe UI", "system-ui", "-apple-system", "BlinkMacSystemFont",
               "Helvetica Neue", "Arial", "sans-serif"],
        mono: ["Cascadia Code", "Cascadia Mono", "SF Mono", "Fira Code",
               "Fira Mono", "Consolas", "Liberation Mono", "monospace"],
      },
      boxShadow: {
        // Fluent UI-style subtle elevation levels
        "fluent-1": "0 1px 2px rgba(0,0,0,.08), 0 0 1px rgba(0,0,0,.06)",
        "fluent-2": "0 2px 4px rgba(0,0,0,.1),  0 0 2px rgba(0,0,0,.06)",
        "fluent-4": "0 4px 8px rgba(0,0,0,.12), 0 0 2px rgba(0,0,0,.06)",
        "fluent-8": "0 8px 16px rgba(0,0,0,.14),0 0 2px rgba(0,0,0,.06)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0", transform: "translateY(4px)" },
          to:   { opacity: "1", transform: "translateY(0)" },
        },
      },
      animation: {
        "fade-in": "fade-in 0.15s ease-out",
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
  ],
};

export default config;
