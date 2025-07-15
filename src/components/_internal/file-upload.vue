<script setup lang="ts">
import { uploadFile } from '@/api/infra/file'
import type { UploadFile, UploadProps } from 'tdesign-vue-next'

const {
  accept = ['.png', '.jpg', '.jpeg', '.pdf', '.svg', '.doc', '.docx'],
  action,
  autoUpload,
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
  action?: string
  accept?: string[]
  theme?: 'single-input' | 'file' | 'image' | 'file-flow' | 'image-flow'
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

// component modal. e.g. `<FileUpload v-model:value="data.src" />`
const value = defineModel<string[]>('value')
// list used to display
const fileList = ref<UploadFile[]>([])
// list to upload
const filesToUpload = ref<UploadFile[]>([])

const uploadUrl = action || import.meta.env.VITE_UPLOAD_URL

const emit = defineEmits(['update:value', 'start', 'success', 'error', 'finish'])

const uploadFn: UploadProps['requestMethod'] = async (files) => {
  emit('start')
  try {
    const res = await uploadFile({ file: files })
    if (res.code === 0) {
      emit('success')
      return Promise.resolve({
        status: 'success',
        response: res,
      })
    } else {
      emit('error', res)
      throw new Error('上传文件失败')
    }
  } catch (e) {
    emit('error', e)
    return Promise.reject(e)
  } finally {
    emit('finish')
  }
}

const onSuccess = () => {}
</script>

<template>
  <TUpload
    v-model:value="fileList"
    :accept="accept.join(',')"
    :action="uploadUrl"
    :auto-upload="autoUpload"
    :request-method="uploadFn"
  ></TUpload>
</template>
