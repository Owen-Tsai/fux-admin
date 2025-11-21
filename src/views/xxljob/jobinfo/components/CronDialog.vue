<template>
  <TDialog
    v-model:visible="visible"
    :confirm-loading="loading"
    header="CRON表单式"
    body="content"
    width="800px"
  >
    <template #body>

    </template>
  </TDialog>
</template>

<script lang="ts" setup>

const emit = defineEmits(['success'])

const visible = ref(false)
const loading = ref(false)


const open = (cronExpVal?: string) => {
  visible.value = true
}

defineExpose({ open })
</script>
