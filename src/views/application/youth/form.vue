
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
         <TFormItem label="姓名" name="name">
          <TInput v-model:value="formData.name" placeholder="请输入姓名" />
        </TFormItem>
         <TFormItem label="出生年月" name="birthday">
          <TDatePicker v-model:value="formData.birthday" value-format="x" placeholder="请选择出生年月" />
        </TFormItem>
         <TFormItem label="学历" name="diploma">
          <TSelect v-model:value="formData.diploma" :options="USER_EDUCATION" placeholder="请选择学历" />
        </TFormItem>
         <TFormItem label="职称" name="professionalTitle">
          <TSelect v-model:value="formData.professionalTitle" :options="PERSONAL_TITLE_LEVEL" placeholder="请选择职称" />
        </TFormItem>
         <TFormItem label="工作单位" name="workUnit">
          <TInput v-model:value="formData.workUnit" placeholder="请输入工作单位" />
        </TFormItem>
         <TFormItem label="技术领域" name="techField">
          <TSelect v-model:value="formData.techField" :options="TEC_FIELD" placeholder="请选择技术领域" />
        </TFormItem>
         <TFormItem label="人才称号" name="talentTitle">
          <TSelect v-model:value="formData.talentTitle" :options="YOUTH_CREATE_TITLE" placeholder="请选择人才称号" />
        </TFormItem>
         <TFormItem label="支持资金" name="supportFund">
          <TInput v-model:value="formData.supportFund" placeholder="请输入支持资金" />
        </TFormItem>
         <TFormItem label="入选年度" name="selectionYear">
          <TInput v-model:value="formData.selectionYear" placeholder="请输入入选年度" />
        </TFormItem>
         <TFormItem label="所在县区" name="county">
          <TSelect v-model:value="formData.county" :options="APPLY_INAREA" placeholder="请选择所在县区" />
        </TFormItem>
         <TFormItem label="本人联系方式" name="contact">
          <TInput v-model:value="formData.contact" placeholder="请输入本人联系方式" />
        </TFormItem>
         <TFormItem label="项目验收结果" name="projectResult">
          <TInput v-model:value="formData.projectResult" placeholder="请输入项目验收结果" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addYouthCreate, updateYouthCreate, getYouthCreateDetail, type YouthCreateVO } from '@/api/application/youth'
  import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'
  import useDict from '@/hooks/use-dict'

  const rules: FormProps['rules'] = {
        idcard: [{ required: true, message: '身份证号不能为空', trigger: 'blur' }],
        name: [{ required: true, message: '姓名不能为空', trigger: 'blur' }],
  }

  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<YouthCreateVO>({})

  const [
          USER_EDUCATION,
          PERSONAL_TITLE_LEVEL,
          TEC_FIELD,
          YOUTH_CREATE_TITLE,
          APPLY_INAREA,
          YES_NO,
  ] = useDict(
              'user_education',
              'personal_title_level',
              'tec_field',
              'youth_create_title',
              'apply_inarea',
              'yes_no',
  )

  const submit = async () => {
    loading.value = true
    try {
      const result = await formRef.value?.validate()
      if (result === true) {
        if (mode.value === 'create') {
          await addYouthCreate(formData.value)
        } else {
          await updateYouthCreate(formData.value)
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
    const res = await getYouthCreateDetail(id)
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
