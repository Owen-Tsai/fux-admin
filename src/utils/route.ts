import { DefaultLayout } from '@/layouts'
import type { RouteRecordRaw } from 'vue-router'
import type { MenuVO } from '@/api/system/menu'

const modules = import.meta.glob('../views/**/*.vue')
const layoutModules = import.meta.glob('../layouts/**/index.vue')

const loadComponent = (path: string) => {
  const [filename] =
    Object.entries(modules).find(([file]) => {
      const fileWithoutExt = file.split(`views/`)[1].split('.vue')[0]
      return fileWithoutExt === path
    }) || []

  return filename ? () => modules[filename]() : undefined
}

const loadLayout = (name: string) => {
  const [layoutName] =
    Object.entries(layoutModules).find(([file]) => {
      const folderName = file.split('/')[2]
      return folderName === name
    }) || []

  return layoutName ? () => layoutModules[layoutName]() : undefined
}

/**
 * 基于MenuVO数组生成Vue Router路由数组
 */
export const generateRoutes = (menuVO: MenuVO[]): RouteRecordRaw[] => {
  const ret: RouteRecordRaw[] = []

  /**
   * 递归处理菜单项，生成路由记录
   * @param menus 菜单列表
   * @param parentPath 父级路径
   * @param parentHasCustomLayout 父级是否有自定义布局
   */
  const traverse = (
    menus: MenuVO[],
    parentPath = '',
    parentHasCustomLayout = false,
  ): RouteRecordRaw[] => {
    const res: RouteRecordRaw[] = []

    menus.forEach((rawEntry) => {
      // 2. 跳过外链（以http开头）
      if (rawEntry.path?.startsWith('http')) {
        return
      }

      // 填充meta字段
      const meta = {
        id: rawEntry.id,
        parentId: rawEntry.parentId,
        icon: rawEntry.icon,
        customLayout: rawEntry.customLayout,
        keepAlive: !!rawEntry.keepAlive,
        title: rawEntry.name || rawEntry.componentName || '',
        visible: rawEntry.visible,
      }

      // 3. 处理目录（type为1）
      if (rawEntry.type === 1) {
        // 6. 目录有自定义布局：作为父级路由
        if (rawEntry.customLayout) {
          const parentRecord: RouteRecordRaw = {
            path: parentPath ? `${parentPath}/${rawEntry.path}` : rawEntry.path!,
            name: rawEntry.componentName,
            component: loadLayout(rawEntry.customLayout),
            meta,
            children: rawEntry.children ? traverse(rawEntry.children, rawEntry.path!, true) : [],
          }

          res.push(parentRecord)
        } else {
          // 4. 顶层目录（parentId为0）使用DefaultLayout
          if (rawEntry.parentId === 0) {
            const directoryRecord: RouteRecordRaw = {
              path: rawEntry.path!,
              name: rawEntry.componentName,
              component: DefaultLayout,
              meta,
              children: rawEntry.children ? traverse(rawEntry.children, rawEntry.path!, false) : [],
            }
            res.push(directoryRecord)
          } else {
            // 普通目录，递归处理子项
            if (rawEntry.children && rawEntry.children.length > 0) {
              res.push(
                ...traverse(
                  rawEntry.children,
                  parentPath ? `${parentPath}/${rawEntry.path}` : rawEntry.path!,
                  parentHasCustomLayout,
                ),
              )
            }
          }
        }
      }
      // 5. 处理菜单（type为2）
      else if (rawEntry.type === 2) {
        // 7. 菜单有自定义布局且不是自定义布局目录的子项
        if (rawEntry.customLayout && !parentHasCustomLayout) {
          const parentRecord: RouteRecordRaw = {
            path: parentPath ? `${parentPath}/${rawEntry.path}` : rawEntry.path!,
            name: rawEntry.componentName,
            redirect: { name: `${rawEntry.componentName}Child` },
            component: loadLayout(rawEntry.customLayout!),
            meta,
            children: [
              {
                path: '',
                name: `${rawEntry.componentName}Child`,
                component: loadComponent(rawEntry.component!),
                meta,
              } as RouteRecordRaw,
            ],
          }
          res.push(parentRecord)
        } else {
          // 普通菜单
          const menuRecord: RouteRecordRaw = {
            path: parentPath ? `${parentPath}/${rawEntry.path}` : rawEntry.path!,
            name: rawEntry.componentName,
            component: loadComponent(rawEntry.component!),
            meta,
          } as RouteRecordRaw
          res.push(menuRecord)
        }
      }
    })

    return res
  }

  // 1. 处理传入的数组
  ret.push(...traverse(menuVO))
  return ret
}
