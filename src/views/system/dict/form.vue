<script setup lang="ts">
import {
  addDictType,
  updateDictType,
  getDictTypeDetail,
  type DictTypeVO,
} from '@/api/system/dict/type'
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'

const message = useMessage()

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写字典名称' }],
  type: [{ required: true, message: '请填写字典类型' }],
}

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const loading = ref(false)

const formData = ref<DictTypeVO>({
  id: undefined,
  useString: false,
  status: 0,
})

const [statusOpts] = useDict('common_status')

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'create') {
        await addDictType(formData.value)
      } else {
        await updateDictType(formData.value)
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

const loadData = async (id: number) => {
  loading.value = true
  const res = await getDictTypeDetail(id)
  formData.value = res
  loading.value = false
}

const open = (id?: number) => {
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

defineExpose({ open })
</script>

<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增字典类型' : '编辑字典类型'"
    :confirm-loading="loading"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm ref="formRef" :data="formData" :rules="rules" :label-width="100">
        <TFormItem label="字典名称" name="name">
          <TInput v-model:value="formData.name" placeholder="如：用户性别" />
        </TFormItem>
        <TFormItem label="字典类型" name="type">
          <TInput v-model:value="formData.type" placeholder="如：system_user_gender" />
        </TFormItem>
        <TFormItem label="状态" name="status">
          <TRadioGroup v-model:value="formData.status" :options="statusOpts" />
        </TFormItem>
        <TFormItem label="备注" name="remark">
          <TTextarea v-model:value="formData.remark" />
        </TFormItem>
        <TFormItem label="禁用类型推断" name="useString" help="强制将字典数据视为字符串类型">
          <TSwitch v-model:value="formData.useString" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>
