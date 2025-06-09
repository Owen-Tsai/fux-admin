<template>
  <TCard title="数据资产" class="card !text-[var(--td-text-color-anti)] z-0">
    <div class="grid grid-cols-2">
      <TStatistic title="人才总量" :value="2938764" />
      <TStatistic title="数据总量" :value="65.92" suffix="GB" />
      <TStatistic title="人才变化量" :value="65.92" suffix="GB" />
    </div>

    <img :src="bgIcon" class="absolute bottom-0 right-0 h-full -z-1 opacity-30" />
  </TCard>
</template>

<script setup lang="ts">
import bgIcon from '@/assets/img/bg-3d.svg'
</script>

<style lang="scss" scoped>
.card {
  background: linear-gradient(135deg, rgba(0, 82, 217, 1) 0%, rgba(37, 117, 252, 1) 100%);
  :deep(.t-card__title) {
    color: var(--td-text-color-anti);
  }
  :deep(.t-statistic) {
    color: var(--td-text-color-anti);
  }
  :deep(.t-statistic-content) {
    color: var(--td-text-color-anti);
  }
}
</style>
