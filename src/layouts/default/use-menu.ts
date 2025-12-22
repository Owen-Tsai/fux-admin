import { manifest } from 'tdesign-icons-vue-next'
import qs from 'qs'
import type { MenuVO } from '@/api/system/menu'

export type MenuItem = {
  key: string
  label: string
  icon?: VNode
  tdIcon?: string
  children?: MenuItem[]
}

const icons = manifest.map((e) => e.stem)

const useMenu = () => {
  const menuItems = ref<MenuItem[]>([])
  const activeKey = ref<string>()
  const expandedKeys = ref<string[]>([])
  const { push, currentRoute } = useRouter()

  const logger = useLogger()

  const generateMenu = (menuVO: MenuVO[], parentPath = ''): MenuItem[] => {
    const ret: MenuItem[] = []

    menuVO.forEach((route) => {
      if (!route.visible) return
      const item: MenuItem = {
        label: route.name || '',
        key: '',
      }

      const origin = window.location.origin

      if (route.children) {
        const children = generateMenu(
          route.children,
          parentPath === '' ? `${parentPath}${route.path}` : `${parentPath}/${route.path}`,
        )
        item.children = children
      }

      if (route.path?.includes('http')) {
        item.key = route.path
      } else {
        item.key =
          route.parentId === 0 ? `${parentPath}${route.path}` : `${parentPath}/${route.path}`

        if (route.customLayout) {
          item.key = origin + item.key
        }
        if (route.params) {
          // route params
          try {
            const params = JSON.parse(route.params)
            item.key += `?${qs.stringify(params)}`
          } catch (e) {
            logger.error(import.meta.url, '菜单管理 -> 路由参数并非一个合法的 JSON：', route.params)
          }
        }
      }

      if (route.icon && icons.includes(route.icon)) {
        item.icon = h(route.icon)
      }
      if (route.tdIcon && icons.includes(route.tdIcon)) {
        item.tdIcon = route.tdIcon
      }

      ret.push(item)
    })

    return ret
  }

  const onMenuSelect = (key: string) => {
    if (key.includes('http')) {
      window.open(key, '_blank')
      const { path } = currentRoute.value
      activeKey.value = path
    } else {
      push(key)
    }
  }

  const setDefaultExpandedKeys = () => {
    const { path } = currentRoute.value
    const portions = path.split('/')
    const [, ...rest] = portions

    const keys: string[] = []

    if (rest.length <= 1) return

    rest.reduce((acc, curr) => {
      const key = `${acc}/${curr}`
      keys.push(key)
      return key
    }, '')

    expandedKeys.value = keys
  }

  watchEffect(() => {
    const { fullPath, meta } = currentRoute.value

    if (meta.ignoreActiveMenu) return

    if (meta.activeMenuKey) {
      activeKey.value = meta.activeMenuKey
    } else {
      activeKey.value = fullPath
    }
    setDefaultExpandedKeys()
  })

  setDefaultExpandedKeys()

  return {
    menuItems,
    activeKey,
    expandedKeys,
    generateMenu,
    onMenuSelect,
  }
}

export default useMenu
