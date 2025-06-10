import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'
import vueDevTools from 'vite-plugin-vue-devtools'
import autoImport from 'unplugin-auto-import/vite'
import unocss from 'unocss/vite'
import { TDesignResolver } from 'unplugin-vue-components/resolvers'
import components from 'unplugin-vue-components/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    vueJsx(),
    vueDevTools(),
    autoImport({
      imports: ['vue', 'vue-router', 'pinia', '@vueuse/core', '@vueuse/math'],
      resolvers: [
        TDesignResolver({
          library: 'vue-next',
          resolveIcons: true,
        }),
      ],
      dirs: ['./src/hooks'],
    }),
    unocss({ hmrTopLevelAwait: false }),
    components({
      resolvers: [
        TDesignResolver({
          library: 'vue-next',
          resolveIcons: true,
        }),
      ],
    }),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
})
