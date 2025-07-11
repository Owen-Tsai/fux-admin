<template>
  <AModal
    v-model:open="visible"
    :title="mode === 'create' ? '新增菜单' : '编辑菜单'"
    :confirm-loading="loading"
    width="550px"
    @ok="submit"
  >
    <AForm
      ref="formRef"
      :model="formData"
      :rules="rules"
      :label-col="{ style: { width: '120px' } }"
      class="mt-4"
    >
      <ASpin :spinning="loading">
        <AFormItem label="上级资讯类别" name="parentId">
          <ATreeSelect
            v-model:value="formData.parentId"
            show-search
            allow-clear
            :dropdown-style="{ maxHeight: '300px', overflow: 'auto' }"
            tree-default-expand-all
            :tree-data="treeData"
            :field-names="{ label: 'name', value: 'id' }"
            @clear="() => (formData.parentId = '0')"
          />
        </AFormItem>
        <AFormItem label="资讯类别名称" name="name">
          <AInput v-model:value="formData.name" placeholder="请输入资讯类别名称" />
        </AFormItem>
        <ARow>
          <ACol :span="12">
            <AFormItem label="排序" name="sort">
              <AInputNumber v-model:value="formData.sort" class="w-full" />
            </AFormItem>
          </ACol>
          <ACol :span="12">
            <AFormItem label="启用状态" name="status">
              <ARadioGroup
                v-model:value="formData.status"
                :options="commonStatus"
                option-type="button"
              />
            </AFormItem>
          </ACol>
        </ARow>
        <ARow>
          <ACol :span="12">
            <AFormItem label="是否上架移动端" name="isInMobile">
              <ARadioGroup
                v-model:value="formData.isInMobile"
                :options="infraBooleanString"
                option-type="button"
              />
            </AFormItem>
          </ACol>
          <ACol :span="12">
            <AFormItem label="是否需要审核" name="isAudit">
              <ARadioGroup
                v-model:value="formData.isAudit"
                :options="infraBooleanString"
                option-type="button"
              />
            </AFormItem>
          </ACol>
        </ARow>
      </ASpin>
    </AForm>
  </AModal>
</template>

<script lang="ts" setup>
import { message, type FormInstance, type TreeSelectProps, type FormProps } from 'ant-design-vue'
import {
  getInfoTypeDetail,
  createInfoType,
  updateInfoType,
  type InformationTypeVO,
} from '@/api/information/type'
import useDict from '@/hooks/use-dict'
import logger from '@/utils/logger'

const [commonStatus, infraBooleanString] = useDict('common_status', 'infra_boolean_string')

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写菜单名称' }],
  sort: [{ required: true, message: '请填写排序' }],
}

const { treeData } = defineProps<{
  treeData: TreeSelectProps['treeData']
}>()

const visible = ref(false)
const loading = ref(false)

const mode = ref<'create' | 'update'>('create')
const formRef = ref<FormInstance>()
const emit = defineEmits(['success'])

const isCustomLayout = ref(false)

const formData = ref<InformationTypeVO>({
  status: 0,
  sort: 1,
  isInMobile: true,
  isAudit: true,
})

const submit = async () => {
  loading.value = true
  try {
    await formRef.value?.validate()
    if (formData.value.parentId === undefined) {
      formData.value.parentId = '0'
    }
    if (mode.value === 'create') {
      // add
      await createInfoType(formData.value)
    } else {
      // edit
      await updateInfoType(formData.value)
    }

    message.success('保存成功')
    visible.value = false
    emit('success')
  } catch (e) {
    logger.error(import.meta.url, '表单提交失败。', e)
  } finally {
    loading.value = false
  }
}

const loadData = async (id: string) => {
  loading.value = true
  const data = await getInfoTypeDetail(id)
  if (data.parentId === '0') {
    data.parentId = undefined
  }
  formData.value = data
  isCustomLayout.value = !!data.customLayout
  loading.value = false
}

const open = (type: 'create' | 'update', id?: string) => {
  formRef.value?.resetFields()
  mode.value = type

  if (type === 'create' && id) {
    // add sub menu
    formData.value.parentId = id
    formData.value.id = undefined
  }

  if (type === 'update') {
    loadData(id!)
  }

  visible.value = true
}

defineExpose({ open })
</script>
