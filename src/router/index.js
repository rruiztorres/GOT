import Vue from 'vue'
import VueRouter from 'vue-router'

function autentication(){
  //COMPROBACION DE TOKENS EN LUGAR DE LOCALSTORAGE??
  if(localStorage.usrName !== undefined && localStorage.token !== undefined){
    return true;
  } else {
    return false;
  }
}


Vue.use(VueRouter)
const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import ('../views/Home.vue'),
  },

  {
    path: '/dashboard',
    component: () => import ('../views/Dashboard.vue'),
    beforeEnter: (to, from, next) => {        
      if(autentication() === true){
        next();     //permitir navegacion
      } else {
        next('/')   //ir a login
      }
    },
    
  },
]


// TODO: Correccion rutas automatico al desplegar
const router = new VueRouter({
  base: '/got',             //dev
  //base: '/',              //prod
  mode: 'history',
  routes
})

export default router
