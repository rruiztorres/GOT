import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Dashboard from '../views/Dashboard.vue'
import VectorTileMap from '../components/common/VectorTileMap';

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
  {
    path: '/vectorTiles',
    name: 'VectorTileMap',
    component: VectorTileMap,
  }
]

const router = new VueRouter({
  base: '/got',
  //base: '/',
  mode: 'history',
  routes
})

export default router
