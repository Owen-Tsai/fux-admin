import { DefaultLayout } from '@/layouts'
// import MinimalLayout from '@/layouts/minimal/index.vue'
import type { RouteRecordRaw } from 'vue-router'

const commonRoutes: RouteRecordRaw[] = [
  {
    path: '/login',
    name: 'login',
    component: () => import('@/views/login/index.vue'),
    meta: {
      hidden: true,
      title: '登录',
    },
  },
  {
    path: '/',
    name: '__root__',
    component: DefaultLayout,
    redirect: 'index',
    children: [
      {
        path: 'index',
        name: 'index',
        component: () => import('@/views/index/index.vue'),
        meta: {
          title: '工作台',
          keepAlive: true,
        },
      },
    ],
  },
]

export default commonRoutes
