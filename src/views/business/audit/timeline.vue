<template>
  <TLoading :loading="pending" class="min-h-200px mt-4">
    <TTimeline mode="same" layout="vertical" label-align="left">
      <TTimelineItem
        v-for="(entry, i) in data"
        :key="i"
        :label="entry.inProcess ? '当前正在此环节' : entry.operationTime || ''"
      >
        <div>{{ operationName(entry) }}</div>
        <div class="text-xs">
          {{ operationDetail(entry) }}
        </div>
      </TTimelineItem>
    </TTimeline>
  </TLoading>
</template>

<script setup lang="ts">
import { getAuditTimeline, type TimelineData } from '@/api/business'

const route = useRoute()
const { data, pending } = useRequest(
  () => getAuditTimeline(route.query.processInstanceId as string),
  {
    immediate: true,
  },
)

const operationName = (entry: TimelineData[number]) => {
  if (entry.operator) {
    return entry.operator + entry.operationResult
  }
  return entry.operationResult
}

const operationDetail = (entry: TimelineData[number]) => {
  if (entry.operationResultCode !== 0 && entry.operationRemark) {
    return '审核意见：' + entry.operationRemark
  }
  return ''
}
</script>
