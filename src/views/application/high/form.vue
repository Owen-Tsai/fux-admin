
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
         <TFormItem label="企业名称" name="companyName">
          <TInput v-model:value="formData.companyName" placeholder="请输入企业名称" />
        </TFormItem>
         <TFormItem label="项目名称" name="projectName">
          <TInput v-model:value="formData.projectName" placeholder="请输入项目名称" />
        </TFormItem>
         <TFormItem label="团队带头人" name="teamLeader">
          <TInput v-model:value="formData.teamLeader" placeholder="请输入团队带头人" />
        </TFormItem>
         <TFormItem label="产业类别" name="industryType">
          <TSelect v-model:value="formData.industryType" :options="TEC_FIELD" placeholder="请选择产业类别" />
        </TFormItem>
         <TFormItem label="投资金额" name="investmentAmount">
          <TInput v-model:value="formData.investmentAmount" placeholder="请输入投资金额" />
        </TFormItem>
         <TFormItem label="落地县区" name="landingCounty">
          <TSelect v-model:value="formData.landingCounty" :options="APPLY_INAREA" placeholder="请选择落地县区" />
        </TFormItem>
         <TFormItem label="联系人" name="contactPerson">
          <TInput v-model:value="formData.contactPerson" placeholder="请输入联系人" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addHighCreateGroup, updateHighCreateGroup, getHighCreateGroupDetail, type HighCreateGroupVO } from '@/api/application/high'
  import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'
  import useDict from '@/hooks/use-dict'

  const rules: FormProps['rules'] = {
  }

  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<HighCreateGroupVO>({})

  const [
          TEC_FIELD,
          APPLY_INAREA,
          YES_NO,
  ] = useDict(
              'tec_field',
              'apply_inarea',
              'yes_no',
  )

  const submit = async () => {
    loading.value = true
    try {
      const result = await formRef.value?.validate()
      if (result === true) {
        if (mode.value === 'create') {
          await addHighCreateGroup(formData.value)
        } else {
          await updateHighCreateGroup(formData.value)
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
    const res = await getHighCreateGroupDetail(id)
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
