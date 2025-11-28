
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
         <TFormItem label="身份证号" name="idcard">
          <TInput v-model:value="formData.idcard" placeholder="请输入身份证号" />
        </TFormItem>
         <TFormItem label="缴费期别" name="payPeriod">
          <TInput v-model:value="formData.payPeriod" placeholder="请输入缴费期别" />
        </TFormItem>
         <TFormItem label="缴费基数" name="payBase">
          <TInput v-model:value="formData.payBase" placeholder="请输入缴费基数" />
        </TFormItem>
         <TFormItem label="缴费金额" name="payAmount">
          <TInput v-model:value="formData.payAmount" placeholder="请输入缴费金额" />
        </TFormItem>
         <TFormItem label="单位编号" name="unitNo">
          <TInput v-model:value="formData.unitNo" placeholder="请输入单位编号" />
        </TFormItem>
         <TFormItem label="参保地行政区划代码" name="insuredAreaCode">
          <TInput v-model:value="formData.insuredAreaCode" placeholder="请输入参保地行政区划代码" />
        </TFormItem>
         <TFormItem label="个人身份" name="personalIdentity">
          <TInput v-model:value="formData.personalIdentity" placeholder="请输入个人身份" />
        </TFormItem>
         <TFormItem label="缴费年月" name="payYearmonth">
          <TDatePicker v-model:value="formData.payYearmonth" value-format="x" placeholder="请选择缴费年月" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addInsurInfo, updateInsurInfo, getInsurInfoDetail, type InsurInfoVO } from '@/api/application/imported/insur'
  import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'

  const rules: FormProps['rules'] = {
  }

  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<InsurInfoVO>({})


  const submit = async () => {
    loading.value = true
    try {
      const result = await formRef.value?.validate()
      if (result === true) {
        if (mode.value === 'create') {
          await addInsurInfo(formData.value)
        } else {
          await updateInsurInfo(formData.value)
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
    const res = await getInsurInfoDetail(id)
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
