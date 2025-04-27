
import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        layer: "0 35px 60px -15px rgba(0, 0, 0, 0.1)",
        soft: "0 4px 24px rgba(0, 0, 0, 0.08)",
        glow: "0 0 15px rgba(25, 195, 125, 0.4)", // Enhanced glow with vibrant green
        'glow-lg': "0 0 25px rgba(25, 195, 125, 0.5)", // Larger glow effect
      },
      colors: {
        black: "#1a1a1a",
        white: "#fefefe",
        primary: {
          50: "#e8faf2",
          100: "#d1f5e5",
          200: "#a3ebcb",
          300: "#75e1b1",
          400: "#47d797",
          500: "#19C37D", // Vibrant shiny green as primary
          600: "#14a367",
          700: "#0f7a4d",
          800: "#0a5233",
          900: "#05291a",
          950: "#02150d",
        },
        secondary: {
          50: "#f0fdf7",
          100: "#dcfce9",
          200: "#bbf7d4",
          300: "#86efba",
          400: "#4ade95",
          500: "#22C55E", // Bright complementary green
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },
        neutral: {
          50: "#f8faf8",
          100: "#f0f5f2",
          200: "#e0eae5",
          300: "#cad9d1",
          400: "#a8bcb2",
          500: "#85998e",
          600: "#677a71",
          700: "#4d5b54",
          800: "#333d38",
          900: "#1a1e1c",
        },
        success: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22C55E", // Matching secondary for consistency
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
        },
        error: {
          50: "#fef2f2",
          100: "#fee2e2",
          200: "#fecaca",
          300: "#fca5a5",
          400: "#f87171",
          500: "#ef4444",
          600: "#dc2626",
          700: "#b91c1c",
          800: "#991b1b",
          900: "#7f1d1d",
        },
        accent: {
          mint: "#D1F5E5",      // Brighter mint green
          emerald: "#10B981",   // Vibrant emerald
          forest: "#059669",    // Deep forest green
          ivory: "#FFFFF0",     // Warm ivory
          sage: "#86EFAC",      // Light sage green
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "sans-serif"],
        heading: ["var(--font-playfair-display)", "serif"],
        display: ["var(--font-libre-baskerville)", "serif"],
      },
      keyframes: {
        "pulse-glow": {
          "0%, 100%": { 
            boxShadow: "0 0 0 0 rgba(25, 195, 125, 0.7)",
            opacity: "1"
          },
          "50%": { 
            boxShadow: "0 0 20px 8px rgba(25, 195, 125, 0.5)",
            opacity: "0.9"
          },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "shine": {
          "0%": { backgroundPosition: "200% center" },
          "100%": { backgroundPosition: "-200% center" },
        },
      },
      animation: {
        "pulse-glow": "pulse-glow 2s infinite",
        "fade-in": "fade-in 0.5s ease-out",
        "float": "float 3s ease-in-out infinite",
        "shine": "shine 4s linear infinite",
      },
      backgroundImage: {
        'gradient-shiny': 'linear-gradient(90deg, rgba(25,195,125,1) 0%, rgba(34,197,94,1) 50%, rgba(25,195,125,1) 100%)',
      },
    },
  },
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    require("daisyui")
  ],
};

export default config;