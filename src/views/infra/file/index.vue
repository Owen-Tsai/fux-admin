<script setup lang="ts">
import dayjs from 'dayjs'
import { columns, useTable } from './use-table'
import type { FileVO } from '@/api/infra/file'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')

const expanded = ref(false)
const previewVisible = ref(false)

const { permission } = usePermission()

const { data, execute, onPageChange, onQueryChange, pagination, pending, query, onDelete } =
  useTable(queryForm)

const images = ref<string[]>([])

const onPreview = (url: string) => {
  images.value = [url]
  previewVisible.value = true
}

defineOptions({ name: 'InfraFile' })
</script>

<template>
  <div class="view">
    <TCard v-if="permission.has('infra:file:query')" class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
        <TFormItem label="文件路径" name="path" class="col">
          <TInput v-model:value="query.path" placeholder="请输入文件路径" />
        </TFormItem>
        <TFormItem label="文件类型" name="type" class="col">
          <TInput v-model:value="query.type" placeholder="请输入文件类型" />
        </TFormItem>
        <TFormItem v-show="expanded" label="创建时间" name="createTime" class="col">
          <TRangePicker v-model:value="query.createTime" />
        </TFormItem>
        <QueryActions v-model:expanded="expanded" :class="`col ${expanded ? 'ml-2/3' : ''}`" />
      </TForm>
    </TCard>

    <TCard title="文件列表">
      <template #actions>
        <div class="flex items-center gap-2">
          <TTooltip content="重新载入">
            <TButton shape="square" variant="text" @click="execute()">
              <template #icon>
                <Icon name="refresh" />
              </template>
            </TButton>
          </TTooltip>
        </div>
      </template>

      <TTable
        :data="data?.list"
        row-key="id"
        :columns="columns"
        :pagination="pagination"
        :loading="pending"
        @page-change="onPageChange"
      >
        <template #preview="{ row }: TableScope<FileVO>">
          <div class="relative h-30 w-30">
            <img :src="row.url" :alt="row.name" class="w-full h-full object-contain" />
            <div
              class="absolute top-0 left-0 right-0 bottom-0 hover:bg-black/40 flex-center group text-[var(--td-text-color-anti)] cursor-pointer"
              @click="onPreview(row.url!)"
            >
              <Icon name="browse" size="1.4em" class="!hidden !group-hover:block" />
            </div>
          </div>
        </template>
        <template #createTime="{ row }">
          {{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
        </template>
        <template #actions="{ row }">
          <div class="flex items-center gap-2">
            <TPopconfirm content="确认删除吗？该操作不可恢复" @confirm="onDelete(row.id!)">
              <TTooltip content="删除">
                <TButton
                  shape="square"
                  theme="danger"
                  variant="text"
                  :disabled="permission.hasNone('infra:file:delete')"
                >
                  <template #icon>
                    <Icon name="edit-2" />
                  </template>
                </TButton>
              </TTooltip>
            </TPopconfirm>
          </div>
        </template>
      </TTable>
    </TCard>

    <TImageViewer v-model:visible="previewVisible" :images="images" />
  </div>
</template>
