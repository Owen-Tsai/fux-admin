<script setup lang="ts">
import {
  createInfoType,
  updateInfoType,
  getInfoTypeDetail,
  type InfoTypeVO,
} from '@/api/information/type'
import type { FormProps, TreeSelectProps, FormInstanceFunctions } from 'tdesign-vue-next'

const { treeData } = defineProps<{
  treeData: TreeSelectProps['data']
}>()
const emit = defineEmits(['success'])

const [statusOpts, booleanOpts] = useDict('common_status', 'infra_boolean_string')
const message = useMessage()

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写菜单名称' }],
  type: [{ required: true, message: '请选择菜单类型' }],
  path: [{ required: true, message: '请填写路由地址' }],
  component: [{ required: true, message: '请填写组件文件路径' }],
}

const visible = ref(false)
const loading = ref(false)

const mode = ref<'create' | 'update'>('create')
const formRef = ref<FormInstanceFunctions>()

const formData = ref<InfoTypeVO>({
  id: undefined,
  sort: 1,
  isAudit: false,
  parentId: undefined,
  status: 0,
})

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (formData.value.parentId === undefined) {
        formData.value.parentId = '0'
      }

      if (mode.value === 'create') {
        await createInfoType(formData.value)
      } else {
        await updateInfoType(formData.value)
      }

      emit('success')
      visible.value = false
      message.success('操作成功')
    }
  } catch (error) {
    console.error(error)
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
  loading.value = false
}

const open = (type: 'create' | 'update', id?: string) => {
  formRef.value?.reset({ type: 'initial' })
  mode.value = type

  if (type === 'create') {
    // add sub menu
    formData.value.id = undefined
    if (id !== undefined) {
      formData.value.parentId = id
    }
  }

  if (type === 'update') {
    loadData(id!)
  }

  visible.value = true
}

defineExpose({ open })
</script>

<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增资讯类别' : '编辑资讯类别'"
    :confirm-loading="loading"
    width="680px"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm ref="formRef" :data="formData" :rules="rules" :label-width="120">
        <TFormItem label="上级资讯类别" name="parentId">
          <TTreeSelect
            v-model:value="formData.parentId"
            :data="treeData"
            :keys="{ label: 'name', value: 'id' }"
            clearable
          />
        </TFormItem>
        <TFormItem label="资讯类别名称" name="name">
          <TInput v-model:value="formData.name" placeholder="请输入资讯类别名称" />
        </TFormItem>
        <TFormItem label="需要审核" name="isAudit" help="开启后，发布该类型的资讯需要审核">
          <TRadioGroup v-model:value="formData.isAudit" :options="booleanOpts" variant="outline" />
        </TFormItem>
        <TRow>
          <TCol :span="12" :lg="6">
            <TFormItem label="显示排序" name="sort">
              <TInputNumber v-model:value="formData.sort" theme="column" class="w-full" />
            </TFormItem>
          </TCol>
          <TCol :span="12" :lg="6">
            <TFormItem label="启用状态" name="status">
              <TRadioGroup v-model:value="formData.status">
                <TRadioButton v-for="opt in statusOpts" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </TRadioButton>
              </TRadioGroup>
            </TFormItem>
          </TCol>
        </TRow>
      </TForm>
    </TLoading>
  </TDialog>
</template>
