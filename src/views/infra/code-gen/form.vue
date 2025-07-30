<script setup lang="ts">
import type { FormInstanceFunctions } from 'tdesign-vue-next'
import { createCodeGenConfig, type CodeGenCreateReqVO } from '@/api/infra/code-gen'
import { useTable, columns } from './use-form-table.ts'
import type { DataSourceVO } from '@/api/infra/data-source'

const loading = ref(false)
const visible = ref(false)

const { dataSourceList } = defineProps<{
  dataSourceList?: DataSourceVO[]
}>()

const tableNames = ref<string[]>([])
const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')

const { data, pending, query, execute, onQueryChange } = useTable(queryForm)

const emit = defineEmits(['success'])

const submit = async () => {
  try {
    loading.value = true
    await createCodeGenConfig({
      dataSourceConfigId: query.value.dataSourceConfigId || 0,
      tableNames: tableNames.value,
    })

    visible.value = false
    emit('success')
  } catch (e) {
    // do nothing at the moment
    // until we have a unified error handling precedure
    console.error(e)
  } finally {
    loading.value = false
  }
}

const open = () => {
  queryForm.value?.reset({ type: 'initial' })
  visible.value = true
}

defineExpose({ open })
</script>

<template>
  <TDialog
    v-model:visible="visible"
    header="导入数据表"
    :confirm-loading="loading"
    width="680px"
    @confirm="submit"
  >
    <TLoading :loading="loading">
      <TForm
        :data="query"
        class="!mb-4 !grid grid-cols-2"
        @submit="execute"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="数据源">
          <TSelect
            v-model:value="query.dataSourceConfigId"
            :keys="{ label: 'name', value: 'id' }"
            :options="dataSourceList"
          />
        </TFormItem>
        <TFormItem label="表名称" name="name">
          <TInput v-model:value="query.name" />
        </TFormItem>
        <TFormItem label="表描述" name="comment">
          <TInput v-model:value="query.comment" />
        </TFormItem>
        <div class="flex justify-end gap-2">
          <TButton theme="primary" :loading="loading" type="submit">搜 索</TButton>
          <TButton theme="default" :loading="loading" type="reset">重 置</TButton>
        </div>
      </TForm>

      <TTable
        v-model:selected-row-keys="tableNames"
        :data="data"
        row-key="name"
        hover
        :pagination="{
          defaultPageSize: 10,
          defaultCurrent: 1,
          total: data?.length,
        }"
        reserve-selected-row-on-paginate
        :columns="columns"
        :loading="pending"
      />
    </TLoading>
  </TDialog>
</template>
