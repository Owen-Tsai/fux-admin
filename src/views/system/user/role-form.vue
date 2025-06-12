<script setup lang="ts">
import { type FormInstanceFunctions } from 'tdesign-vue-next'
import { setUserRole, getUserRoles } from '@/api/system/permission'
import { getRoleSimpleList } from '@/api/system/role'
import type { UserVO } from '@/api/system/user'

const emit = defineEmits(['success'])

const visible = ref(false)
const formRef = useTemplateRef<FormInstanceFunctions>('formRef')

const message = useMessage()

const loading = ref(false)
const state = ref<{ roleIds: number[]; id?: number; nickname?: string }>({
  roleIds: [],
})

const submit = async () => {
  loading.value = true
  const result = await formRef.value?.validate()
  if (result === true) {
    await setUserRole(state.value.id!, state.value.roleIds)
    message.success('保存成功')
    emit('success')
    visible.value = false
  }
  loading.value = false
}

const { data, pending, execute } = useRequest(getRoleSimpleList, {
  async onSuccess() {
    const data = await getUserRoles(state.value.id!)
    state.value.roleIds = data
    loading.value = false
  },
})

const open = (record: UserVO) => {
  formRef.value?.reset()
  execute()
  state.value.id = record.id
  state.value.nickname = record.nickname
  visible.value = true
}

defineExpose({ open })
</script>

<template>
  <TDialog v-model:visible="visible" header="分配角色" :confirm-loading="loading" @confirm="submit">
    <TAlert theme="info">
      <template #message>
        正在分配
        <span class="font-bold">{{ state.nickname }}</span>
        的角色
      </template>
    </TAlert>

    <TForm ref="formRef" :data="state" label-width="60px" class="!my-4">
      <TFormItem label="角色" name="roleIds">
        <TSelect
          v-model:value="state.roleIds"
          :options="data"
          multiple
          :keys="{ label: 'name', value: 'id' }"
          :loading="pending || loading"
        />
      </TFormItem>
    </TForm>
  </TDialog>
</template>
