import { useRendererCtxInject, useInstanceMethods, useLimitedRequest } from '.'

export const useEvalContext = () => {
  const ctx = useRendererCtxInject()
  if (!ctx) {
    return
  }

  const $message = useMessage()
  const $dialog = useDialog()
  const $request = useLimitedRequest()

  const { $state, appSchema, formData, mode } = ctx

  return {
    $func: useInstanceMethods(),
    $values: formData.value,
    $schema: appSchema.value,
    $state: $state.value,
    $mode: mode,
    $apiPrefix: '',
    $request,
    $message,
    $dialog,
  }
}
