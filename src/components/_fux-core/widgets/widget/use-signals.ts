import { emitter } from '@fusionx/core/utils'
import { mergeWith, isArray } from 'lodash-es'
import type { Widget } from '@fusionx/core/types'
import type { ModelRef } from 'vue'

const useSignals = (widget: ModelRef<Widget>) => {
  const visible = ref(true)

  emitter.on('widget:hide', (nameOrUid) => {
    if (nameOrUid === widget.value.props.field.name || nameOrUid === widget.value.uid) {
      visible.value = false
    }
  })

  emitter.on('widget:show', (nameOrUid) => {
    if (nameOrUid === widget.value.props.field.name || nameOrUid === widget.value.uid) {
      visible.value = true
    }
  })

  emitter.on('widget:props', (evt: any) => {
    const { nameOrUid, newProps } = evt
    if (nameOrUid === widget.value.props.field.name || nameOrUid === widget.value.uid) {
      widget.value.props = mergeWith({ ...widget.value.props }, newProps, (objValue, newValue) => {
        if (isArray(objValue) && newValue) {
          return newValue
        }
      })
    }
  })

  return {
    visible,
  }
}

export default useSignals
