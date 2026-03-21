/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: 'class', // Enable class-based dark mode
    theme: {
        extend: {
            colors: {
                brand: {
                    50: '#f0f7ff',
                    100: '#e0effe',
                    200: '#bae0fd',
                    300: '#7cc8fb',
                    400: '#36abf7',
                    500: '#0ea5e9', // Medical Sky Blue
                    600: '#0284c7',
                    700: '#0369a1',
                    800: '#075985',
                    900: '#0c4a6e',
                    950: '#082f49',
                },
                accent: {
                    400: '#34d399',
                    500: '#10b981', // Medical Emerald
                    600: '#059669',
                },
                medical: {
                    background: '#f8fafc',
                    surface: '#ffffff',
                    card: '#ffffff',
                    border: '#e2e8f0',
                    text: '#0f172a',
                    muted: '#64748b'
                },
                // Dark mode colors - Full Dark & Violet Theme
                dark: {
                    background: '#0a0a0f',
                    surface: '#1a1a2e',
                    card: '#252537',
                    border: '#374151',
                    text: '#e4e4e7',
                    'text-secondary': '#9ca3af',
                    'text-muted': '#6b7280',
                    // Violet accents
                    violet: {
                        50: '#8b5cf6',
                        100: '#a78bfa',
                        200: '#c084fc',
                        300: '#a855f7',
                        400: '#818cf8',
                        500: '#6366f1',
                        600: '#7c3aed',
                        700: '#6d28d9',
                        800: '#7c2d12',
                        900: '#4c1d95',
                        950: '#3730a3',
                    },
                    // Dark gradients
                    'gradient-start': '#1a1a2e',
                    'gradient-end': '#374151',
                    'gradient-violet': '#6366f1'
                }
            },
            fontFamily: {
                sans: ['"Plus Jakarta Sans"', 'Inter', 'sans-serif'],
            },
            boxShadow: {
                'premium': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
                'premium-hover': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
                'glass': 'inset 0 0 0 1px rgba(255, 255, 255, 1), 0 10px 30px -5px rgba(0, 0, 0, 0.05)',
                'subtle': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
                'glow-brand': '0 0 20px rgba(14, 165, 233, 0.15)',
                'glow-cyan': '0 0 15px rgba(14, 165, 233, 0.2)',
                'glow-emerald': '0 0 15px rgba(16, 185, 129, 0.2)',
                'glow-violet': '0 0 15px rgba(139, 92, 246, 0.2)',
                'dark-premium': '0 4px 6px -1px rgba(0, 0, 0 / 0.3), 0 2px 4px -2px rgba(0, 0, 0 / 0.3)',
                'dark-glow-violet': '0 0 20px rgba(139, 92, 246, 0.3)',
                'dark-glow-brand': '0 0 20px rgba(99, 102, 241, 0.25)',
            },
            borderRadius: {
                '2xl': '1.25rem',
                '3xl': '1.75rem',
                '4xl': '2.5rem',
                '5xl': '3.5rem',
            },
            animation: {
                'float': 'float 6s ease-in-out infinite',
                'float-delayed': 'float 6s ease-in-out infinite 2s',
                'pulse-slow': 'pulse 5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
                'background-shine': 'background-shine 3s linear infinite',
                'border-spin': 'border-spin 4s linear infinite',
            },
            keyframes: {
                float: {
                    '0%, 100%': { transform: 'translateY(0)' },
                    '50%': { transform: 'translateY(-10px)' },
                },
                'background-shine': {
                    'from': { backgroundPosition: '0 0' },
                    'to': { backgroundPosition: '-200% 0' }
                },
                'border-spin': {
                    '100%': { transform: 'rotate(360deg)' }
                }
            }
        },
    },
    plugins: [],
}
