const plugin = require('tailwindcss/plugin');
const colors = require('tailwindcss/colors');

module.exports = {
  purge: ['./src/**/*.{jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    colors,
    extend: {
      width: {
        '1/10': '10%',
      },
      height: {
        '1/10': '10%',
      }
    }
  },
  backgroundColor: (theme) => theme('colors'),
  variants: {
    extend: {
    },
  },
  future: {
    removeDeprecatedGapUtilities: true,
    purgeLayersByDefault: true
  },
  plugins: [
    plugin(function ({ addUtilities, addComponents, e, prefix, config }) {
      // Add your custom styles here
      addUtilities({
        '.path': {
          '&::after': {
            content: "''",
            top: '50%',
            left: '50%',
            position: 'absolute',
            padding: '2vmin',
            borderRadius: '50%',
            backgroundColor: '#0014',
            transform: 'translate(-50%, -50%)',
            zIndex: '50'
          }
        },
        '.trail': {
          '&::before': {
            content: "''",
            position: 'absolute',
            top: '0',
            left: '0',
            width: '100%',
            height: '100%',
            backgroundColor: '#93C5FD',
          }
        }
      });
    }),
  ],
};
