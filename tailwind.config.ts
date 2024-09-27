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
        background: "var(--background)",
        foreground: "var(--foreground)",
        paragraph: "#E6E6E6",
        placeholder: "#C0C0C0",
        border: "#414141",
        dark: "#2C2C2C",
        darker: "#232323",
        purple: "#9747FF",
      },
      backgroundImage: {
        solanaLinearGradient:
          "linear-gradient(44.76deg, #9945FF 10.43%, #8752F3 30.84%, #5497D5 49.4%, #43B4CA 58.68%, #28E0B9 69.81%, #19FB9B 93.01%)",
      },
    },
  },
  plugins: [],
};
export default config;
