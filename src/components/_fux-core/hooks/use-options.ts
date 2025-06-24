import type { SelectProps, CheckboxGroupProps, RadioGroupProps } from 'tdesign-vue-next'
import type { WidgetMap } from '@fusionx/core/types'
import type { DictDataEntry } from '@/api/system/dict/data'
import { tryParse, eventKeys, emitter } from '@fusionx/core/utils'
import { useRendererCtxInject } from './use-context'

type OptionType<T> = T extends WidgetMap['select']
  ? SelectProps['options']
  : T extends WidgetMap['checkbox']
    ? CheckboxGroupProps['options']
    : T extends WidgetMap['radio']
      ? RadioGroupProps['options']
      : never

export const useRecordOptions = <
  T extends WidgetMap['select'] | WidgetMap['checkbox'] | WidgetMap['radio'],
>(
  widget: T,
) => {
  const optionsProp = widget.props.options
  // the final value that should be assigned to the `options` prop of the widget
  const options = ref<OptionType<T> | []>([])
  // the dict data made reactive to respond to the change of the optionsProp
  const dictData = ref<Ref<DictDataEntry[]>>()

  const ctx = useRendererCtxInject()

  if (optionsProp?.type === 'static') {
    if (typeof optionsProp.value === 'string') {
      options.value = tryParse(optionsProp.value, [])
    } else {
      options.value = optionsProp.value || []
    }
  } else if (optionsProp?.type === 'dict') {
    if (optionsProp.value && ctx && ctx.mode !== 'dev') {
      dictData.value = useDict(optionsProp.value)[0]
    }
  } else if (optionsProp?.type === 'expression') {
    if (optionsProp.value && ctx && ctx.mode !== 'dev') {
      options.value = ctx.$state.value[optionsProp.value]
    }
  }

  watch(
    dictData,
    (val) => {
      if (optionsProp?.type === 'dict' && val) {
        nextTick(() => {
          options.value = val.value
        })
      }
    },
    { immediate: true, deep: true },
  )

  emitter.on(eventKeys.FORM_$STATE_CHANGE, () => {
    if (optionsProp?.type === 'expression' && optionsProp.value && ctx && ctx.mode !== 'dev') {
      options.value = ctx.$state.value[optionsProp.value]
    }
  })

  return options
}
