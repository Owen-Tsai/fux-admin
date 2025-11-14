
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
         <TFormItem label="姓名" name="name">
          <TInput v-model:value="formData.name" placeholder="请输入姓名" />
        </TFormItem>
         <TFormItem label="身份证号码" name="idcard">
          <TInput v-model:value="formData.idcard" placeholder="请输入身份证号码" />
        </TFormItem>
         <TFormItem label="学历" name="diploma">
          <TSelect v-model:value="formData.diploma" :options="USER_EDUCATION" placeholder="请选择学历" />
        </TFormItem>
         <TFormItem label="所在区县" name="countyCode">
          <TInput v-model:value="formData.countyCode" placeholder="请输入所在区县" />
        </TFormItem>
         <TFormItem label="所在街道" name="streetCode">
          <TInput v-model:value="formData.streetCode" placeholder="请输入所在街道" />
        </TFormItem>
         <TFormItem label="落户地址" name="address">
          <TInput v-model:value="formData.address" placeholder="请输入落户地址" />
        </TFormItem>
         <TFormItem label="落户原因" name="reason">
          <TInput v-model:value="formData.reason" placeholder="请输入落户原因" />
        </TFormItem>
         <TFormItem label="落户时间" name="settlementTime">
          <TDatePicker v-model:value="formData.settlementTime" value-format="x" placeholder="请选择落户时间" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addTalentSettle, updateTalentSettle, getTalentSettleDetail, type TalentSettleVO } from '@/api/application/settle'
  import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'
  import useDict from '@/hooks/use-dict'

  const rules: FormProps['rules'] = {
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
        idcard: [{ required: true, message: '身份证号码不能为空', trigger: 'blur' }],
        countyCode: [{ required: true, message: '所在区县不能为空', trigger: 'blur' }],
        streetCode: [{ required: true, message: '所在街道不能为空', trigger: 'blur' }],
        address: [{ required: true, message: '落户地址不能为空', trigger: 'blur' }],
        settlementTime: [{ required: true, message: '落户时间不能为空', trigger: 'blur' }],
  }

  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<TalentSettleVO>({})

  const [
          USER_EDUCATION,
          YES_NO,
  ] = useDict(
              'user_education',
              'yes_no',
  )

  const submit = async () => {
    loading.value = true
    try {
      const result = await formRef.value?.validate()
      if (result === true) {
        if (mode.value === 'create') {
          await addTalentSettle(formData.value)
        } else {
          await updateTalentSettle(formData.value)
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
    const res = await getTalentSettleDetail(id)
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
