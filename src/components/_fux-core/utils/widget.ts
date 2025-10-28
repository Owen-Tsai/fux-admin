import { cloneDeepWith, camelCase } from 'lodash-es'
import { generateId } from './id'
import type { Widget } from '@fusionx/core/types'

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

export const findWidgetByUid = (widgets: Widget[], uid: string): Widget | null => {
  for (let i = 0; i < widgets.length; i++) {
    const w = widgets[i]
    if (w.uid === uid) {
      return w
    }

    if (w.class === 'layout') {
      if (w.type === 'grid' || w.type === 'steps' || w.type === 'tabs') {
        if (w.props.children) {
          for (let j = 0; j < w.props.children.length; j++) {
            const ret = findWidgetByUid(w.props.children[j].widgets, uid)
            if (ret) return ret
          }
        }
      }
    }
  }

  return null
}

export const findWidgetsByClass = (widgets: Widget[], className: string): Widget[] => {
  const ret: Widget[] = []

  widgets.forEach((w) => {
    if (w.class === className) {
      ret.push(w)
    } else if (w.class === 'layout') {
      if (w.type === 'grid' || w.type === 'steps' || w.type === 'tabs') {
        if (w.props.children) {
          for (let j = 0; j < w.props.children.length; j++) {
            ret.push(...findWidgetsByClass(w.props.children[j].widgets, className))
          }
        }
      } else if (w.type === 'subForm') {
        ret.push(...findWidgetsByClass(w.props.children, className))
      } else {
        // dataTable
        ret.push(...findWidgetsByClass(w.props.widgets, className))
      }
    }
  })

  return ret
}

export const findWidgetsByCompareFn = (
  widgets: Widget[],
  compareFn: (w: Widget) => boolean,
): Widget[] => {
  const ret: Widget[] = []

  widgets.forEach((w) => {
    if (compareFn(w)) {
      ret.push(w)
    } else if (w.class === 'layout') {
      if (w.type === 'grid' || w.type === 'steps' || w.type === 'tabs') {
        if (w.props.children) {
          for (let j = 0; j < w.props.children.length; j++) {
            ret.push(...findWidgetsByCompareFn(w.props.children[j].widgets, compareFn))
          }
        }
      } else if (w.type === 'subForm') {
        ret.push(...findWidgetsByCompareFn(w.props.children, compareFn))
      } else {
        // dataTable
        ret.push(...findWidgetsByCompareFn(w.props.widgets, compareFn))
      }
    }
  })

  return ret
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
export const viewModeWidgetManifest = import.meta.glob('../widgets/**/view.vue', {
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

export const viewModeWidgetToRender = (type: Widget['type']) => {
  for (const key in viewModeWidgetManifest) {
    const name = key.split('/')[key.split('/').length - 2]
    if (camelCase(name) === type) {
      return viewModeWidgetManifest[key] as any
    }
  }

  return null
}
