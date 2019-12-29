import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import echarts from 'echarts';


Vue.prototype.$echarts = echarts 
Vue.config.productionTip = false

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')

// router.beforeEach((to, from, next) => {
//   // console.log(to.meta.auth);
//   if (to.meta.auth) {
//     if (window.sessionStorage.getItem('isLogin') === '1') {
//       next()
//     } else if (to.path !== '/') {
//       next({path: '/login'})
//     }
//   } else {
//     next()
//   }
// })
// router.beforeEach((to,from,next)=>{
//   if(to.path === '/login' ) return next()

//   if(!window.sessionStorage.getItem("isLogin")) return next("/login")

//   next()
// })
// router.beforeEach((to, from, next) => {
//   if (to.matched.some(record => record.meta.requireAuth)) {
//     if (window.sessionStorage.getItem('isLogin') !== '1') {
//       next({
//         path: '/login'
//       })
//     } else {
//       next()
//     }
//   } else {
//     next() // 确保一定要调用 next()
//   }
// })