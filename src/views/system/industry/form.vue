<template>
  <TCard :title="formTitle" class="col-start-2 col-end-4">
    <TEmpty v-show="activeNodes.length <= 0" />

    <TForm
      v-show="activeNodes.length > 0"
      ref="formRef"
      :data="formData"
      :rules="rules"
      :label-width="140"
    >
      <TLoading :loading="loading">
        <TRow>
          <TCol :span="6">
            <TFormItem label="上级行业名称" name="pname">
              {{ formData.pname || '无' }}
            </TFormItem>
          </TCol>
          <TCol :span="6">
            <TFormItem label="上级行业 ID" name="pid">
              {{ formData.pid || '无' }}
            </TFormItem>
          </TCol>
        </TRow>
        <TFormItem label="行业名称" name="name">
          <TInput v-model:value="formData.name" placeholder="请输入行业名称" />
        </TFormItem>
        <TFormItem label="行业编码" name="code">
          <TInput v-model:value="formData.code" placeholder="请输入行业编码" />
        </TFormItem>
        <TFormItem label="排序" name="sort">
          <TInputNumber v-model:value="formData.sort" />
        </TFormItem>
        <div class="flex items-center justify-end gap-2">
          <TButton v-if="mode === 'add'" tyoe="button" theme="default" @click="cancel"
            >取消新增</TButton
          >
          <TButton type="submit" theme="primary" @click="submit">提交</TButton>
        </div>
      </TLoading>
    </TForm>
  </TCard>
</template>

<script setup lang="ts">
import { addIndustry, updateIndustry, getIndustry, type IndustryVO } from '@/api/system/industry'
import type { FormProps, FormInstanceFunctions, TreeProps, TreeNodeModel } from 'tdesign-vue-next'

const activeNodes = defineModel<number[]>('activeNodes', { default: [] })

const emit = defineEmits(['success'])

const mode = ref<'add' | 'edit'>('edit')
const toggle = useToggle(mode, {
  falsyValue: 'add',
  truthyValue: 'edit',
})
const formData = ref<IndustryVO>({})
const loading = ref(false)

const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const message = useMessage()

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请输入行业名称' }],
}

const formTitle = computed(() => {
  if (!activeNodes.value || activeNodes.value.length <= 0) {
    return '编辑行业'
  }
  return mode.value === 'add' ? `在${formData.value?.pname}下新增行业` : `${formData.value?.name}`
})

const onActive: TreeProps['onActive'] = async (value) => {
  toggle('edit')
  if (value.length <= 0) {
    formData.value = {}
    return
  }
  loading.value = true
  const data = await getIndustry(value[0] as string)
  formData.value = data
  loading.value = false
}

const onAdd = (node: TreeNodeModel<IndustryVO>) => {
  toggle('add')
  formData.value = {
    pid: node.data.id,
    pname: node.data.name,
    name: '',
    code: '',
    sort: 0,
    id: '',
  }
}

const submit = async () => {
  loading.value = true
  try {
    const res = await formRef.value?.validate()
    if (res === true) {
      if (mode.value === 'add') {
        await addIndustry(formData.value)
      } else {
        await updateIndustry(formData.value)
      }
      emit('success')
      message.success('保存成功')
    }
  } catch (error) {
    console.log(error)
  } finally {
    loading.value = false
  }
}

const cancel = () => {
  activeNodes.value = []
}

defineExpose({
  onAdd,
  onActive,
})
</script>
