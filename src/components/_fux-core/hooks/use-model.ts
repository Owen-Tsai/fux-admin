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
      const ret = get(formData?.value, key)
      if (!formData || !formData.value || ret === undefined || ret === null) {
        return widget.type === 'dateRangePicker' || widget.type === 'checkbox' ? [] : undefined
      }
      return ret
    },
    set: (val) => {
      if (!formData?.value) return
      set(formData.value, key, val)
    },
  })

  return model
}
