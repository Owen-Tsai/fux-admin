export interface FormProps {
  colon?: boolean
  disabled?: boolean
  labelAlign?: 'left' | 'right' | 'top'
  /**
   * @deprecated
   */
  labelCol?: string
  labelWidth?: string
  /**
   * @deprecated
   */
  wrapperCol?: string
  /**
   * @deprecated
   */
  wrapperWidth?: string
  /**
   * @deprecated
   */
  layout?: 'horizontal' | 'vertical' | 'inline'
  readonly?: boolean
  requiredMark?: 'left' | 'right' | false
}

export interface APIConfig {
  name: string
  dataIndex: string
  url: string
  method: 'get' | 'post' | 'delete' | 'put'
  params?: string
}

export interface FunctionConfig {
  name: string
  body?: string
}

export type LifecyclePhase = 'loaded' | 'beforeSubmit'
