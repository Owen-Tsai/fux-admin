import useDictStore from '@/stores/dict'
import { getDictData, type DictDataEntry } from '@/api/system/dict/data'
import type { Ref } from 'vue'

type UseDictOptions = Record<
  string,
  {
    valueType?: 'string' | 'number' | 'boolean'
    formatter?: (entry: DictDataEntry) => DictDataEntry
  }
>

export function useDict(
  dictTypeOrConfig?: string | UseDictOptions,
  ...rest: string[]
): Array<Ref<DictDataEntry[]>> {
  const dictTypes = typeof dictTypeOrConfig === 'string' ? [dictTypeOrConfig, ...rest] : rest

  const options = typeof dictTypeOrConfig === 'string' ? null : dictTypeOrConfig

  const ret = dictTypes.map(() => ref<DictDataEntry[]>([]))

  const smartProcessEntries = (dictEntries: DictDataEntry[]) => {
    if (dictEntries[0].useString) {
      return dictEntries
    }

    return dictEntries.map((entry) => {
      if (!entry.useString) {
        // translate boolean
        if (entry.value === 'true') {
          ;(entry.value as any) = true
        } else if (entry.value === 'false') {
          ;(entry.value as any) = false
        }
        // translate number
        const intVal = parseInt(entry.value as string)
        if (!isNaN(intVal)) {
          entry.value = intVal
        }
      }
      return entry
    })
  }

  const processEntries = (dictType: string, dictEntries: DictDataEntry[]) => {
    if (!options || !options[dictType]) {
      return smartProcessEntries(dictEntries)
    }
    return dictEntries.map((entry) => {
      if (options[dictType]?.formatter) {
        return options[dictType]?.formatter(entry)
      }
      if (options[dictType]?.valueType === 'string') {
        entry.value = entry.value.toString()
      }
      if (options[dictType]?.valueType === 'number') {
        entry.value = Number(entry.value)
      }
      if (options[dictType]?.valueType === 'boolean') {
        entry.value = entry.value === 'true'
      }
      return entry
    })
  }

  const dictStore = useDictStore()

  dictTypes.map((type) => {
    const dictEntries = dictStore.getDict(type)
    if (dictEntries) {
      // 1. if the type is in the cache
      ret[dictTypes.indexOf(type)].value = processEntries(type, dictEntries)
    } else {
      // 2. if the type is not in the cache
      getDictData(type).then((res) => {
        dictStore.setDict(type, res)
        ret[dictTypes.indexOf(type)].value = processEntries(type, res)
      })
    }
  })

  return ret
}

export default useDict
