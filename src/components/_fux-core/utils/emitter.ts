import mitt from 'mitt'

export const emitter = mitt()

export const eventKeys = {
  /**
   * 表单的 $state 状态变化。
   * 一般是接口数据源获得了响应，此时应当动态地修改部分组件的 options 属性。
   */
  FORM_$STATE_CHANGE: 'form:$state:change',
  /**
   * 表单准备就绪。
   * 一般是表单的初始化数据已经获取完毕。
   */
  FORM_READY: 'form:ready',
  /**
   * 隐藏控件
   */
  WIDGET_HIDE: 'widget:hide',
  /**
   * 显示控件
   */
  WIDGET_SHOW: 'widget:show',
  /**
   * 控件属性变化
   */
  WIDGET_PROP_CHANGE: 'widget:prop:change',
  /**
   * 显示分页控件的分页
   */
  WIDGET_PAGE_SHOW: 'widget:page:show',
  /**
   * 隐藏分页控件的分页
   */
  WIDGET_PAGE_HIDE: 'widget:page:hide',
}

export enum LifecyclePhases {
  LOADED = 'lifecycle:loaded',
  BEFORE_SUBMIT = 'lifecycle:beforeSubmit',
}
