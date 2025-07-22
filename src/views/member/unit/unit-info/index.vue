<template>
  <div class="view">
    <!-- filter form -->
    <ACard class="mb-4">
      <AForm
        ref="filterForm"
        :label-col="{ span: 6 }"
        class="dense-form"
        :class="{ expanded: filterExpanded }"
        :model="queryParams"
      >
        <ARow :gutter="[0, 16]">
          <ACol :lg="8" :span="24">
            <AFormItem label="单位名称" name="name">
              <AInput v-model:value="queryParams.name" placeholder="请输入单位名称" allow-clear />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="用户名" name="username">
              <AInput v-model:value="queryParams.username" placeholder="请输入用户名" allow-clear />
            </AFormItem>
          </ACol>

          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="email" name="email">
              <AInput v-model:value="queryParams.email" placeholder="请输入email" allow-clear />
            </AFormItem>
          </ACol>

          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="注册时间" name="regdate">
              <ARangePicker
                v-model:value="queryParams.regdate"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </AFormItem>
          </ACol>

          <!-- <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="单位编码" name="code">
              <AInput v-model:value="queryParams.code" placeholder="请输入单位编码" allow-clear />
            </AFormItem>
          </ACol> -->
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="统一社会信用代码" name="creditrate">
              <AInput
                v-model:value="queryParams.creditrate"
                placeholder="请输入统一社会信用代码"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="单位性质" name="unitnature">
              <ASelect
                v-model:value="queryParams.unitnature"
                :options="UNIT_TYPE"
                placeholder="请选择单位性质"
              />
            </AFormItem>
          </ACol>
          <!-- <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="联系人" name="contact">
              <AInput v-model:value="queryParams.contact" placeholder="请输入联系人" allow-clear />
            </AFormItem>
          </ACol> -->
          <!-- <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="手机号" name="mobile">
              <AInput v-model:value="queryParams.mobile" placeholder="请输入手机号" allow-clear />
            </AFormItem>
          </ACol> -->
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="电话" name="telphone">
              <AInput v-model:value="queryParams.telphone" placeholder="请输入电话" allow-clear />
            </AFormItem>
          </ACol>
          <!-- <ACol v-show="filterExpanded" :lg="8" :span="24">
              <AFormItem label="最后登录时间" name="lastlogondate">
              <ARangePicker
                v-model:value="queryParams.lastlogondate"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </AFormItem>
          </ACol> -->
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="允许登录" name="isenable">
              <ASelect
                v-model:value="queryParams.isenable"
                :options="YES_NO"
                placeholder="请选择是否允许登录"
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="法定代表人" name="legalrepresent">
              <AInput
                v-model:value="queryParams.legalrepresent"
                placeholder="请输入法定代表人"
                allow-clear
              />
            </AFormItem>
          </ACol>
          <!-- <ACol v-show="filterExpanded" :lg="8" :span="24">
              <AFormItem label="创建时间" name="createTime">
              <ARangePicker
                v-model:value="queryParams.createTime"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </AFormItem>
          </ACol> -->
          <!-- <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="单位类型" name="unitType">
              <ASelect
                  v-model:value="queryParams.unitType"
                  :options="UNIT_TYPE"
                  placeholder="请选择单位类型"
              />
            </AFormItem>
          </ACol> -->

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
    <ACard title="单位信息库">
      <template #extra>
        <AFlex :gap="8">
          <AButton v-if="false" type="primary" :loading="pending" @click="modal?.open()">
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
          <ATooltip v-if="permission.has('system:unit-info:export')" title="导出">
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
          <template #bodyCell="scope: TableScope<UnitInfoVO>">
            <template v-if="scope.column.key === 'regdate'">
              {{ dayjs(scope.text).format('YYYY-MM-DD') }}
            </template>
            <template v-if="scope.column.key === 'unitnature'">
              <DictTag :dict-object="UNIT_TYPE" :value="scope?.text" />
            </template>
            <template v-if="scope.column.key === 'lastlogondate'">
              {{ dayjs(scope.text).format('YYYY-MM-DD') }}
            </template>
            <template v-if="scope.column.key === 'isenable'">
              <DictTag :dict-object="YES_NO" :value="scope?.text" />
            </template>
            <template v-if="scope.column.key === 'createTime'">
              {{ dayjs(scope.text).format('YYYY-MM-DD') }}
            </template>
            <template v-if="scope.column.key === 'unitType'">
              <DictTag :dict-object="UNIT_TYPE" :value="scope?.text" />
            </template>

            <template v-if="scope.column.key === 'status'">
              <ASwitch
                :checked="scope.record.isenable === 1"
                :loading="scope.record.statusLoading"
                @change="onStatusChange(scope.record, $event)"
                checked-children="是"
                un-checked-children="否"
              />
            </template>

            <template v-if="scope.column.title === '操作'">
              <AFlex :gap="16">
                <ATypographyLink @click="modal?.open({ id: scope?.record.id, isViewMode: true })">
                  <EyeOutlined />
                  查看
                </ATypographyLink>
                <APopconfirm
                  v-if="false"
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
import { ref, getCurrentInstance } from 'vue'
import dayjs from 'dayjs'
import { useToggle } from '@vueuse/core'
import useDict from '@/hooks/use-dict'
import { useTable, columns } from './use-table'
import useActions from './use-actions'
import FormModal from './form.vue'
import type { UnitInfoVO } from '@/api/member/unit/unit-info'
import { updateUnitStatus } from '@/api/member/unit/unit-info'
import { permission } from '@/hooks/use-permission'

const modal = useTemplateRef('modal')

const [filterExpanded, toggle] = useToggle(false)

const filterFormRef = ref()

// 获取全局属性
const { proxy } = getCurrentInstance()
const message = proxy.$message
const confirm = proxy.$confirm

// 状态切换方法
const onStatusChange = async (record, checked) => {
  confirm({
    title: '确认变更状态',
    content: `确定要${checked ? '启用' : '禁用'}该单位的登录权限吗？`,
    onOk: async () => {
      record.statusLoading = true
      try {
        // 调用后端接口
        await updateUnitStatus(record.id, checked ? 1 : 0)
        record.isenable = checked ? 1 : 0
        message.success('状态更新成功')
      } catch (error) {
        message.error('状态更新失败，请重试')
        // 重置开关状态
        record.isenable = checked ? 0 : 1
      } finally {
        record.statusLoading = false
      }
    },
    onCancel: () => {
      // 重置开关状态
      record.isenable = checked ? 0 : 1
    },
  })
}

const [
  UNIT_TYPE,
  SCALE_SIZE,
  YES_NO,
  COMPANY_RELATION,
  ORG_TYPE,
  TEC_FIELD,
  COM_HOLDINGS,
  NON_PUBLIC_COM_TYPE,
] = useDict(
  'unit_type',
  'scale_size',
  'yes_no',
  'company_relation',
  'org_type',
  'tec_field',
  'com_holdings',
  'non_public_com_type',
)

const { data, execute, pending, queryParams, onFilter, onFilterReset, pagination, onChange } =
  useTable(filterFormRef)

const { onDelete } = useActions(execute)

defineOptions({ name: 'UnitInfo' })
</script>
