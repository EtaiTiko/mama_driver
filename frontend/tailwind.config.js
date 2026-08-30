/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Hebrew-optimized typography — Rubik for UI, Lora for display
        sans: ['Rubik', 'system-ui', 'sans-serif'],
        serif: ['Lora', 'Georgia', 'serif'],
      },
      spacing: {
        // Touch-friendly spacing (48px = min iOS touch target)
        touch: '3rem',
      },
      height: {
        // Touch-friendly height for buttons and inputs
        touch: '3rem',
      },
      minHeight: {
        // Minimum height for touch targets
        touch: '3rem',
      },
      fontSize: {
        // Mobile-first sizes (readable on small screens)
        xs: ['0.75rem', { lineHeight: '1.25rem' }],
        sm: ['0.875rem', { lineHeight: '1.375rem' }],
        base: ['1rem', { lineHeight: '1.5rem' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.875rem' }],
      },
      colors: {
        // Brand colors (Hebrew-focused driving school aesthetic)
        primary: '#2563EB',   // Israeli blue
        secondary: '#DC2626', // Warning red
        success: '#16A34A',   // Green
        warning: '#F97316',   // Orange
      },
    },
  },
  plugins: [require('tailwindcss-rtl')],
  corePlugins: {
    // Disable LTR-only utilities when RTL is detected
    direction: false,
  },
};
