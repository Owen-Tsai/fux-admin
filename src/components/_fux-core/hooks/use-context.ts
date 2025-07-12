import { deleteWidgetByUid, copyWidget as duplicate } from '../utils/widget'
import type {
  AppSchema,
  Widget,
  FlowSchema,
  TaskNode,
  FuxDesignerCtx,
  FuxRendererCtx,
  FuxFlowBuilderCtx,
} from '@fusionx/core/types'

const FUX_KEY_DESIGNER = Symbol('fux-designer')
const FUX_KEY_RENDERER = Symbol('fux-renderer')
const FUX_KEY_FLOW_BUILDER = Symbol('fux-workflow-builder')
const FUX_KEY_NESTED_MODEL = Symbol('fux-nested-model')

export const useDesignerCtxProvide = (appSchema: Ref<AppSchema>) => {
  const selectedWidget = ref<Widget | undefined>()
  const formData = ref<Record<string, any>>({})

  const deleteWidget = (uid: string) => {
    deleteWidgetByUid(appSchema.value.form.widgets, uid)
    // 删除的一定是当前选中的组件
    selectedWidget.value = undefined
  }

  const copyWidget = (
    widget: Widget,
    options?: {
      siblings: Widget[]
      index?: number
    },
  ) => {
    duplicate(widget, appSchema.value.form.widgets)
  }

  provide<FuxDesignerCtx>(FUX_KEY_DESIGNER, {
    appSchema,
    deleteWidget,
    copyWidget,
    selectedWidget,
    formData,
  })
}

export const useDesignerCtxInject = () => {
  return inject<FuxDesignerCtx | null>(FUX_KEY_DESIGNER, null)
}

export const useRendererCtxProvide = (ctx: FuxRendererCtx) => {
  provideLocal<FuxRendererCtx>(FUX_KEY_RENDERER, ctx)
}

export const useRendererCtxInject = () => {
  return injectLocal<FuxRendererCtx | null>(FUX_KEY_RENDERER, null)
}

export const useFlowBuilderCtxProvide = (appFlowSchema: Ref<FlowSchema>) => {
  const selectedNode = ref<TaskNode | undefined>()

  const deleteNode = (uid: string) => {
    const idx = appFlowSchema.value.nodes.findIndex((e) => e.uid === uid)
    if (idx > -1) {
      appFlowSchema.value.nodes.splice(idx, 1)
    }
  }

  provide<FuxFlowBuilderCtx>(FUX_KEY_FLOW_BUILDER, {
    flowSchema: appFlowSchema,
    selectedNode,
    deleteNode,
  })

  return {
    selectedNode,
  }
}

export const useFlowBuilderCtxInject = () => {
  return inject<FuxFlowBuilderCtx | null>(FUX_KEY_FLOW_BUILDER, null)
}

export const useFuxNestedModelCtxProvide = (model: Ref<Record<string, any>>) => {
  provide(FUX_KEY_NESTED_MODEL, {
    model,
  })
}

export const useFuxNestedModelCtxInject = () => {
  return inject<{ model: Ref<Record<string, any>> } | null>(FUX_KEY_NESTED_MODEL, null)
}
