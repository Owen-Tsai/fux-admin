import { createHighlighterCore } from 'shiki'
import vitesseLight from '@shikijs/themes/vitesse-light'
import vitesseDark from '@shikijs/themes/vitesse-dark'
import { createJavaScriptRegexEngine } from 'shiki/engine/javascript'
import useAppStore from '@/stores/app'

const jsEngine = createJavaScriptRegexEngine()

const highlighterPromise = createHighlighterCore({
  themes: [vitesseLight, vitesseDark],
  langs: [
    import('@shikijs/langs/json'),
    import('@shikijs/langs/typescript'),
    import('@shikijs/langs/java'),
    import('@shikijs/langs/vue'),
    import('@shikijs/langs/sql'),
    import('@shikijs/langs/xml'),
  ],
  engine: jsEngine,
})

const highlightCode = async (code: string, lang: string) => {
  const { isDark } = storeToRefs(useAppStore())

  const highlighter = await highlighterPromise
  return highlighter.codeToHtml(code, {
    lang,
    theme: isDark.value ? 'vitesse-dark' : 'vitesse-light',
  })
}

export default highlightCode
