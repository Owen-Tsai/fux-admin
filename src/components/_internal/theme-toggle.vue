<template>
  <TButton
    theme="default"
    variant="text"
    shape="square"
    :icon="() => h(icon)"
    @click="handleClick"
  />
</template>

<script setup lang="ts">
import { h } from 'vue'
import { SunnyIcon, MoonIcon } from 'tdesign-icons-vue-next'
import useAppStore from '@/stores/app'

const appStore = useAppStore()

const icon = computed(() => {
  return appStore.isDark ? h(SunnyIcon) : h(MoonIcon)
})

const handleClick = () => {
  appStore.toggleDark()
}
</script>
