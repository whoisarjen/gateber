import { type Config } from "tailwindcss";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        primary: '#4f46ba',
        secondary: '#f7f9fb',
        tertiary: "#dddddd",
      }
    },
  },
  important: '#__next',
  corePlugins: {
    preflight: false,
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
} satisfies Config;
