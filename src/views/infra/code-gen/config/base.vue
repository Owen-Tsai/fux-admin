<template>
  <TForm ref="formRef" :data="model" :rules="rules" label-width="120px" class="!mt-4">
    <TRow>
      <TCol :lg="6">
        <TFormItem label="表名称" name="tableName">
          <TInput v-model:value="model.tableName" placeholder="请输入表名称" />
        </TFormItem>
      </TCol>
      <TCol :lg="6">
        <TFormItem label="表描述" name="tableComment">
          <TInput v-model:value="model.tableComment" placeholder="请输入表描述" />
        </TFormItem>
      </TCol>
      <TCol :lg="6">
        <TFormItem label="实体类名称" name="className">
          <TInput v-model:value="model.className" placeholder="请输入实体类名称" />
        </TFormItem>
      </TCol>
      <TCol :lg="6">
        <TFormItem label="作者" name="author">
          <TInput v-model:value="model.author" placeholder="请输入作者名称" />
        </TFormItem>
      </TCol>
      <TCol :lg="6">
        <TFormItem label="是否业务表" name="isBusiness">
          <TSelect v-model:value="model.isBusiness" placeholder="请选择是否业务表">
            <TOption value="1" label="是" />
            <TOption value="0" label="否" />
          </TSelect>
        </TFormItem>
      </TCol>
      <TCol :lg="12">
        <TFormItem label="备注" name="remark">
          <TTextarea v-model:value="model.remark" />
        </TFormItem>
      </TCol>
    </TRow>
  </TForm>
</template>

<script setup lang="ts">
import type { ConfigDetailVO } from '@/api/infra/code-gen'
import type { FormProps, FormInstanceFunctions } from 'tdesign-vue-next'

const rules: FormProps['rules'] = {
  tableName: [{ required: true, message: '请输入表名称' }],
  tableComment: [{ required: true, message: '请输入表描述' }],
  className: [{ required: true, message: '请输入实体类名称' }],
  author: [{ required: true, message: '请输入作者名称' }],
  isBusiness: [{ required: true, message: '请选择是否业务表' }],
}

const model = defineModel<ConfigDetailVO['table']>({ required: true })

const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

defineExpose({ formRef })
</script>
