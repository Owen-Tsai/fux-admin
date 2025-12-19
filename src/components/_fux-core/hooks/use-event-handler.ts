import { safeEval } from '@fusionx/core/utils'
import { useRendererCtxInject, useInstanceMethods, useLimitedRequest } from '.'

export const useEventHandlers = (eventMap?: Record<string, string>) => {
  const ctx = useRendererCtxInject()
  if (!ctx) {
    return
  }

  const $message = useMessage()
  const $dialog = useDialog()
  const $request = useLimitedRequest()

  const { $state, appSchema, formData, mode } = ctx

  const evalContext = {
    $func: useInstanceMethods(),
    $values: formData.value,
    $schema: appSchema.value,
    $state: $state.value,
    $mode: mode,
    $request,
    $message,
    $dialog,
  }

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
