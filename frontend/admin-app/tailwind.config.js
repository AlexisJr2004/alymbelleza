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
      },
    },
  },
  plugins: [],
};
