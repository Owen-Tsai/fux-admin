import { emitter } from '@fusionx/utils'
import { mergeWith, isArray } from 'lodash-es'
import type { Widget } from '@/types/fux-core/form'

const useWidgetSignals = (widgetConfig: WritableComputedRef<Widget>) => {
  const visible = ref(true)
  const renderKey = ref(0)

  emitter.on('widget:show', (name) => {
    if (name === widgetConfig.value.uid || name === widgetConfig.value.props.field?.name) {
      visible.value = true
    }
  })

  emitter.on('widget:hide', (name) => {
    if (name === widgetConfig.value.uid || name === widgetConfig.value.props.field?.name) {
      visible.value = false
    }
  })

  emitter.on('widget:attrs', (evt) => {
    const { name, attrs } = evt as { name: string; attrs: Record<string, any> }
    if (name === widgetConfig.value.uid || name === widgetConfig.value.props.field?.name) {
      widgetConfig.value = mergeWith({ ...widgetConfig.value }, attrs, (objValue, newValue) => {
        if (isArray(objValue) && newValue) {
          return newValue
        }
      })

      renderKey.value++
    }
  })

  return {
    visible,
    renderKey,
  }
}

export default useWidgetSignals
