<script setup lang="ts">
import dayjs from 'dayjs'
import type { ProfileVO } from '@/api/member/personal'

const { data } = defineProps<{
  data: ProfileVO['honorList']
}>()
</script>

<template>
  <div v-for="item in data" :key="item.id">
    <TDescriptions bordered :column="3" :label-style="{ width: '140px' }">
      <TDescriptionsItem label="荣誉名称">{{ item.awardName }}</TDescriptionsItem>
      <TDescriptionsItem label="证书编号">{{ item.certificateNo }}</TDescriptionsItem>
      <TDescriptionsItem label="获得时间">
        {{ dayjs(item.awardDate).format('YYYY-MM-DD') }}
      </TDescriptionsItem>
    </TDescriptions>
  </div>
</template>
