<script setup lang="ts">
import { uploadFile } from '@/api/infra/file'
import { FILE_UPLOAD_STORAGE } from '@/utils/constant'
import type { UploadFile, UploadProps, UploadInstanceFunctions } from 'tdesign-vue-next'

const {
  accept,
  requestFn,
  data,
  autoUpload = true,
  disabled,
  draggable,
  loading,
  max,
  multiple,
  name,
  placeholder,
  sizeLimit,
  theme,
  storage = FILE_UPLOAD_STORAGE.PUBLIC,
  beforeUpload,
} = defineProps<{
  requestFn?: (reqData: {
    file: UploadFile | UploadFile[]
    [x: string]: any
  }) => Promise<{ code: number; msg?: string; data: string }>
  accept?: string
  action?: string
  data?: Record<string, any>
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
  storage?: FILE_UPLOAD_STORAGE
  beforeUpload?: UploadProps['beforeUpload']
}>()

const message = useMessage()

// component modal. e.g. `<FileUpload v-model:value="data.src" />`
const value = defineModel<string[] | string>('value')
// list used to display
const fileList = ref<UploadFile[]>([])

// const emit = defineEmits(['update:value', 'start', 'success', 'error', 'finish'])
const emit = defineEmits<{
  (e: 'start'): void
  (e: 'update:value', value: string[] | string): void
  (
    e: 'success',
    data: {
      file?: UploadFile
      fileList?: UploadFile[]
      currentFiles?: UploadFile[]
      value?: string | string[]
    },
  ): void
  (e: 'error', err: any): void
  (e: 'finish'): void
  (e: 'change', files: UploadFile[]): void
}>()

const uploadFn: UploadProps['requestMethod'] = async (files) => {
  emit('start')

  const file = Array.isArray(files) ? files[0] : files

  try {
    const res = requestFn
      ? await requestFn({ file: file as UploadFile, ...data })
      : await uploadFile({ file: (file as UploadFile).raw!, clientId: storage, ...data })

    if (res.code === 0) {
      if (multiple) {
        if (!value.value) value.value = []
        nextTick(() => {
          ;(value.value as string[]).push(res.data)
        })
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
    :data="data"
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
    :before-upload="beforeUpload"
    @success="onSuccess"
    @fail="(error) => $emit('error', error)"
    @change="(files) => $emit('change', files)"
    @remove="onRemove"
  >
    <slot v-if="$slots.default"></slot>
  </TUpload>
</template>
