//INIT
import Vue from 'vue'
import App from './App.vue'
import router from './router'
import './index.css'

//AXIOS
import axios from 'axios'
import VueAxios from 'vue-axios'
Vue.use(VueAxios, axios)

//VUETIFY
import vuetify from './plugins/vuetify';
import Vuetify from 'vuetify/lib';
Vue.use(Vuetify)


//LEAFLET
import VueLayers from 'vuelayers'
import 'vuelayers/lib/style.css' // needs css-loader

Vue.use(VueLayers)


//DEV - PROD
Vue.config.productionTip = false


new Vue({
  router,
  vuetify,
  render: h => h(App)
}).$mount('#app')
