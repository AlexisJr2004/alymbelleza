/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Bella Montserrat', 'ui-sans-serif', 'sans-serif'],
        display: ['Georgia', 'Times New Roman', 'serif'],
      },
      colors: {
        ink: '#51303f',
        muted: '#77656f',
        sky: '#b5345b',
        coral: '#c33060',
        mist: '#fff2f6',
        lilac: '#f8e5ed',
        violet: '#a83a65',
        dim: '#77656f',
      },
    },
  },
  plugins: [],
};
