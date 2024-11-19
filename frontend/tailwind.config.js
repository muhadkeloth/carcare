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
        maincoldark:'#007BB8',
        mainclr:{
          100:'#E5F7FD',
          200:'#CCEFFF',
          300:'#99DBF7',
          400:'#33C3EC',
          500:'#0098D3',
          600:'#007CB3',
          700:'#005F90',
          800:'#004675',
          900:'#00325D',
        }
      },
      animation: {
        ripple: 'ripple 0.6s linear',
      },
      keyframes: {
        ripple: {
          '0%': {
            transform: 'scale(0)',
            opacity: 1,
          },
          '100%': {
            transform: 'scale(4)',
            opacity: 0,
          },
        },
      },
    },
  },
  plugins: [
    function({ addComponents }){
      addComponents({
        '.btn-primary':{
          // position: 'relative', 
          display: 'inline-block', 
          borderRadius: '0.375rem', 
          backgroundColor: '#0098D3', //500
          paddingLeft: '1.5rem', 
          paddingRight: '1.5rem', 
          paddingTop: '0.75rem', 
          paddingBottom: '0.75rem', 
          fontSize: '0.75rem', 
          fontWeight: '500', 
          textTransform: 'uppercase', 
          lineHeight: '1.25rem', 
          letterSpacing:'0.09em',
          color: '#fff', 
          boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)', 
          transitionProperty: 'all', 
          transitionDuration: '150ms', 
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', 
          '&:hover': {
            backgroundColor: '#007CB3', //600 
            boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)', 
          },
          '&:focus': {
            outline: 'none', 
            ringWidth: '2px', 
            ringColor: '#33C3EC', //400
            ringOpacity: '0.5', 
          },
          '&:active': {
            backgroundColor: '#005F90', //700
            boxShadow: 'inset 0px 4px 6px -1px rgba(0, 0, 0, 0.2)', 
            transform: 'scale(0.95)', 
          },
        },
        '.btn-secondary':{
          position: 'relative', 
          display: 'inline-block', 
          borderRadius: '0.375rem', 
          backgroundColor: '#9ca3af', //400
          paddingLeft: '1.5rem', 
          paddingRight: '1.5rem', 
          paddingTop: '0.75rem', 
          paddingBottom: '0.75rem', 
          fontSize: '0.75rem', 
          fontWeight: '500', 
          textTransform: 'uppercase', 
          lineHeight: '1.25rem', 
          letterSpacing:'0.06em',
          color: '#111827', 
          boxShadow: '0px 4px 6px -1px rgba(0, 0, 0, 0.1), 0px 2px 4px -1px rgba(0, 0, 0, 0.06)', 
          transitionProperty: 'all', 
          transitionDuration: '150ms', 
          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)', 
          '&:hover': {
            backgroundColor: '#6b7280', //500 
            boxShadow: '0px 10px 15px -3px rgba(0, 0, 0, 0.1), 0px 4px 6px -2px rgba(0, 0, 0, 0.05)', 
          },
          '&:focus': {
            outline: 'none', 
            ringWidth: '2px', 
            ringColor: '#d1d5db', //300
            ringOpacity: '0.5', 
          },
          '&:active': {
            backgroundColor: '#4b5563', //600
            boxShadow: 'inset 0px 4px 6px -1px rgba(0, 0, 0, 0.2)', 
            transform: 'scale(0.95)', 
          },
        }
      })
    }
  ],
}
