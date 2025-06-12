<script setup lang="ts">
const { custom, hideAdd, hideRefresh } = defineProps<{
  custom?: Array<{
    icon: string
    handler: () => void
    label: string
  }>
  hideAdd?: Boolean
  hideRefresh?: Boolean
}>()

const emit = defineEmits<{
  (e: 'add'): void
  (e: 'refresh'): void
}>()
</script>

<template>
  <div class="flex items-center gap-2">
    <TButton v-if="!hideAdd" theme="primary" @click="emit('add')">
      <template #icon>
        <TIcon name="add" />
      </template>
      新增
    </TButton>

    <TTooltip v-if="!hideRefresh" content="重新载入">
      <TButton shape="square" variant="text" @click="emit('refresh')">
        <template #icon>
          <TIcon name="refresh" />
        </template>
      </TButton>
    </TTooltip>

    <template v-for="(item, i) in custom" :key="i">
      <TTooltip :content="item.label">
        <TButton shape="square" variant="text" @click="() => item.handler()">
          <template #icon>
            <TIcon :name="item.icon" />
          </template>
        </TButton>
      </TTooltip>
    </template>
  </div>
</template>
