<template>
  <div class="view">
    <ARow :gutter="24">
      <ACol :span="24">
        <ACard v-if="permission.has('system:info-list:query')" class="mb-4">
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
        <ACard title="信息资讯" class="flex-1">
          <template #extra>
            <AFlex :gap="8">
              <AButton
                type="primary"
                v-if="permission.has('system:info-list:create')"
                :loading="pending"
                @click="onEdit()"
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

          <ATable :data-source="data?.list" :columns="columns" row-key="id" :loading="pending">
            <template #bodyCell="scope: TableScope<InformationVO>">
              <template v-if="scope?.column.key === 'title'">
                {{ scope.text.length > 27 ? scope.text.substring(0, 26) + '...' : scope.text }}
              </template>
              <template v-if="scope?.column.key === 'createTime'">
                {{ dayjs(scope.text).format('YYYY-MM-DD HH:mm') }}
              </template>
              <template v-if="scope?.column.key === 'audittime'">
                {{ scope.text == null ? '' : dayjs(scope.text).format('YYYY-MM-DD HH:mm') }}
              </template>
              <template v-if="scope?.column.key === 'auditstate'">
                <DictTag :dict-object="informationStatus" :value="scope.text" />
              </template>
              <template v-if="scope?.column.key === 'actions'">
                <AFlex :gap="16">
                  <ATypographyLink
                    v-if="permission.has('system:info-list:update')"
                    @click="onEdit(scope.record)"
                  >
                    <EditOutlined />
                    修改
                  </ATypographyLink>
                  <APopconfirm
                    v-if="permission.has('system:info-list:delete')"
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
    <FormModal v-if="visible" :record="entry" @success="execute" @close="visible = false" />
  </div>
</template>

<script lang="ts" setup>
import dayjs from 'dayjs'
import useDict from '@/hooks/use-dict'
import FormModal from './form.vue'
import { permission } from '@/hooks/use-permission'
import { getInfoTyoeTree, type InformationVO } from '@/api/information/list'
import { useTable, columns } from './use-table'
import useActions from './use-actions'

const filterFormRef = ref()

const treeData = ref()

const [informationStatus] = useDict('information_status')

const { data, execute, pending, queryParams, onFilter, onFilterReset } = useTable(filterFormRef)

const { entry, visible, onDelete, onEdit } = useActions(execute)

const createInformation = () => {}

const updateInformation = () => {}

getInfoTyoeTree().then((res) => {
  treeData.value = res
})

defineOptions({ name: 'InformationList' })
</script>
