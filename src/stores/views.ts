/**
 * Stores the opened view, consumed by <KeepAlive />
 */
export default defineStore('views', () => {
  // { fullpath1: componentName1, fullpath2: componentName2, ... }
  const cached = ref<Map<string, string>>(new Map())
  // [componentName1, componentName2, ...]
  const keepsList = computed(() => [...cached.value.values()])

  const addCache = (fullPath: string, componentName: string) => {
    cached.value.set(fullPath, componentName)
  }

  const removeCache = (fullPath: string) => {
    cached.value.delete(fullPath)
  }

  return {
    cached,
    keepsList,
    addCache,
    removeCache,
  }
})
