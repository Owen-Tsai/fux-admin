<template>
  <Scrollbar
    :thumb-width="8"
    :auto-expand="false"
    content-class="w-fit"
    wrapper-class="!sticky left-0 top-0 z-10 bg-[var(--td-bg-color-secondarycontainer)] border-[var(--td-border-level-2-color)] border-b border-b-solid"
  >
    <div class="flex whitespace-nowrap flex-nowrap px-2 py-1 gap-2">
      <TDropdown v-for="tab in tabsView.tabsMap" :key="tab[0]" trigger="context-menu">
        <div class="tag" :class="{ active: isActive(tab[0]) }" @click="onTabClick(tab)">
          <span v-show="isActive(tab[0])" class="dot" />
          <span>{{ tab[1] }}</span>
          <div
            v-if="tab[0] !== INDEX_PATH"
            class="close-icon"
            @click.stop="tabsView.removeTab(tab[0])"
          >
            <TIcon name="close" />
          </div>
        </div>

        <TDropdownMenu>
          <TDropdownItem
            v-if="tab[0] === router.currentRoute.value.fullPath"
            @click="layoutCtx.reload"
          >
            重新载入
          </TDropdownItem>
          <TDropdownItem v-if="tab[0] !== INDEX_PATH" @click="tabsView.removeTab(tab[0])">
            关闭当前页面
          </TDropdownItem>
          <TDropdownItem @click="tabsView.removeTabsAfter(tab[0])">关闭右侧页面</TDropdownItem>
          <TDropdownItem @click="tabsView.removeOtherTabs(tab[0])">关闭其他页面</TDropdownItem>
        </TDropdownMenu>
      </TDropdown>
    </div>
  </Scrollbar>
</template>

<script setup lang="ts">
import useTabsView from '@/stores/tabs'
import { injectCtx } from './index.vue'

const INDEX_PATH = '/index'

const tabsView = useTabsView()
const router = useRouter()
const layoutCtx = injectCtx()

const isActive = (tabKey: string) => {
  return router.currentRoute.value.fullPath === tabKey
}

const onTabClick = (tab: [string, string]) => {
  router.push(tab[0])
}

watch(router.currentRoute, (val) => {
  tabsView.addViewTab(val.fullPath, val.meta.title || (val.name as string))
})
</script>

<style lang="scss" scoped>
.tag {
  background-color: var(--td-bg-color-container);
  color: var(--td-text-color-secondary);
  font-size: var(--td-font-size-body-small);
  @apply px-2 py-[2px] inline-flex items-center gap-1 rounded relative cursor-pointer;

  .close-icon {
    @apply inline-flex items-center justify-center p-[2px] rounded-full;
    font-size: var(--td-font-size-body-small);
    &:hover {
      background-color: var(--td-bg-color-secondarycontainer-hover);
    }
    &:active {
      background-color: var(--td-bg-color-secondarycontainer-active);
    }
  }
  &.active {
    background-color: var(--td-brand-color-1);
    color: var(--td-brand-color);
    border: 1px solid var(--td-brand-color-3);
    @apply pl-6;
  }
  .dot {
    @apply absolute w-2 h-2 top-1/2 left-2 -translate-y-1/2 rounded;
    background-color: var(--td-brand-color);
  }
}
</style>
