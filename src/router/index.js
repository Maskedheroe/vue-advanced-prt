import { createRouter, createWebHashHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    redirect: '/recommend'
  },
  {
    path: '/recommend',
    name: 'Recommend',
    component: () => import(/* webpackChunkName: "Recommend" */'../views/Recommend.vue')
  },
  {
    path: '/search',
    name: 'Search',
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
    component: () => import(/* webpackChunkName: "Toplist" */'../views/TopList.vue')
  }
]

const router = createRouter({
  history: createWebHashHistory(process.env.BASE_URL),
  routes
})

export default router
