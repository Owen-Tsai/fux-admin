<template>
  <TDialog
    v-model:visible="visible"
    mode="full-screen"
    header="生成代码预览"
    class="code-gen-preview-modal"
  >
    <template #footer>
      <TButton @click="visible = false">关闭</TButton>
    </template>

    <div class="flex h-full gap-6">
      <div
        ref="treeWrapper"
        class="w-7/24 h-full border-r border-r-solid border-[var(--td-border-level-1-color)] pr-4"
      >
        <TTree
          v-model:actived="actived"
          activable
          :data="filePathTree"
          expand-all
          :height="height"
          :scroll="{ type: 'virtual' }"
          class="!p-4"
        />
      </div>
      <div class="bg-[var(--td-bg-color-container)] w-17/24 h-full">
        <TTabs v-model:value="actived[0]" class="code-tabs">
          <TTabPanel
            v-for="file in data!"
            :key="file.filePath"
            :label="last(file.filePath.split('/'))"
            :value="file.filePath"
          >
            <div class="h-full" v-html="code" />
          </TTabPanel>
        </TTabs>
      </div>
    </div>
  </TDialog>
</template>

<script setup lang="ts">
import { previewCode, type CodePreviewVO } from '@/api/infra/code-gen'
import highlight from '@/utils/highlighter'
import { last } from 'lodash-es'

const visible = defineModel<boolean>('visible')

type FileNode = {
  value: string
  label: string
  pKey?: string | null
  children?: FileNode[]
}

const treeWrapper = useTemplateRef('treeWrapper')
const { height } = useElementSize(treeWrapper, { height: 100, width: 0 })

const data = ref<CodePreviewVO>()
const actived = ref<string[]>([])

const loading = ref(true)

const code = computedAsync<string>(async () => {
  const entry = data.value?.find((e) => e.filePath === actived.value[0])
  if (!entry) return ''
  const snippet = entry.code
  const lang = last(entry.filePath.split('/'))?.split('.')[1]
  const highlighted = await highlight(snippet, lang || 'txt')
  return highlighted
})

const filePathTree = computed<FileNode[]>(() => {
  if (!data.value) return []
  const existedMap: Record<string, boolean> = {}
  const files: FileNode[] = []

  for (const entry of data.value) {
    let pathFrags = entry.filePath.split('/')
    // full path from top level dir, used for key generation
    let fullPath = ''

    if (pathFrags[pathFrags.length - 1].includes('.java')) {
      const newPathFrags: string[] = []
      for (let i = 0; i < pathFrags.length; i++) {
        let p = pathFrags[i]
        if (p !== 'java') {
          newPathFrags.push(p)
          continue
        }

        newPathFrags.push(p)
        let temp = ''
        while (i < pathFrags.length) {
          p = pathFrags[i + 1]
          if (
            [
              'controller',
              'convert',
              'dal',
              'enums',
              'service',
              'vo',
              'mysql',
              'dataobject',
            ].includes(p)
          ) {
            break
          }
          temp = temp ? temp + '.' + p : p
          i++
        }

        if (temp) {
          newPathFrags.push(temp)
        }
      }

      pathFrags = newPathFrags
    }

    for (let i = 0; i < pathFrags.length; i++) {
      const oldFullPath = fullPath
      fullPath =
        fullPath.length === 0 ? pathFrags[i] : fullPath.replaceAll('.', '/') + '/' + pathFrags[i]
      if (existedMap[fullPath]) {
        continue
      }
      // 添加到 files 中
      existedMap[fullPath] = true
      files.push({
        value: fullPath,
        label: pathFrags[i],
        pKey: oldFullPath || '/', // `/` -> root node
      })
    }
  }

  return constructTree(files)
})

const constructTree = (files: FileNode[]) => {
  const clonedData = [...files]

  const treeData = clonedData.filter((parent) => {
    const branchArr = clonedData.filter((child) => {
      return parent.value === child.pKey
    })

    if (branchArr.length > 0) {
      parent.children = branchArr
    }
    return parent.pKey === '/'
  })

  return treeData
}

const loadData = async (id: number) => {
  loading.value = true
  const res = await previewCode(id)
  data.value = res
  actived.value[0] = data.value[0].filePath
  loading.value = false
}

const open = (id: number) => {
  visible.value = true
  loadData(id)
}

defineExpose({ open })
</script>

<style lang="scss" scoped>
.code-tabs {
  @apply flex flex-col h-full;
  :deep(.t-tabs__header) {
    @apply flex-none min-h-0;
  }
  :deep(.t-tabs__content) {
    @apply flex-1 min-h-0 overflow-y-auto;
  }
}

.code-gen-preview-modal {
  :global(.t-dialog__position_fullscreen) {
    height: 100% !important;
  }
}
</style>
