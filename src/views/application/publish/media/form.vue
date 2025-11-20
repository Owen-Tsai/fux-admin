
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
         <TFormItem label="报道标题" name="title">
          <TInput v-model:value="formData.title" placeholder="请输入报道标题" />
        </TFormItem>
         <TFormItem label="报道摘要" name="summary">
          <TInput v-model:value="formData.summary" placeholder="请输入报道摘要" />
        </TFormItem>
         <TFormItem label="报道文字内容" name="content">
          <TTextarea v-model:value="formData.content" />
        </TFormItem>
         <TFormItem label="媒体名称" name="mediaName">
          <TInput v-model:value="formData.mediaName" placeholder="请输入媒体名称" />
        </TFormItem>
         <TFormItem label="报道来源" name="mediaSource">
          <TInput v-model:value="formData.mediaSource" placeholder="请输入报道来源" />
        </TFormItem>
         <TFormItem label="报道日期" name="reportTime">
          <TDatePicker v-model:value="formData.reportTime" value-format="x" placeholder="请选择报道日期" />
        </TFormItem>
         <TFormItem label="存储类型" name="publishMediaType">
          <TSelect v-model:value="formData.publishMediaType" :options="PUBLISH_MEDIA_TYPE" placeholder="请选择存储类型" />
        </TFormItem>
         <TFormItem label="排序字段" name="sortNum">
          <TInput v-model:value="formData.sortNum" placeholder="请输入排序字段" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
  import { addMedia, updateMedia, getMediaDetail, type MediaVO } from '@/api/application/publish/media'
  import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'
  import useDict from '@/hooks/use-dict'

  const rules: FormProps['rules'] = {
        title: [{ required: true, message: '报道标题不能为空', trigger: 'blur' }],
        publishMediaType: [{ required: true, message: '存储类型不能为空', trigger: 'change' }],
        sortNum: [{ required: true, message: '排序字段不能为空', trigger: 'blur' }],
  }

  const mode = ref<'create' | 'update'>('create')
  const visible = ref(false)

  const emit = defineEmits(['success'])
  const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

  const loading = ref(false)

  const formData = ref<MediaVO>({})

  const [
          PUBLISH_MEDIA_TYPE,
          YES_NO,
  ] = useDict(
              'publish_media_type',
              'yes_no',
  )

  const submit = async () => {
    loading.value = true
    try {
      const result = await formRef.value?.validate()
      if (result === true) {
        if (mode.value === 'create') {
          await addMedia(formData.value)
        } else {
          await updateMedia(formData.value)
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
    const res = await getMediaDetail(id)
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
