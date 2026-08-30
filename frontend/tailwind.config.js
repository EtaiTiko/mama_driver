/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        // Hebrew-optimized typography — Rubik for UI, Frank Ruhl Libre for
        // display headings. (Lora, used previously, has no Hebrew glyphs at
        // all, so it silently fell back to a generic serif on every Hebrew
        // heading — Frank Ruhl Libre is a proper Hebrew serif face.)
        sans: ['Rubik', 'system-ui', 'sans-serif'],
        serif: ['"Frank Ruhl Libre"', 'Georgia', 'serif'],
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
        // Brand palette — "sunrise on the road": a confident twilight-violet
        // paired with a warm sunrise-coral accent, used together only in the
        // signature gradient (hero bands, primary CTAs). Everything else
        // pulls single shades from these ramps so hover/active/tint states
        // stay consistent instead of ad-hoc gray/blue/red utilities.
        primary: {
          50: '#F2F0FE',
          100: '#E6E0FD',
          200: '#CDC0FC',
          300: '#AC98F8',
          400: '#8A6CF3',
          500: '#6C46EC',
          600: '#5730DE',
          700: '#4623B4',
          800: '#391C8F',
          900: '#2E1873',
        },
        accent: {
          50: '#FFF4EE',
          100: '#FFE4D5',
          200: '#FFC7AB',
          300: '#FFA274',
          400: '#FF7D47',
          500: '#FF5F24',
          600: '#F0470E',
          700: '#C7380B',
          800: '#9E2E0F',
          900: '#7F290F',
        },
        success: {
          50: '#ECFDF5',
          100: '#D2FAE6',
          500: '#1AAE71',
          600: '#128A5B',
          700: '#0E6E48',
        },
        warning: {
          50: '#FFF8EB',
          100: '#FEEDC7',
          500: '#F5A524',
          600: '#DB8B0B',
          700: '#B26F08',
        },
        danger: {
          50: '#FEF1F0',
          100: '#FCDBD8',
          500: '#F0483E',
          600: '#D33128',
          700: '#AA2620',
        },
      },
      backgroundImage: {
        // The one gradient in the whole app — reserved for the primary CTA
        // and dashboard hero bands so it reads as a signature, not a habit.
        brand: 'linear-gradient(135deg, #5730DE 0%, #8A45E0 45%, #FF5F24 100%)',
      },
      boxShadow: {
        soft: '0 2px 10px -2px rgb(87 48 222 / 0.08)',
        lifted: '0 12px 24px -8px rgb(87 48 222 / 0.22)',
      },
    },
  },
  plugins: [require('tailwindcss-rtl')],
  corePlugins: {
    // Disable LTR-only utilities when RTL is detected
    direction: false,
  },
};
