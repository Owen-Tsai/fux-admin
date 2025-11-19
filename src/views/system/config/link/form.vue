
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
         <TFormItem label="链接名称" name="linkName">
          <TInput v-model:value="formData.linkName" placeholder="请输入链接名称" />
        </TFormItem>
         <TFormItem label="链接地址" name="linkUrl">
          <TInput v-model:value="formData.linkUrl" placeholder="请输入链接地址" />
        </TFormItem>
         <TFormItem label="链接Logo地址" name="linkLogo">
          <TInput v-model:value="formData.linkLogo" placeholder="请输入链接Logo地址" />
        </TFormItem>
         <TFormItem label="链接描述" name="linkDesc">
          <TInput v-model:value="formData.linkDesc" placeholder="请输入链接描述" />
        </TFormItem>
         <TFormItem label="排序序号" name="orderNum">
          <TInput v-model:value="formData.orderNum" placeholder="请输入排序序号" />
        </TFormItem>
         <TFormItem label="打开方式" name="openType">
          <TInput v-model:value="formData.openType" placeholder="请输入打开方式（blank-新窗口，self-当前窗口）" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addConfigLink, updateConfigLink, getConfigLinkDetail, type ConfigLinkVO } from '@/api/system/config/link'
  import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'

  const rules: FormProps['rules'] = {
        linkName: [{ required: true, message: '链接名称不能为空', trigger: 'blur' }],
        linkUrl: [{ required: true, message: '链接地址不能为空', trigger: 'blur' }],
  }

  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<ConfigLinkVO>({})


  const submit = async () => {
    loading.value = true
    try {
      const result = await formRef.value?.validate()
      if (result === true) {
        if (mode.value === 'create') {
          await addConfigLink(formData.value)
        } else {
          await updateConfigLink(formData.value)
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
    const res = await getConfigLinkDetail(id)
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
