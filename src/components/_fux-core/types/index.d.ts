import type { FormSchema } from './form'
import type { FlowSchema } from './flow'

export * from './form'
export * from './flow'

export interface AppSchemaGenerationInfo {
  paginated?: false | 'steps' | 'tabs'
  tables: Array<{
    name: string
    comment?: string
    /**
     * @deprecated use `isSubTable` instead
     */
    subTable?: boolean
    isSubTable?: boolean
    id: number | string
  }>
  gridColumns?: false | 2 | 3
  viewModePaginated?: boolean
}
export interface AppSchema {
  version: string
  form: FormSchema
  flow: FlowSchema
  info: AppSchemaGenerationInfo
}
