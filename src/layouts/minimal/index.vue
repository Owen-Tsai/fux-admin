<template>
  <TLayout>
    <TContent>
      <RouterView v-if="routerAlive">
        <template #default="{ Component, route }">
          <KeepAlive :include="[...keepsList]">
            <component :is="Component" :key="route.fullPath" />
          </KeepAlive>
        </template>
      </RouterView>
    </TContent>
  </TLayout>
</template>

<script lang="ts" setup>
import useViewCache from '@/stores/views'

const { keepsList } = storeToRefs(useViewCache())

const routerAlive = ref(true)
</script>
