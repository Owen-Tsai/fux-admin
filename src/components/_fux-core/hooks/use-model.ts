import { useRendererCtxInject, useFuxNestedModelCtxInject } from './use-context'
import { get, set } from 'lodash-es'
import { emitter, eventKeys, parseExpression } from '@fusionx/core/utils'
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

  const setDefaultValue = () => {
    const defaultVal: string = (widget.props as any).defaultValue
    // 0. if the user or the system has already modified the value,
    // do nothing and retuen
    if (formData?.value && get(formData.value, key) !== undefined) {
      return
    }
    if (defaultVal) {
      model.value = parseExpression(defaultVal, ctx?.$state.value || {})
    }
  }

  emitter.on(eventKeys.FORM_$STATE_CHANGE, setDefaultValue)

  setDefaultValue()

  return model
}
