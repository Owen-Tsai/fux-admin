<script setup lang="ts">
import { createPolicy, updatePolicy, getPolicyDetail, getCheckboxData, type PolicyVO } from '@/api/system/policy/list'
import useDict from '@/hooks/use-dict'
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'

const message = useMessage()

const [sexOpts] = useDict('policy_label')

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
              <TSelect v-model:value="formData.level" :options="sexOpts" />
            </TFormItem>
          </TCol>
          <TCol :span="12">
            <TFormItem label="政策分类" name="classification">
              <TCheckboxGroup v-model:value="formData.classification" :options="sexOpts" />
            </TFormItem>
          </TCol>
          <TCol :span="12">
            <TFormItem label="政策级别" name="type">
              <TCheckboxGroup v-model:value="formData.type" :options="sexOpts" />
            </TFormItem>
          </TCol>
          <TCol :span="12" v-for="(item, i) in checkboxData" :key="i">
            <TFormItem :label="item.name" name="label">
              <TCheckboxGroup v-model:value="formData.label">
                <TCheckbox v-for="(value, j) in item.optionValue" :key="value" :value="value" :label="item.optionName?.[j]" />
              </TCheckboxGroup>
            </TFormItem>
          </TCol>
        </TRow>
      </TForm>
    </TLoading>
  </TDialog>
</template>
