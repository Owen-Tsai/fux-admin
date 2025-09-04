<template>
  <TDialog
    v-model:visible="visible"
    header="菜单权限配置"
    :confirm-loading="loading"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TAlert theme="info">
        <template #message>
          正在设置
          <span class="font-bold">{{ state.name }}（{{ state.code }}）</span>
          的数据权限
        </template>
      </TAlert>
      <TForm ref="formRef" :data="formData" class="!mt-4">
        <TRow :gutter="16" class="w-full">
          <TCol :span="12">
            <TFormItem label="数据权限范围">
              <TSelect v-model:value="formData.dataScope" :options="dataScopeOpts" />
            </TFormItem>
          </TCol>
          <!-- 2: custom -->
          <TCol v-if="formData.dataScope === 2" :span="12">
            <TFormItem label="生效部门">
              <TTreeSelect
                v-model:value="formData.dataScopeDeptIds"
                :data="deptTree"
                multiple
                :loading="pending"
                :keys="{ label: 'name', value: 'id' }"
              />
            </TFormItem>
          </TCol>
        </TRow>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script setup lang="ts">
import { getDeptTree } from '@/api/system/dept'
import type { FormInstanceFunctions } from 'tdesign-vue-next'
import { setRoleDataScope, type RolePermissionVO } from '@/api/system/permission'
import type { RoleVO } from '@/api/system/role'

const visible = ref(false)
const emit = defineEmits(['success'])
const formRef = ref<FormInstanceFunctions>()
const message = useMessage()

const loading = ref(true)
const formData = ref<RolePermissionVO>({})
const state = reactive<RoleVO>({})

const [dataScopeOpts] = useDict('system_data_scope')

const { data: deptTree, pending } = useRequest(getDeptTree, {
  immediate: true,
})

const loadData = async (record: RoleVO) => {
  formData.value.dataScope = record.dataScope
  formData.value.dataScopeDeptIds = record.dataScopeDeptIds
  formData.value.roleId = record.id
  loading.value = false
}

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      await setRoleDataScope(formData.value)
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

const open = (record: RoleVO) => {
  formRef.value?.reset()
  loadData(record)
  state.code = record.code
  state.name = record.name
  visible.value = true
}

defineExpose({ open })
</script>
