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
      if (!formData) return widget.type === 'dateRangePicker' ? [] : undefined
      return get(formData, key)
    },
    set: (val) => {
      if (!formData) return
      set(formData, key, val)
    },
  })

  if ((widget.props as any).defaultValue) {
    model.value = (widget.props as any).defaultValue
  }

  return model
}
