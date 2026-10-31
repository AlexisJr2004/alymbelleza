/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#16181d',
        muted: '#64748b',
        sky: '#3d68a0',
        coral: '#b53b65',
        // Paleta literal de surveys-app.html — solo para los widgets tipo
        // dashboard de la vista móvil (StatCardMobile, BottomMobileNav,
        // ResumenQuickAction). Escritorio sigue en ink/muted/sky/coral.
        mist: '#f0eff4',
        lilac: '#f8e5ed',
        violet: '#a83a65',
        dim: '#6d6d75',
      },
    },
  },
  plugins: [],
};
