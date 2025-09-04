<template>
  <TMenu
    v-show="!loading"
    :theme="isDark ? 'dark' : 'light'"
    v-model:value="activeKey"
    v-model:expanded="expandedKeys"
    :width="width"
    @change="(key) => onMenuSelect(key as string)"
  >
    <TMenuItem value="/index">
      <template #icon>
        <Icon name="dashboard-1" />
        工作台
      </template>
    </TMenuItem>
    <MenuItem v-for="item in menuItems" :key="item.key" :item="item" />
  </TMenu>
</template>

<script setup lang="ts">
import useAppStore from '@/stores/app'
import useUserStore from '@/stores/user'
import useMenu from './use-menu'
import MenuItem from './menu-item.vue'

const { width = 220 } = defineProps<{
  width?: number | string
}>()

const userStore = useUserStore()

const { isDark } = storeToRefs(useAppStore())

const loading = ref(true)

const { menuItems, generateMenu, onMenuSelect, activeKey, expandedKeys } = useMenu()

menuItems.value = generateMenu(userStore.routerMap!)

loading.value = false
</script>
