import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import autoImport from 'unplugin-auto-import/vite'
import unocss from 'unocss/vite'
import components from 'unplugin-vue-components/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    autoImport({
      imports: ['vue', 'vue-router', 'pinia', '@vueuse/core', '@vueuse/math'],
      dirs: ['./src/hooks'],
    }),
    unocss({ hmrTopLevelAwait: false }),
    components({
      dirs: ['./src/components/_internal'],
      extensions: ['vue', 'tsx'],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@fusionx/core': fileURLToPath(new URL('./src/components/_fux-core', import.meta.url)),
    },
  },
  server: {
    port: 1127,
  },
})
