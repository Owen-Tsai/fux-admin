<script setup lang="ts">
import { ref } from 'vue'
import type { ProfileVO } from '@/api/member/company'

const visible = ref(false)

const data = ref<ProfileVO>()

function open(profile: ProfileVO) {
  data.value = profile
  visible.value = true
}

defineExpose({ open })
</script>

<template>
  <TDialog v-model:visible="visible" header="单位详情" width="80%">
    
  </TDialog>
</template>