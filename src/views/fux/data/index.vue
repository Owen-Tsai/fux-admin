<template>
  <div class="flex-1 min-h-0 px-6 py-4 overflow-auto">
    <div class="min-h-full bg-[var(--td-bg-color-container)] rounded-lg py-6">
      <TForm :data="dataConfigState" class="w-5/12 min-w-500px !mx-auto" label-width="100px">
        <TAlert theme="warning" class="!mb-6">
          <template #message>
            当前应用的 Schema 版本为 <b>44</b>。如不需要重新生成
            Schema，请直接点击页面上方步骤条中的对应环节进行切换。
          </template>
        </TAlert>

        <TFormItem label="数据表" help="仅可选择导入至【基础设施/代码生成】中的数据表">
          <TSelect
            v-model:value="selectedTables"
            multiple
            clearable
            filterable
            @change="onTableSelectChange"
          >
            <TOption
              v-for="(opt, i) in tableDefList"
              :key="i"
              :label="opt.tableName"
              :value="opt.id"
            >
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <div>{{ opt.tableComment }}</div>
                  <div>{{ opt.tableName }}</div>
                </div>
                <TTag>{{
                  dataSourceList?.find((d) => d.id === opt.dataSourceConfigId)?.name
                }}</TTag>
              </div>
            </TOption>
          </TSelect>
        </TFormItem>
        <TFormItem label="表单分步" name="paginated">
          <TRadioGroup v-model:value="dataConfigState.paginated">
            <TRadioButton value="tabs">使用 tabs 分页</TRadioButton>
            <TRadioButton value="steps">使用 steps 分页</TRadioButton>
            <TRadioButton :value="false">不分页</TRadioButton>
          </TRadioGroup>
        </TFormItem>
        <TFormItem label="表单分栏" name="gridColumns">
          <TRadioGroup v-model:value="dataConfigState.gridColumns">
            <TRadioButton :value="false">不分列</TRadioButton>
            <TRadioButton :value="2">2 列</TRadioButton>
            <TRadioButton :value="3">3 列</TRadioButton>
          </TRadioGroup>
        </TFormItem>
        <TFormItem label="已选数据表">
          <div ref="tableList" class="w-full flex-1 min-w-0">
            <div
              v-for="item in tableSortList"
              :key="item.id"
              class="bg-[var(--td-bg-color-secondarycontainer)] rounded-lg p-2 mb-2 select-none"
            >
              <TRow>
                <TCol :span="5">
                  <span>{{ item.name }}</span>
                </TCol>
                <TCol :span="5">
                  <span class="text-secondary">{{ item.comment }}</span>
                </TCol>
                <TCol :span="2">
                  <TCheckbox v-model:checked="item.isSubTable" label="子表" />
                </TCol>
              </TRow>
            </div>
            <TEmpty v-show="tableSortList.length === 0" />
          </div>
        </TFormItem>
        <div class="flex items-center justify-end gap-2 mt-4">
          <TButton
            v-if="appEditMode === 'create' || (appEditMode === 'update' && hasModified)"
            :disabled="tableSortList.length <= 0"
            :loading="isGenerating"
            @click="generateSchema"
            >生成 Schema</TButton
          >
          <TButton v-else @click="emit('finish')">下一步</TButton>
        </div>
      </TForm>
      <pre>{{ tableSortList }}</pre>
      <pre>{{ subTableMap }}</pre>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppDesignCtxInject } from '../use-app-design'
import { getTableDefList } from '@/api/fux-core'
import { getDataSourceList } from '@/api/infra/data-source'
import { useSortable } from '@vueuse/integrations/useSortable'
import genAppFormSchema from './gen-schema'
import type { AppSchema } from '@fusionx/core/types'

const { appEditMode, appSchema } = useAppDesignCtxInject()!
const dialog = useDialog()

const emit = defineEmits(['finish'])

const tableList = ref<HTMLElement>()

const isGenerating = ref(false)
const hasModified = ref(false)

// 最终将会合并到 appSchema 中的配置项
// 默认值：从 appSchema 中获取
const dataConfigState = ref<AppSchema['info']>({ ...appSchema.value.info })
// 存储选定的表
const selectedTables = ref<(number | string)[]>([])
// 存储选定的表中为子表的表
const subTableMap = ref<Set<number>>(new Set())
// 存储选定的表的排序
const tableSortList = ref<AppSchema['info']['tables']>([])

const onTableSelectChange = () => {
  tableSortList.value = (selectedTables.value as number[]).map((v) => {
    const isSubTable = subTableMap.value.has(v)
    return {
      id: v,
      name: tableDefList.value?.find((d) => d.id === v)?.tableName as string,
      comment: tableDefList.value?.find((d) => d.id === v)?.tableComment as string,
      isSubTable: !!isSubTable,
    }
  })
}

const { data: tableDefList, execute: getTableDefListExec } = useRequest(getTableDefList)
const { data: dataSourceList, execute: getDataSourceListExec } = useRequest(getDataSourceList)

const init = async () => {
  await getDataSourceListExec()
  await getTableDefListExec()

  subTableMap.value = new Set(
    dataConfigState.value.tables.filter((v) => v.isSubTable).map((v) => v.id as number),
  )

  selectedTables.value = dataConfigState.value.tables.map((v) => {
    return v.id
  })

  onTableSelectChange()
}

useSortable(tableList, dataConfigState.value.tables, {
  animation: 150,
})

const generateSchema = async () => {
  const doGenerate = async () => {
    isGenerating.value = true
    appSchema.value.info = {
      ...dataConfigState.value,
      tables: tableSortList.value,
    }

    appSchema.value.form = await genAppFormSchema(appSchema.value.info)
    isGenerating.value = false
    nextTick(() => {
      emit('finish')
    })
  }

  if (appEditMode.value === 'update' && hasModified.value) {
    dialog.confirm({
      header: '重新生成 Schema',
      body: '当前应用的数据源配置已经被修改，生成 Schema 将覆盖应用原本的 Schema。确定要执行此操作吗？',
      onCancel() {
        return
      },
      async onConfirm() {
        await doGenerate()
      },
    })
  } else {
    await doGenerate()
  }
}

init()

watchOnce(
  () => [dataConfigState.value, tableSortList.value],
  () => {
    if (!hasModified.value) {
      hasModified.value = true
    }
  },
  { deep: true },
)
</script>
