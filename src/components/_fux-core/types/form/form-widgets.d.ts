import type { TdCheckboxGroupProps, TdRadioGroupProps, FormRule } from 'tdesign-vue-next'

interface FieldProps {
  label?: string
  extra?: string
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
  name?: string
  required?: boolean
  validation?: Record<string, FormRule>
  rules?: string
  validateTrigger?: string[]
}

export type OptionSourceEnum = 'static' | 'dict' | 'expression'

export type OptionOf<T, OST = OptionSourceEnum> = OST extends 'static'
  ? { type?: 'static'; value?: T }
  : { type?: 'expression' | 'dict'; value?: string }

export type JsonOption = {
  type?: 'static' | 'expression'
  value?: string
}

/**
 * 用于输入框的前后缀（prefix/suffix）
 */
export type AddonProps = {
  type: 'icon' | 'text'
  value?: string
}

/**
 * 表单组件通用配置项
 */
interface WPropsCommon {
  disabled?: boolean
  readonly?: boolean
  hide?: boolean
  required?: boolean
  field: FieldProps
  event?: Record<string, string>
}

/**
 * @see https://tdesign.tencent.com/vue-next/components/input?tab=api
 */
export interface WPropsInput extends WPropsCommon {
  allowClear?: boolean
  align?: 'left' | 'center' | 'right'
  defaultValue?: string
  maxlength?: number
  placeholder?: string
  showCount?: boolean
  tips?: string
  prefixIcon?: string
  prefixText?: string
  suffixText?: string
}

/**
 * @see https://tdesign.tencent.com/vue-next/components/input-number?tab=api
 */
export interface WPropsInputNumber extends WPropsCommon {
  allowClear?: boolean
  align?: 'left' | 'center' | 'right'
  /**
   * `theme`
   * @deprecated use `controlsLayout` instead
   */
  controls?: boolean
  controlsLayout?: 'row' | 'column' | 'normal'
  defaultValue?: string
  max?: number
  min?: number
  placeholder?: string
  prefixText?: string
  suffixText?: string
  precision?: number
  step?: number
  tips?: string
}

/**
 * @see https://tdesign.tencent.com/vue-next/components/textarea?tab=api
 */
export interface WPropsTextarea extends WPropsCommon {
  allowClear?: boolean
  defaultValue?: string
  autoResize?: boolean
  showCount?: boolean
  maxlength?: number
  placeholder?: string
  minRows?: number
  maxRows?: number
  /**
   * @deprecated use `minRows` to achieve the same effect
   */
  rows?: number
}

/**
 * @see https://tdesign.tencent.com/vue-next/components/select?tab=api
 */
export interface WPropsSelect extends WPropsCommon {
  allowClear?: boolean
  defaultValue?: string | string[]
  fieldNames?: string
  multiple?: boolean
  max?: number
  minCollapsedNum?: number
  valueType?: 'value' | 'object'
  formatter?: string
  placeholder?: string
  tips?: string
  filterable?: boolean
  filter?: string
  creatable?: boolean
  options: OptionOf<TdSelectProps['options']>
  popupHeight?: string
}

export interface WPropsCascader extends WPropsCommon {
  allowClear?: boolean
  defaultValue?: string | srting[]
  fieldNames?: string
  filterable?: boolean
  filter?: string
  placeholder?: string
  tips?: string
  multiple?: boolean
  max?: number
  minCollapsedNum?: number
  showAllLevels?: boolean
  valueMode?: 'onlyLeaf' | 'parentFirst' | 'all'
  valueType?: 'single' | 'full'
  formatter?: string
  lazy?: boolean
  checkStrictly?: boolean
  options: JsonOption
}

export interface WPropsRadio extends WPropsCommon {
  defaultValue?: string
  options: OptionOf<TdRadioGroupProps['options']>
  /**
   * @deprecated use `variant` instead
   */
  type?: 'button' | 'default' | 'solid-button'
  variant?: 'radio' | 'outline' | 'default-filled' | 'primary-filled'
  allowUncheck?: boolean
}

