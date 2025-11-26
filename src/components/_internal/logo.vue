<template>
  <img :src="logo" alt="FusionX Logo" />
</template>

<script setup lang="ts">
import useAppStore from '@/stores/app'
import logoSimple from '@/assets/brand/logo-simple.svg'
import logoSimpleD from '@/assets/brand/logo-simple-d.svg'
import logofull from '@/assets/brand/logo-full copy.svg'
import logofullD from '@/assets/brand/logo-full-d copy.svg'

const { isDark } = storeToRefs(useAppStore())

const { type = 'simple' } = defineProps<{
  type?: 'full' | 'simple'
}>()

const logo = computed(() => {
  return isDark.value === true
    ? type === 'full'
      ? logofullD
      : logoSimpleD
    : type === 'full'
      ? logofull
      : logoSimple
})
</script>
