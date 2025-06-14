import { last } from 'lodash-es'
import useViewStore from './views'

export default defineStore('tabs', () => {
  // { fullpath1: title1, fullpath2: title2, ... }
  const tabsMap = ref<Map<string, string>>(new Map())
  // fullpath in visit order
  const history = ref<string[]>([])

  const { currentRoute, replace, go } = useRouter()
  const viewCache = useViewStore()

  const removeTabHistory = (fullpath: string) => {
    history.value = history.value.filter((e) => e !== fullpath)
  }

  const redirect = (to?: string) => {
    if (to) {
      console.log('to is', to)
      replace(to)
      return
    }
    const latestTab = last(history.value)
    if (latestTab) {
      replace(latestTab)
    }
  }

  /**
   * 增加一个 tab。路由变化时自动调用，通常无需使用此方法
   * @param fullpath fullpath of the added route
   * @param title text that will be displayed on tab
   */
  const addViewTab = (fullpath: string, title: string) => {
    tabsMap.value.set(fullpath, title)
    history.value.push(fullpath)
    // now the currentRoute should be the newly added view
    if (currentRoute.value.meta.keepAlive && currentRoute.value.name) {
      viewCache.addCache(fullpath, currentRoute.value.name as string)
    }
  }

  /**
   * 修改当前激活的 tab 上的文字标题
   * @param title new text
   */
  const setTabTitle = (title: string) => {
    tabsMap.value.set(currentRoute.value.fullPath, title)
  }

  /**
   * 移除一个 tab。如果移除的是当前激活的 tab，则同时返回到上一个激活的 tab 所对应的页面（或`to`指定的页面）
   * @param fullpath the fullpath of the tab that will be removed
   * @param to [optional] custom redirect path (instead of the path of last active tab)
   */
  const removeTab = (fullpath: string, to?: string) => {
    let flag = false
    if (fullpath === currentRoute.value.fullPath) {
      flag = true
    }

    tabsMap.value.delete(fullpath)
    removeTabHistory(fullpath)

    if (flag) {
      redirect(to)
    }
  }

  /**
   * 移除`fullpath`之后的所有 tab。如果被移除的 tab 中包含当前激活的 tab，
   * 则同时返回到上一个激活的 tab 所对应的页面（或`to`指定的页面）
   */
  const removeTabsAfter = (fullpath: string, to?: string) => {
    const keys = Array.from(tabsMap.value.keys())
    const idx = keys.indexOf(fullpath)
    const tabsToRemove = keys.slice(idx + 1)

    tabsToRemove.forEach((key) => {
      tabsMap.value.delete(key)
      removeTabHistory(key)
    })

    if (tabsToRemove.includes(currentRoute.value.fullPath)) {
      redirect(to)
    }
  }

  /**
   * 移除除`fullpath`对应的 tab 之外的所有 tab。如果被移除的 tab 中包含当前激活的 tab，
   * 则同时返回到上一个激活的 tab 所对应的页面（或`to`指定的页面）
   */
  const removeOtherTabs = (fullpath: string, to?: string) => {
    const keys = tabsMap.value.keys()
    let toRemove = keys.next()

    while (!toRemove.done) {
      if (toRemove.value !== fullpath && toRemove.value !== '/index') {
        tabsMap.value.delete(toRemove.value)
        removeTabHistory(toRemove.value)
      }
      toRemove = keys.next()
    }

    if (fullpath !== currentRoute.value.fullPath) {
      redirect(to)
    }
  }

  /**
   * @deprecated use `removeTab(fullpathToRemove, fullpathToOpen)` instead
   */
  const removeAndOpenTab = (fullpathToRemove: string, fullpathToOpen: string) => {
    removeTab(fullpathToRemove, fullpathToOpen)
  }

  /**
   * 刷新当前 tab 对应的视图
   */
  const refreshTab = () => {
    go(0)
  }

  onMounted(() => {
    addViewTab('/index', '工作台')
    if (currentRoute.value.fullPath !== '/index') {
      addViewTab(
        currentRoute.value.fullPath,
        currentRoute.value.meta.title || (currentRoute.value.name as string),
      )
    }
  })

  return {
    tabsMap,
    addViewTab,
    removeTab,
    removeOtherTabs,
    removeTabsAfter,
    removeTabHistory,
    removeAndOpenTab,
    refreshTab,
    setTabTitle,
  }
})
