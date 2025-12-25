import type { Ref } from 'vue'
import type { Widget } from './widget'
import type { AppSchema, FieldInteractivity } from '..'

/**
 * States that must be provided by both designer and the renderer
 */
interface FuxCoreContext {
  formData: Ref<Record<string, any>>
  appSchema: Ref<AppSchema>
}

export interface FuxDesignerCtx extends FuxCoreContext {
  selectedWidget: Ref<Widget | undefined>
  deleteWidget: (uid: string) => void
  copyWidget: (widget: Widget) => void
}

export interface FuxRendererCtx extends FuxCoreContext {
  $state: Ref<Record<string, any>>
  mode: FuxRendererMode
  fieldsInteractivity: ComputedRef<FieldInteractivity[]>
}

export interface BusinessCtx {
  planId: Ref<string>
  appId: string
  applyId: Ref<string>
  taskKey?: string
}

/**
 * 渲染器工作模式。
 * dev - 编辑模式
 * prod - 表单填报模式
 * audit - 数据审核模式
 * preview - 编辑模式下的预览
 * archive - 归档模式（信息库或提交后用户查看，只读）
 */
export type FuxRendererMode = 'dev' | 'prod' | 'audit' | 'preview' | 'archive'
