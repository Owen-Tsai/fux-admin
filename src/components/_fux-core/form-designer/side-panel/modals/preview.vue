<template>
  <TDialog
    v-model:visible="visible"
    header="表单预览"
    confirm-btn="关闭"
    :cancel-btn="null"
    mode="full-screen"
    destroy-on-close
    @confirm="close"
  >
    <FormRenderer :app-schema="appSchema" debug :state="state" mode="preview" />
  </TDialog>
</template>

<script setup lang="ts">
import FormRenderer from '@fusionx/core/form-renderer/index.vue'
import { useDesignerCtxInject } from '@fusionx/core/hooks'

const visible = ref(false)
const { appSchema } = useDesignerCtxInject()!

const state = ref({})

const close = () => {
  visible.value = false
}

const open = () => {
  visible.value = true
}

defineExpose({ open })
</script>
