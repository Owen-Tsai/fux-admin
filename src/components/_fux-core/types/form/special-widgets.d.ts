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

export type SpecialWidgetPropsMap = {
  attachmentTable: WPropsAttachmentTable
}
