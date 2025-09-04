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
    <div class="flex items-center justify-center">
      <TRadioGroup
        v-model:value="mode"
        theme="button"
        variant="default-filled"
        size="large"
        :options="[
          { label: '表单模式', value: 0 },
          { label: '查看模式', value: 1 },
        ]"
      />
    </div>
    <div class="mt-4">
      <FormRenderer v-if="mode === 0" :app-schema="appSchema" debug :state="state" mode="preview" />
      <FormRenderer v-else :app-schema="appSchema" debug :state="state" mode="archive" />
    </div>
  </TDialog>
</template>

<script setup lang="ts">
import FormRenderer from '@fusionx/core/form-renderer/index.vue'
import { useDesignerCtxInject } from '@fusionx/core/hooks'

const visible = ref(false)
const { appSchema } = useDesignerCtxInject()!

const mode = ref(0)

const state = ref({})

const close = () => {
  visible.value = false
}

const open = () => {
  visible.value = true
}

defineExpose({ open })
</script>
