import type { FormProps } from './misc'
import type { Widget } from './widget'

interface FieldProps {
  label?: string
  name?: string
}

interface WPropsCommon {
  hide?: boolean
  field: FieldProps
}

export interface WPropsGridCol {
  span?: number
  widgets: Widget[]
}

export interface WPropsGrid extends WPropsCommon {
  align?: 'start' | 'end' | 'center' | 'stretch' | 'baseline' | 'top' | 'middle' | 'bottom'
  gutter?: number
  justify?: 'start' | 'end' | 'center' | 'space-between' | 'space-around'
  children: WPropsGridCol[]
}

export interface WPropsTabsPane {
  title?: string
  widgets: Widget[]
}

export interface WPropsTabs extends WPropsCommon {
  centered?: boolean
  /**
   * `middle` is the same as `medium` now
   */
  size?: 'large' | 'middle' | 'small' | 'medium'
  /**
   * `line` is the same as `normal` now
   */
  type?: 'line' | 'card' | 'normal'
  stepsMode?: boolean
  state: {
    current: number
  }
  children: WPropsTabsPane[]
}

export interface WPropsStep {
  title?: string
  desc?: string
  widgets: Widget[]
}

export interface WPropsSteps extends WPropsCommon {
  /**
   * @deprecated
   */
  size?: 'default' | 'small'
  type?: 'default' | 'dot'
  children: WPropsStep[]
  state: {
    current?: number
  }
}

export interface WPropsSubForm extends WPropsCommon {
  max?: number
  min?: number
  children: Widget[]
}

export type WPropsTableColumn = {
  align?: 'left' | 'right' | 'center'
  title?: string
  width?: number | string
  /**
   * @deprecated use `colKey` instead
   */
  key?: string
  formatter: {
    type: 'dict' | 'custom' | 'image' | ''
    value: string
  }
  /**
   * @deprecated use `colKey` instead
   */
  dataIndex?: string
  colKey?: string
}

export type WPropsTablePagination = {
  pageSize?: number
  disabled?: boolean
  small?: boolean // size=small
  lite?: boolean // theme=simple
}

export interface WPropsDataTable extends WPropsCommon {
  columns?: WPropsTableColumn[]
  pagination: WPropsTablePagination
  dialogWidth?: string
  /**
   * @deprecated use `dialogWidth` instead
   */
  formWidth?: string
  form: Omit<FormProps, 'disabled'>
  widgets: Widget[]
  state: {
    mode: 'table' | 'form'
  }
  url?: string
  min?: number
  max?: number
}

export interface LayoutWidgetPropsMap {
  grid: WPropsGrid
  tabs: WPropsTabs
  steps: WPropsSteps
  subForm: WPropsSubForm
  dataTable: WPropsDataTable
}
