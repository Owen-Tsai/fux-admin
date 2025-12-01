interface FieldProps {
  label?: string
  name?: string
}

interface WPropsCommon {
  hide?: boolean
  field: FieldProps
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export interface WPropsAttachmentTable extends WPropsCommon {}

export interface WPropsDivider extends WPropsCommon {
  title?: string
  subtitle?: string
  align?: 'left' | 'center' | 'right'
}

export type SpecialWidgetPropsMap = {
  attachmentTable: WPropsAttachmentTable
  divider: WPropsDivider
}
