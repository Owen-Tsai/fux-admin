<script setup lang="ts">
import type { InfoTypeVO } from '@/api/information/type'
import { useTable, columns } from './use-table'
import dayjs from 'dayjs'
import Form from './form.vue'
import type { FormInstanceFunctions, EnhancedTableInstanceFunctions } from 'tdesign-vue-next'

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')
const tableRef = useTemplateRef<EnhancedTableInstanceFunctions>('tableRef')

const [statusOpts] = useDict('common_status')

const { permission } = usePermission()
const { query, onQueryChange, data, execute, onDelete, pending, onSetAudit } = useTable(queryForm)

const [tableExpanded, toggle] = useToggle(false)

const toggleTableExpanded = () => {
  toggle()
  if (tableExpanded.value) {
    tableRef.value?.expandAll()
  } else {
    tableRef.value?.foldAll()
  }
}

const cardBody = useTemplateRef('cardBody')
const { height } = useElementSize(cardBody, { height: 300, width: 0 })

defineOptions({ name: 'SystemMenu' })
</script>

<template>
  <div class="view flex flex-col gap-4">
    <TCard v-if="permission.has('system:info-type:query')" class="query-form min-h-0 flex-none">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="资讯类别" name="name" class="col">
          <TInput v-model:value="query.name" placeholder="请输入资讯类别名称" />
        </TFormItem>
        <QueryActions :expanded="null" class="col ml-1/3" />
      </TForm>
    </TCard>

    <TCard title="资讯类别列表" bordered class="flex-1 menu-card">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
            v-if="permission.has('system:info-type:create')"
            theme="primary"
            :loading="pending"
            @click="formRef?.open('create')"
          >
            <template #icon>
              <Icon name="add" />
            </template>
            新增
          </TButton>

          <TTooltip content="全部展开/折叠">
            <TButton
              shape="square"
              variant="text"
              :loading="pending"
              @click="toggleTableExpanded()"
            >
              <template #icon>
                <Icon name="unfold-less" />
              </template>
            </TButton>
          </TTooltip>

          <TTooltip content="重新载入">
            <TButton shape="square" variant="text" :loading="pending" @click="execute()">
              <template #icon>
                <Icon name="refresh" />
              </template>
            </TButton>
          </TTooltip>
        </div>
      </template>

      <template #content>
        <div ref="cardBody" class="flex-1">
          <TEnhancedTable
            ref="tableRef"
            :data="data"
            :columns="columns"
            row-key="id"
            :tree="{ defaultExpandAll: false }"
            :loading="pending"
            :height="height"
            :scroll="{ type: 'virtual' }"
          >
            <template #status="{ row }">
              <DictTag :dict-data="statusOpts" :value="row.status" />
            </template>
            <template #isAudit="{ row }: TableScope<InfoTypeVO>">
              <TSwitch
                v-model:value="row.isAudit"
                :label="['是', '否']"
                @change="(v) => onSetAudit(row.id!, v as boolean)"
              />
            </template>
            <template #createTime="{ row }">{{
              dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss')
            }}</template>
            <template #actions="{ row }: TableScope<InfoTypeVO>">
              <div class="flex gap-2">
                <TTooltip content="编辑">
                  <TButton
                    shape="square"
                    theme="primary"
                    variant="text"
                    @click="formRef?.open('update', row.id)"
                  >
                    <template #icon>
                      <Icon name="edit-2" />
                    </template>
                  </TButton>
                </TTooltip>
                <TTooltip content="新增下一级">
                  <TButton
                    shape="square"
                    theme="primary"
                    variant="text"
                    @click="formRef?.open('create', row.id)"
                  >
                    <template #icon>
                      <Icon name="add" />
                    </template>
                  </TButton>
                </TTooltip>
                <TTooltip content="删除">
                  <TPopconfirm
                    content="确定删除吗？该操作无法撤销"
                    theme="danger"
                    @confirm="onDelete(row.id!)"
                  >
                    <TButton shape="square" theme="danger" variant="text">
                      <template #icon>
                        <Icon name="delete" />
                      </template>
                    </TButton>
                  </TPopconfirm>
                </TTooltip>
              </div>
            </template>
          </TEnhancedTable>
        </div>
      </template>
    </TCard>

    <Form ref="formRef" :tree-data="data" @success="execute()" />
  </div>
</template>

<style lang="scss" scoped>
.menu-card {
  @apply flex flex-col;
  :deep(.t-card__header) {
    @apply flex-none;
  }
  :deep(.t-card__body) {
    @apply flex-1 h-full flex flex-col;
  }
}
</style>
