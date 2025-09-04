<template>
  <div class="btn-add">
    <TPopup v-model:visible="visible" trigger="click" placement="right-top">
      <TButton shape="circle">
        <template #icon>
          <Icon name="add" />
        </template>
      </TButton>

      <template #content>
        <div class="flex gap-2">
          <div class="item" @click="onClick('audit')">
            <div class="icon">
              <Icon name="seal" />
            </div>
            <div class="title">审核人</div>
          </div>
          <div class="item" @click="onClick('group')">
            <div class="icon">
              <Icon name="git-merge" />
            </div>
            <div class="title">条件分支</div>
          </div>
        </div>
      </template>
    </TPopup>
  </div>
</template>

<script setup lang="ts">
const emit = defineEmits(['click'])

const visible = ref(false)

const onClick = (type: 'audit' | 'group') => {
  emit('click', type)
  visible.value = false
}
</script>

<style lang="scss" scoped>
.item {
  @apply flex-center flex-col gap-1 cursor-pointer p-2;
  border-radius: var(--td-radius-medium);
  width: 72px;

  .icon {
    @apply flex-center p-2;
    font-size: var(--td-font-size-headline-small);
    background-color: var(--td-bg-color-secondarycontainer);
    border-radius: var(--td-radius-medium);
  }

  &:not(.disabled):hover {
    background-color: var(--td-bg-color-secondarycontainer);
    .icon {
      background-color: var(--td-brand-color);
      color: var(--td-text-color-anti);
    }
    .title {
      color: var(--td-brand-color);
    }
  }
}
</style>
