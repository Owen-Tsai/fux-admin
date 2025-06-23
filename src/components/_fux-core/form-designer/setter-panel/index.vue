<template>
  <div
    class="flex bg-[var(--td-bg-color-container)] h-full border-l border-l-[var(--td-border-level-1-color)] border-l-solid"
  >
    <TTabs v-model:value="activeTab" theme="card" class="setter-tabs w-full h-full">
      <TTabPanel value="form" label="表单配置" lazy>
        <div class="p-4">
          <FormSetter />
        </div>
      </TTabPanel>
      <TTabPanel value="widget" label="组件配置" lazy class="h-full">
        <Scrollbar wrapper-class="!h-full" class="!h-full">
          <div class="p-4 pb-20">
            <widgetSetter />
          </div>
        </Scrollbar>
      </TTabPanel>
    </TTabs>
  </div>
</template>

<script setup lang="ts">
import FormSetter from './form-setter.vue'
import widgetSetter from './widget-setter.vue'

const activeTab = ref('form')
</script>

<style lang="scss" scoped>
.setter-tabs {
  :deep(.t-tabs__nav-wrap) {
    width: 100% !important;
  }
  :deep(.t-tabs__nav-item) {
    width: 50% !important;
    justify-content: center !important;
  }
  :deep(.t-form__item.boolean-setter) {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 0 !important;
  }
  :deep(.t-tabs__content) {
    height: 100%;
  }
}
</style>
