<template>
  <TCard title="通知公告">
    <template #actions>
      <TLink theme="primary">查看全部</TLink>
    </template>

    <TLoading :loading="pending">
      <div class="flex flex-col gap-2 min-h-140px">
        <RouterLink
          v-for="item in data?.list"
          :key="item.id"
          :to="`/system/notification/${item.id}`"
          class="flex items-center gap-2 decoration-none text-inherit has-tag py-1 px-2 group"
        >
          <DictTag :dict-data="systemNoticeType" :value="item.type" />
          <div class="text-truncate group-hover:text-[var(--td-brand-color)]">{{ item.title }}</div>
        </RouterLink>
      </div>
    </TLoading>
  </TCard>
</template>

<script setup lang="ts">
import { getNotificationList } from '@/api/system/notification'

const [systemNoticeType] = useDict('system_notice_type')

const { data, pending } = useRequest(() => getNotificationList({ pageNo: 1, pageSize: 5 }), {
  immediate: true,
})
</script>
