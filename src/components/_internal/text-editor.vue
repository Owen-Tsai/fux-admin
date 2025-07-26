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
    v-model:value="fileUrl"
    :accept="fileAccept"
    :max="1"
    :multiple="false"
    class="hidden"
    @success="({ file, value }) => onFileUploaded(value!, file)"
  />
</template>

<script setup lang="ts">
import tinymce, { type EditorOptions } from 'tinymce'
import Editor from '@tinymce/tinymce-vue'
import useAppStore from '@/stores/app'
import 'tinymce/skins/ui/oxide/skin'
import 'tinymce/skins/ui/oxide-dark/skin'
import 'tinymce/skins/ui/oxide/content'

import 'tinymce/icons/default'
import 'tinymce/models/dom'
import 'tinymce/themes/silver'
import 'tinymce/plugins/autoresize'
import 'tinymce/plugins/advlist'
import 'tinymce/plugins/image'
import 'tinymce/plugins/link'
import 'tinymce/plugins/lists'
import 'tinymce/plugins/media'
import 'tinymce/plugins/searchreplace'
import 'tinymce/plugins/table'
import 'tinymce/plugins/wordcount'

import FileUpload from '@/components/_internal/file-upload.vue'
import type { UploadFile } from 'tdesign-vue-next'

tinymce.init({})

const { isDark } = storeToRefs(useAppStore())
const uploadRef = useTemplateRef<InstanceType<typeof FileUpload>>('uploadRef')

const { toolbar, plugins } = defineProps<{
  toolbar?: string
  plugins?: string
}>()

const value = defineModel<string>('value')

const cToolbar = computed(
  () =>
    toolbar ||
    'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | table link | imageUpload videoUpload | alignleft aligncenter alignright alignjustify | outdent indent | numlist bullist | forecolor backcolor | removeformat',
)

const cPlugins = computed(() => plugins || 'image link media lists table wordcount')

const filePickerCallbackRef = ref<(url: string, name?: string) => void>()

const setupEditor: EditorOptions['setup'] = (editor) => {
  editor.ui.registry.addButton('imageUpload', {
    icon: 'image',
    tooltip: '插入图片',
    onAction: () => {
      fileAccept.value = 'image/*'
      setTimeout(() => {
        uploadRef.value?.triggerUpload()
      }, 1)
      filePickerCallbackRef.value = (url: string) => editor.execCommand('insertImage', false, url)
    },
  })

  editor.ui.registry.addButton('videoUpload', {
    icon: 'embed',
    tooltip: '插入视频',
    onAction: () => {
      fileAccept.value = 'video/*'
      setTimeout(() => {
        uploadRef.value?.triggerUpload()
      }, 1)
      filePickerCallbackRef.value = (url: string) => {
        editor.execCommand('insertHTML', false, `<video src="${url}" controls></video>`)
      }
    },
  })
}

const initOpts: Partial<EditorOptions> = {
  promotion: false,
  branding: false,
  language_url: '/tinymce/langs/zh_CN.js',
  language: 'zh_CN',
  menubar: false,
  toolbar_mode: 'sliding',
  skin: isDark.value ? 'oxide-dark' : 'oxide',
  setup: setupEditor,
  file_picker_types: 'file image media',
  font_size_formats: '12px 14px 16px 18px 20px 22px 24px 26px 32px 40px 48px 56px 64px 72px',
  font_family_formats:
    '系统默认字体=sans-serif;微软雅黑=Microsoft YaHei,arial,helvetica,sans-serif;宋体=SimSun,sans-serif;仿宋=FangSong,sans-serif;楷体=KaiTi,sans-serif;黑体=SimHei,sans-serif;Arial=arial,helvetica,sans-serif;Arial Black=arial black,avant garde;',
}

const fileUrl = ref<string>()
const fileAccept = ref<string>('*')

const onFileUploaded = (url: string, file?: UploadFile) => {
  if (filePickerCallbackRef.value) {
    filePickerCallbackRef.value(url, file?.name)
    filePickerCallbackRef.value = undefined
  }
}
</script>
