import {
  getAppDesignSchema,
  createAppSchema,
  getProcessXML,
  updateProcessXML,
  type AppSchemaVO,
  addMenuById,
  updateMenuById,
} from '@/api/fux-core'
import { getApplicationDetail, type AppVO } from '@/api/app/app'
import defaultSchema from './default-schema'
import { compact, flattenDeep, merge } from 'lodash-es'
import dayjs from 'dayjs'
import type { AppSchema, TaskNode } from '@fusionx/core/types'

const APP_DESIGN_CTX_KEY = Symbol('app-design-ctx')

type AppDesignCtx = {
  appEditMode: Ref<'create' | 'update' | null>
  appSchema: Ref<AppSchema>
  appVersion: Ref<string | undefined>
}

export const useAppLoad = () => {
  const { params } = useRoute()
  const appSchemaDetail = ref<AppSchemaVO>({})
  const appSchema = ref<AppSchema>({ ...defaultSchema })
  const appDesignMode = ref<'create' | 'update'>('create')

  const message = useMessage()

  const loading = ref(true)

  const { data: appDetail, pending: isAppDetailLoading } = useRequest(
    () => getApplicationDetail(params.appId as string),
    { immediate: true },
  )

  const loadAppSchemaDetail = async () => {
    loading.value = true
    try {
      if (!params.appId) {
        throw new Error('应用信息获取失败，默认 Schema 已加载')
      }
      const data = await getAppDesignSchema(params.appId as string)
      if (data === null || !data.appSchema) {
        appSchema.value = defaultSchema
      } else {
        appSchemaDetail.value = data
        appDesignMode.value = 'update'
        appSchema.value = JSON.parse(data.appSchema)
      }
    } catch (e) {
      appSchema.value = defaultSchema
      message.warning((e as Error).message)
    } finally {
      loading.value = false
    }
  }

  loadAppSchemaDetail()

  provide<AppDesignCtx>(APP_DESIGN_CTX_KEY, {
    appEditMode: appDesignMode,
    appSchema,
    appVersion: computed(() => appSchemaDetail.value?.version),
  })

  return {
    appSchema,
    appSchemaDetail,
    appDesignMode,
    appDetail,
    isAppDetailLoading,
    isAppSchemaLoading: loading,
  }
}

export const useAppSave = (
  appSchema: Ref<AppSchema>,
  vo: Ref<AppSchemaVO>,
  appDetail: Ref<AppVO | undefined>,
) => {
  const loading = ref(false)
  const dialog = useDialog()
  const message = useMessage()
  const { params } = useRoute()

  const resetTabsState = () => {
    appSchema.value.form.widgets.forEach((widget) => {
      if (widget.type === 'tabs' || widget.type === 'steps') {
        widget.props.state.current = 0
      }
    })
  }

  const validateNodes = (nodes: TaskNode[]): boolean => {
    nodes.forEach((node) => {
      if (node.type === 'condition') {
        if (!node.props.condition) {
          message.error(node.name + '：没有设置任务节点的条件')
          return false
        }
      }
      if (node.type === 'audit') {
        if (!node.props.actor.value) {
          message.error(node.name + '：没有设置任务节点的审核人')
          return false
        }
      }
      if (node.type === 'group') {
        node.props.children.forEach((branch) => {
          if (!validateNodes(branch)) {
            return false
          }
        })
      }
    })

    return true
  }

  const generateWorkflowXML = async () => {
    if (!appDetail.value) return
    loading.value = true
    try {
      const xml = await getProcessXML({
        id: params.appId as string,
        name: appDetail.value.name || 'unnamed',
        data: appSchema.value.flow.nodes,
      })

      await updateProcessXML({
        id: appDetail.value.processIds!,
        name: appDetail.value.name || 'unnamed',
        bpmnXml: xml.data,
        category: appDetail.value.type || 'unknown',
      })
    } catch (e) {
      throw new Error(e as any)
    } finally {
      loading.value = false
    }
  }

  const generateSchema = async () => {
    const id = await createAppSchema(vo.value)
    return id
  }

  const generateAuditMenu = async (id: string, mode: 'create' | 'update' = 'update') => {
    const getTasks = (nodes: TaskNode[] = appSchema.value.flow.nodes): TaskNode[] => {
      const ret: TaskNode[] = []

      nodes.forEach((node) => {
        if (node.type === 'audit' && node.props.actor.strategy !== 30) {
          ret.push(node)
        }
        if (node.type === 'group') {
          const sub = node.props.children.map((branch) => getTasks(branch))
          ret.push(...flattenDeep(sub))
        }
      })

      return ret
    }

    const menuItems = compact(getTasks())

    if (mode === 'create') {
      await addMenuById(id, menuItems)
    } else {
      await updateMenuById(id, menuItems)
    }
  }

  const save = async (mode: 'create' | 'update') => {
    loading.value = true
    // validate nodes
    const result = validateNodes(appSchema.value.flow.nodes)

    if (!result) return

    resetTabsState()

    merge(vo.value, {
      appSchema: JSON.stringify(appSchema.value),
      name: `${params.appId}-${dayjs().format('YYYYMMDDHHmmss')}`,
      appId: params.appId as string,
      conf: '{}',
    })

    const confirmText =
      mode === 'create'
        ? '是否保存当前应用？'
        : '你正在编辑已保存的应用，保存后，应用将迭代至新版本，所有处于审核流程中的业务不会受到此次编辑的影响。如需强制使此次修改对正在办理中的业务生效，请先将正在办理中的业务退回至发起人处再保存。'

    dialog.confirm({
      header: '保存应用',
      body: confirmText,
      onConfirm: async () => {
        loading.value = true
        try {
          loading.value = true
          await generateWorkflowXML()
          const id = await generateSchema()
          await generateAuditMenu(id, mode)
          loading.value = false
          message.success('保存成功')
        } catch (e) {
          console.error(e)
        }
      },
    })
  }

  return {
    save,
  }
}

export const useAppDesignCtxInject = () => {
  return inject<AppDesignCtx>(APP_DESIGN_CTX_KEY)
}
