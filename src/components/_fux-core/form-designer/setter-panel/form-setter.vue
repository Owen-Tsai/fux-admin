<template>
  <TForm :data="appSchema" label-align="top" layout="inline">
    <TFormItem label="字段标签位置">
      <TSelect v-model:value="appSchema.form.labelAlign" :options="labelAlignOpts" />
    </TFormItem>
    <TFormItem label="标签列宽度" help="输入含单位的值(px/%/rem/...)">
      <TInput v-model:value="appSchema.form.labelWidth" />
    </TFormItem>
    <TFormItem label="必填标记">
      <TSelect v-model:value="appSchema.form.requiredMark" :options="requiredMarkOpts" />
    </TFormItem>
    <TFormItem label="显示标签后的冒号" class="boolean-setter">
      <TSwitch v-model:value="appSchema.form.colon" />
    </TFormItem>
    <TFormItem label="表单只读" class="boolean-setter">
      <TSwitch v-model:value="appSchema.form.readonly" />
    </TFormItem>
    <TFormItem label="表单禁用" class="boolean-setter">
      <TSwitch v-model:value="appSchema.form.disabled" />
    </TFormItem>
    <AppLifecycleSetter />
  </TForm>
</template>

<script setup lang="ts">
import { useDesignerCtxInject } from '@fusionx/core/hooks'
import { labelAlignOpts, requiredMarkOpts } from '../../utils/form-setter-opts'
import AppLifecycleSetter from './app-lifecycle-setter.vue'

const { appSchema } = useDesignerCtxInject()!
</script>
