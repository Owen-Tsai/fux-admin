<template>
  <div class="view">
    <TCard :title="pageHeader">
      <template #actions>
        <div class="flex items-center gap-2">
          <TTooltip content="重新载入">
            <TButton shape="square" variant="text" :loading="pending" @click="execute()">
              <template #icon>
                <Icon name="refresh" />
              </template>
            </TButton>
          </TTooltip>
          <TTooltip content="返回">
            <TButton shape="square" variant="text" @click="onReturn()">
              <template #icon>
                <Icon name="rollback" />
              </template>
            </TButton>
          </TTooltip>
        </div>
      </template>

      <TLoading :loading="pending">
        <TTabs v-model:value="activeTab">
          <TTabPanel :value="0" label="基本信息" :destroy-on-hide="false">
            <BaseConfig v-if="data" ref="baseConfigRef" v-model="data.table" />
          </TTabPanel>
          <TTabPanel :value="1" label="字段信息" :destroy-on-hide="false">
            <ColumnsConfig v-if="data" ref="columnsConfigRef" v-model="data.columns" />
          </TTabPanel>
          <TTabPanel :value="2" label="生成信息" :destroy-on-hide="false">
            <GenerationConfig v-if="data" ref="generationConfigRef" v-model="data.table" />
          </TTabPanel>
        </TTabs>
        <TDivider />
        <div class="flex items-center justify-end gap-2">
          <TButton theme="default" type="button" @click="onReturn()">取 消</TButton>
          <TButton theme="primary" type="button" @click="submit()">保 存</TButton>
        </div>
      </TLoading>
    </TCard>
  </div>
</template>

<script setup lang="ts">
import useTabsStore from '@/stores/tabs'
import BaseConfig from './base.vue'
import ColumnsConfig from './columns.vue'
import GenerationConfig from './generation.vue'
import { getCodeGenConfigDetail, updateCodeGenConfig } from '@/api/infra/code-gen'
import { getFirstErrorMessage } from '@/utils/validate'

const { removeTab } = useTabsStore()
const { query, fullPath } = useRoute()
const id = parseInt(query.id as string)
const activeTab = ref(0)
const pageHeader = computed(
  () => `${data.value?.table.tableName} - ${data.value?.table.tableComment}`,
)

const message = useMessage()

const { data, execute, pending } = useRequest(() => getCodeGenConfigDetail(id), {
  immediate: true,
})

const onReturn = () => {
  removeTab(fullPath, '/infra/code-gen')
}

const baseConfig = useTemplateRef<InstanceType<typeof BaseConfig>>('baseConfigRef')
const generationConfig = useTemplateRef<InstanceType<typeof BaseConfig>>('generationConfigRef')

const submit = async () => {
  pending.value = true
  try {
    const result1 = await baseConfig.value?.formRef?.validate()
    console.log(result1)
    if (result1 !== true) {
      activeTab.value = 0
      const msg = getFirstErrorMessage(result1)
      return msg && message.error(msg)
    }

    const result2 = await generationConfig.value?.formRef?.validate()
    console.log(result2)
    if (result2 !== true) {
      activeTab.value = 0
      const msg = getFirstErrorMessage(result2)
      return msg && message.error(msg)
    }

    await updateCodeGenConfig(data.value!)
    message.success('保存成功')
    execute()
  } catch (e) {
    console.error(e)
  } finally {
    pending.value = false
  }
}
</script>
