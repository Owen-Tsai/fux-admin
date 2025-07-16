<script setup lang="ts">
import { uploadFile } from '@/api/infra/file'
import type { UploadFile, UploadProps } from 'tdesign-vue-next'

const {
  accept = ['.png', '.jpg', '.jpeg', '.pdf', '.svg', '.doc', '.docx'],
  action,
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

const message = useMessage()

// component modal. e.g. `<FileUpload v-model:value="data.src" />`
const value = defineModel<string | string[]>('value')
// list used to display
const fileList = ref<UploadFile[]>([])
// list to upload
const filesToUpload = ref<UploadFile[]>([])

const uploadUrl = action || import.meta.env.VITE_UPLOAD_URL

const emit = defineEmits(['update:value', 'start', 'success', 'error', 'finish'])

const uploadFn: UploadProps['requestMethod'] = async (files) => {
  emit('start')
  const binary = Array.isArray(files) ? files[0] : files.raw

  try {
    const res = await uploadFile({ file: binary })
    if (res.code === 0) {
      emit('success')
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
  emit('success')

  console.log(fileList, file, currentFiles)
}
</script>

<template>
  <TUpload
    v-model:value="fileList"
    :accept="accept.join(',')"
    :action="uploadUrl"
    :auto-upload="autoUpload"
    :request-method="uploadFn"
    @success="onSuccess"
  ></TUpload>
</template>
