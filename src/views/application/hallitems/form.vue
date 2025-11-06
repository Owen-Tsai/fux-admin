<template>
  <TDialog
    v-model:visible="visible"
    :confirm-loading="loading"
    :header="mode === 'create' ? '新增' : '编辑'"
    width="560px"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm ref="formRef" :data="formData" :label-width="100" :rules="rules">
        <TFormItem label="事项名称" name="itemName">
          <TInput v-model:value="formData.itemName" placeholder="请输入事项名称" />
        </TFormItem>
        <TFormItem label="事项描述" name="description">
          <TTextarea v-model:value="formData.description" />
        </TFormItem>
        <TFormItem label="入口链接" name="linkUrl">
          <TInput v-model:value="formData.linkUrl" placeholder="请输入事项入口链接" />
        </TFormItem>
        <TFormItem label="事项图标" name="iconPath">
          <FileUpload v-model:value="formData.iconPath" theme="image" />
        </TFormItem>
        <TFormItem label="排序" name="sortOrder">
          <TInput v-model:value="formData.sortOrder" placeholder="请输入排序" />
        </TFormItem>
        <TFormItem label="状态" name="status">
          <TRadioGroup v-model:value="formData.status" :options="SYSTEM_APPLICATION_STATUS" />
        </TFormItem>
        <TFormItem label="是否热门" name="isHot">
          <TRadioGroup v-model:value="formData.isHot" :options="INFRA_BOOLEAN_STRING" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
import {
  addHallItems,
  getHallItemsDetail,
  type HallItemsVO,
  updateHallItems,
} from '@/api/application/hallitems'
import { type FormInstanceFunctions, type FormProps } from 'tdesign-vue-next'
import useDict from '@/hooks/use-dict'

const rules: FormProps['rules'] = {
  itemName: [{ required: true, message: '事项名称不能为空', trigger: 'blur' }],
  linkUrl: [{ required: true, message: '事项入口链接不能为空', trigger: 'blur' }],
  sortOrder: [{ required: true, message: '排序不能为空', trigger: 'blur' }],
  status: [{ required: true, message: '状态不能为空', trigger: 'blur' }],
  isHot: [{ required: true, message: '是否热门不能为空', trigger: 'blur' }],
}

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const loading = ref(false)

const formData = ref<HallItemsVO>({})

const [SYSTEM_APPLICATION_STATUS, INFRA_BOOLEAN_STRING] = useDict('system_application_status', 'infra_boolean_string')

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'create') {
        await addHallItems(formData.value)
      } else {
        await updateHallItems(formData.value)
      }

      emit('success')
      visible.value = false
    }
  } catch (e) {
    console.log(e)
  } finally {
    loading.value = false
  }
}

const loadData = async (id: number) => {
  loading.value = true
  const res = await getHallItemsDetail(id)
  formData.value = res
  loading.value = false
}

const open = (id?: number) => {
  formRef.value?.reset({ type: 'initial' })
  formData.value.id = undefined
  mode.value = 'create'

  if (id) {
    loadData(id)
    mode.value = 'update'
  } else {
    mode.value = 'create'
  }

  visible.value = true
}

defineExpose({ open })
</script>
