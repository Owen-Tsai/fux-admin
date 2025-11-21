<template>
  <TDialog
    v-model:visible="visible"
    :confirm-loading="loading"
    :header="dialogProps.header"
    :width="dialogProps.width"
    :footer="false"
  >
    <TLoading :loading="loading">
      <div style="min-height: 300px">
        <t-empty v-if="htmlContent.length === 0" title="暂无数据"></t-empty>
        <div v-html="htmlContent"></div>
      </div>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
import type { TdDialogProps } from 'tdesign-vue-next'

const visible = ref(false)
const loading = ref(false)
const htmlContent = ref<string>('')
const dialogProps = ref<TdDialogProps>({
  width: '500px',
  header: '提示信息'
})


const open = (htmlStr: string, props?: TdDialogProps) => {
  htmlContent.value = htmlStr
  if (props)
    dialogProps.value = { ...dialogProps.value, ...props }
  visible.value = true
}

defineExpose({ open })
</script>
