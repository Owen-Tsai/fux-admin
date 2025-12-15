<template>
  <TDrawer v-model:visible="visible" size="30%" header="IP 流量详情">
    <template #footer>
      <TButton @click="visible = false">关 闭</TButton>
    </template>

    <TDescriptions v-if="entry" bordered :column="1" :label-style="{ width: '120px' }">
      <TDescriptionsItem label="IP 地址">{{ entry.ipAddress }}</TDescriptionsItem>
      <TDescriptionsItem label="入站流量">{{ entry.inboundTraffic }} MB</TDescriptionsItem>
      <TDescriptionsItem label="出站流量">{{ entry.outboundTraffic }} MB</TDescriptionsItem>
      <TDescriptionsItem label="流量统计时间">
        {{ dayjs(entry.trafficTime).format('YYYY-MM-DD HH:mm:ss') }}
      </TDescriptionsItem>
      <TDescriptionsItem label="频率 Mbps">{{ entry.accessFrequency }}</TDescriptionsItem>
      <TDescriptionsItem label="创建时间">
        {{ dayjs(entry.createTime).format('YYYY-MM-DD HH:mm:ss') }}
      </TDescriptionsItem>
    </TDescriptions>
  </TDrawer>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import type { IPTrafficVO } from '@/api/system/ip/traffic'

const entry = ref<IPTrafficVO>()

const visible = ref(false)

const open = (record: IPTrafficVO) => {
  visible.value = true
  entry.value = record
}

defineExpose({ open })
</script>
