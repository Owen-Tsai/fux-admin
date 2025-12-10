<template>
  <TFormItem label="自定义上传地址" name="action" help="留空将使用项目统一配置">
    <TInput v-model:value="props.action" clearable />
  </TFormItem>
  <TFormItem label="存储配置" name="storage" help="留空时将使用「公开」存储配置">
    <TSelect
      v-model:value="props.storage"
      :options="data?.list || []"
      :loading="pending"
      :keys="{ label: 'name', value: 'id' }"
      clearable
      placeholder="请选择存储配置"
    />
  </TFormItem>
  <TFormItem label="展示形式" name="theme">
    <TSelect
      v-model:value="props.theme"
      :options="themeOpts"
      clearable
      placeholder="请选择展示形式"
    />
  </TFormItem>
  <TFormItem label="文件类型限制" name="accept" help="以逗号分隔">
    <TInput v-model:value="props.accept" clearable placeholder=".png,.jpg,.pdf" />
  </TFormItem>
  <TFormItem label="文件大小限制" name="sizeLimit">
    <TInputNumber v-model:value="props.sizeLimit" clearable theme="row" suffix="KB" />
  </TFormItem>
  <TFormItem label="允许多选" name="multiple" class="boolean-setter">
    <TSwitch v-model:value="props.multiple" />
  </TFormItem>
  <TFormItem v-if="props.multiple" label="最大上传数量" name="max">
    <TInputNumber v-model:value="props.max" clearable />
  </TFormItem>
  <TFormItem label="禁用" name="disabled" class="boolean-setter">
    <TSwitch v-model:value="props.disabled" />
  </TFormItem>
  <TFormItem label="只读" name="readonly" class="boolean-setter">
    <TSwitch v-model:value="props.readonly" />
  </TFormItem>
  <TFormItem label="隐藏" name="hide" class="boolean-setter">
    <TSwitch v-model:value="props.hide" />
  </TFormItem>
</template>

<script setup lang="ts">
import { getConfigList } from '@/api/infra/file/config'
import type { WidgetMap } from '@fusionx/core/types'

const themeOpts = [
  { label: '文件输入框', value: 'file-input' },
  { label: '文件', value: 'file' },
  { label: '图片', value: 'image' },
  { label: '文件卡片', value: 'file-flow' },
  { label: '图片卡片', value: 'image-flow' },
]

const { data, pending } = useRequest(() => getConfigList({ pageNo: 1, pageSize: 99 }), {
  immediate: true,
})

const props = defineModel<WidgetMap['upload']['props']>('props', { required: true })
</script>
