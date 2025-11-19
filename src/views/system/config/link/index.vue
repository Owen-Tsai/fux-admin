
<template>
  <div class="view">
    <!-- filter form -->
    <TCard class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
            <TFormItem  label="链接名称" name="linkName" class="col">
              <TInput v-model:value="query.linkName" placeholder="请输入链接名称" allow-clear />
            </TFormItem>
            <TFormItem  label="链接地址" name="linkUrl" class="col">
              <TInput v-model:value="query.linkUrl" placeholder="请输入链接地址" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="链接Logo地址" name="linkLogo" class="col">
              <TInput v-model:value="query.linkLogo" placeholder="请输入链接Logo地址" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="链接描述" name="linkDesc" class="col">
              <TInput v-model:value="query.linkDesc" placeholder="请输入链接描述" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="排序序号" name="orderNum" class="col">
              <TInput v-model:value="query.orderNum" placeholder="请输入排序序号" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="打开方式" name="openType" class="col">
              <TInput v-model:value="query.openType" placeholder="请输入打开方式" allow-clear />
            </TFormItem>
              <TFormItem  v-show='expanded' label="创建时间" name="createTime" class="col">
              <TDateRangePicker
                v-model:value="query.createTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </TFormItem>

        <QueryActions v-model:expanded="expanded" :class="`col ${expanded ? 'ml-1/3' : ''}`" />
      </TForm>
    </TCard>

    <!-- table card -->
    <TCard title="友情链接配置表">
      <template #actions>
        <div class="flex items-center gap-2">
          <TButton

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

      <div class="overflow-x-auto">
        <TTable
          :data="data?.list"
          row-key="id"
          :columns="columns"
          :pagination="pagination"
          :loading="pending"
          @page-change="onPageChange"
        >
             <template #createTime="{ row }">
              {{ dayjs(row.createTime).format('YYYY-MM-DD') }}
            </template>
            <template #actions="{ row }">
              <div class="flex gap-2">
                <TTooltip  content="编辑"

                >
                  <TButton shape="square" theme="primary" variant="text" @click="formRef?.open(row.id)">
                    <template #icon>
                      <Icon name="edit-2" />
                    </template>
                  </TButton>
                </TTooltip>
                <TTooltip content="删除" >
                  <TPopconfirm
                          content="该操作无法撤销，确定要删除吗？"
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
        </TTable>
      </div>
    </TCard>

    <Form ref="formRef" @success="execute" />
  </div>
</template>

<script lang="ts" setup>
  import { ref } from 'vue'
  import dayjs from 'dayjs'
  import { useToggle } from '@vueuse/core'
  import { useTable, columns } from './use-table'
  import Form from './form.vue'
  import type { ConfigLinkVO } from '@/api/system/config/link'
  import type { FormInstanceFunctions } from 'tdesign-vue-next'

  const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
  const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

  const { permission } = usePermission()


  const {
    data,
    pending,
    execute,
    query,
    onQueryChange,
    pagination,
    onPageChange,
    onDelete
  } = useTable(queryForm)
  const expanded = ref(false)

  defineOptions({ name: 'ConfigLink' })
</script>
