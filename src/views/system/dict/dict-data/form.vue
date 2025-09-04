<script setup lang="ts">
import {
  addDictData,
  updateDictData,
  getDictDataDetail,
  type DictDataItemVO,
} from '@/api/system/dict/data'
import type { FormInstanceFunctions, FormProps, TagProps } from 'tdesign-vue-next'

const message = useMessage()
const { params } = useRoute()

const rules: FormProps['rules'] = {
  label: [{ required: true, message: '请填写字典标签' }],
  value: [{ required: true, message: '请填写字典键值' }],
}

const colorTypeOpts: Array<{
  label: string
  value: string
  renderAs: TagProps['theme']
}> = [
  { label: 'primary', value: 'processing', renderAs: 'primary' },
  { label: 'success', value: 'success', renderAs: 'success' },
  { label: 'warning', value: 'warning', renderAs: 'warning' },
  { label: 'danger', value: 'error', renderAs: 'danger' },
  { label: 'default', value: 'default', renderAs: 'default' },
]

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const loading = ref(false)

const formData = ref<Partial<DictDataItemVO>>({
  status: 0,
  sort: 0,
})

const [statusOpts] = useDict('common_status')

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'create') {
        await addDictData(formData.value)
      } else {
        await updateDictData(formData.value)
      }
      message.success('保存成功')
      emit('success')
      visible.value = false
    }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

const loadData = async (id: number) => {
  loading.value = true
  const res = await getDictDataDetail(id)
  formData.value = res
  loading.value = false
}

const open = (id?: number) => {
  formRef.value?.reset({ type: 'initial' })
  formData.value.id = undefined
  formData.value.createTime = undefined
  formData.value.dictType = params.type as string
  mode.value = 'create'

  if (id) {
    loadData(id)
    mode.value = 'update'
  }

  visible.value = true
}

defineExpose({ open })
</script>

<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增字典类型' : '编辑字典类型'"
    :confirm-loading="loading"
    width="520px"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm ref="formRef" :data="formData" :rules="rules" :label-width="100">
        <TFormItem label="字典类型" name="dictType">
          <TInput v-model:value="formData.dictType" readonly />
        </TFormItem>
        <TFormItem label="字典标签" name="label">
          <TInput v-model:value="formData.label" placeholder="请输入字典标签" />
        </TFormItem>
        <TFormItem label="字典键值" name="value">
          <TInput v-model:value="formData.value" placeholder="请输入该项数据对应的键值" />
        </TFormItem>
        <TFormItem label="颜色类型" name="colorType">
          <TSelect v-model:value="formData.colorType">
            <TOption
              v-for="opt in colorTypeOpts"
              :key="opt.value"
              :value="opt.value"
              class="flex items-center gap-1"
            >
              <TTag :theme="opt.renderAs" variant="light-outline">{{ opt.label }}</TTag>
              {{ opt.value }}
            </TOption>
          </TSelect>
        </TFormItem>
        <AFormItem label="CSS Class" name="cssClass">
          <AInput v-model:value="formData.cssClass" placeholder="请输入 CSS Class" />
        </AFormItem>
        <TRow>
          <TCol :span="12" :lg="6">
            <TFormItem label="排序" name="sort">
              <TInputNumber v-model:value="formData.sort" theme="column" />
            </TFormItem>
          </TCol>
          <TCol :span="12" :lg="6">
            <TFormItem label="状态" name="status">
              <TRadioGroup v-model:value="formData.status">
                <TRadioButton v-for="opt in statusOpts" :key="opt.value" :value="opt.value">
                  {{ opt.label }}
                </TRadioButton>
              </TRadioGroup>
            </TFormItem>
          </TCol>
        </TRow>
        <TFormItem label="备注" name="remark">
          <TTextarea v-model:value="formData.remark" />
        </TFormItem>
      </TForm>
    </TLoading>
  </TDialog>
</template>
