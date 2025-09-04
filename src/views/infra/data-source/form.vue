<script setup lang="ts">
import {
  getDataSourceDetail,
  addDataSource,
  updateDataSource,
  type DataSourceVO,
} from '@/api/infra/data-source'
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'

const message = useMessage()

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const loading = ref(false)
const formData = ref<DataSourceVO>({})

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请输入数据源名称' }],
  url: [{ required: true, message: '请输入数据源链接地址' }],
  username: [{ required: true, message: '请输入用户名' }],
  password: [{ required: true, message: '请输入密码' }],
}

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'create') {
        await addDataSource(formData.value)
      } else {
        await updateDataSource(formData.value)
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
  const res = await getDataSourceDetail(id)
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
    :header="mode === 'create' ? '新增数据源' : '编辑数据源'"
    :confirm-loading="loading"
    @confirm="submit"
  >
    <TForm ref="formRef" :data="formData" :rules="rules" :label-width="100">
      <TFormItem label="数据源名称" name="name">
        <TInput v-model:value="formData.name" placeholder="如：master" />
      </TFormItem>
      <TFormItem label="数据源链接" name="url">
        <TInput v-model:value="formData.url" placeholder="如：jdbc:mysql://localhost:3306/" />
      </TFormItem>
      <TFormItem label="用户名" name="username">
        <TInput v-model:value="formData.username" />
      </TFormItem>
      <TFormItem label="密码" name="password">
        <TInput v-model:value="formData.password" type="password" />
      </TFormItem>
    </TForm>
  </TDialog>
</template>
