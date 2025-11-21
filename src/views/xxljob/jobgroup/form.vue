
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
         <TFormItem label="AppName" name="appName">
          <TInput v-model:value="formData.appName" placeholder="请输入AppName" clearable />
        </TFormItem>
         <TFormItem label="名称" name="title">
          <TInput v-model:value="formData.title" placeholder="请输入应用名称" clearable />
        </TFormItem>
        <TFormItem label="注册方式" name="addressType">
          <t-select v-model:value="formData.addressType" clearable @change="onAddressTypeChange">
            <t-option :key="0" label="自动注册" :value="0" />
            <t-option ::key="1" label="手动注册" :value="1" />
          </t-select>
        </TFormItem>
         <TFormItem label="机器地址" name="addressList">
           <t-textarea v-model="formData.addressList" placeholder="请输入执行机器地址,多个地址用逗号隔开" clearable :disabled="formData.addressType === 0" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addJobGroup, updateJobGroup, getJobGroupDetail, type JobGroupVO } from '@/api/xxljob/jobgroup'
  import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'

  const rules: FormProps['rules'] = {
        appName: [{ required: true, message: '执行器名称不能为空', trigger: 'blur' }],
        title: [{ required: true, message: '应用名称不能为空', trigger: 'blur' }],
        addressType: [{ required: true, message: '注册方式不能为空', trigger: 'change' }],
  }

  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<JobGroupVO>({})


  const submit = async () => {
    loading.value = true
    try {
      const result = await formRef.value?.validate()
      if (result === true) {
        if (mode.value === 'create') {
          await addJobGroup(formData.value)
        } else {
          await updateJobGroup(formData.value)
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
    const res = await getJobGroupDetail(id)
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
      formData.value.addressType = 0
    }

    visible.value = true
  }

  defineExpose({ open })

  const onAddressTypeChange = (value: number) => {
    if (value === 0) {
      formData.value.addressList = ''
    }
  }
</script>
