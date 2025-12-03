interface FieldProps {
  label?: string
  name?: string
}

interface WPropsCommon {
  hide?: boolean
  field: FieldProps
}

export interface WPropsAttachmentTable extends WPropsCommon {
  hasButton?: boolean
  action?: string
  buttonLabel?: string
}

export interface WPropsDivider extends WPropsCommon {
  title?: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
}

export type SpecialWidgetPropsMap = {
  attachmentTable: WPropsAttachmentTable
  divider: WPropsDivider
}
