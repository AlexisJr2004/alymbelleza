/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        ink: '#202b42',
        muted: '#5d687d',
        sky: '#466cac',
        coral: '#b75467',
        mist: '#eef1f9',
        lilac: '#d6cff4',
        violet: '#7051c7',
        dim: '#606a7e',
      },
    },
  },
  plugins: [],
};
