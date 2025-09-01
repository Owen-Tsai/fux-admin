import { defineConfig, presetMini, transformerDirectives } from 'unocss'

export default defineConfig({
  presets: [presetMini()],
  transformers: [transformerDirectives()],
  theme: {
    colors: {},
  },
  rules: [
    [
      /^radius-(.*)-b/,
      ([, v]) => ({
        'border-bottom-left-radius': `var(--td-radius-${v})`,
        'border-bottom-right-radius': `var(--td-radius-${v})`,
      }),
    ],
    [
      /^radius-(.*)-t/,
      ([, v]) => ({
        'border-top-left-radius': `var(--td-radius-${v})`,
        'border-top-right-radius': `var(--td-radius-${v})`,
      }),
    ],
    [
      /^line-clamp-(.*)/,
      ([, v]) => ({
        overflow: v === 'none' ? 'visible' : 'hidden',
        // 'text-overflow': 'ellipsis',
        display: v === 'none' ? 'block' : '-webkit-box',
        '-webkit-line-clamp': v === 'none' ? 'unset' : v,
        '-webkit-box-orient': v === 'none' ? 'horizontal' : 'vertical',
      }),
    ],
  ],
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
