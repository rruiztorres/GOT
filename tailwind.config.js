module.exports = {
  purge: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx'],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        'sans': ['Montserrat', 'Sans-serif']
      },
      backgroundImage: theme => ({
        'login-back': "url('../src/assets/start_background.jpg')",
      })
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
}
