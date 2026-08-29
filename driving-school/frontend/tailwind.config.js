/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      // Real typography/spacing/color decisions land in Phase 2
      // (Mobile UI Foundation) — kept empty here on purpose.
    },
  },
  plugins: [],
};
