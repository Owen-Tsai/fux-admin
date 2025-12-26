import type { DictDataEntry } from '@/api/system/dict/data'

export default defineStore('dict', () => {
  const dictCache = ref<Map<string, DictDataEntry[]>>(new Map())

  const getDict = (type: string) => {
    return dictCache.value?.get(type)
  }

  const setDict = (type: string, entries: DictDataEntry[]) => {
    dictCache.value?.set(type, entries)
  }

  const deleteDict = (type: string) => {
    dictCache.value?.delete(type)
  }

  const clearDict = () => {
    dictCache.value?.clear()
  }

  return {
    dictCache,
    getDict,
    setDict,
    deleteDict,
    clearDict,
  }
})
