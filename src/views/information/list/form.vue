<script setup lang="ts">
import { createInfo, updateInfo, getInfoDetail, type InformationVO } from '@/api/information/list'
import { getInfoTypeTree } from '@/api/information/type'
import { getDeptSimpleList } from '@/api/system/dept'
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'

const message = useMessage()

const { data: deptOpts, pending: deptPending } = useRequest(getDeptSimpleList, {
  immediate: true,
})
const { data: typeOpts, pending: typePending } = useRequest(getInfoTypeTree, {
  immediate: true,
})

const rules: FormProps['rules'] = {
  title: [{ required: true, message: '请填写资讯标题' }],
  infoType: [{ required: true, message: '请选择资讯类别' }],
  publishTime: [{ required: true, message: '请选择资讯发布时间' }],
  content: [{ required: true, message: '请填写资讯内容' }],
}

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const loading = ref(false)

const formData = ref<InformationVO>({
  id: undefined,
  sort: 1,
  isPinned: false,
  isInHome: false,
})

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'create') {
        await createInfo(formData.value)
      } else {
        await updateInfo(formData.value)
      }
      message.success('保存成功')
      emit('success')
      visible.value = false
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const loadData = async (id: string) => {
  loading.value = true
  const res = await getInfoDetail(id)
  formData.value = res
  loading.value = false
}

const open = (id?: string) => {
  formRef.value?.reset({ type: 'initial' })
  formData.value.id = undefined
  formData.value.createTime = undefined
  mode.value = 'create'

  if (id) {
    loadData(id)
    mode.value = 'update'
  }

  visible.value = true
}

defineExpose({ open })
</script>

<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增资讯' : '编辑资讯'"
    :confirm-loading="loading"
    mode="full-screen"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm ref="formRef" :data="formData" :rules="rules" :label-width="100">
        <TRow>
          <TCol :span="12">
            <TFormItem label="资讯标题" name="title">
              <TInput v-model:value="formData.title" placeholder="如：人才分类认定" />
            </TFormItem>
          </TCol>
          <TCol :span="6">
            <TFormItem label="资讯类别" name="infoType">
              <TTreeSelect
                v-model:value="formData.infoType"
                :data="typeOpts"
                :loading="typePending"
                :keys="{ label: 'name', value: 'id' }"
                :tree-props="{ expandAll: true }"
                clearable
              />
            </TFormItem>
          </TCol>
          <TCol :span="6">
            <TFormItem label="发布时间" name="publishTime" help="发布时间将覆盖默认的创建时间">
              <TDatePicker
                v-model:value="formData.publishTime"
                enable-time-picker
                value-type="time-stamp"
              />
            </TFormItem>
          </TCol>
          <TCol :span="6">
            <TFormItem label="置顶资讯" name="isPinned">
              <TSwitch v-model:value="formData.isPinned" />
            </TFormItem>
          </TCol>
          <TCol :span="6">
            <TFormItem label="在首页展示" name="isInHome">
              <TSwitch v-model:value="formData.isInHome" />
            </TFormItem>
          </TCol>
          <TCol :span="12">
            <TFormItem label="资讯内容" name="content">
              <TextEditor v-model:value="formData.content" />
            </TFormItem>
          </TCol>
          <TCol :span="6">
            <TFormItem label="资讯图片" name="image" help="资讯图片将被用于在轮播等场景下展示">
              <FileUpload v-model:value="formData.image" :max="1" theme="image" draggable>
              </FileUpload>
            </TFormItem>
          </TCol>
          <TCol :span="6">
            <TFormItem label="附件" name="attachment">
              <FileUpload v-model:value="formData.attachment" multiple />
            </TFormItem>
          </TCol>
        </TRow>
      </TForm>
    </TLoading>
  </TDialog>
</template>
