import { useRendererCtxInject } from '@fusionx/core/hooks'
import { merge } from 'lodash-es'
import { emitter, eventKeys } from '@fusionx/core/utils'

/**
 * 返回表单渲染器 formRenderer 实例的方法供外部调用
 * 包括保存数据、设置表单的值、改变组件的属性等
 */
const useRendererInstance = () => {
  const { appSchema, $state, formData } = useRendererCtxInject()!

  /**
   * 获取表单数据。
   * 当需要对表单数据进行处理时可以调用此方法
   */
  const getFormData = () => {
    return formData.value
  }

  /**
   * 设置表单数据。
   */
  const setFormData = (partialData: Record<string, any>) => {
    merge(formData.value, partialData)
  }

  /**
   * 清空表单数据。
   */
  const clearFormData = () => {
    formData.value = {}
  }

  /**
   * 获取表单的 schema。
   */
  const getAppSchema = () => {
    return appSchema.value
  }

  /**
   * 隐藏组件。
   * @param nameOrUid 组件的 name 或 uid
   */
  const hide = (nameOrUid: string) => {
    emitter.emit(eventKeys.WIDGET_HIDE, nameOrUid)
  }

  /**
   * 显示组件。
   * @param nameOrUid 组件的 name 或 uid
   */
  const show = (nameOrUid: string) => {
    emitter.emit(eventKeys.WIDGET_SHOW, nameOrUid)
  }

  /**
   * 针对组件的 Props 进行更新。更新采用深度递归合并的方式。
   * @param nameOrUid 组件的 name 或 uid
   * @param newProps 新的 Props
   */
  const setWidgetProps = (nameOrUid: string, newProps: Record<string, any>) => {
    emitter.emit(eventKeys.WIDGET_PROP_CHANGE, { nameOrUid, newProps })
  }

  /**
   * 针对 select, radio 和 checkbox 组件的选项进行更新。
   * @param nameOrUid 组件的 name 或 uid
   * @param newOptions 新的选项
   */
  const setWidgetOptions = (nameOrUid: string, newOptions: Record<string, any>) => {
    setWidgetProps(nameOrUid, { options: newOptions })
  }

  /**
   * 更新渲染器实例附加的状态
   */
  const setState = (data: Record<string, any>) => {
    merge($state.value, data)
  }

  const findPaginatedWidget = () => {
    if (!appSchema.value?.info.paginated) return null
    return appSchema.value.form.widgets.find(
      (widget) =>
        (widget.type === 'tabs' && widget.props.stepsMode === true) || widget.type === 'steps',
    )
  }

  const setPaginatedWidgetDisabled = (disabled: boolean) => {
    const paginatedWidget = findPaginatedWidget()
    if (paginatedWidget) {
      setWidgetProps(paginatedWidget.uid, { disabled })
    }
  }

  const showStep = (nameOrUid: string, index: number) => {
    emitter.emit(eventKeys.WIDGET_PAGE_SHOW, { nameOrUid, index })
  }

  const hideStep = (nameOrUid: string, index: number) => {
    emitter.emit(eventKeys.WIDGET_PAGE_HIDE, { nameOrUid, index })
  }

  return {
    clearFormData,
    getAppSchema,
    getFormData,
    setFormData,
    hide,
    show,
    setState,
    setWidgetOptions,
    setWidgetProps,
    setPaginatedWidgetDisabled,
    showStep,
    hideStep,
  }
}

export default useRendererInstance
