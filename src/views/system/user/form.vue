<script lang="ts" setup>
import type { FormInstanceFunctions, FormProps } from 'tdesign-vue-next'
import useDict from '@/hooks/use-dict'
import useRequest from '@/hooks/use-request'
import { getUserDetail, updateUser, createUser, type UserVO } from '@/api/system/user'
import { getDeptTree } from '@/api/system/dept'

const formRef = useTemplateRef<FormInstanceFunctions>('formRef')
const message = useMessage()

const rules: FormProps['rules'] = {
  username: [{ required: true, message: '请填写用户账号', trigger: 'blur' }],
  password: [{ required: true, message: '请填写初始密码', trigger: 'blur' }],
  nickname: [{ required: true, message: '请填写用户名称', trigger: 'blur' }],
}

const emit = defineEmits(['success'])

const mode = ref<'create' | 'update'>('create')
const visible = ref(false)
const loading = ref(false)
const formData = ref<UserVO>({
  status: 0,
})

const [sexOpts, statusOpts] = useDict('system_user_sex', 'common_status')

const { data, pending } = useRequest(getDeptTree, { immediate: true })

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      if (mode.value === 'create') {
        await createUser(formData.value)
      } else {
        await updateUser(formData.value)
      }
      message.success('保存成功')
      visible.value = false
      emit('success')
    }
  } catch (_e) {
  } finally {
    loading.value = false
  }
}

const loadData = async (id: number) => {
  loading.value = true
  const data = await getUserDetail(id)
  formData.value = data
  loading.value = false
}

const open = (id?: number) => {
  formRef.value?.reset({ type: 'initial' })
  formData.value.id = undefined
  formData.value.createTime = undefined
  mode.value = 'create'

  if (id) {
    loadData(id)
    mode.value = 'update'
  }

  visible.value = true
}

const setDept = (deptId: number | string) => {
  formData.value.deptId = deptId
}

defineExpose({ open, setDept })
</script>

<template>
  <TDialog
    v-model:visible="visible"
    :header="mode === 'create' ? '新增用户' : '编辑用户'"
    :confirm-loading="loading"
    :width="680"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm ref="formRef" :data="formData" :rules="rules">
        <TRow :gutter="16" class="w-full">
          <TCol :span="12" :lg="mode === 'create' ? 6 : 12">
            <TFormItem label="用户账号" name="username">
              <TInput v-model:value="formData.username" />
            </TFormItem>
          </TCol>
          <TCol v-if="mode === 'create'" :span="12" :lg="6">
            <TFormItem label="初始密码" name="password">
              <TInput v-model:value="formData.password" type="password" />
            </TFormItem>
          </TCol>
          <TCol :span="12" :lg="6">
            <TFormItem label="用户名称" name="nickname">
              <TInput v-model:value="formData.nickname" />
            </TFormItem>
          </TCol>
          <TCol :span="12" :lg="6">
            <TFormItem label="所属部门" name="deptId">
              <TTreeSelect
                v-model:value="formData.deptId"
                :data="data"
                value-type="value"
                :keys="{ label: 'name', value: 'id' }"
                :loading="pending"
              />
            </TFormItem>
          </TCol>
          <TCol :span="12" :lg="6">
            <TFormItem label="手机号码" name="mobile">
              <TInput v-model:value="formData.mobile" />
            </TFormItem>
          </TCol>
          <TCol :span="12" :lg="6">
            <TFormItem label="邮箱" name="email">
              <TInput v-model:value="formData.email" />
            </TFormItem>
          </TCol>
          <TCol :span="12" :lg="6">
            <TFormItem label="性别" name="sex">
              <TSelect v-model:value="formData.sex" :options="sexOpts" />
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
