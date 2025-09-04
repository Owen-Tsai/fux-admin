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
          的菜单权限
        </template>
      </TAlert>
      <TForm ref="formRef" :data="formData" class="!mt-4">
        <TRow :gutter="16" class="w-full">
          <TCol :span="12">
            <TFormItem label="菜单权限">
              <TTreeSelect
                v-model:value="formData.menuIds"
                :data="menuTree"
                multiple
                :loading="pending"
                :keys="{ label: 'name', value: 'id' }"
                :min-collapsed-num="8"
                :tree-props="{ valueMode: 'all' }"
              />
            </TFormItem>
          </TCol>
        </TRow>
      </TForm>
    </TLoading>
  </TDialog>
</template>

<script setup lang="ts">
import { getMenuTree } from '@/api/system/menu'
import type { FormInstanceFunctions } from 'tdesign-vue-next'
import { getRoleMenuList, setRoleMenuList, type RolePermissionVO } from '@/api/system/permission'
import type { RoleVO } from '@/api/system/role'

const visible = ref(false)
const emit = defineEmits(['success'])
const formRef = ref<FormInstanceFunctions>()
const message = useMessage()

const loading = ref(true)
const formData = ref<RolePermissionVO>({})
const state = reactive<RoleVO>({})

const { data: menuTree, pending } = useRequest(getMenuTree, {
  immediate: true,
})

const loadData = async (id: number) => {
  const ret = await getRoleMenuList(id)
  formData.value.menuIds = ret
  formData.value.roleId = id
  loading.value = false
}

const submit = async () => {
  loading.value = true
  try {
    const result = await formRef.value?.validate()
    if (result === true) {
      await setRoleMenuList(formData.value)
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
  loadData(record.id!)
  state.code = record.code
  state.name = record.name
  visible.value = true
}

defineExpose({ open })
</script>
