
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
         <TFormItem label="分类" name="sceneryType">
          <TSelect v-model:value="formData.sceneryType" :options="SCENERY_TYPE" placeholder="请选择分类" />
        </TFormItem>
         <TFormItem label="宣传标题" name="title">
          <TInput v-model:value="formData.title" placeholder="请输入宣传标题" />
        </TFormItem>
         <TFormItem label="内容摘要" name="summary">
          <TInput v-model:value="formData.summary" placeholder="请输入内容摘要" />
        </TFormItem>
         <TFormItem label="详细文字内容" name="content">
          <TTextarea v-model:value="formData.content" />
        </TFormItem>
         <TFormItem label="排序字段" name="sortNum">
          <TInput v-model:value="formData.sortNum" placeholder="请输入排序字段" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addScenery, updateScenery, getSceneryDetail, type SceneryVO } from '@/api/application/publish/scenery'
  import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'
  import useDict from '@/hooks/use-dict'

  const rules: FormProps['rules'] = {
        sceneryType: [{ required: true, message: '分类不能为空', trigger: 'change' }],
        title: [{ required: true, message: '宣传标题不能为空', trigger: 'blur' }],
        sortNum: [{ required: true, message: '排序字段不能为空', trigger: 'blur' }],
  }

  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<SceneryVO>({})

  const [
          SCENERY_TYPE,
          SCENERY_STATUS,
          YES_NO,
  ] = useDict(
              'scenery_type',
              'scenery_status',
              'yes_no',
  )

  const submit = async () => {
    loading.value = true
    try {
      const result = await formRef.value?.validate()
      if (result === true) {
        if (mode.value === 'create') {
          await addScenery(formData.value)
        } else {
          await updateScenery(formData.value)
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
    const res = await getSceneryDetail(id)
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
