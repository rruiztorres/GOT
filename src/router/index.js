import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
  },
]

const router = new VueRouter({
  //base: '/GOT/', // comentar en desarrollo hasta encontrar otra solucion mejor
  base: '/',
  mode: 'history',
  routes
})

export default router
