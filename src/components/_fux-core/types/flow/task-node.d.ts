export interface FieldControlOverride {
  name?: string
  config?: 'shown' | 'hidden' | 'readonly' | 'writable'
}

export interface NPropsAudit {
  actor: {
    strategy?: number | string
    value?: (number | string)[]
    text?: string
  }
  /**
   * @deprecated use `fieldsOverride` instead
   */
  fields?: Array<FieldControlOverride>
  fieldsOverride: Array<FieldControlOverride>
  /**
   * 是否为会签
   */
  joint?: boolean
}

export type NPropsStart = {
  [x: string]: any
}

export type NPropsCondition = {
  // for now we use string (UEL, unified expression language)
  // this should be replaced by a UEL (de)serializer for better UX
  condition?: string
}

export type NPropsConditionalGroup = {
  children: Array<TaskNode[]>
}

export type TaskNodePropsMap = {
  audit: NPropsAudit
  start: NPropsStart
  condition: NPropsCondition
  group: NPropsConditionalGroup
}

type ConfigOf<T extends keyof TaskNodePropsMap> = {
  uid: string
  name: string
  type: T
  props: TaskNodePropsMap[T]
}

export type TaskNodeConfigMap = {
  [x in keyof TaskNodePropsMap]: ConfigOf<x>
}

export type TaskNode = TaskNodeConfigMap[keyof TaskNodeConfigMap]

export interface FlowSchema {
  nodes: TaskNode[]
}
