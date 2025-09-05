// Tailwind CSS configuration
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html"
  ],
  darkMode: 'class', // Enable class-based dark mode
  theme: {
    extend: {
      // Custom colors for Guardian Eagle theme
      colors: {
        // Primary brand colors
        guardian: {
          50: '#f0f9ff',
          100: '#e0f2fe', 
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        // Safety status colors
        safety: {
          safe: '#10b981',
          caution: '#f59e0b', 
          danger: '#ef4444',
        },
        // Alert severity colors
        alert: {
          critical: '#dc2626',
          high: '#ea580c',
          medium: '#d97706',
          low: '#2563eb',
        }
      },
      
      // Custom font families
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          '"Segoe UI"',
          'Roboto',
          '"Helvetica Neue"',
          'Arial',
          'sans-serif',
        ],
      },

      // Custom spacing
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },

      // Custom border radius
      borderRadius: {
        '4xl': '2rem',
        '5xl': '2.5rem',
      },

      // Custom box shadows
      boxShadow: {
        'card': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'card-hover': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'inner-lg': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
      },

      // Custom animations
      animation: {
        'spin-slow': 'spin 3s linear infinite',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-subtle': 'bounce 2s infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
      },

      // Custom keyframes
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        slideDown: {
          '0%': { transform: 'translateY(-10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },

      // Custom typography
      fontSize: {
        'xxs': ['0.625rem', { lineHeight: '0.75rem' }],
        '2xs': ['0.6875rem', { lineHeight: '0.8125rem' }],
      },

      // Custom screens for responsive design
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },

      // Custom gradients
      backgroundImage: {
        'gradient-guardian': 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'gradient-safety': 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },

      // Custom backdrop blur
      backdropBlur: {
        xs: '2px',
      },

      // Custom z-index values
      zIndex: {
        '60': '60',
        '70': '70',
        '80': '80',
        '90': '90',
        '100': '100',
      },

      // Custom aspect ratios
      aspectRatio: {
        '4/3': '4 / 3',
        '3/2': '3 / 2',
        '2/3': '2 / 3',
        '9/16': '9 / 16',
      },

      // Custom grid template columns
      gridTemplateColumns: {
        '13': 'repeat(13, minmax(0, 1fr))',
        '14': 'repeat(14, minmax(0, 1fr))',
        '15': 'repeat(15, minmax(0, 1fr))',
        '16': 'repeat(16, minmax(0, 1fr))',
      },

      // Custom width and height
      width: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem',
        '128': '32rem',
      },
      height: {
        '18': '4.5rem',
        '88': '22rem',
        '112': '28rem', 
        '128': '32rem',
      },

      // Custom maximum width
      maxWidth: {
        '8xl': '88rem',
        '9xl': '96rem',
      },

      // Custom minimum height
      minHeight: {
        '12': '3rem',
        '16': '4rem',
        '20': '5rem',
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'), // Better form styling
    
    // Custom plugin for Guardian Eagle utilities
    function({ addUtilities, addComponents, theme }) {
      // Custom utility classes
      const newUtilities = {
        // Safety status utilities
        '.text-safety-safe': {
          color: theme('colors.safety.safe'),
        },
        '.text-safety-caution': {
          color: theme('colors.safety.caution'),
        },
        '.text-safety-danger': {
          color: theme('colors.safety.danger'),
        },
        
        // Alert severity utilities
        '.alert-critical': {
          borderColor: theme('colors.alert.critical'),
          backgroundColor: theme('colors.red.50'),
          color: theme('colors.red.800'),
        },
        '.alert-high': {
          borderColor: theme('colors.alert.high'),
          backgroundColor: theme('colors.orange.50'),
          color: theme('colors.orange.800'),
        },
        '.alert-medium': {
          borderColor: theme('colors.alert.medium'),
          backgroundColor: theme('colors.yellow.50'),
          color: theme('colors.yellow.800'),
        },
        '.alert-low': {
          borderColor: theme('colors.alert.low'),
          backgroundColor: theme('colors.blue.50'),
          color: theme('colors.blue.800'),
        },

        // Scrollbar utilities
        '.scrollbar-thin': {
          scrollbarWidth: 'thin',
        },
        '.scrollbar-none': {
          scrollbarWidth: 'none',
          '&::-webkit-scrollbar': {
            display: 'none',
          },
        },

        // Map container utilities
        '.map-container': {
          height: '100%',
          width: '100%',
          zIndex: '1',
        },
      };

      // Custom component classes
      const newComponents = {
        // Card components
        '.card': {
          backgroundColor: theme('colors.white'),
          borderRadius: theme('borderRadius.lg'),
          boxShadow: theme('boxShadow.card'),
          padding: theme('spacing.6'),
        },
        '.card-hover': {
          transition: 'all 0.2s ease-in-out',
          '&:hover': {
            boxShadow: theme('boxShadow.card-hover'),
            transform: 'translateY(-4px)',
          },
        },

        // Button components
        '.btn': {
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: theme('borderRadius.lg'),
          fontWeight: theme('fontWeight.medium'),
          transition: 'all 0.2s ease-in-out',
          '&:focus': {
            outline: 'none',
            boxShadow: `0 0 0 3px ${theme('colors.blue.500')}40`,
          },
        },
        '.btn-primary': {
          backgroundColor: theme('colors.blue.600'),
          color: theme('colors.white'),
          '&:hover': {
            backgroundColor: theme('colors.blue.700'),
          },
        },
        '.btn-secondary': {
          backgroundColor: theme('colors.gray.200'),
          color: theme('colors.gray.900'),
          '&:hover': {
            backgroundColor: theme('colors.gray.300'),
          },
        },

        // Status badge components
        '.badge': {
          display: 'inline-flex',
          alignItems: 'center',
          borderRadius: theme('borderRadius.full'),
          fontSize: theme('fontSize.xs'),
          fontWeight: theme('fontWeight.medium'),
          padding: `${theme('spacing.1')} ${theme('spacing.3')}`,
        },
      };

      addUtilities(newUtilities);
      addComponents(newComponents);
    }
  ],
};
