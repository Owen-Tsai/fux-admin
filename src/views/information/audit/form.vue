<template>
  <AModal
    v-model:open="open"
    title="咨询审核"
    destroy-on-close
    :confirm-loading="loading"
    :after-close="resetFields"
    :body-style="{ overflowX: 'hidden', overflowY: 'auto' }"
    wrap-class-name="fullscreen-modal"
    width="100%"
  >
    <ASpin :spinning="loading">
      <div class="modal-content-wrapper">
        <AForm
          ref="formRef"
          :label-col="{ style: { width: '80px' } }"
          :model="formData"
          :rules="rules"
          class="mt-4"
        >
          <ARow :gutter="24">
            <ACol :span="12">
              <AFormItem label="资讯标题" name="title">
                <AInput v-model:value="formData.title" placeholder="请输入通知资讯的标题" />
              </AFormItem>
            </ACol>
            <ACol :span="6">
              <AFormItem label="资讯类型" name="infotype">
                <ATreeSelect
                  v-model:value="formData.infotype"
                  show-search
                  placeholder="请选择资讯分类"
                  allow-clear
                  tree-default-expand-all
                  :tree-data="treeData"
                  tree-node-filter-prop="label"
                />
              </AFormItem>
            </ACol>
            <ACol :span="6">
              <AFormItem label="是否置顶" name="isTop">
                <ASwitch
                  v-model:checked="formData.isTop"
                  :options="infraBooleanString"
                  checked-children="是"
                  un-checked-children="否"
                />
              </AFormItem>
            </ACol>
          </ARow>
          <ARow :gutter="24">
            <ACol :span="12">
              <AFormItem label="链接地址" name="herfurl">
                <AInput v-model:value="formData.herfurl" placeholder="请输入链接地址" />
              </AFormItem>
            </ACol>
            <ACol :span="6">
              <AFormItem label="发布时间" name="senddate">
                <ADatePicker
                  v-model:value="formData.senddate"
                  value-format="x"
                  show-time
                  placeholder="发布时间"
                />
              </AFormItem>
            </ACol>
            <ACol :span="6">
              <AFormItem label="是否首页" name="isHome">
                <ASwitch
                  v-model:checked="formData.isHome"
                  :options="infraBooleanString"
                  checked-children="是"
                  un-checked-children="否"
                />
              </AFormItem>
            </ACol>
          </ARow>
          <ARow>
            <ACol :span="23">
              <AFormItem label="资讯内容" name="content">
                <EEditor type="document" v-model:value="formData.content" />
              </AFormItem>
            </ACol>
          </ARow>
          <ARow>
            <ACol :span="24">
              <AFormItem label="首页图片" name="imageinfo">
                <FileUpload
                  v-model:value="formData.imageinfo"
                  :client-id="27"
                  list-type="picture-card"
                  :accept="['jpg', 'jpeg', 'png', 'gif']"
                  :multiple="false"
                  :limit="1"
                  :size-limit="10240"
                  disabled
                />
              </AFormItem>
            </ACol>
          </ARow>
          <ARow>
            <ACol :span="12">
              <AFormItem label="附件" name="attachment">
                <FileUpload
                  v-model:value="formData.attachment"
                  :client-id="28"
                  list-type="text"
                  :accept="['pdf', 'doc', 'docx', 'xls', 'xlsx']"
                  :multiple="false"
                  :limit="5"
                  :size-limit="10240"
                  disabled
                />
              </AFormItem>
            </ACol>
          </ARow>
        </AForm>
      </div>
    </ASpin>
    <template #footer>
      <div class="flex items-center justify-end gap-2">
        <AButton @click="open = false">取消</AButton>
        <AButton danger @click="audit(2)" v-if="permission.has('system:info-audit:approve')"
          >不通过</AButton
        >
        <AButton type="primary" @click="audit(1)" v-if="permission.has('system:info-audit:approve')"
          >通过</AButton
        >
      </div>
    </template>
  </AModal>
</template>

<script lang="ts" setup>
import useDict from '@/hooks/use-dict'
import {
  getInformationDetail,
  getInfoTyoeTree,
  auditInformation,
  type InformationVO,
} from '@/api/information/audit'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'
import EEditor from '@/components/editor/index.vue'
import { permission } from '@/hooks/use-permission'
import FileUpload from '@/components/upload/index.vue'

const rules: FormProps['rules'] = {
  title: [{ required: true, message: '请填写标题' }],
  infotype: [{ required: true, message: '请选择资讯类别' }],
  content: [{ required: true, message: '请填写资讯内容' }],
}

const props = defineProps({
  record: {
    type: Object as PropType<InformationVO>,
  },
})

const emit = defineEmits(['success', 'close'])

const formRef = ref<FormInstance>()
const loading = ref(false)
const open = ref(true)
const formData = ref<InformationVO>({})

const [infraBooleanString] = useDict('infra_boolean_string')

const treeData = ref()

getInfoTyoeTree().then((res) => {
  treeData.value = res
})

const audit = async (status: number) => {
  try {
    loading.value = true

    await auditInformation({
      id: formData.value.id,
      auditstate: status,
      review: '审核资讯',
    })
    message.success('审核成功')

    open.value = false
    emit('success')
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

const resetFields = () => {
  formRef.value?.resetFields()
  emit('close')
}

if (props.record?.id) {
  loading.value = true
  getInformationDetail(props.record.id).then((res) => {
    formData.value = res
    loading.value = false
  })
}
</script>

<style lang="scss" scoped>
.modal-content-wrapper {
  @apply flex flex-col;
}
.document-wrapper {
  background-color: var(--color-bg-layout);
  height: calc(100% - 72px);
}
</style>
