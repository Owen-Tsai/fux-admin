<script setup lang="ts">
import dayjs from 'dayjs'
import type { ProfileVO } from '@/api/member/personal'

const { data } = defineProps<{
  data: ProfileVO['honorList']
}>()
</script>

<template>
  <template v-if="data && data.length > 0">
    <div v-for="item in data" :key="item.id" class="my-4">
      <TDescriptions bordered :column="3" :label-style="{ width: '140px' }">
        <TDescriptionsItem label="荣誉名称">{{ item.awardName }}</TDescriptionsItem>
        <TDescriptionsItem label="证书编号">{{ item.certificateNo }}</TDescriptionsItem>
        <TDescriptionsItem label="获得时间">
          {{ dayjs(item.awardDate).format('YYYY-MM-DD') }}
        </TDescriptionsItem>
      </TDescriptions>
    </div>
  </template>
  <TEmpty class="!my-4" v-else />
</template>
