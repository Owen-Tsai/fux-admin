<script setup lang="ts">
import {
  getAttachmentTypeDetail,
  createAttachmentType,
  updateAttachmentType,
  type AttachmentTypeVO,
} from '@/api/app/attachment'
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'

const message = useMessage()

const [attachmentLibTypeOpts] = useDict('attach_lib_type')

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const loading = ref(false)
const formData = ref<AttachmentTypeVO>({
  required: false,
  isLib: false,
})

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请输入附件类型名称' }],
  moduleName: [{ required: true, message: '请输入附件类型编码' }],
  allowedFileTypes: [
    { required: true, message: '请输入允许上传的文件类型' },
    { validator: (v: string[]) => v.length > 0, message: '请输入允许上传的文件类型' },
  ],
  isLib: [{ required: true, message: '请选择是否从附件库中选取' }],
}

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'create') {
        await createAttachmentType(formData.value)
      } else {
        await updateAttachmentType(formData.value)
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
  const res = await getAttachmentTypeDetail(id)
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

const onIsLibChange = (v: boolean) => {
  if (!v) {
    formData.value.libType = undefined
  }
}

defineExpose({ open })
</script>

<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增附件类型' : '编辑附件类型'"
    :confirm-loading="loading"
    @confirm="submit"
  >
    <TForm ref="formRef" :data="formData" :rules="rules" :label-width="140">
      <TFormItem label="附件类型名称" name="name">
        <TInput v-model:value="formData.name" placeholder="如：身份证" />
      </TFormItem>
      <TFormItem label="附件类型编码" name="moduleName">
        <TInput v-model:value="formData.moduleName" placeholder="如：idCard" />
      </TFormItem>
      <TFormItem
        label="允许的文件类型"
        name="allowedFileTypes"
        help="输入文件后缀，按下 Enter 键可添加多个"
      >
        <TTagInput v-model:value="formData.allowedFileTypes" placeholder="如：pdf" />
      </TFormItem>
      <TFormItem label="最大文件大小" name="maxFileSize">
        <TInputNumber v-model:value="formData.maxFileSize" :min="0" suffix="MB" />
      </TFormItem>
      <TFormItem label="是否必需" name="required">
        <TSwitch v-model:value="formData.required" />
      </TFormItem>
      <TFormItem label="从附件库选取" name="isLib">
        <TSwitch v-model:value="formData.isLib" @change="(v) => onIsLibChange(v as boolean)" />
      </TFormItem>
      <TFormItem v-if="formData.isLib" label="附件库类型" name="libType">
        <TSelect v-model:value="formData.libType" :options="attachmentLibTypeOpts" />
      </TFormItem>
    </TForm>
  </TDialog>
</template>
