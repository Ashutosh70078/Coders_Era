import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        card: {
          DEFAULT: "var(--card)",
          foreground: "var(--card-foreground)",
        },
        popover: {
          DEFAULT: "var(--popover)",
          foreground: "var(--popover-foreground)",
        },
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        border: "var(--border)",
        input: "var(--input)",
        ring: "var(--ring)",
        cyber: {
          violet: "#8b5cf6",
          cyan: "#38bdf8",
          neon: "#00f0ff",
          purple: "#a855f7",
          pink: "#ec4899",
          emerald: "#10b981",
          amber: "#f59e0b",
          rose: "#f43f5e",
        },
        slate: {
          850: "#131c2e",
          950: "#080c16",
        }
      },
      fontFamily: {
        sans: ["var(--font-inter)", "-apple-system", "BlinkMacSystemFont", "Segoe UI", "Roboto", "sans-serif"],
        mono: ["var(--font-jetbrains)", "ui-monospace", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "glow": "glow 3s ease-in-out infinite alternate",
        "hologram": "hologram 6s ease infinite",
        "scan": "scan 2.5s linear infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 15px rgba(56, 189, 248, 0.3), 0 0 30px rgba(139, 92, 246, 0.2)" },
          "100%": { boxShadow: "0 0 25px rgba(56, 189, 248, 0.6), 0 0 50px rgba(139, 92, 246, 0.4)" },
        },
        hologram: {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        scan: {
          "0%": { transform: "translateY(-100%)" },
          "100%": { transform: "translateY(1000%)" },
        }
      },
      boxShadow: {
        "neon-cyan": "0 0 20px -3px rgba(56, 189, 248, 0.5)",
        "neon-violet": "0 0 20px -3px rgba(139, 92, 246, 0.5)",
        "neon-emerald": "0 0 20px -3px rgba(16, 185, 129, 0.5)",
        "neon-rose": "0 0 20px -3px rgba(244, 63, 94, 0.5)",
        "glass": "0 8px 32px 0 rgba(0, 0, 0, 0.37)",
      }
    },
  },
  plugins: [],
};
export default config;
