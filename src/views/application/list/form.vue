<script setup lang="ts">
import { addApplication, updateApplication, getApplicationDetail, type AppVO } from '@/api/app/app'
import { getDeptSimpleList } from '@/api/system/dept'
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'

const message = useMessage()
const [typeOpts] = useDict('system_application_type')
const { data: deptOpts, pending } = useRequest(getDeptSimpleList, {
  immediate: true,
})

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写应用名称' }],
  type: [{ required: true, message: '请选择应用类型' }],
  userType: [{ required: true, message: '请选择申报主体' }],
}

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const loading = ref(false)

const formData = ref<AppVO>({
  published: 0,
  comopen: 0,
  canImport: false,
  canExport: false,
})

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'create') {
        await addApplication(formData.value)
      } else {
        await updateApplication(formData.value)
      }
      message.success('保存成功')
      emit('success')
      visible.value = false
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const loadData = async (id: string) => {
  loading.value = true
  const res = await getApplicationDetail(id)
  formData.value = res
  loading.value = false
}

const open = (id?: string) => {
  formRef.value?.reset({ type: 'initial' })
  formData.value.id = undefined
  formData.value.createTime = undefined
  mode.value = 'create'

  if (id) {
    loadData(id)
    mode.value = 'update'
  }

  visible.value = true
}

const onUserTypeChange = (value: string) => {
  if (value === '3') {
    formData.value.comopen = 0
  } else {
    formData.value.comopen = undefined
  }
}

defineExpose({ open })
</script>

<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增应用' : '编辑应用'"
    :confirm-loading="loading"
    width="560px"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm ref="formRef" :data="formData" :rules="rules" :label-width="100">
        <TFormItem label="应用名称" name="name">
          <TInput v-model:value="formData.name" placeholder="如：人才分类认定" />
        </TFormItem>
        <TFormItem label="应用代码" name="code">
          <TInput v-model:value="formData.code" placeholder="如：talent_classification" />
        </TFormItem>
        <TFormItem label="业务类别" name="type">
          <TSelect v-model:value="formData.type" :options="typeOpts" />
        </TFormItem>
        <TFormItem label="申报主体" name="userType">
          <TSelect
            v-model:value="formData.userType"
            @change="(v) => onUserTypeChange(v as '3' | '4')"
          >
            <TOption value="3" label="个人申报" />
            <TOption value="4" label="单位申报" />
          </TSelect>
        </TFormItem>
        <TFormItem v-if="formData.userType === '3'" label="申报方式" name="comopen">
          <TRadioGroup v-model:value="formData.comopen">
            <TRadio :value="0" label="个人自主申报" />
            <TRadio :value="1" label="单位开通权限" />
          </TRadioGroup>
        </TFormItem>
        <TFormItem label="主管部门" name="dept">
          <TSelect
            v-model:value="formData.dept"
            :options="deptOpts"
            :loading="pending"
            filterable
            clearable
            :keys="{ label: 'name', value: 'id' }"
            :tree-props="{ expandAll: true }"
          />
        </TFormItem>
        <TFormItem label="应用描述" name="description">
          <TTextarea v-model:value="formData.description" />
        </TFormItem>
        <TRow>
          <TCol :span="6">
            <TFormItem label="前台图标" name="iconFe" help="在用户端展示的图标">
              <FileUpload v-model:value="formData.iconFe" theme="image" />
            </TFormItem>
          </TCol>
          <TCol :span="6">
            <TFormItem label="后台图标" name="iconBe" help="在管理端展示的图标">
              <FileUpload v-model:value="formData.iconBe" theme="image" />
            </TFormItem>
          </TCol>
        </TRow>
        <TRow>
          <TCol :span="6">
            <TFormItem label="允许导入" name="canImport">
              <TSwitch v-model="formData.canImport" />
            </TFormItem>
          </TCol>
          <TCol :span="6">
            <TFormItem label="允许导出" name="canExport">
              <TSwitch v-model="formData.canExport" />
            </TFormItem>
          </TCol>
        </TRow>
      </TForm>
    </TLoading>
  </TDialog>
</template>
