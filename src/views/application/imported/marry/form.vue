
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
         <TFormItem label="女方姓名" name="femaleName">
          <TInput v-model:value="formData.femaleName" placeholder="请输入女方姓名" />
        </TFormItem>
         <TFormItem label="女方身份证件号码" name="femaleIdcard">
          <TInput v-model:value="formData.femaleIdcard" placeholder="请输入女方身份证件号码" />
        </TFormItem>
         <TFormItem label="男方姓名" name="maleName">
          <TInput v-model:value="formData.maleName" placeholder="请输入男方姓名" />
        </TFormItem>
         <TFormItem label="男方身份证件号码" name="maleIdcard">
          <TInput v-model:value="formData.maleIdcard" placeholder="请输入男方身份证件号码" />
        </TFormItem>
         <TFormItem label="登记日期" name="registerDate">
          <TDatePicker v-model:value="formData.registerDate" value-format="x" placeholder="请选择登记日期" />
        </TFormItem>
         <TFormItem label="婚姻状况" name="maritalStatus">
          <TRadioGroup v-model:value="formData.maritalStatus" />
        </TFormItem>
         <TFormItem label="登记机关" name="registerAuthority">
          <TInput v-model:value="formData.registerAuthority" placeholder="请输入登记机关" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addMarryInfo, updateMarryInfo, getMarryInfoDetail, type MarryInfoVO } from '@/api/application/imported/marry'
  import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'
  import useDict from '@/hooks/use-dict'

  const rules: FormProps['rules'] = {
  }

  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<MarryInfoVO>({})

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
          await addMarryInfo(formData.value)
        } else {
          await updateMarryInfo(formData.value)
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
    const res = await getMarryInfoDetail(id)
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
