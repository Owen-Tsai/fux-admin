
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
         <TFormItem label="企业名称" name="name">
          <TInput v-model:value="formData.name" placeholder="请输入企业名称" />
        </TFormItem>
         <span>请选择字典类型以生成选择框</span>
         <TFormItem label="成立日期" name="establishDate">
          <TDatePicker v-model:value="formData.establishDate" value-format="x" placeholder="请选择成立日期" />
        </TFormItem>
         <TFormItem label="法定代表人" name="legalRep">
          <TInput v-model:value="formData.legalRep" placeholder="请输入法定代表人" />
        </TFormItem>
         <TFormItem label="住所" name="domicile">
          <TInput v-model:value="formData.domicile" placeholder="请输入住所" />
        </TFormItem>
         <TFormItem label="核准日期" name="approveDate">
          <TDatePicker v-model:value="formData.approveDate" value-format="x" placeholder="请选择核准日期" />
        </TFormItem>
         <TFormItem label="经营期限自" name="businessTermStart">
          <TDatePicker v-model:value="formData.businessTermStart" value-format="x" placeholder="请选择经营期限自" />
        </TFormItem>
         <TFormItem label="经营期限至" name="businessTermEnd">
          <TDatePicker v-model:value="formData.businessTermEnd" value-format="x" placeholder="请选择经营期限至" />
        </TFormItem>
         <TFormItem label="经营范围" name="businessScope">
          <TInput v-model:value="formData.businessScope" placeholder="请输入经营范围" />
        </TFormItem>
         <TFormItem label="注册资本" name="registeredCapital">
          <TInput v-model:value="formData.registeredCapital" placeholder="请输入注册资本" />
        </TFormItem>
         <TFormItem label="注册资本币种" name="currency">
          <TInput v-model:value="formData.currency" placeholder="请输入注册资本币种" />
        </TFormItem>
         <TFormItem label="注册号" name="registrationNo">
          <TInput v-model:value="formData.registrationNo" placeholder="请输入注册号" />
        </TFormItem>
         <TFormItem label="统一社会信用代码" name="creditCode">
          <TInput v-model:value="formData.creditCode" placeholder="请输入统一社会信用代码" />
        </TFormItem>
         <TFormItem label="登记机关" name="registrationAuth">
          <TInput v-model:value="formData.registrationAuth" placeholder="请输入登记机关" />
        </TFormItem>
         <TFormItem label="登记状态" name="registrationStatus">
          <TRadioGroup v-model:value="formData.registrationStatus" />
        </TFormItem>
         <TFormItem label="节点号" name="nodeNo">
          <TInput v-model:value="formData.nodeNo" placeholder="请输入节点号" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addComInfo, updateComInfo, getComInfoDetail, type ComInfoVO } from '@/api/application/imported/com'
  import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'
  import useDict from '@/hooks/use-dict'

  const rules: FormProps['rules'] = {
  }

  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<ComInfoVO>({})

  const [
  ] = useDict(
  )

  const submit = async () => {
    loading.value = true
    try {
      const result = await formRef.value?.validate()
      if (result === true) {
        if (mode.value === 'create') {
          await addComInfo(formData.value)
        } else {
          await updateComInfo(formData.value)
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
    const res = await getComInfoDetail(id)
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
