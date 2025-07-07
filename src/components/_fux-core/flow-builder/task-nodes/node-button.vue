<template>
  <div class="btn-add">
    <TPopup tri>
      <TButton shape="circle">
        <template #icon>
          <TIcon name="add" />
        </template>
      </TButton>

      <template #content>
        <div class="flex gap-2">
          <div class="item">
            <div class="icon">
              <TIcon name="seal" />
            </div>
            <div class="title">审核人</div>
          </div>
          <div class="item">
            <div class="icon">
              <TIcon name="git-merge" />
            </div>
            <div class="title">条件分支</div>
          </div>
        </div>
      </template>
    </TPopup>
  </div>
</template>

<style lang="scss" scoped>
.item {
  @apply flex-center flex-col gap-1 cursor-pointer p-2;
  border-radius: var(--td-radius-medium);
  width: 72px;

  .icon {
    @apply size-8 flex-center;
    font-size: var(--td-font-size-headline-large);
    background-color: var(--td-bg-color-secondarycontainer);
    border-radius: var(--td-radius-medium);
  }

  &:not(.disabled):hover {
    background-color: var(--td-bg-color-secondarycontainer);
    .icon {
      background-color: var(--td-brand-color);
      color: var(--td-text-color-anti);
    }
  }
}
</style>
