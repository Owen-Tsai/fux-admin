<template>
  <TLayout class="h-full max-h-screen flex flex-col">
    <Header
      class="flex-none border-b border-b-solid border-[var(--td-border-level-1-color)]"
      @click:drawer="toggleDrawer(true)"
    />
    <TLayout class="flex min-h-0">
      <TAside
        class="flex-none w-full border-r border-r-solid border-[var(--td-border-level-1-color)] overflow-y-auto hidden lg:block"
        width="auto"
      >
        <Menu />
      </TAside>
      <TContent class="flex-1 w-full overflow-x-hidden relative">
        <TabsView />
        <RouterView v-if="routerAlive">
          <template #default="{ Component, route }">
            <KeepAlive :include="[...keepsList]">
              <component :is="Component" :key="route.fullPath" />
            </KeepAlive>
          </template>
        </RouterView>
      </TContent>
    </TLayout>

    <TDrawer
      v-if="bps.isSmallerOrEqual('md')"
      v-model:visible="drawer"
      :header="false"
      :footer="false"
      placement="left"
      size="auto"
    >
      <Menu />
    </TDrawer>
  </TLayout>
</template>

<script setup lang="ts">
import Header from './header.vue'
import useViewStore from '@/stores/views'
import Menu from './menu.vue'
import TabsView from './tabs-view.vue'
import bps from '@/utils/breakpoints'

const { keepsList } = storeToRefs(useViewStore())
const [drawer, toggleDrawer] = useToggle(false)

const routerAlive = ref(true)

const reload = () => {
  routerAlive.value = false

  nextTick(() => (routerAlive.value = true))
}

provideCtx({ reload })
</script>

<script lang="ts">
import createCtx from '@/utils/context'

export type LayoutCtx = {
  reload: () => void
}

export const [provideCtx, injectCtx] = createCtx<LayoutCtx>('layout')
</script>

<style lang="scss" scoped>
.aside {
  border-right: 1px solid var(--border-color);
}
</style>
