
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
         <TFormItem label="飘窗标题" name="windowTitle">
          <TInput v-model:value="formData.windowTitle" placeholder="请输入飘窗标题" />
        </TFormItem>
         <TFormItem label="飘窗内容" name="windowContent">
          <TTextarea v-model:value="formData.windowContent" />
        </TFormItem>
         <TFormItem label="自定义宽度" name="customWidth">
          <TInput v-model:value="formData.customWidth" placeholder="请输入自定义宽度（px）" />
        </TFormItem>
         <TFormItem label="自定义高度" name="customHeight">
          <TInput v-model:value="formData.customHeight" placeholder="请输入自定义高度（px）" />
        </TFormItem>
         <TFormItem label="背景颜色" name="bgColor">
          <TInput v-model:value="formData.bgColor" placeholder="请输入背景颜色" />
        </TFormItem>
         <TFormItem label="文本颜色" name="textColor">
          <TInput v-model:value="formData.textColor" placeholder="请输入文本颜色" />
        </TFormItem>
         <TFormItem label="圆角大小" name="borderRadius">
          <TInput v-model:value="formData.borderRadius" placeholder="请输入圆角大小（px）" />
        </TFormItem>
         <TFormItem label="透明度" name="opacity">
          <TInput v-model:value="formData.opacity" placeholder="请输入透明度" />
        </TFormItem>
         <TFormItem label="点击跳转地址" name="clickUrl">
          <TInput v-model:value="formData.clickUrl" placeholder="请输入点击跳转地址" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addConfigFloat, updateConfigFloat, getConfigFloatDetail, type ConfigFloatVO } from '@/api/system/config/float'
  import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'

  const rules: FormProps['rules'] = {
  }

  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<ConfigFloatVO>({})


  const submit = async () => {
    loading.value = true
    try {
      const result = await formRef.value?.validate()
      if (result === true) {
        if (mode.value === 'create') {
          await addConfigFloat(formData.value)
        } else {
          await updateConfigFloat(formData.value)
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
    const res = await getConfigFloatDetail(id)
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
