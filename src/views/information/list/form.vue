<template>
  <AModal
    v-model:open="open"
    :title="isAdd ? '发布资讯' : '编辑资讯'"
    destroy-on-close
    :confirm-loading="loading"
    :after-close="resetFields"
    wrap-class-name="fullscreen-modal"
    width="100%"
    @ok="submit"
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
        </AForm>

        <div class="document-wrapper flex-grow">
          <EEditor type="document" v-model:value="formData.content" />
        </div>
      </div>
    </ASpin>
  </AModal>
</template>

<script lang="ts" setup>
import useDict from '@/hooks/use-dict'
import {
  addInformation,
  updateInformation,
  getInformationDetail,
  getInfoTyoeTree,
  type InformationVO,
} from '@/api/information/list'
import { message, type FormInstance, type FormProps } from 'ant-design-vue'
import EEditor from '@/components/editor/index.vue'

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
const formData = ref<InformationVO>({
  isTop: false,
  isHome: true,
  content: '',
})

const [infraBooleanString] = useDict('infra_boolean_string')

const isAdd = computed(() => props.record === undefined)

const treeData = ref()

getInfoTyoeTree().then((res) => {
  treeData.value = res
})

const submit = async () => {
  try {
    loading.value = true
    await formRef.value?.validate()

    if (isAdd.value) {
      await addInformation(formData.value)
      message.success('创建成功')
    } else {
      await updateInformation(formData.value)
      message.success('保存成功')
    }

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
