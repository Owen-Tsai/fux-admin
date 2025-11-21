<template>
  <TTable :columns="columns" :data="uploadList" :loading="loading"></TTable>
</template>

<script setup lang="ts">
import { getUploadList, type UploadList } from '@/api/business/attachment'
import { useRendererCtxInject, usePlanIdCtxInject } from '@fusionx/core/hooks'
import type { TableProps } from 'tdesign-vue-next'

const route = useRoute()
const ctx = usePlanIdCtxInject()
const appId = route.params.appId as string
const planId = (route.params.planId || route.query.planId || ctx?.planId.value) as string
const applyId = (route.params.applyId || route.query.applyId) as string

const rendererCtx = useRendererCtxInject()

const isProd = computed(
  () => rendererCtx && rendererCtx.mode !== 'dev' && rendererCtx.mode !== 'preview',
)

if (isProd.value && (!appId || !planId || !applyId)) {
  throw new Error('appId, planId, applyId are required')
}

const columns: TableProps['columns'] = [
  { title: '附件名称', colKey: 'name', ellipsis: true },
  { title: '文件类型', colKey: 'allowedFileTypes', width: 120 },
  { title: '最大大小', colKey: 'maxFileSize', width: 120 },
  { title: '文件', colKey: 'uploadedFile' },
]

const uploadList = ref<UploadList>([])
const loading = ref(false)

const load = async () => {
  if (!isProd.value) return
  loading.value = true
  uploadList.value = await getUploadList(appId, planId, applyId)
  loading.value = false
}

load()
</script>
