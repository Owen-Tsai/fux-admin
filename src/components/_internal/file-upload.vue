<script setup lang="ts">
import { uploadFile } from '@/api/infra/file'
import type { UploadFile, UploadProps, UploadInstanceFunctions } from 'tdesign-vue-next'

const {
  accept,
  requestFn,
  autoUpload = true,
  disabled,
  draggable,
  loading,
  max,
  multiple,
  name,
  placeholder,
  sizeLimit = 5 * 1024,
  theme,
} = defineProps<{
  requestFn?: (
    files: UploadFile | UploadFile[],
  ) => Promise<{ code: number; msg?: string; data: string }>
  accept?: string
  theme?: 'file-input' | 'file' | 'image' | 'file-flow' | 'image-flow' | 'custom'
  multiple?: boolean
  max?: number
  sizeLimit?: number
  autoUpload?: boolean
  draggable?: boolean
  disabled?: boolean
  loading?: boolean
  name?: string
  placeholder?: string
}>()

const message = useMessage()

// component modal. e.g. `<FileUpload v-model:value="data.src" />`
const value = defineModel<string | string[]>('value')
// list used to display
const fileList = ref<UploadFile[]>([])
// list to upload
const filesToUpload = ref<UploadFile[]>([])

const uploadUrl = import.meta.env.VITE_UPLOAD_URL

const emit = defineEmits(['update:value', 'start', 'success', 'error', 'finish'])

const uploadFn: UploadProps['requestMethod'] = async (files) => {
  emit('start')

  try {
    if (Array.isArray(files) && requestFn === undefined) {
      console.error('多选模式下请指定上传函数')
      throw new Error('上传失败')
    }

    const res = requestFn
      ? await requestFn(files)
      : await uploadFile({ file: (files as UploadFile).raw! })

    if (res.code === 0) {
      if (Array.isArray(value.value)) {
        value.value.push(res.data)
      } else {
        value.value = res.data
      }
      return Promise.resolve({
        status: 'success',
        response: { url: res.data },
      })
    } else {
      emit('error', res)
      return Promise.resolve({
        status: 'fail',
        error: res.msg || '上传失败',
        response: res,
      })
    }
  } catch (e) {
    emit('error', e)
    return Promise.reject(e)
  } finally {
    emit('finish')
  }
}

const onSuccess: UploadProps['onSuccess'] = ({ fileList, file, currentFiles }) => {
  message.success('上传成功')
  emit('success', { file, fileList, currentFiles, value: value.value })
}

const onRemove: UploadProps['onRemove'] = ({ index }) => {
  if (index === undefined) return

  if (Array.isArray(value.value)) {
    value.value.splice(index, 1)
  } else {
    value.value = ''
  }
}

watch(
  () => value.value,
  (val) => {
    fileList.value = []
    if (!val) return

    if (Array.isArray(val)) {
      if (val.length > 0) {
        fileList.value = val.map((item) => ({
          url: item,
        }))
      }
    } else {
      fileList.value = [{ url: val }]
    }
  },
  { immediate: true },
)

const uploadRef = useTemplateRef<UploadInstanceFunctions>('uploadRef')

const triggerUpload = () => {
  uploadRef.value?.triggerUpload()
}

defineExpose({
  triggerUpload,
})
</script>

<template>
  <TUpload
    ref="uploadRef"
    v-model:files="fileList"
    :accept="accept"
    :action="uploadUrl"
    :auto-upload="autoUpload"
    :request-method="uploadFn"
    :max="max"
    :multiple="multiple"
    :disabled="disabled"
    :draggable="draggable"
    :loading="loading"
    :name="name"
    :placeholder="placeholder"
    :size-limit="sizeLimit"
    :theme="theme"
    @success="onSuccess"
    @remove="onRemove"
  >
    <slot></slot>
  </TUpload>
</template>
