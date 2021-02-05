const plugin = require('tailwindcss/plugin');
module.exports = {
  purge: ['./pages/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        '1/10': '10%',
      },
      height: {
        '1/10': '10%',
      }
    }
  },
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
        '.selected': {
          backgroundColor: 'yellow !important'
        }
      });
    }),
  ],
};
