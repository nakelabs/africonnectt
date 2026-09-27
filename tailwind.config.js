/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Premium White System
        brand: {
          bg: '#FCFCFC',        // Page background
          card: '#FFFFFF',      // Card surfaces
          charcoal: '#1A1A1A',  // Primary text
          gold: '#D4AF37',      // Verified badges, CTAs
          'gold-light': '#F5E99A',
          'gold-muted': '#B8962E',
          border: '#E5E7EB',    // 1px dividers
          muted: '#6B7280',     // Secondary text
          'muted-light': '#9CA3AF',
          subtle: '#F9FAFB',    // Input backgrounds
          accent: '#F0EAD6',    // Gold-tinted surface
        },
        // Sector color chips
        sector: {
          fintech: '#EFF6FF',
          agritech: '#F0FDF4',
          healthtech: '#FFF7ED',
          edtech: '#FDF4FF',
          cleantech: '#F0FDFA',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      fontSize: {
        '2xs': ['0.625rem', { lineHeight: '0.875rem' }],
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)',
        'nav': '0 -1px 0 #E5E7EB, 0 -2px 8px rgba(0,0,0,0.04)',
        'gold': '0 0 0 3px rgba(212,175,55,0.15)',
      },
      borderRadius: {
        'xl2': '1rem',
        'xl3': '1.5rem',
      },
      spacing: {
        '18': '4.5rem',
        '22': '5.5rem',
        'safe-bottom': 'env(safe-area-inset-bottom)',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'slide-up': 'slideUp 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
        'pulse-gold': 'pulseGold 2s ease-in-out infinite',
        'shimmer': 'shimmer 1.5s infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseGold: {
          '0%, 100%': { boxShadow: '0 0 0 0 rgba(212,175,55,0)' },
          '50%': { boxShadow: '0 0 0 4px rgba(212,175,55,0.2)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
}
