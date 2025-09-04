<script setup lang="ts">
import { createPolicy, updatePolicy, getPolicyDetail, getCheckboxData, type PolicyVO } from '@/api/system/policy/list'
import useDict from '@/hooks/use-dict'
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'

const message = useMessage()

const [ policyLabel, policyClassification, policyType ] = useDict('policy_label', 'policy_classification', 'policy_type')

const rules: FormProps['rules'] = {
  title: [{ required: true, message: '请填写资讯标题' }],
}

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const loading = ref(false)

const formData = ref<PolicyVO>({
  id: undefined,
  classification: [],
  type: [],
  label: []
})

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'create') {
        await createPolicy(formData.value)
      } else {
        await updatePolicy(formData.value)
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
  const res = await getPolicyDetail(id)
  formData.value = res
  loading.value = false
}

const open = (id?: string) => {
  formRef.value?.reset({ type: 'initial' })
  formData.value.id = undefined
  mode.value = 'create'

  if (id) {
    loadData(id)
    mode.value = 'update'
  }

  visible.value = true
}

const { data: checkboxData } = useRequest(getCheckboxData, { immediate: true })

defineExpose({ open })
</script>

<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增政策' : '编辑政策'"
    :confirm-loading="loading"
    :width="680"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm ref="formRef" :data="formData" :rules="rules" :label-width="150">
        <TRow>
          <TCol :span="12">
            <TFormItem label="政策标题" name="title">
              <TInput v-model:value="formData.title" placeholder="如：XX市住房补贴" />
            </TFormItem>
          </TCol>
          <TCol :span="6">
            <TFormItem label="排序" name="sort">
              <TInputNumber v-model:value="formData.sort" placeholder="请输入排序" />
            </TFormItem>
          </TCol>
          <TCol :span="6" />
          <TCol :span="6">
            <TFormItem label="成文日期" name="sendDate">
              <TDatePicker
                v-model:value="formData.sendDate"
                value-type="time-stamp"
              />
            </TFormItem>
          </TCol>
          <TCol :span="6">
            <TFormItem label="政策级别" name="level">
              <TSelect v-model:value="formData.level" :options="policyLabel" />
            </TFormItem>
          </TCol>
          <TCol :span="12">
            <TFormItem label="政策分类" name="classification">
              <TCheckboxGroup v-model:value="formData.classification" :options="policyClassification" />
            </TFormItem>
          </TCol>
          <TCol :span="12">
            <TFormItem label="人才政策类型" name="type">
              <TCheckboxGroup v-model:value="formData.type" :options="policyType" />
            </TFormItem>
          </TCol>
          <TCol :span="12" v-for="(item, i) in checkboxData" :key="i">
            <TFormItem :label="item.name" name="label">
              <TCheckboxGroup v-model:value="formData.label">
                <TCheckbox v-for="(value, j) in item.optionValue" :key="value" :value="value" :label="item.optionName?.[j]" />
              </TCheckboxGroup>
            </TFormItem>
          </TCol>
          <TCol :span="12">
            <TFormItem label="政策文件" name="document">
              <TInput v-model:value="formData.document" placeholder="请输入政策文件" />
            </TFormItem>
          </TCol>
          <TCol :span="12">
            <TFormItem label="支持对象" name="supportObject">
              <TTextarea v-model:value="formData.supportObject" placeholder="请输入支持对象" />
            </TFormItem>
          </TCol>
          <TCol :span="12">
            <TFormItem label="支持政策" name="supportPolicy">
              <TTextarea v-model:value="formData.supportPolicy" placeholder="请输入支持政策" />
            </TFormItem>
          </TCol>
          <TCol :span="12">
            <TFormItem label="申报条件" name="declarationConditions">
              <TTextarea v-model:value="formData.declarationConditions" placeholder="请输入申报条件" />
            </TFormItem>
          </TCol>
          <TCol :span="12">
            <TFormItem label="主管部门" name="competentDepartment">
              <TInput v-model:value="formData.competentDepartment" placeholder="请输入主管部门" />
            </TFormItem>
          </TCol>
          <TCol :span="12">
            <TFormItem label="联系方式" name="contact">
              <TInput v-model:value="formData.contact" placeholder="请输入联系方式" />
            </TFormItem>
          </TCol>
        </TRow>
      </TForm>
    </TLoading>
  </TDialog>
</template>
