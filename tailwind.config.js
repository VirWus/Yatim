module.exports = {
  important: true,
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./node_modules/flowbite/**/*.js"
  ],
    theme: { 
      extend: {
      spacing: {
        '128': '32rem',
      },
      screens: {
        'sm': '460px',
        // => @media (min-width: 390px) { ... }

        'md': '640px',
        // => @media (min-width: 640px) { ... }
  
        'lg': '1024px',
        // => @media (min-width: 1024px) { ... }
  
        'xl': '1280px',
        // => @media (min-width: 1280px) { ... }
      },
      fontFamily: {
        arabic:['Noto','regular', 'sans-serif'],
        sans: ['Karu', 'regular'],
        heading: ['Karu', 'Black', 'sans-serif'],
      },
      colors: {
        platinium: "#CCCCCC",
        vividtangelo: "#FF6633",
        buttonblue: "#24ACF0",
        charcoal: "#394555",
        spacecadet: "#182B54",
        chinesblack: "#0D161B",
        raisinblack: "#231F20",
        bronze: "#CD7F32",
        silver: "#C0C0C0",
        gold: "#FFD700",
      },
      keyframes:{
        'bg-blur-animation': {
        'from': { tranform: 'backdrop-blur-sm' },
         
        'to': { tranform: 'backdrop-blur-lg' },
      }
    },
      animation: {
        'bg-blur': 'bg-blur-animation ease-in-out 0.5s '
    }
    }
  },
  plugins: [
    require("@tailwindcss/aspect-ratio"),
    require('flowbite/plugin')
    
  ],
}
