
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
         <TFormItem label="参保人证件号" name="idcard">
          <TInput v-model:value="formData.idcard" placeholder="请输入参保人证件号" />
        </TFormItem>
         <TFormItem label="参保人姓名" name="name">
          <TInput v-model:value="formData.name" placeholder="请输入参保人姓名" />
        </TFormItem>
         <TFormItem label="缴费单位名称" name="companyName">
          <TInput v-model:value="formData.companyName" placeholder="请输入缴费单位名称" />
        </TFormItem>
         <TFormItem label="统一社会信用代码" name="orgNum">
          <TInput v-model:value="formData.orgNum" placeholder="请输入统一社会信用代码" />
        </TFormItem>
         <TFormItem label="缴费额度" name="paymentAmount">
          <TInput v-model:value="formData.paymentAmount" placeholder="请输入缴费额度" />
        </TFormItem>
         <TFormItem label="缴费基数" name="paymentBase">
          <TInput v-model:value="formData.paymentBase" placeholder="请输入缴费基数" />
        </TFormItem>
         <!-- <TFormItem label="人员参保状态" name="status">
          <TRadioGroup v-model:value="formData.status" :options="" />
        </TFormItem> -->
         <TFormItem label="开始时间" name="startDate">
          <TDatePicker v-model:value="formData.startDate" value-format="x" placeholder="请选择开始时间" />
        </TFormItem>
         <TFormItem label="备注" name="remark">
          <TInput v-model:value="formData.remark" placeholder="请输入备注" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addMedicalInsurance, updateMedicalInsurance, getMedicalInsuranceDetail, type MedicalInsuranceVO } from '@/api/application/insurance'
  import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'
  import useDict from '@/hooks/use-dict'

  const rules: FormProps['rules'] = {
  }

  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<MedicalInsuranceVO>({})

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
          await addMedicalInsurance(formData.value)
        } else {
          await updateMedicalInsurance(formData.value)
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
    const res = await getMedicalInsuranceDetail(id)
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
