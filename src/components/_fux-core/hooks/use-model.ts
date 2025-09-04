import { useRendererCtxInject, useFuxNestedModelCtxInject } from './use-context'
import { get, set } from 'lodash-es'
import type { FormWidget } from '../types'

export const useModel = (widget: FormWidget) => {
  const nestedModelCtx = useFuxNestedModelCtxInject()
  const ctx = useRendererCtxInject()
  const key = widget?.props.field.name || widget.uid
  const formData = nestedModelCtx ? nestedModelCtx.model : ctx?.formData

  const model = computed({
    get: () => {
      if (!formData?.value) return widget.type === 'dateRangePicker' ? [] : undefined
      return get(formData.value, key)
    },
    set: (val) => {
      if (!formData?.value) return
      set(formData.value, key, val)
    },
  })

  if ((widget.props as any).defaultValue) {
    model.value = (widget.props as any).defaultValue
  }

  return model
}
