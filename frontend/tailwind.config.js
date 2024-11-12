/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        maincol:'#0098D3',
        maincoldark:'#007BB8'
      },
      classes:{
        'btn-primary':''
      }
    },
  },
  plugins: [],
}
