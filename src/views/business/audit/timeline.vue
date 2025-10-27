<template>
  <TLoading :loading="pending" class="min-h-200px mt-4">
    <TTimeline mode="same" layout="vertical" label-align="left">
      <TTimelineItem
        v-for="(entry, i) in data"
        :key="i"
        :label="entry.inProcess ? '当前正在此环节' : entry.operationTime || ''"
      >
        <div>{{ entry.operator + entry.operationResult }}</div>
        <div v-if="entry.operationResultCode !== 0 && entry.operationRemark != ''">
          审核意见：{{ entry.operationRemark }}
        </div>
      </TTimelineItem>
    </TTimeline>
  </TLoading>
</template>

<script setup lang="ts">
import { getAuditTimeline } from '@/api/business'

const route = useRoute()
const { data, pending } = useRequest(
  () => getAuditTimeline(route.query.processInstanceId as string),
  {
    immediate: true,
  },
)
</script>
