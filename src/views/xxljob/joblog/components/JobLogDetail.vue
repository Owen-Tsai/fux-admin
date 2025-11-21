<template>
  <TDialog
    v-model:visible="visible"
    :confirm-loading="loading"
    header="日志详情"
    width="1000px"
    :footer="false"
  >
    <TLoading :loading="loading">
      <div style="min-height: 300px">
        <t-empty v-if="logList.length === 0" title="暂无数据"></t-empty>
      </div>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
import {
  type XxlJobLogVO,
} from '@/api/xxljob/joblog'

const visible = ref(false)
const loading = ref(false)
const logList = ref<string[]>([])

const open = (row: XxlJobLogVO) => {
  logList.value = []

  visible.value = true
}

defineExpose({ open })
</script>
