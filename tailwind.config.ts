import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: "#FF6B6B",
        secondary: "#4ECDC4",
        accent: "#FFE66D",
        blue: "#45B7D1",
        purple: "#9B5DE5",
        orange: "#F15BB5",
        background: "#F7FFF7",
        foreground: "#2F3E46",
      },
      borderRadius: {
        sm: "12px",
        md: "20px",
        lg: "32px",
      },
      boxShadow: {
        sm: "0 4px 6px rgba(0, 0, 0, 0.05)",
        md: "0 8px 16px rgba(0, 0, 0, 0.1)",
        lg: "0 12px 24px rgba(0, 0, 0, 0.15)",
      },
      fontFamily: {
        main: ["Outfit", "sans-serif"],
      },
      keyframes: {
        bounce: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        pop: {
          "0%": { transform: "scale(0.9)", opacity: "0" },
          "100%": { transform: "scale(1)", opacity: "1" },
        },
        matchPop: {
          "0%": { transform: "translateY(10px) scale(0)", opacity: "0" },
          "50%": { transform: "translateY(-30px) scale(1.2)", opacity: "1" },
          "100%": { transform: "translateY(-25px) scale(1)", opacity: "1" },
        },
        pulse: {
          "0%": { transform: "scale(1)" },
          "50%": { transform: "scale(1.1)" },
          "100%": { transform: "scale(1)" },
        },
        matchedShrink: {
          "0%": { transform: "scale(1)", opacity: "1" },
          "100%": { transform: "scale(0)", opacity: "0" },
        },
        slideUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        bounce: "bounce 2s infinite ease-in-out",
        pop: "pop 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards",
        matchPop: "matchPop 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        pulse: "pulse 1s infinite",
        matchedShrink: "matchedShrink 0.5s forwards",
        slideUp: "slideUp 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
        fadeIn: "fadeIn 0.5s ease-out forwards",
      },

    },
  },
  plugins: [],
};
export default config;
