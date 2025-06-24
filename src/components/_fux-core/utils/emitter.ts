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
}
