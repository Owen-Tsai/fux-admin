<template>
  <TCard title="常用应用">
    <template #actions>
      <TLink theme="primary">自定义</TLink>
    </template>

    <TLoading :loading="pending">
      <div class="grid grid-cols-2 gap-2 min-h-100px">
        <RouterLink
          v-for="app in data"
          :key="app.id"
          :to="app.path"
          class="flex items-center gap-2 decoration-none text-inherit group hover:bg-[var(--td-bg-color-container-hover)] p-2 rounded-lg"
        >
          <TAvatar :image="app.icon" class="flex-none" size="36px">{{
            app.appName.slice(0, 2)
          }}</TAvatar>
          <div class="flex-1 overflow-hidden">
            <div class="truncate w-full group-hover:text-[var(--td-brand-color)]">
              {{ app.appName }}
            </div>
            <div class="text-xs text-secondary">{{ app.name }}</div>
          </div>
        </RouterLink>
      </div>
    </TLoading>
  </TCard>
</template>

<script setup lang="ts">
import { getApplications } from '@/api/index'

const { data, pending } = useRequest(getApplications, { immediate: true })
</script>
