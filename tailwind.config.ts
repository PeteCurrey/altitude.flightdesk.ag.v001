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
        background: "#0A0A0B", // Tactical Black
        panel: "#111112",
        "background-secondary": "#151516",
        accent: "#00D4FF", // Electric Blue (Altitude-Hire Signature)
        border: "#1F2023",
        "text-primary": "#FFFFFF",
        "text-secondary": "#9CA3AF",
        "text-muted": "#6B7280",
        void: "#000000",
        success: "#22C55E",
        warning: "#EAB308",
        danger: "#EF4444",
      },
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-mono)", "monospace"],
        sans: ["var(--font-sans)", "sans-serif"],
      },
      borderRadius: {
        none: "0px",
        sm: "0px",
        md: "0px",
        lg: "0px",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
export default config;
