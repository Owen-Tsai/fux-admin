import 'tdesign-vue-next/dist/reset.css'
import 'tdesign-vue-next/es/style/index.css'
import 'nprogress/nprogress.css'
import '@/assets/css/index.scss'
import 'virtual:uno.css'
import TDesign from 'tdesign-vue-next'

import App from './app.tsx'
import router from './router'
import './router/guard'

import registerComponents from './plugins/register.ts'

const app = createApp(App)

app.use(TDesign)
app.use(createPinia())
app.use(router)

registerComponents(app)

app.mount('#app')
