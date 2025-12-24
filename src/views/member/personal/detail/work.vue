<script setup lang="ts">
import dayjs from 'dayjs'
import type { ProfileVO } from '@/api/member/personal'

const { data } = defineProps<{
  data: ProfileVO['workList']
}>()
</script>

<template>
  <template v-if="data && data.length > 0">
    <div v-for="item in data" :key="item.id" class="my-4">
      <TDescriptions bordered :label-style="{ width: '140px' }">
        <TDescriptionsItem label="单位名称">{{ item.companyName }}</TDescriptionsItem>
        <TDescriptionsItem label="所属部门">{{ item.department || '-' }}</TDescriptionsItem>
        <TDescriptionsItem label="岗位/职务">{{ item.position || '-' }}</TDescriptionsItem>
        <TDescriptionsItem label="在职时间">
          {{ dayjs(item.startDate).format('YYYY-MM-DD') }} -
          {{ item.endDate ? dayjs(item.endDate).format('YYYY-MM-DD') : '至今' }}
        </TDescriptionsItem>
        <TDescriptionsItem label="工作描述">{{ item.jobDescription }}</TDescriptionsItem>
      </TDescriptions>
    </div>
  </template>
  <TEmpty class="!my-4" v-else />
</template>
