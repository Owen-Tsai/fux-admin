import Logo from '@/components/_internal/logo.vue'
import Scrollbar from 'custom-vue-scrollbar'
import Chart from 'vue-echarts'
import DictTag from '@/components/_internal/dict-tag.vue'
import 'custom-vue-scrollbar/dist/style.css'
import type { App } from 'vue'

import './echarts'

const registerComponents = (app: App) => {
  app.component('FuxLogo', Logo)
  app.component('Scrollbar', Scrollbar)
  app.component('DictTag', DictTag)
  app.component('Chart', Chart)
}

export default registerComponents
