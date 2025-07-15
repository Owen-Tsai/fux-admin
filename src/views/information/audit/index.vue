<template>
  <div class="view">
    <ARow :gutter="24">
      <ACol :span="24">
        <ACard v-if="permission.has('system:info-audit:query')" class="mb-4">
          <AForm ref="filterFormRef" :model="queryParams" class="dense-form">
            <ARow :gutter="24">
              <ACol :span="24" :lg="8">
                <AFormItem label="标题" name="title">
                  <AInput v-model:value="queryParams.title" allow-clear placeholder="请输入标题" />
                </AFormItem>
              </ACol>
              <ACol :span="24" :lg="8">
                <AFormItem label="资讯分类" name="infotype">
                  <ATreeSelect
                    v-model:value="queryParams.infotype"
                    show-search
                    placeholder="请选择资讯分类"
                    allow-clear
                    tree-default-expand-all
                    :tree-data="treeData"
                    tree-node-filter-prop="label"
                  />
                </AFormItem>
              </ACol>
              <ACol :span="24" :lg="8">
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
        <ACard title="待审核资讯" class="flex-1">
          <template #extra>
            <AFlex :gap="8">
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
            :data-source="data?.list"
            :columns="columns"
            row-key="id"
            :loading="pending"
            :pagination="pagination"
          >
            <template #bodyCell="scope: TableScope<InformationVO>">
              <template v-if="scope?.column.key === 'title'">
                {{ scope.text.length > 46 ? scope.text.substring(0, 45) + '...' : scope.text }}
              </template>
              <template v-if="scope?.column.key === 'createTime'">
                {{ dayjs(scope.text).format('YYYY-MM-DD HH:mm') }}
              </template>
              <template v-if="scope?.column.key === 'auditstate'">
                <DictTag :dict-object="informationStatus" :value="scope.text" />
              </template>
              <template v-if="scope?.column.key === 'actions'">
                <AFlex :gap="16">
                  <ATypographyLink
                    v-if="permission.has('system:info-audit:approve')"
                    @click="onAudit(scope.record)"
                  >
                    <EditOutlined />
                    审核
                  </ATypographyLink>
                </AFlex>
              </template>
            </template>
          </ATable>
        </ACard>
      </ACol>
    </ARow>
    <FormModal v-if="visible" :record="entry" @success="execute" @close="visible = false" />
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import useDict from '@/hooks/use-dict'
import FormModal from './form.vue'
import { permission } from '@/hooks/use-permission'
import { getInfoTyoeTree, type InformationVO } from '@/api/information/audit'
import { useTable, columns } from './use-table'
import useActions from './use-actions'

const filterFormRef = ref()

const treeData = ref()

const [informationStatus] = useDict('information_status')

const { data, execute, pending, queryParams, onFilter, onFilterReset, pagination } =
  useTable(filterFormRef)

const { entry, visible, onAudit } = useActions()

getInfoTyoeTree().then((res) => {
  treeData.value = res
})

defineOptions({ name: 'InformationList' })
</script>
