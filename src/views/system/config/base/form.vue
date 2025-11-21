
<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增' : '编辑'"
    :confirm-loading="loading"
    width="560px"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm
        ref="formRef"
        :label-width="100"
        :data="formData"
        :rules="rules"
      >
         <TFormItem label="系统名称" name="systemName">
          <TInput v-model:value="formData.systemName" placeholder="请输入系统名称" />
        </TFormItem>
         <TFormItem label="系统描述" name="systemDesc">
          <TInput v-model:value="formData.systemDesc" placeholder="请输入系统描述" />
        </TFormItem>
         <TFormItem label="系统版本" name="systemVersion">
          <TInput v-model:value="formData.systemVersion" placeholder="请输入系统版本" />
        </TFormItem>
         <TFormItem label="版权信息" name="copyright">
          <TInput v-model:value="formData.copyright" placeholder="请输入版权信息" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addConfigBase, updateConfigBase, getConfigBaseDetail, type ConfigBaseVO } from '@/api/system/config/base'
  import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'

  const rules: FormProps['rules'] = {
        systemName: [{ required: true, message: '系统名称不能为空', trigger: 'blur' }],
  }

  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<ConfigBaseVO>({})


  const submit = async () => {
    loading.value = true
    try {
      const result = await formRef.value?.validate()
      if (result === true) {
        if (mode.value === 'create') {
          await addConfigBase(formData.value)
        } else {
          await updateConfigBase(formData.value)
        }

        emit('success')
        visible.value = false
      }
    } catch (e) {
      console.log(e)
    } finally {
      loading.value = false
    }
  }

  const loadData = async (id: number) => {
    loading.value = true
    const res = await getConfigBaseDetail(id)
    formData.value = res
    loading.value = false
  }

  const open = (id?: number) => {
    formRef.value?.reset({ type: 'initial' })
    formData.value.id = undefined
    mode.value = 'create'

    if (id) {
      loadData(id)
      mode.value = 'update'
    } else {
      mode.value = 'create'
    }

    visible.value = true
  }

  defineExpose({ open })
</script>
