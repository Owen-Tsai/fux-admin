import { useRendererCtxInject } from '@fusionx/core/hooks'
import { emitter, LifecyclePhases, safeEval } from '@fusionx/core/utils'
import { useInstanceMethods, useLimitedRequest } from '.'

export const useLifecycles = () => {
  const { appSchema, mode, formData, $state } = useRendererCtxInject()!

  if (mode === 'dev' || mode === 'preview') return

  if (!appSchema.value.form.lifecycle) return
  const { lifecycle, function: functions } = appSchema.value.form

  const $message = useMessage()
  const $dialog = useDialog()
  const $request = useLimitedRequest()

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

  if (lifecycle.loaded) {
    const func = functions?.[lifecycle.loaded]
    if (!func) return
    emitter.on(LifecyclePhases.LOADED, () => safeEval(func.body!, evalContext))
  }

  if (lifecycle.beforeSubmit) {
    const func = functions?.[lifecycle.beforeSubmit]
    if (!func) return
    emitter.on(LifecyclePhases.BEFORE_SUBMIT, () => safeEval(func.body!, evalContext))
  }
}
