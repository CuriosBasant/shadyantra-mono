module.exports = {
  mode: "jit",
  purge: ["./src/**/*.tsx"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      width: {
        "1/10": "10%",
      },
      maxWidth: {
        "8xl": "90rem",
      },
      height: {
        "1/10": "10%",
      },
    },
  },
  variants: {
    extend: {
      cursor: ["hover", "focus"],
    },
  },
  // future: {
  //   removeDeprecatedGapUtilities: true,
  //   purgeLayersByDefault: true,
  // },
  plugins: [
    // require("@tailwindcss/typography"),
    require("@tailwindcss/forms"),
    // require("@tailwindcss/line-clamp"),
    require("@tailwindcss/aspect-ratio"),
  ],
}
