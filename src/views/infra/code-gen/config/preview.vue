<template>
  <TDialog v-model:visible="visible" mode="full-screen" header="生成代码预览">
    <template #footer>
      <TButton @click="visible = false">关闭</TButton>
    </template>

    <div class="flex h-full">
      <div class="bg-[var(--td-bg-color-secondarycontainer)] w-7/24">
        <Scrollbar wrapper-class="h-full" class="h-full">
          <TTree v-model:actived="actived" activable :data="filePathTree" />
        </Scrollbar>
      </div>
      <div class="bg-[var(--td-bg-color-container)] w-17/24">
        <TTabs v-model:value="actived[0]">
          <TTabPanel
            v-for="file in data!"
            :key="file.filePath"
            :label="last(file.filePath.split('/'))"
            :value="file.filePath"
          >
            <Scrollbar wrapper-class="h-full" class="h-full">
              <div class="h-full" v-html="code" />
            </Scrollbar>
          </TTabPanel>
        </TTabs>
      </div>
    </div>
  </TDialog>
</template>

<script setup lang="ts">
import { previewCode, type CodePreviewVO } from '@/api/infra/code-gen'
import highlighter from '@/utils/highlighter'
import { last } from 'lodash-es'

const visible = defineModel<boolean>('visible')

type FileNode = {
  key: string
  title: string
  pKey?: string | null
  children?: FileNode[]
}

const data = ref<CodePreviewVO>()
const actived = ref<string[]>([])

const loading = ref(true)

const code = computedAsync<string>(() => {
  const entry = data.value?.find((e) => e.filePath === actived.value[0])
  if (!entry) return ''
  const snippet = entry.code
  const lang = last(entry.filePath.split('/'))?.split('.')[1]
  return highlighter(snippet, lang || 'txt')
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
        key: fullPath,
        title: pathFrags[i],
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
      return parent.key === child.pKey
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
