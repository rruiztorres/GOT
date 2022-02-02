module.exports = {
  transpileDependencies: [
    'vuetify'
  ],

  //Pagina en blanco en produccion
  publicPath: process.env.NODE_ENV === 'production'?'/GOT/':'/'
}
