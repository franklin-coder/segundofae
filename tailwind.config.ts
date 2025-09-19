import type { Config } from 'tailwindcss'

const config = {
  darkMode: ['class'],
  content: [
    './pages/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
    './app/**/*.{ts,tsx}',
    './src/**/*.{ts,tsx}',
  ],
  prefix: '',
  theme: {
    container: {
      center: true,
      padding: '2rem',
      screens: {
        '2xl': '1400px',
      },
    },
    extend: {
      colors: {
        // FaeLight Crafts Brand Colors
        primary: {
          DEFAULT: '#0A8E81',
          50: '#E6F7F6',
          100: '#CCF0EC',
          200: '#99E1DA',
          300: '#66D2C7',
          400: '#33C3B5',
          500: '#0A8E81',
          600: '#087267',
          700: '#06564D',
          800: '#043A34',
          900: '#021D1A'
        },
        secondary: {
          DEFAULT: '#000000',
          100: '#1A1A1A',
          200: '#333333',
          300: '#4D4D4D',
          400: '#666666',
          500: '#808080',
          600: '#999999',
          700: '#B3B3B3',
          800: '#CCCCCC',
          900: '#E6E6E6'
        },
        accent: {
          DEFAULT: '#AEBBB2',
          50: '#F5F7F6',
          100: '#EAEFEC',
          200: '#D6DFD9',
          300: '#C1CFC5',
          400: '#ADBFB2',
          500: '#AEBBB2',
          600: '#8B9C8F',
          700: '#6B7D6F',
          800: '#4A5E4E',
          900: '#2A3F2E'
        },
        background: {
          DEFAULT: '#FAF5EF',
          50: '#FEFDFB',
          100: '#FCF9F1',
          200: '#FAF5EF',
          300: '#F7F1E7',
          400: '#F4EDDF',
          500: '#F1E9D7',
          600: '#EEE5CF',
          700: '#EBE1C7',
          800: '#E8DDBF',
          900: '#E5D9B7'
        },
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: '#0A8E81',
        foreground: '#000000',
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--destructive-foreground))',
        },
        muted: {
          DEFAULT: '#AEBBB2',
          foreground: '#000000',
        },
        popover: {
          DEFAULT: '#FFFFFF',
          foreground: '#000000',
        },
        card: {
          DEFAULT: '#FFFFFF',
          foreground: '#000000',
        },
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
      },
      keyframes: {
        'accordion-down': {
          from: { height: '0' },
          to: { height: 'var(--radix-accordion-content-height)' },
        },
        'accordion-up': {
          from: { height: 'var(--radix-accordion-content-height)' },
          to: { height: '0' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        slideInFromLeft: {
          '0%': { opacity: '0', transform: 'translateX(-100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        slideInFromRight: {
          '0%': { opacity: '0', transform: 'translateX(100px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        countUp: {
          '0%': { transform: 'scale(0.5)', opacity: '0' },
          '50%': { transform: 'scale(1.1)', opacity: '0.8' },
          '100%': { transform: 'scale(1)', opacity: '1' }
        }
      },
      animation: {
        'accordion-down': 'accordion-down 0.2s ease-out',
        'accordion-up': 'accordion-up 0.2s ease-out',
        'fade-in': 'fadeIn 0.6s ease-out',
        'slide-in-left': 'slideInFromLeft 0.8s ease-out',
        'slide-in-right': 'slideInFromRight 0.8s ease-out',
        'count-up': 'countUp 0.8s ease-out'
      },
      fontFamily: {
        sans: ['var(--font-della-respira)', 'system-ui', 'sans-serif'],
        heading: ['var(--font-berkshire-swash)', 'serif'],
      },
      aspectRatio: {
        'product': '4/5',
        'hero': '16/9',
      }
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

export default config
