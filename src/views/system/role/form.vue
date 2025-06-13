<script setup lang="ts">
import { addRole, updateRole, getRoleDetail, type RoleVO } from '@/api/system/role'
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'

const message = useMessage()

const rules: FormProps['rules'] = {
  name: [{ required: true, message: '请填写角色名称', trigger: 'blur' }],
  code: [{ required: true, message: '请填写角色标识', trigger: 'blur' }],
}

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)

const emit = defineEmits(['success'])
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const loading = ref(false)

const formData = ref<RoleVO>({
  sort: 0,
  status: 0,
})

const [statusOpts] = useDict('common_status')

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'create') {
        await addRole(formData.value)
      } else {
        await updateRole(formData.value)
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
  const res = await getRoleDetail(id)
  formData.value = res
  loading.value = false
}

const open = (id?: number) => {
  formRef.value?.reset()
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
    :header="mode === 'create' ? '新增角色' : '编辑角色'"
    :confirm-loading="loading"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm ref="formRef" :data="formData" :rules="rules" :label-width="88">
        <TRow :gutter="16" class="w-full">
          <TCol :span="12">
            <TFormItem label="角色名称" name="name">
              <TInput v-model:value="formData.name" />
            </TFormItem>
          </TCol>
          <TCol :span="12">
            <TFormItem label="角色标识" name="code">
              <TInput v-model:value="formData.code" />
            </TFormItem>
          </TCol>
          <TCol :span="12" :lg="6">
            <TFormItem label="显示顺序" name="sort">
              <TInputNumber v-model:value="formData.sort" theme="column" />
            </TFormItem>
          </TCol>
          <TCol :span="12" :lg="6">
            <TFormItem label="状态" name="status">
              <TSelect v-model:value="formData.status" :options="statusOpts" />
            </TFormItem>
          </TCol>
          <TCol :span="12">
            <TFormItem label="备注" name="remark">
              <TTextarea v-model:value="formData.remark" :maxlength="200" />
            </TFormItem>
          </TCol>
        </TRow>
      </TForm>
    </TLoading>
  </TDialog>
</template>
