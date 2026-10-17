/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Urbanist', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#16181d',
        muted: '#8a8f9a',
        sky: '#7e9ce3',
        coral: '#e2766f',
        // Paleta literal de surveys-app.html — solo para los widgets tipo
        // dashboard de la vista móvil (StatCardMobile, BottomMobileNav,
        // ResumenQuickAction). Escritorio sigue en ink/muted/sky/coral.
        mist: '#f0eff4',
        lilac: '#cbc2f6',
        violet: '#8b78ee',
        dim: '#6d6d75',
      },
    },
  },
  plugins: [],
};
