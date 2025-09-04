<template>
  <TForm ref="formRef" :data="model" :rules="rules" label-width="120px" class="!mt-4">
    <TAlert
      theme="info"
      message="选择前端类型时，@fusionx/admin v1.2.0 及以上版本请选择 Vue3 Fux 1.2+ 模板，以下版本请选择 Vue3 Fux 模板。"
      class="!mb-4"
    />
    <TLoading :loading="pending1 || pending2">
      <TRow>
        <TCol :lg="6">
          <TFormItem label="生成模板" name="templateType">
            <TSelect v-model:value="model.templateType" :options="infraCodegenTemplateType" />
          </TFormItem>
        </TCol>
        <TCol :lg="6">
          <TFormItem label="前端类型" name="frontType">
            <TSelect v-model:value="model.frontType" :options="infraCodegenFrontType" />
          </TFormItem>
        </TCol>
        <TCol :lg="6">
          <TFormItem label="生成场景" name="scene">
            <TSelect v-model:value="model.scene" :options="infraCodegenScene" />
          </TFormItem>
        </TCol>
        <TCol :lg="6">
          <TFormItem label="上级菜单" name="parentMenuId">
            <TTreeSelect
              v-model:value="model.parentMenuId"
              filterable
              clearable
              :keys="{ label: 'name', value: 'id' }"
              :data="menuTree"
              placeholder="请选择上级菜单"
            />
          </TFormItem>
        </TCol>
        <TCol :lg="6">
          <TFormItem label="模块名称" name="moduleName">
            <TInput v-model:value="model.moduleName" placeholder="请输入模块名称" />
          </TFormItem>
        </TCol>
        <TCol :lg="6">
          <TFormItem label="业务名称" name="businessName">
            <TInput v-model:value="model.businessName" placeholder="请输入业务名称" />
          </TFormItem>
        </TCol>
        <TCol :lg="6">
          <TFormItem label="类名称" name="className">
            <TInput v-model:value="model.className" placeholder="请输入类名称" />
          </TFormItem>
        </TCol>
        <TCol :lg="6">
          <TFormItem label="类描述" name="classComment">
            <TInput v-model:value="model.classComment" placeholder="请输入类描述" />
          </TFormItem>
        </TCol>

        <!-- extra generation info based on template type -->
        <!-- tree table -->
        <template v-if="model.templateType === templateTypeEnums.tree">
          <TDivider>数表设置</TDivider>
          <TCol :lg="6">
            <TFormItem label="上级ID字段" name="treeParentColumnId">
              <TSelect v-model:value="model.treeParentColumnId" placeholder="请选择上级ID字段">
                <TOption v-for="item in columns" :key="item.id">
                  {{ item.javaField }}: {{ item.columnComment }}
                </TOption>
              </TSelect>
            </TFormItem>
          </TCol>
          <TCol :lg="6">
            <TFormItem label="显示名称字段" name="treeNameColumnId">
              <TSelect v-model:value="model.treeNameColumnId" placeholder="请选择显示名称字段">
                <TOption v-for="item in columns" :key="item.id">
                  {{ item.javaField }}: {{ item.columnComment }}
                </TOption>
              </TSelect>
            </TFormItem>
          </TCol>
        </template>

        <!-- child table -->
        <template v-if="model.templateType === templateTypeEnums.child">
          <TDivider>子表设置</TDivider>
          <TCol :lg="6">
            <TFormItem label="关联的主表" name="masterTableId">
              <TSelect v-model:value="model.masterTableId" placeholder="请选择所关联的主表">
                <TOption v-for="item in codeGenConfigList" :key="item.id">
                  {{ item.tableName }}: {{ item.tableComment }}
                </TOption>
              </TSelect>
            </TFormItem>
          </TCol>
          <TCol :lg="6">
            <TFormItem label="子表关联字段" name="subJoinColumnId">
              <TSelect v-model:value="model.subJoinColumnId" placeholder="请选择子表关联的字段">
                <TOption v-for="item in columns" :key="item.id">
                  {{ item.javaField }}: {{ item.columnComment }}
                </TOption>
              </TSelect>
            </TFormItem>
          </TCol>
          <TCol :lg="6">
            <TFormItem label="关联方式" name="subJoinMany">
              <TRadioGroup v-model:value="model.subJoinMany">
                <TRadio :value="true">一对多</TRadio>
                <TRadio :value="false">一对一</TRadio>
              </TRadioGroup>
            </TFormItem>
          </TCol>
        </template>
      </TRow>
    </TLoading>
  </TForm>
</template>

<script setup lang="ts">
import { getPlainCodeGenConfigList, type ConfigDetailVO } from '@/api/infra/code-gen'
import { getMenuTree } from '@/api/system/menu'
import type { FormProps, FormInstanceFunctions } from 'tdesign-vue-next'

const { columns } = defineProps<{
  columns?: ConfigDetailVO['columns']
}>()

const model = defineModel<ConfigDetailVO['table']>({ required: true })

const templateTypeEnums: Readonly<Record<string, number>> = {
  single: 1,
  tree: 2,
  masterStandard: 10,
  masterERP: 11,
  masterNested: 12,
  child: 15,
}

const rules: FormProps['rules'] = {
  templateType: [{ required: true, message: '请选择生成模板的类型' }],
  frontType: [{ required: true, message: '请选择生成模板的前端类型' }],
  scene: [{ required: true, message: '请选择生成模板的使用场景' }],
  moduleName: [{ required: true, message: '请输入模块名称' }],
  businessName: [{ required: true, message: '请输入业务名称' }],
  className: [{ required: true, message: '请输入类名称' }],
  classComment: [{ required: true, message: '请输入类描述' }],
}

const [infraCodegenFrontType, infraCodegenScene, infraCodegenTemplateType] = useDict(
  'infra_codegen_front_type',
  'infra_codegen_scene',
  'infra_codegen_template_type',
)

const { data: menuTree, pending: pending1 } = useRequest(getMenuTree, { immediate: true })
const { data: codeGenConfigList, pending: pending2 } = useRequest(
  () => getPlainCodeGenConfigList(model.value.dataSourceConfigId || 0),
  { immediate: true },
)

const formRef = useTemplateRef<FormInstanceFunctions>('formRef')
defineExpose({ formRef })
</script>
