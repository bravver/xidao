/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        period: { rain: '#4A5568', warm: '#F6AD55' },
        follicular: { dawn: '#FBD38D', pink: '#FEB89B' },
        ovulation: { sun: '#F6E05E', sea: '#4299E1' },
        luteal: { sunset: '#ED8936', dim: '#C05621' },
        ocean: {
          50: '#E6F4F9',
          100: '#CCE9F3',
          200: '#99D3E7',
          300: '#66BDDB',
          400: '#33A7CF',
          500: '#0891B2',
          600: '#067490',
          700: '#05576C',
          800: '#033A48',
          900: '#021D24',
        },
      },
      fontFamily: {
        display: ['Georgia', 'serif'],
        body: ['system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}