/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                background: "#000000", // Pure Black
                surface: "#1c1c1e",    // Apple Dark Gray
                "surface-highlight": "#2c2c2e",
                primary: {
                    DEFAULT: "#0A84FF",  // Apple System Blue (Dark Mode)
                    hover: "#409CFF",
                    foreground: "#ffffff",
                },
                secondary: {
                    DEFAULT: "#5E5CE6",  // Apple System Indigo
                    hover: "#7D7AFF",
                },
                accent: "#BF5AF2",     // Apple System Purple
                success: "#32D74B",    // Apple System Green
                warning: "#FFD60A",    // Apple System Yellow
                danger: "#FF453A",     // Apple System Red
            },
            fontFamily: {
                sans: ['-apple-system', 'BlinkMacSystemFont', 'Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
            },
            borderRadius: {
                '2xl': '18px', // Apple-ish curvature
                '3xl': '24px',
            },
            animation: {
                'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
            }
        },
    },
    plugins: [],
}
