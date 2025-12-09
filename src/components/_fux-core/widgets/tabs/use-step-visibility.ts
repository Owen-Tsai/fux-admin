import { emitter, eventKeys } from '@fusionx/core/utils'
import type { WidgetMap } from '@fusionx/core/types'

const useStepVisibility = (
  widget: WidgetMap['tabs'] | WidgetMap['steps'],
  current: Ref<number>,
) => {
  const visible = ref<boolean[]>([])

  emitter.on(eventKeys.WIDGET_PAGE_SHOW, (event: any) => {
    const { nameOrUid, index } = event

    if (nameOrUid === widget.uid || nameOrUid === widget.props.field.name) {
      // 显示分页控件的分页
      visible.value[index] = true
    }
  })

  emitter.on(eventKeys.WIDGET_PAGE_HIDE, (event: any) => {
    const { nameOrUid, index } = event

    if (nameOrUid === widget.uid || nameOrUid === widget.props.field.name) {
      // 隐藏分页控件的分页
      visible.value[index] = false
    }
    if (index === current.value) {
      // 如果当前分页被隐藏了，那么就切换到第一个可见的分页
      current.value = visible.value.findIndex((v) => v) || 0
    }
  })

  return {
    visible,
  }
}

export default useStepVisibility
