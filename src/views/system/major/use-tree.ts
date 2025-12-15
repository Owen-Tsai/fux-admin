import { getMajorTree } from '@/api/system/major'
import type { TreeProps } from 'tdesign-vue-next'

const useMajorTree = () => {
  const filterText = ref('')
  const filter = ref<TreeProps['filter']>()
  const activeNodes = ref<number[]>([])

  const { data, pending, execute } = useRequest(getMajorTree, { immediate: true })

  watchDebounced(
    filterText,
    (val) => {
      if (val) {
        filter.value = (node) => {
          const rs = (node.label as string).indexOf(val) >= 0
          // 命中的节点会强制展示
          // 命中节点的路径节点会锁定展示
          // 未命中的节点会隐藏
          return rs
        }
      } else {
        filter.value = undefined
      }
    },
    { debounce: 200 },
  )

  return {
    filterText,
    majorTree: data,
    majorLoading: pending,
    filter,
    activeNodes,
    execute,
  }
}

export default useMajorTree
