<template>
  <div class="view">
    <ARow :gutter="24">
      <ACol :span="24">
        <ACard v-if="permission.has('system:info-type:query')" class="mb-4">
          <AForm ref="filterFormRef" :model="queryParams" class="dense-form">
            <ARow :gutter="24">
              <ACol :span="24" :lg="8">
                <AFormItem label="类别名称" name="name">
                  <AInput v-model:value="queryParams.name" placeholder="请输入资讯类别名称" />
                </AFormItem>
              </ACol>
              <ACol :span="24" :lg="16">
                <AFlex justify="end" align="center" :gap="16">
                  <AButton html-type="reset" @click="onFilterReset">重置</AButton>
                  <AButton html-type="submit" type="primary" @click="onFilter">查询</AButton>
                </AFlex>
              </ACol>
            </ARow>
          </AForm>
        </ACard>
      </ACol>

      <ACol :span="24">
        <ACard title="资讯类别管理" class="flex-1">
          <template #extra>
            <AFlex :gap="8">
              <AButton
                v-if="permission.has('system:info-type:create')"
                type="primary"
                :loading="pending"
                @click="modal?.open('create')"
              >
                <template #icon>
                  <PlusOutlined />
                </template>
                新增
              </AButton>
              <ATooltip title="重新载入">
                <AButton type="text" :loading="pending" @click="execute">
                  <template #icon>
                    <ReloadOutlined />
                  </template>
                </AButton>
              </ATooltip>
            </AFlex>
          </template>

          <ATable
            :data-source="data"
            :columns="columns"
            row-key="id"
            :loading="pending"
            :sticky="{ offsetHeader: 90 }"
            :pagination="false"
          >
            <template #bodyCell="scope: TableScope<InformationTypeVO>">
              <template v-if="scope?.column.key === 'isinmobile'">
                <ASpace direction="vertical">
                  <ASwitch
                    v-model:checked="scope.record.isinmobile"
                    checked-children="是"
                    un-checked-children="否"
                    @change="onChange(scope.record)"
                  />
                </ASpace>
              </template>
              <template v-if="scope?.column.key === 'status'">
                <DictTag :dict-object="commonStatus" :value="scope.text" />
              </template>
              <template v-if="scope?.column.key === 'createTime'">
                {{ dayjs(scope.text).format('YYYY-MM-DD HH:mm:ss') }}
              </template>
              <template v-if="scope?.column.key === 'actions'">
                <AFlex :gap="16">
                  <ATypographyLink
                    v-if="permission.has('system:info-type:update')"
                    @click="modal?.open('update', scope.record.id)"
                  >
                    <EditOutlined />
                    修改
                  </ATypographyLink>
                  <ATypographyLink
                    v-if="permission.has('system:info-type:create')"
                    @click="modal?.open('create', scope.record.id)"
                  >
                    <PlusOutlined />
                    新增
                  </ATypographyLink>
                  <APopconfirm
                    v-if="permission.has('system:info-type:delete')"
                    title="确定要删除吗？"
                    :overlay-inner-style="{ width: '260px' }"
                    @confirm="onDelete(scope.record!)"
                  >
                    <ATypographyLink type="danger">
                      <DeleteOutlined />
                      删除
                    </ATypographyLink>
                  </APopconfirm>
                </AFlex>
              </template>
            </template>
          </ATable>
        </ACard>
      </ACol>
    </ARow>

    <FormModal ref="modal" :tree-data="data" @success="execute" />
  </div>
</template>

<script lang="ts" setup>
import useDict from '@/hooks/use-dict'
import { permission } from '@/hooks/use-permission'
import type { InformationTypeVO } from '@/api/information/type'
import { useTable, columns } from './use-table'
import useActions from './use-actions'
import FormModal from './form.vue'
import dayjs from 'dayjs'

const filterFormRef = ref()
const modal = useTemplateRef('modal')

const [commonStatus] = useDict('common_status')

const { data, execute, pending, queryParams, onFilter, onFilterReset, onChange } =
  useTable(filterFormRef)

const { onDelete } = useActions(execute)

defineOptions({ name: 'InformationType' })
</script>
