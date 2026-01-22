import type { Config } from 'tailwindcss';
import scrollbar from 'tailwind-scrollbar';

const config: Config = {
  darkMode: 'class',
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [scrollbar],
};

export default config;
