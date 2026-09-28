import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // Custom brand palette — hand-picked, NOT default AI palette
        harvest: {
          50: "#F4F8F1",
          100: "#E3EFDB",
          200: "#C6DFB6",
          300: "#9FC888",
          400: "#78AF5F",
          500: "#5A9540",
          600: "#457631",
          700: "#385E29",
          800: "#2D5F3F", // Primary green
          900: "#1F3E28",
          950: "#0F2214",
        },
        cream: {
          50: "#FDFBF6",
          100: "#FDF8F0", // Background cream
          200: "#F9EED9",
          300: "#F3DEB6",
          400: "#EBC985",
          500: "#E3B355",
          600: "#D19836",
          700: "#AE7B2C",
          800: "#8B6229",
          900: "#725126",
        },
        terracotta: {
          50: "#FBF3EF",
          100: "#F6E3D7",
          200: "#EDC6AE",
          300: "#DFA07C",
          400: "#D07F55",
          500: "#C9633D", // Accent terracotta
          600: "#B54F30",
          700: "#963D28",
          800: "#7A3324",
          900: "#652C22",
        },
        ink: {
          50: "#F6F5F3",
          100: "#E8E6E1",
          200: "#D0CBC3",
          300: "#B0A99C",
          400: "#8F8776",
          500: "#736B5C",
          600: "#5B5548",
          700: "#48433A",
          800: "#3B3730",
          900: "#2A2823",
          950: "#161510",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"],
        serif: ["var(--font-fraunces)", "Georgia", "serif"],
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-out",
        "fade-in-up": "fadeInUp 0.6s ease-out",
        "slide-in-right": "slideInRight 0.4s ease-out",
        "scale-in": "scaleIn 0.3s ease-out",
        "shimmer": "shimmer 2s linear infinite",
        "float": "float 6s ease-in-out infinite",
        "leaf-fall": "leafFall 8s linear infinite",
      },
      keyframes: {
        fadeIn: { "0%": { opacity: "0" }, "100%": { opacity: "1" } },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        slideInRight: {
          "0%": { opacity: "0", transform: "translateX(20px)" },
          "100%": { opacity: "1", transform: "translateX(0)" },
        },
        scaleIn: {
          "0%": { opacity: "0", transform: "scale(0.95)" },
          "100%": { opacity: "1", transform: "scale(1)" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-500px 0" },
          "100%": { backgroundPosition: "500px 0" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-15px)" },
        },
        leafFall: {
          "0%": { transform: "translateY(-10vh) rotate(0deg)", opacity: "0" },
          "10%": { opacity: "1" },
          "90%": { opacity: "1" },
          "100%": { transform: "translateY(100vh) rotate(360deg)", opacity: "0" },
        },
      },
      backgroundImage: {
        "grain": "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E\")",
      },
      boxShadow: {
        "soft": "0 2px 8px rgba(45, 95, 63, 0.06), 0 1px 3px rgba(45, 95, 63, 0.04)",
        "lift": "0 10px 30px rgba(45, 95, 63, 0.12), 0 4px 8px rgba(45, 95, 63, 0.06)",
        "lift-lg": "0 20px 50px rgba(45, 95, 63, 0.15), 0 8px 16px rgba(45, 95, 63, 0.08)",
        "inner-soft": "inset 0 2px 4px rgba(45, 95, 63, 0.04)",
      },
    },
  },
  plugins: [],
};
export default config;
