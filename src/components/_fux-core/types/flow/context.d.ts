import type { FlowSchema, TaskNode } from './task-node'

export interface FuxFlowBuilderCtx {
  flowSchema: Ref<FlowSchema>
  selectedNode: Ref<TaskNode | undefined>
  deleteNode: (uid: string) => void
}
