import Logo from '@/components/_internal/logo.vue'
import Scrollbar from 'custom-vue-scrollbar'
import 'custom-vue-scrollbar/dist/style.css'
import type { App } from 'vue'

const registerComponents = (app: App) => {
  app.component('FuxLogo', Logo)
  app.component('Scrollbar', Scrollbar)
}

export default registerComponents
