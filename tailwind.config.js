import tailwindcssRTL from 'tailwindcss-rtl';

export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {},
  },
  plugins: [tailwindcssRTL()],
};