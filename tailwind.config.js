/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        'space': ['Space Grotesk', 'sans-serif'],
        'argent': ['Argent CF', 'serif'],
        'inter': ['Inter', 'sans-serif'],
      },
      colors: {
        // Original tech colors
        'tech-gray': {
          50: '#f9fafb',
          100: '#f3f4f6',
          200: '#e5e7eb',
          300: '#d1d5db',
          400: '#9ca3af',
          500: '#6b7280',
          600: '#4b5563',
          700: '#374151',
          800: '#1f2937',
          900: '#111827',
          950: '#030712',
        },
        'accent': {
          blue: '#3b82f6',
          green: '#10b981',
          yellow: '#f59e0b',
          red: '#ef4444',
          purple: '#8b5cf6',
        },
        // New Zach Klein inspired color palette
        'zk': {
          'navy': '#0F1626',
          'leather': '#AB987A',
          'coral': '#FF533D',
          'eggshell': '#F5F5F5',
          'charcoal': '#2A2A2A',
          'cream': '#FAF9F6',
        }
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'tech-gradient': 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 50%, #f9fafb 100%)',
        'zk-gradient': 'linear-gradient(135deg, #0F1626 0%, #2A2A2A 100%)',
        'zk-light-gradient': 'linear-gradient(135deg, #F5F5F5 0%, #FAF9F6 100%)',
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'spin-slow': 'spin 3s linear infinite',
        'shimmer': 'shimmer 2s infinite',
      },
      backdropBlur: {
        'xs': '2px',
      },
      boxShadow: {
        'tech': '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
        'tech-lg': '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
        'inner-tech': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.06)',
        'zk': '0 8px 32px rgba(15, 22, 38, 0.15)',
        'zk-lg': '0 20px 40px rgba(15, 22, 38, 0.2)',
      },
    },
  },
  plugins: [],
};