
<template>
  <div class="view">
    <!-- filter form -->
    <TCard  class="query-form !mb-4">
      <TForm
        ref="queryForm"
        :data="query"
        layout="inline"
        class="flex flex-wrap gap-y-4 w-full"
        label-width="100px"
        @submit="onQueryChange()"
        @reset="onQueryChange(true)"
      >
            <TFormItem  label="分类" name="sceneryType" class="col">
              <TSelect
                  v-model:value="query.sceneryType"
                  :options="SCENERY_TYPE"
                  placeholder="请选择分类"
              />
            </TFormItem>
            <TFormItem  label="宣传标题" name="title" class="col">
              <TInput v-model:value="query.title" placeholder="请输入宣传标题" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="内容摘要" name="summary" class="col">
              <TInput v-model:value="query.summary" placeholder="请输入内容摘要" allow-clear />
            </TFormItem>
            <TFormItem  v-show='expanded' label="状态" name="sceneryStatus" class="col">
              <TSelect
                  v-model:value="query.sceneryStatus"
                  :options="SCENERY_STATUS"
                  placeholder="请选择状态"
              />
            </TFormItem>
              <TFormItem  v-show='expanded' label="创建时间" name="createTime" class="col">
              <TDateRangePicker
                v-model:value="query.createTime"
                value-format="YYYY-MM-DD HH:mm:ss"
                clearable
              />
            </TFormItem>

        <QueryActions v-model:expanded="expanded" class="col ml-auto" />
      </TForm>
    </TCard>

    <!-- table card -->
    <TCard title="洛阳风采信息表">
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
             <template #sceneryType="{ row }">
              <DictTag :dict-data="SCENERY_TYPE" :value="row.sceneryType" />
            </template>
             <template #sceneryStatus="{ row }">
              <DictTag :dict-data="SCENERY_STATUS" :value="row.sceneryStatus" />
            </template>
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
  import useDict from '@/hooks/use-dict'
  import { useTable, columns } from './use-table'
  import Form from './form.vue'
  import type { SceneryVO } from '@/api/application/publish/scenery'
  import type { FormInstanceFunctions } from 'tdesign-vue-next'

  const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
  const formRef = useTemplateRef<InstanceType<typeof Form>>('formRef')

  const { permission } = usePermission()

  const [
    SCENERY_TYPE ,
    SCENERY_STATUS ,
    YES_NO
  ] = useDict(
    'scenery_type' ,
    'scenery_status' ,
    'yes_no'
  )

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

  defineOptions({ name: 'Scenery' })
</script>
