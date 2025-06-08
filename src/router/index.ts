import { createRouter, createWebHistory } from 'vue-router'
import commonRoutes from './common-routes'

const router = createRouter({
  history: createWebHistory(),
  routes: commonRoutes,
})

export default router
