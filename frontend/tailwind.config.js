/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}", // Inclut tous les fichiers HTML et TypeScript dans src
  ],
  theme:{
    extend: {
      // Ajout d'animations personnalisées
      animation: {
        'slide-in-left': 'slideInLeft 1s ease-out',
        'slide-in-right': 'slideInRight 1s ease-out', 
      },
      keyframes: {
        slideInLeft: {
          '0%': { transform: 'translateX(-100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        slideInRight: { // Animation pour glissement à droite
          '0%': { transform: 'translateX(100%)', opacity: 0 },
          '100%': { transform: 'translateX(0)', opacity: 1 },
        },
        fadeIn: {
          '0%': { opacity: 0 },
          '100%': { opacity: 1 },
        },
        
      },
      // Ajout de couleurs personnalisées
      colors: {
        customBlue: 'rgb(134, 165, 251)', // Définissez la couleur personnalisée ici

        primary: '#1E40AF', // Couleur principale
        secondary: '#1D4ED8', // Couleur secondaire
        accent: '#10B981',   // Couleur d'accentuation
      },
      // Personnalisation des tailles
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
      // Typographie
      fontFamily: {
        sans: ['Inter', 'Arial', 'sans-serif'], // Remplace par ta police préférée
        serif: ['Merriweather', 'serif'],
      },
    },
  },
  plugins: [
   
  ],
}