export interface WPropsCheckbox extends WPropsCommon {
  defaultValue?: string[]
  options: OptionOf<TdCheckboxGroupProps['options']>
  max?: number
}

export interface WPropsTreeSelect extends WPropsCommon {
  allowClear?: boolean
  defaultValue?: string | string[]
  fieldNames?: string
  options: JsonOption
  filterable?: boolean
  placeholder?: string
  tips?: string
  multiple?: boolean
  max?: number
  minCollapsedNum?: number
  valueType?: 'value' | 'object'
  valueMode?: 'onlyLeaf' | 'parentFirst' | 'all'
  formatter?: string
  lazy?: boolean
  checkStrictly?: boolean
}

export interface WPropsSlider extends WPropsCommon {
  defaultValue?: number | [number, number]
  max?: number
  min?: number
  range?: boolean
  /**
   * showStep
   */
  dots?: boolean
  step?: number
  marks?: string
}

export interface WPropsRate extends WPropsCommon {
  allowClear?: boolean
  allowHalf?: boolean
  defaultValue?: number
  count?: number
  color?: string
  icon?: string
  texts?: string
}

export interface WPropsSwitch extends WPropsCommon {
  defaultValue?: boolean
  customValue?: string
  /**
   * @deprecated use `customValue` instead
   */
  checkedValue?: string
  /**
   * @deprecated use `customValue` instead
   */
  unCheckedValue?: string
}

interface WPropsDatePickerCommon extends WPropsCommon {
  allowInput?: boolean
  allowClear?: boolean
  disableDate?: string[]
  enableTimePicker?: string
  format?: string
  mode?: 'year' | 'quarter' | 'month' | 'week' | 'date'
  presets?: string
  presetsPlacement?: 'left' | 'top' | 'bottom' | 'right'
  tips?: string
  valueType?:
    | 'time-stamp'
    | 'Date'
    | 'YYYY'
    | 'YYYY-MM'
    | 'YYYY-MM-DD'
    | 'YYYY-MM-DD HH'
    | 'YYYY-MM-DD HH:mm'
    | 'YYYY-MM-DD HH:mm:ss'
    | 'YYYY-MM-DD HH:mm:ss:SSS'
  displayFormat?:
    | 'time-stamp'
    | 'Date'
    | 'YYYY'
    | 'YYYY-MM'
    | 'YYYY-MM-DD'
    | 'YYYY-MM-DD HH'
    | 'YYYY-MM-DD HH:mm'
    | 'YYYY-MM-DD HH:mm:ss'
    | 'YYYY-MM-DD HH:mm:ss:SSS'
}

export interface WPropsDatePicker extends WPropsDatePickerCommon {
  multiple?: boolean
  defaultValue?: string | string[]
  placeholder?: string
}

export interface WPropsDateRangePicker extends WPropsDatePickerCommon {
  defaultValue?: string[]
  placeholder?: string
}

export interface WPropsUpload extends WPropsCommon {
  action?: string
  accept?: string
  /**
   * @deprecated use `theme` instead
   */
  type?: 'image' | 'image-flow' | 'file' | 'file-flow' | 'id-card'
  theme?: 'file-input' | 'file' | 'image' | 'file-flow' | 'image-flow'
  multiple?: boolean
  storage?: number
  max?: number
  /**
   * @deprecated use `max` instead
   */
  limit?: number
  sizeLimit?: number
}

export interface FormWidgetPropsMap {
  input: WPropsInput
  textarea: WPropsTextarea
  inputNumber: WPropsInputNumber
  select: WPropsSelect
  cascader: WPropsCascader
  radio: WPropsRadio
  checkbox: WPropsCheckbox
  treeSelect: WPropsTreeSelect
  slider: WPropsSlider
  rate: WPropsRate
  switch: WPropsSwitch
  datePicker: WPropsDatePicker
  dateRangePicker: WPropsDateRangePicker
  upload: WPropsUpload
}
