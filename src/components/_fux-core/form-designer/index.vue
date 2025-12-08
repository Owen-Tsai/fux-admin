<template>
  <div class="flex h-full bg-[var(--td-bg-color-secondarycontainer)]">
    <div class="flex-none w-280px">
      <SidePanel ref="sidePanel" />
    </div>
    <div class="flex-1 min-w-0 min-h-0">
      <Canvas />
    </div>
    <div class="flex-none w-240px">
      <SetterPanel />
    </div>
  </div>
</template>

<script setup lang="ts">
import SidePanel from './side-panel/index.vue'
import SetterPanel from './setter-panel/index.vue'
import Canvas from './canvas/index.vue'
import { useDesignerCtxProvide } from '../hooks'
import type { AppSchema } from '../types'

const props = defineProps<{
  appSchame: AppSchema
}>()

const emit = defineEmits<{
  (e: 'update:appSchema', schema: AppSchema): void
}>()

const cAppSchema = computed({
  get: () => props.appSchame,
  set: (val) => emit('update:appSchema', val),
})

useDesignerCtxProvide(cAppSchema)
</script>

<script lang="ts">
const CTX_KEY = Symbol('sidePanelCtx')
const sidePanel = ref<InstanceType<typeof SidePanel>>()

const showModal = computed(() => sidePanel.value?.showFuncModal)

export const injectSidePanelCtx = () => {
  return injectLocal(CTX_KEY, {
    showModal,
  })
}
</script>
