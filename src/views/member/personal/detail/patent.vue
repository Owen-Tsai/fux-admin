<script setup lang="ts">
import dayjs from 'dayjs'
import type { ProfileVO } from '@/api/member/personal'

const { data } = defineProps<{
  data: ProfileVO['patentList']
}>()

const [patentTypes] = useDict('patent_type')
</script>

<template>
  <div v-for="item in data" :key="item.id">
    <TDescriptions bordered :label-style="{ width: '140px' }">
      <TDescriptionsItem label="专利名称">{{ item.patentName }}</TDescriptionsItem>
      <TDescriptionsItem label="专利类型">
        <DictTag :dict-data="patentTypes" :value="item.patentType" />
      </TDescriptionsItem>
      <TDescriptionsItem label="专利号">{{ item.patentNo }}</TDescriptionsItem>
      <TDescriptionsItem label="申请时间">
        {{ dayjs(item.applicationDate).format('YYYY-MM-DD') }}
      </TDescriptionsItem>
    </TDescriptions>
  </div>
</template>
