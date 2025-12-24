<script setup lang="ts">
import dayjs from 'dayjs'
import type { ProfileVO } from '@/api/member/personal'

const { data } = defineProps<{
  data: ProfileVO['publicationList']
}>()
</script>

<template>
  <template v-if="data && data.length > 0">
    <div v-for="item in data" :key="item.id" class="my-4">
      <TDescriptions bordered :column="2" :label-style="{ width: '140px' }">
        <TDescriptionsItem label="论文/著作名称">{{ item.title }}</TDescriptionsItem>
        <TDescriptionsItem label="发布时间">
          {{ dayjs(item.publishDate).format('YYYY-MM-DD') }}
        </TDescriptionsItem>
      </TDescriptions>
    </div>
  </template>
  <TEmpty class="!my-4" v-else />
</template>
