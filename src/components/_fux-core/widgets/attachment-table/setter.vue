<template>
  <div>
    <TAlert theme="info" title="Beta 功能">
      将该组件拖动至画布中。如果是分页表单，建议新增一个标签页用于放置本组件。在生产环境下，本组件将渲染<b>特定应用、特定申报计划中特定的申报</b>所需要和已经上传的组件列表。
    </TAlert>
  </div>
  <TFormItem label="包含导出操作" name="hasButton" class="boolean-setter">
    <TSwitch v-model="props.hasButton" />
  </TFormItem>
  <template v-if="props.hasButton">
    <TFormItem label="URL" name="action">
      <TInput v-model="props.action" placeholder="请输入下载文件的 URL" clearable />
    </TFormItem>
    <TFormItem label="导出按钮文本" name="buttonLabel">
      <TInput v-model="props.buttonLabel" placeholder="默认：导出模板" clearable />
    </TFormItem>
  </template>
</template>

<script setup lang="ts">
import type { WidgetMap } from '@fusionx/core/types'

const props = defineModel<WidgetMap['attachmentTable']['props']>('props', { required: true })
</script>
