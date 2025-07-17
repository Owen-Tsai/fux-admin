import { DefaultLayout } from '@/layouts'
import MinimalLayout from '@/layouts/minimal/index.vue'
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
      {
        path: '/system/dict/data/:type',
        name: 'DictData',
        component: () => import('@/views/system/dict/dict-data/index.vue'),
        meta: {
          title: '字典数据',
          activeMenuKey: '/system/dict',
          keepAlive: true,
        },
      },
      {
        path: '/infra/code-gen/edit',
        name: 'CodeGenEdit',
        component: () => import('@/views/infra/code-gen/config/index.vue'),
        meta: {
          title: '代码生成配置',
          activeMenuKey: '/infra/code-gen',
        },
      },
    ],
  },
  {
    path: '/app-design/:appId',
    name: 'AppDesignRoot',
    component: MinimalLayout,
    redirect: 'AppDesign',
    children: [
      {
        path: '',
        name: 'AppDesign',
        component: () => import('@/views/fux/index.vue'),
        meta: {
          title: '应用设计',
        },
      },
    ],
  },
]

export default commonRoutes
