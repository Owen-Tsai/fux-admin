import { safeEval } from '@fusionx/core/utils'
import { useRendererCtxInject, useEvalContext } from '.'

export const useEventHandlers = (eventMap?: Record<string, string>) => {
  const ctx = useRendererCtxInject()
  if (!ctx) {
    return
  }

  const { appSchema } = ctx
  const evalContext = useEvalContext()

  const handler = (event: string) => {
    if (!eventMap) return
    // find the designated function and execute it in a safe environment
    const id = eventMap[event]
    const funcConfig = appSchema.value.form.function?.[id]

    if (funcConfig) {
      if (funcConfig.body) {
        safeEval(funcConfig.body, evalContext)
      }
    }
  }

  return handler
}
