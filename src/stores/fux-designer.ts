import { getSimpleDictTypeList, type DictTypeVO } from '@/api/system/dict/type'

export default defineStore('fux-designer', () => {
  const dictTypes = ref<Array<DictTypeVO>>()

  const getDictTypes = async () => {
    const res = await getSimpleDictTypeList()
    dictTypes.value = res
  }

  onMounted(() => {
    getDictTypes()
  })

  return {
    dictTypes,
  }
})
