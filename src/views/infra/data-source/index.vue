<script setup lang="ts">
import dayjs from 'dayjs'
import Form from './form.vue'
import { columns, useTable } from './use-table'

const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

const { permission } = usePermission()

const { data, execute, onDelete, pending } = useTable()

defineOptions({ name: 'InfraDataSourceConfig' })
</script>

<template>
  <div class="view">
    <TCard title="数据源列表">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton
            v-if="permission.has('infra:data-source-config:create')"
            theme="primary"
            @click="formRef?.open()"
          >
            <template #icon>
              <Icon name="add" />
            </template>
            新增
          </TButton>
          <TTooltip content="重新载入">
            <TButton shape="square" variant="text" @click="execute()">
              <template #icon>
                <Icon name="refresh" />
              </template>
            </TButton>
          </TTooltip>
        </div>
      </template>

      <TTable :data="data" row-key="id" :columns="columns" :loading="pending">
        <template #createTime="{ row }">
          {{
            row.createTime === null
              ? '系统创建'
              : dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss')
          }}
        </template>
        <template #actions="{ row }">
          <div class="flex items-center gap-2">
            <TTooltip content="编辑">
              <TButton
                shape="square"
                theme="primary"
                variant="text"
                :disabled="permission.hasNone('infra:data-source-config:update') || row.id === 0"
                @click="formRef?.open(row.id)"
              >
                <template #icon>
                  <Icon name="edit-2" />
                </template>
              </TButton>
            </TTooltip>
            <TTooltip v-if="permission.has('infra:data-source-config:delete')" content="删除">
              <TPopconfirm
                content="确定删除吗？该操作无法撤销"
                theme="danger"
                @confirm="onDelete(row.id)"
              >
                <TButton shape="square" theme="danger" variant="text" :disabled="row.id === 0">
                  <template #icon>
                    <Icon name="delete" />
                  </template>
                </TButton>
              </TPopconfirm>
            </TTooltip>
          </div>
        </template>
      </TTable>
    </TCard>

    <Form ref="formRef" @success="execute" />
  </div>
</template>
