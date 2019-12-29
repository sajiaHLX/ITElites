import Vue from 'vue'
import VueRouter from 'vue-router'
import SignUp from '../views/SignUp.vue'
import Login from '../views/Login.vue'
import Backstage from '../views/Backstage.vue'
import Reviewed from '../views/Reviewed.vue'
// import Home from '../views/Home.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'home',
    redirect: '/signup'
  },
  {
    path:'/signup',
    component:SignUp
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path:'/backstage',
    name:'backstage',
    component:Backstage,
    meta: { requireAuth:true },
    beforeEnter: (to, from, next) => {
      if (window.sessionStorage.getItem('isLogin') !== '1') {
        next({
          path: '/login'
        })
      } else {
        next()
      }
    }
  },
  {
    path:'/reviewed',
    name:'reviewed',
    component:Reviewed,
    meta: { requireAuth:true },
    beforeEnter: (to, from, next) => {
      if (window.sessionStorage.getItem('isLogin') !== '1') {
        next({
          path: '/login'
        })
      } else {
        next()
      }
    }
  }
]

const router = new VueRouter({
  routes,
  mode:'history'
})

export default router
