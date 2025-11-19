
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
         <TFormItem label="字体家族" name="fontFamily">
          <TInput v-model:value="formData.fontFamily" placeholder="请输入字体家族" />
        </TFormItem>
         <TFormItem label="标题字体大小" name="fontSizeTitle">
          <TInput v-model:value="formData.fontSizeTitle" placeholder="请输入标题字体大小（px）" />
        </TFormItem>
         <TFormItem label="内容字体大小" name="fontSizeContent">
          <TTextarea v-model:value="formData.fontSizeContent" placeholder="请输入内容字体大小（px）" />
        </TFormItem>
         <TFormItem label="标题字重" name="fontWeightTitle">
          <TInput v-model:value="formData.fontWeightTitle" placeholder="请输入标题字重" />
        </TFormItem>
         <TFormItem label="内容字重" name="fontWeightBase">
          <TInput v-model:value="formData.fontWeightBase" placeholder="请输入内容字重" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addConfigFont, updateConfigFont, getConfigFontDetail, type ConfigFontVO } from '@/api/system/config/font'
  import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'

  const rules: FormProps['rules'] = {
  }

  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<ConfigFontVO>({})


  const submit = async () => {
    loading.value = true
    try {
      const result = await formRef.value?.validate()
      if (result === true) {
        if (mode.value === 'create') {
          await addConfigFont(formData.value)
        } else {
          await updateConfigFont(formData.value)
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
    const res = await getConfigFontDetail(id)
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
