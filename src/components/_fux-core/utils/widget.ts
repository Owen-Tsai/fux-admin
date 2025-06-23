import { cloneDeepWith, camelCase } from 'lodash-es'
import { generateId } from './id'
import type { FormSchema, Widget } from '@fusionx/core/types'

type SchemaTreeNode = {
  label: string
  name?: string
  key: string
  children?: SchemaTreeNode[]
}

/**
 * 返回树形展示的表单结构。注意，仅返回 AppSchema['form'] 下的`widgets`
 * @param formSchema AppSchema['form']
 */
export const schemaToTree = (formSchema: FormSchema): SchemaTreeNode[] => {
  const widgets = formSchema.widgets
  if (!widgets) return []

  const tree: SchemaTreeNode[] = []

  const visit = (ws: FormSchema['widgets'], branch: SchemaTreeNode[]) => {
    ws.forEach((w) => {
      const leaf: SchemaTreeNode = {
        label: w.props.field.label || w.name,
        key: w.uid,
        name: w.props.field.name,
      }

      if (w.class === 'layout') {
        leaf.children = []
        if (w.type === 'steps' || w.type === 'tabs' || w.type === 'grid') {
          if (w.props.children) {
            w.props.children.forEach((child) => {
              visit(child.widgets, leaf.children!)
            })
          }
        } else if (w.type === 'subForm') {
          visit(w.props.children, leaf.children)
        } else if (w.type === 'dataTable') {
          visit(w.props.widgets, leaf.children)
        }
      }

      branch.push(leaf)
    })
  }

  visit(formSchema.widgets, tree)

  return [
    {
      label: '组件树',
      name: '',
      key: 'root',
      children: tree,
    },
  ]
}

/**
 * 从 widgets 中递归地删除指定 uid 的元素
 * @param widgets Widget[]
 * @param uid 待删除的元素的 uid
 */
export const deleteWidgetByUid = (widgets: Widget[], uid: string) => {
  for (let i = 0; i < widgets.length; i++) {
    const w = widgets[i]
    if (w.uid === uid) {
      widgets.splice(i, 1)
      break
    }

    if (w.class === 'layout') {
      if (w.type === 'grid' || w.type === 'steps' || w.type === 'tabs') {
        if (w.props.children) {
          for (let j = 0; j < w.props.children.length; j++) {
            deleteWidgetByUid(w.props.children[j].widgets, uid)
          }
        }
      } else if (w.type === 'subForm') {
        deleteWidgetByUid(w.props.children, uid)
      } else {
        // dataTable
        deleteWidgetByUid(w.props.widgets, uid)
      }
    }
  }
}

/**
 * 复制组件，插入到 siblings
 * @param widgetToCopy 需要复制的组件
 * @param siblings 兄弟节点
 */
export const copyWidget = (widgetToCopy: Widget, siblings: Widget[]) => {
  const insertPos = siblings.findIndex((w) => w.uid === widgetToCopy.uid)
  const newWidgetSchema = cloneDeepWith(widgetToCopy, (value, key, widget) => {
    console.log(key, value)
    // generate a new uid
    if (key === 'uid') {
      return generateId()
    }
    if (key === 'children') {
      if (widget?.type === 'subForm') {
      }
      if (widget?.type === 'grid' || widget?.type === 'tabs' || widget?.type === 'steps') {
      }
      if (widget?.type === 'dataTable') {
      }
    }
  })

  if (insertPos === -1) {
    siblings.push(newWidgetSchema)
  } else {
    siblings.splice(insertPos + 1, 0, newWidgetSchema)
  }
}

/**
 * 从 widgets 中获取所有字段的名称（`props.field.name`）
 * @param widgets
 */
export const getFieldNames = (widgets: Widget[]) => {
  const ret: string[] = []

  widgets.forEach((w) => {
    if (w.class === 'form') {
      ret.push(w.props.field.name || w.uid)
    } else {
      if (w.type === 'grid' || w.type === 'steps' || w.type === 'tabs') {
        if (w.props.children) {
          w.props.children.forEach((child) => {
            ret.push(...getFieldNames(child.widgets))
          })
        }
      }
    }
  })

  return ret
}

export const widgetManifest = import.meta.glob('../widgets/**/index.vue', {
  eager: true,
  import: 'default',
})

export const widgetToRender = (type: Widget['type']) => {
  for (const key in widgetManifest) {
    const name = key.split('/')[key.split('/').length - 2]
    if (camelCase(name) === type) {
      return widgetManifest[key] as any
    }
  }

  return null
}
