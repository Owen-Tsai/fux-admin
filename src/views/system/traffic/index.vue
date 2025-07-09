<template>
  <div class="view">
    <!-- filter form -->
    <ACard v-if="permission.has('system:ip-traffic:query')" class="mb-4">
      <AForm
        ref="filterForm"
        :label-col="{ span: 6 }"
        class="dense-form"
        :class="{ expanded: filterExpanded }"
        :model="queryParams"
      >
        <ARow :gutter="[0, 16]">
          <ACol :lg="8" :span="24">
            <AFormItem label="是否删除" name="deleted">
              <ASelect
                v-model:value="queryParams.deleted"
                :options="INFRA_BOOLEAN_STRING"
                placeholder="请选择是否删除"
              />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="IP地址" name="ipAddress">
              <AInput
                v-model:value="queryParams.ipAddress"
                placeholder="请输入IP地址"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="创建时间" name="createTime">
              <ARangePicker
                v-model:value="queryParams.createTime"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </AFormItem>
          </ACol>

          <ACol :lg="{ span: 8, offset: filterExpanded ? 16 : 0 }" :span="24">
            <AFlex justify="end" align="center" :gap="16">
              <AButton html-type="reset" @click="onFilterReset">重置</AButton>
              <AButton html-type="submit" type="primary" @click="onFilter">查询</AButton>
              <ATypographyLink @click="toggle()">
                {{ filterExpanded ? '收起' : '展开' }}
                <DownOutlined :class="{ 'rotate-180': filterExpanded }" />
              </ATypographyLink>
            </AFlex>
          </ACol>
        </ARow>
      </AForm>
    </ACard>

    <!-- table card -->
    <ACard title="IP流量监控">
      <template #extra>
        <AFlex :gap="8">
          <AButton
            v-if="permission.has('system:ip-traffic:create')"
            type="primary"
            :loading="pending"
            @click="modal?.open()"
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
          <ATooltip v-if="permission.has('system:ip-traffic:export')" title="导出">
            <AButton type="text" :loading="pending">
              <template #icon>
                <ExportOutlined />
              </template>
            </AButton>
          </ATooltip>
        </AFlex>
      </template>

      <div class="overflow-x-auto">
        <ATable
          :columns="columns"
          :data-source="data?.list"
          :loading="pending"
          :pagination="pagination"
          @change="onChange"
        >
          <template #bodyCell="scope: TableScope<IpTrafficVO>">
            <template v-if="scope.column.key === 'deleted'">
              <DictTag :dict-object="INFRA_BOOLEAN_STRING" :value="scope?.text" />
            </template>
            <template v-if="scope.column.key === 'trafficTime'">
              {{ dayjs(scope.text).format('YYYY-MM-DD HH:ss:mm') }}
            </template>
            <template v-if="scope.column.title === '操作'">
              <AFlex :gap="16">
                <ATypographyLink
                  v-if="permission.has('system:ip-traffic:update')"
                  @click="modal?.open(scope?.record.id)"
                >
                  <EditOutlined />
                  编辑
                </ATypographyLink>
                <APopconfirm
                  v-if="permission.has('system:ip-traffic:delete')"
                  title="该操作无法撤销，确定要删除吗？"
                  :overlay-style="{ width: '240px' }"
                  @confirm="onDelete(scope?.record)"
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
      </div>
    </ACard>

    <!-- form modal -->
    <FormModal ref="modal" @success="execute" />
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue'
import dayjs from 'dayjs'
import { useToggle } from '@vueuse/core'
import useDict from '@/hooks/use-dict'
import { useTable, columns } from './use-table'
import useActions from './use-actions'
import FormModal from './form.vue'
import type { IpTrafficVO } from '@/api/system/traffic'
import { permission } from '@/hooks/use-permission'

const modal = useTemplateRef('modal')

const [filterExpanded, toggle] = useToggle(false)

const filterFormRef = ref()

const [INFRA_BOOLEAN_STRING] = useDict('infra_boolean_string')

const { data, execute, pending, queryParams, onFilter, onFilterReset, pagination, onChange } =
  useTable(filterFormRef)

const { onDelete } = useActions(execute)

defineOptions({ name: 'IpTraffic' })
</script>
