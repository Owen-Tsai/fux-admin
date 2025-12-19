<template>
  <div>
    <div v-if="widget.props.hasButton" class="text-right !mb-4">
      <TButton @click="exportTemplate">{{ widget.props.buttonLabel || '导出模板' }}</TButton>
    </div>
    <TTable :columns="columns" :data="uploadList" :loading="loading"></TTable>
  </div>
</template>

<script setup lang="ts">
import { getUploadList, type UploadList } from '@/api/business/attachment'
import { useRendererCtxInject, useBusinessCtxInject } from '@fusionx/core/hooks'
import request from '@/utils/request'
import type { WidgetMap } from '@fusionx/core/types'
import type { TableProps } from 'tdesign-vue-next'

const { widget } = defineProps<{
  widget: WidgetMap['attachmentTable']
}>()

const bizCtx = useBusinessCtxInject()
const { planId, appId, applyId } = bizCtx || {}

const rendererCtx = useRendererCtxInject()
const logger = useLogger()
const message = useMessage()

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
  if (!appId || !planId?.value || !applyId) {
    return
  }
  loading.value = true
  uploadList.value = await getUploadList(appId, planId.value, applyId)
  loading.value = false
}

const exportTemplate = async () => {
  loading.value = true
  try {
    await request.download({
      url: widget.props.action,
      params: {
        appId,
        planId: planId?.value,
        applyId,
      },
    })
  } catch (e) {
    message.error('导出失败')
    logger.error(import.meta.url, 'attachmentTable 导出模板失败', e)
  } finally {
    loading.value = false
  }
}

load()
</script>
