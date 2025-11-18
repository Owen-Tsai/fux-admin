<template>
  <TRadioGroup v-model:value="active" variant="default-filled" class="block">
    <TRadioButton :value="0">审核设置</TRadioButton>
    <TRadioButton :value="1">字段控制设置</TRadioButton>
  </TRadioGroup>
  <TForm v-show="active === 0" :data="node" class="!mt-4">
    <TFormItem
      label="审核人"
      name="actor.strategy"
      :rules="[{ required: true, message: '请选择审核人' }]"
    >
      <TSelect
        v-model="node.actor.strategy"
        :options="auditActorStrategyOpts"
        @change="onStrategyChange"
      />
    </TFormItem>
    <TFormItem
      v-if="node.actor.strategy === TaskNodeActorStrategy.ROLE"
      label="选择角色"
      name="actor.value"
      :rules="[{ required: true, message: '请选择角色' }]"
    >
      <TSelect
        v-model="node.actor.value"
        :options="roleOptions"
        :loading="pending"
        placeholder="请选择角色"
        :keys="{ label: 'name', value: 'id' }"
        :filterable="true"
        :clearable="true"
        multiple
        @change="onRoleChange"
      />
    </TFormItem>
    <TFormItem
      label="会签"
      name="joint"
      help="会签时，所有审核人员都需要审核通过后才可继续下一任务环节"
    >
      <TSwitch v-model:value="node.joint" />
    </TFormItem>
  </TForm>
  <TForm v-show="active === 1" :data="node.fieldsInteractivity" label-width="0" class="!mt-4">
    <div v-for="(field, index) in node.fieldsInteractivity" :key="index" class="flex gap-2">
      <div class="flex-1 flex items-center gap-2">
        <TFormItem class="min-w-0">
          <TInput label="字段名" v-model:value="field.name" />
        </TFormItem>
        <TFormItem class="min-w-0">
          <TSelect label="控制方式" v-model="field.config" :options="fieldOverrideOpts" />
        </TFormItem>
      </div>
      <TButton
        shape="square"
        variant="text"
        theme="danger"
        class="flex-none"
        @click="node.fieldsInteractivity.splice(index, 1)"
      >
        <template #icon>
          <Icon name="delete" />
        </template>
      </TButton>
    </div>
    <TButton block @click="node.fieldsInteractivity.push({})">添加字段配置</TButton>
  </TForm>
</template>

<script setup lang="ts">
import { TaskNodeActorStrategy } from '@fusionx/core/utils'
import { getSimpleAuditList } from '@/api/system/role'
import type { TaskNodePropsMap } from '@fusionx/core/types'

const auditActorStrategyOpts = [
  { label: '指定角色', value: TaskNodeActorStrategy.ROLE },
  { label: '所属单位', value: TaskNodeActorStrategy.ORG },
]

const fieldOverrideOpts = [
  { label: '可见', value: 'shown' },
  { label: '隐藏', value: 'hidden' },
  { label: '只读', value: 'readonly' },
  { label: '可编辑', value: 'writable' },
]

const node = defineModel<TaskNodePropsMap['audit']>('node', { required: true })

const active = ref(0)

const { data: roleOptions, pending } = useRequest(getSimpleAuditList, { immediate: true })

const onStrategyChange = () => {
  const strategy = node.value.actor.strategy
  if (strategy === TaskNodeActorStrategy.ORG) {
    node.value.actor.value = ['org']
    node.value.actor.text = '发起人所属单位'
  } else {
    node.value.actor.value = []
  }
}

const onRoleChange = () => {
  const first = node.value.actor.value?.[0]
  node.value.actor.text = roleOptions.value?.find((u) => u.id === first)?.name
}
</script>

<style lang="scss" scoped>
.block {
  @apply w-full;
  :deep(.t-radio-button) {
    width: 50%;
    justify-content: center;
  }
}
</style>
