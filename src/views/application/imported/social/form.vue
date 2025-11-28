
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
         <TFormItem label="单位编号" name="unitSocialCode">
          <TInput v-model:value="formData.unitSocialCode" placeholder="请输入单位编号" />
        </TFormItem>
         <TFormItem label="单位名称" name="unitName">
          <TInput v-model:value="formData.unitName" placeholder="请输入单位名称" />
        </TFormItem>
         <TFormItem label="个人编号" name="personalNo">
          <TInput v-model:value="formData.personalNo" placeholder="请输入个人编号" />
        </TFormItem>
         <TFormItem label="姓名" name="name">
          <TInput v-model:value="formData.name" placeholder="请输入姓名" />
        </TFormItem>
         <TFormItem label="缴费年月" name="payYearmonth">
          <TDatePicker v-model:value="formData.payYearmonth" value-format="x" placeholder="请选择缴费年月" />
        </TFormItem>
         <TFormItem label="缴费状态" name="payStatus">
          <TRadioGroup v-model:value="formData.payStatus"  />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addSocialInfo, updateSocialInfo, getSocialInfoDetail, type SocialInfoVO } from '@/api/application/imported/social'
  import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'
  import useDict from '@/hooks/use-dict'

  const rules: FormProps['rules'] = {
  }

  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<SocialInfoVO>({})

  const [
          YES_NO,
  ] = useDict(
              'yes_no',
  )

  const submit = async () => {
    loading.value = true
    try {
      const result = await formRef.value?.validate()
      if (result === true) {
        if (mode.value === 'create') {
          await addSocialInfo(formData.value)
        } else {
          await updateSocialInfo(formData.value)
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
    const res = await getSocialInfoDetail(id)
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
