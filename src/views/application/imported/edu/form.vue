
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
         <TFormItem label="学历" name="diploma">
          <TInput v-model:value="formData.diploma" placeholder="请输入学历" />
        </TFormItem>
         <TFormItem label="毕业学校" name="graduateSchool">
          <TInput v-model:value="formData.graduateSchool" placeholder="请输入毕业学校" />
        </TFormItem>
         <TFormItem label="毕业时间" name="graduateTime">
          <TDatePicker v-model:value="formData.graduateTime" value-format="x" placeholder="请选择毕业时间" />
        </TFormItem>
         <TFormItem label="专业名称" name="major">
          <TInput v-model:value="formData.major" placeholder="请输入专业名称" />
        </TFormItem>
         <span>请选择字典类型以生成选择框</span>
         <TFormItem label="入学时间" name="startTime">
          <TDatePicker v-model:value="formData.startTime" value-format="x" placeholder="请选择入学时间" />
        </TFormItem>
         <TFormItem label="证书编号" name="certNo">
          <TInput v-model:value="formData.certNo" placeholder="请输入证书编号" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addEduInfo, updateEduInfo, getEduInfoDetail, type EduInfoVO } from '@/api/application/imported/edu'
  import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'

  const rules: FormProps['rules'] = {
  }

  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<EduInfoVO>({})


  const submit = async () => {
    loading.value = true
    try {
      const result = await formRef.value?.validate()
      if (result === true) {
        if (mode.value === 'create') {
          await addEduInfo(formData.value)
        } else {
          await updateEduInfo(formData.value)
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
    const res = await getEduInfoDetail(id)
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
