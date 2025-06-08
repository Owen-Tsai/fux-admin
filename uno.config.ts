import { defineConfig, presetMini, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [presetMini()],
  transformers: [transformerDirectives()],
  theme: {
    colors: {},
  },
  shortcuts: [
    {
      's-full': 'w-full h-full',
      'flex-center': 'flex items-center justify-center',
      'flex-center-v': 'flex flex-col items-center justify-center',
      'flex-between': 'flex items-center justify-between',
      'text-brand': 'text-[var(--td-brand-color)]',
      'text-secondary': 'text-[var(--td-text-color-secondary)]',
    },
  ],
})
