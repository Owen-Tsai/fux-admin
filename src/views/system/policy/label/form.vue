<script setup lang="ts">
import { createPolicyLabel, updatePolicyLabel, getPolicyLabelDetail, type PolicyLabelVO } from '@/api/system/policy/label'
import useDict from '@/hooks/use-dict'
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'

const message = useMessage()

const [policyLabel] = useDict('policy_label')

const rules: FormProps['rules'] = {
  type: [{ required: true, message: '请选择标签类别' }],
}

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const loading = ref(false)

const formData = ref<PolicyLabelVO>({
  id: undefined,
})

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'create') {
        await createPolicyLabel(formData.value)
      } else {
        await updatePolicyLabel(formData.value)
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
  const res = await getPolicyLabelDetail(id)
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

defineExpose({ open })
</script>

<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增类别' : '编辑类别'"
    :confirm-loading="loading"
    :width="680"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm ref="formRef" :data="formData" :rules="rules" :label-width="150">
        <TRow>
          <TCol :span="12">
            <TFormItem label="标签类别" name="type">
              <TSelect v-model:value="formData.type" placeholder="请选择标签类别" :options="policyLabel" />
            </TFormItem>
          </TCol>
          <TCol :span="12">
            <TFormItem label="标签名" name="name">
              <TInput v-model:value="formData.name" placeholder="请输入标签名" />
            </TFormItem>
          </TCol>
          <TCol :span="12">
            <TFormItem label="字典键值" name="value">
              <TInput v-model:value="formData.value" placeholder="请输入字典键值" />
            </TFormItem>
          </TCol>
        </TRow>
      </TForm>
    </TLoading>
  </TDialog>
</template>
