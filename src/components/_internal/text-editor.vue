<template>
  <Editor
    v-model="value"
    license-key="gpl"
    :toolbar="cToolbar"
    :plugins="cPlugins"
    :init="initOpts"
  />
  <FileUpload
    ref="uploadRef"
    v-model:value="fileUploadProps.url"
    :accept="fileUploadProps.accept"
    :max="1"
    :multiple="false"
    class="hidden"
    @success="({ value }) => onFileUploaded(value)"
  />
</template>

<script setup lang="ts">
import tinymce from 'tinymce'
import Editor from '@tinymce/tinymce-vue'
import useAppStore from '@/stores/app'
import 'tinymce/skins/ui/oxide/skin'
import 'tinymce/skins/ui/oxide-dark/skin'

import 'tinymce/icons/default'
import 'tinymce/models/dom'
import 'tinymce/themes/silver'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/quickbars'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/table'
import 'tinymce/plugins/wordcount'

import FileUpload from '@/components/_internal/file-upload.vue'

tinymce.init({})

const { isDark } = storeToRefs(useAppStore())
const uploadRef = useTemplateRef<InstanceType<typeof FileUpload>>('uploadRef')

const {
  theme = 'normal',
  toolbar,
  plugins,
} = defineProps<{
  theme?: 'normal' | 'document'
  toolbar?: string
  plugins?: string
}>()

const value = defineModel<string>('value')

const cToolbar = computed(
  () =>
    toolbar ||
    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | table image media link | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | forecolor backcolor | removeformat',
)

const cPlugins = computed(() => plugins || 'image link media lists table wordcount quickbars')

const filePickerCallbackRef = ref<(url: string) => void>()

const filePickerCallback = (callback: (url: string) => void, value: string, meta: any) => {
  if (meta.filetype === 'image') {
    filePickerCallbackRef.value = callback
    uploadRef.value?.triggerUpload()
  }
}

const initOpts = {
  promotion: false,
  branding: false,
  language_url: '/tinymce/langs/zh_CN.js',
  language: 'zh_CN',
  menubar: false,
  object_resizing: true,
  toolbar_mode: 'sliding',
  skin: isDark.value ? 'oxide-dark' : 'oxide',
  content_css: isDark.value ? 'dark' : 'default',
  image_advtab: true,
  file_picker_callback: filePickerCallback,
}

const fileUploadProps = reactive({
  url: '',
  accept: 'image/*',
})

const onFileUploaded = (url: string) => {
  if (filePickerCallbackRef.value) {
    filePickerCallbackRef.value(url)
    filePickerCallbackRef.value = undefined
  }
}
</script>
