
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
         <TFormItem label="贷款总额" name="loanTotal">
          <TInput v-model:value="formData.loanTotal" placeholder="请输入贷款总额" />
        </TFormItem>
         <TFormItem label="公积金贷款金额" name="fundLoanAmount">
          <TInput v-model:value="formData.fundLoanAmount" placeholder="请输入公积金贷款金额" />
        </TFormItem>
         <TFormItem label="银行名称" name="bankName">
          <TInput v-model:value="formData.bankName" placeholder="请输入银行名称" />
        </TFormItem>
         <TFormItem label="借款人姓名" name="borrowerName">
          <TInput v-model:value="formData.borrowerName" placeholder="请输入借款人姓名" />
        </TFormItem>
         <TFormItem label="借款人证件号码" name="borrowerIdcard">
          <TInput v-model:value="formData.borrowerIdcard" placeholder="请输入借款人证件号码" />
        </TFormItem>
         <TFormItem label="单位名称" name="unitName">
          <TInput v-model:value="formData.unitName" placeholder="请输入单位名称" />
        </TFormItem>
         <TFormItem label="配偶姓名" name="spouseName">
          <TInput v-model:value="formData.spouseName" placeholder="请输入配偶姓名" />
        </TFormItem>
         <TFormItem label="配偶证件号" name="spouseIdcard">
          <TInput v-model:value="formData.spouseIdcard" placeholder="请输入配偶证件号" />
        </TFormItem>
         <TFormItem label="手机号码" name="phone">
          <TInput v-model:value="formData.phone" placeholder="请输入手机号码" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addReserveFundLoan, updateReserveFundLoan, getReserveFundLoanDetail, type ReserveFundLoanVO } from '@/api/application/loan'
  import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'

  const rules: FormProps['rules'] = {
        loanTotal: [{ required: true, message: '贷款总额不能为空', trigger: 'blur' }],
        fundLoanAmount: [{ required: true, message: '公积金贷款金额不能为空', trigger: 'blur' }],
        bankName: [{ required: true, message: '银行名称不能为空', trigger: 'blur' }],
        borrowerName: [{ required: true, message: '借款人姓名不能为空', trigger: 'blur' }],
        borrowerIdcard: [{ required: true, message: '借款人证件号码不能为空', trigger: 'blur' }],
        unitName: [{ required: true, message: '单位名称不能为空', trigger: 'blur' }],
        spouseName: [{ required: true, message: '配偶姓名不能为空', trigger: 'blur' }],
        spouseIdcard: [{ required: true, message: '配偶证件号不能为空', trigger: 'blur' }],
        phone: [{ required: true, message: '手机号码不能为空', trigger: 'blur' }],
  }

  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<ReserveFundLoanVO>({})


  const submit = async () => {
    loading.value = true
    try {
      const result = await formRef.value?.validate()
      if (result === true) {
        if (mode.value === 'create') {
          await addReserveFundLoan(formData.value)
        } else {
          await updateReserveFundLoan(formData.value)
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
    const res = await getReserveFundLoanDetail(id)
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
