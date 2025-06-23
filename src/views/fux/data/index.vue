<template>
  <div class="flex-1 min-h-0 px-6 py-4">
    <div class="h-full bg-[var(--td-bg-color-container)] rounded-lg py-6">
      <TForm class="w-5/12 min-w-500px !mx-auto" label-width="100px">
        <TAlert theme="warning">
          <template #message>
            当前应用的 Schema 版本为 <b>44</b>。如不需要重新生成
            Schema，请直接点击页面上方步骤条中的对应环节进行切换。
          </template>
        </TAlert>
      </TForm>
    </div>
  </div>
</template>

<script setup lang="ts"></script>
