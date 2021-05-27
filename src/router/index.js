import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'Recommend',
    children: [
      {
        path: ':id',
        component: () => import(/* webpackChunkName: "Album" */'../views/Album.vue')
        // 魔术注释
      }
    ],
    component: () => import(/* webpackChunkName: "Recommend" */'../views/Recommend.vue')
  },
  {
    path: '/search',
    name: 'Search',
    children: [
      {
        path: ':id',
        component: () => import(/* webpackChunkName: "SingerDetail" */'../views/SingerDetail.vue')
      }
    ],
    component: () => import(/* webpackChunkName: "Search" */'../views/Search.vue')
  },
  {
    path: '/singer',
    name: 'Singer',
    children: [
      {
        path: ':id',
        component: () => import(/* webpackChunkName: "SingerDetail" */'../views/SingerDetail.vue')
      }
    ],
    component: () => import(/* webpackChunkName: "Singer" */'../views/Singer.vue')
  },
  {
    path: '/toplist',
    name: 'TopList',
    children: [
      {
        path: ':id',
        component: () => import(/* webpackChunkName: "TopDetail" */'../views/TopDetail.vue')
      }
    ],
    component: () => import(/* webpackChunkName: "Toplist" */'../views/TopList.vue')
  },
  {
    path: '/user',
    name: 'UserCenter',
    components: {
      user: () => import(/* webpackChunkName: "UserCenter" */'../views/UserCenter.vue')
    }
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
