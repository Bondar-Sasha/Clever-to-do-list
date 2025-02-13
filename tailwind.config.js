/** @type {import('tailwindcss').Config} */
import colors from 'tailwindcss/colors'
import plugin from 'tailwindcss/plugin'

export default {
  theme: {
    colors: {
      ...colors,
    },
    extend: {
      spacing: {},
    },
  },
  plugins: [
    plugin(function ({addUtilities}) {
      const newUtilities = {
        '.flex-center': {
          display: 'flex',
          'align-items': 'center',
          'justify-content': 'center',
        },
        '.stretching': {
          width: '100%',
          height: '100%',
        },
      }
      addUtilities(newUtilities, ['responsive', 'hover'])
    }),
  ],
}
