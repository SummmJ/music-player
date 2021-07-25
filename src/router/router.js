/**
 * 整个app的路由设置
 */
import Vue from 'vue'
import VueRouter from 'vue-router'
Vue.use(VueRouter)

const router = new VueRouter({
  routes: [{
    path: '/index',
    component: require('../views/index'),
    children: [
      {
        path: 'rage',
        component: require('../views/rage')
      },
      {
        path: 'songList',
        component: require('../views/songList')
      },
      {
        path: 'recommend',
        component: require('../views/recommend')
      },
      {
        path: 'analysis',
        component: require('../views/analysis')
      }
    ]
  }, {
    name: 'playerDetail',
    path: '/playerDetail/:id',
    component: require('../views/playerDetail')
  }, {
    path: '/playListDetail/:id',
    name: 'playListDetail',
    component: require('../views/playListDetail')
  }, {
    path: '*', redirect: '/index/rage'
  }, {
    path: '/login',
    component: require('../views/login.vue')
  }, {
    path: '/register',
    component: require('../views/register.vue')
  }, {
    path: '/search',
    component: require('../views/search.vue')
  }]
})

export default router
