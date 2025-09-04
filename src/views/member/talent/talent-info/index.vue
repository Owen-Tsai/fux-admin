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
            <AFormItem label="用户名" name="username">
              <AInput v-model:value="queryParams.username" placeholder="请输入用户名" allow-clear />
            </AFormItem>
          </ACol>
          <ACol :lg="8" :span="24">
            <AFormItem label="身份证号" name="idcard">
              <AInput v-model:value="queryParams.idcard" placeholder="请输入身份证号" allow-clear />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="姓名" name="name">
              <AInput v-model:value="queryParams.name" placeholder="请输入姓名" allow-clear />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="出生年月" name="birthday">
              <ADatePicker
                v-model:value="queryParams.birthday"
                value-format="YYYY-MM-DD HH:mm:ss"
                placeholder="请选择出生年月"
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="性别" name="sex">
              <ASelect
                v-model:value="queryParams.sex"
                :options="USER_SEX"
                placeholder="请选择性别"
              />
            </AFormItem>
          </ACol>
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="手机号" name="mobile">
              <AInput v-model:value="queryParams.mobile" placeholder="请输入手机号" allow-clear />
            </AFormItem>
          </ACol>
          <!-- <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="email" name="email">
              <AInput v-model:value="queryParams.email" placeholder="请输入email" allow-clear />
            </AFormItem>
          </ACol> -->
          <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="学历" name="diploma">
              <ASelect
                v-model:value="queryParams.diploma"
                :options="RC_EDUCATION_LEVEL"
                placeholder="请选择学历"
              />
            </AFormItem>
          </ACol>
          <!-- <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="毕业院校" name="eduschool">
              <AInput v-model:value="queryParams.eduschool" placeholder="请输入毕业院校" allow-clear />
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
          <!-- <ACol v-show="filterExpanded" :lg="8" :span="24">
              <AFormItem label="注册时间" name="regdate">
              <ARangePicker
                v-model:value="queryParams.regdate"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </AFormItem>
          </ACol> -->
          <!-- <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="是否推荐" name="isrecommend">
              <ASelect
                  v-model:value="queryParams.isrecommend"
                  :options="YES_NO"
                  placeholder="请选择是否推荐"
              />
            </AFormItem>
          </ACol> -->
          <!-- <ACol v-show="filterExpanded" :lg="8" :span="24">
            <AFormItem label="学位" name="degree">
              <AInput v-model:value="queryParams.degree" placeholder="请输入学位" allow-clear />
            </AFormItem>
          </ACol> -->
          <!-- <ACol v-show="filterExpanded" :lg="8" :span="24">
              <AFormItem label="创建时间" name="createTime">
              <ARangePicker
                v-model:value="queryParams.createTime"
                value-format="YYYY-MM-DD HH:mm:ss"
              />
            </AFormItem>
          </ACol> -->

          <ACol :lg="{ span: 8, offset: filterExpanded ? 0 : 0 }" :span="24">
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
    <ACard title="人才信息库">
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
          <ATooltip v-if="false" title="导出">
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
          <template #bodyCell="scope: TableScope<TalentInfoVO>">
            <template v-if="scope.column.key === 'birthday'">
              {{ dayjs(scope.text).format('YYYY-MM-DD') }}
            </template>
            <template v-if="scope.column.key === 'sex'">
              <DictTag :dict-object="USER_SEX" :value="scope?.text" />
            </template>
            <template v-if="scope.column.key === 'diploma'">
              <DictTag :dict-object="RC_EDUCATION_LEVEL" :value="scope?.text" />
            </template>
            <template v-if="scope.column.key === 'isenable'">
              <ASwitch
                :checked="scope.record.isenable === 1"
                :loading="scope.record.statusLoading"
                @change="onStatusChange(scope.record, $event)"
                checked-children="是"
                un-checked-children="否"
              />
            </template>
            <template v-if="scope.column.key === 'regdate'">
              {{ dayjs(scope.text).format('YYYY-MM-DD') }}
            </template>
            <template v-if="scope.column.key === 'isrecommend'">
              <DictTag :dict-object="YES_NO" :value="scope?.text" />
            </template>
            <template v-if="scope.column.key === 'createTime'">
              {{ dayjs(scope.text).format('YYYY-MM-DD') }}
            </template>
            <template v-if="scope.column.title === '操作'">
              <AFlex :gap="16">
                <ATypographyLink @click="modal?.open(scope?.record.id)">
                  <EyeOutlined />
                  查看
                </ATypographyLink>
                <ATypographyLink @click="handleResetPassword(scope?.record.id)">
                  <LockOutlined />
                  重置密码
                </ATypographyLink>
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
import { LockOutlined } from '@ant-design/icons-vue'
import dayjs from 'dayjs'
import { useToggle } from '@vueuse/core'
import useDict from '@/hooks/use-dict'
import { useTable, columns } from './use-table'
import useActions from './use-actions'
import FormModal from './form.vue'
import type { TalentInfoVO } from '@/api/member/talent/talent-info'
import { updateTalentStatus, resetPassword } from '@/api/member/talent/talent-info'
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
    content: `确定要${checked ? '启用' : '禁用'}该人才的登录权限吗？`,
    onOk: async () => {
      record.statusLoading = true
      try {
        // 调用后端接口
        await updateTalentStatus(record.id, checked ? 1 : 0)
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
  IDENTITY_TYPE,
  USER_SEX,
  RC_MARRIAGE,
  RC_NATION,
  RC_POLITIC,
  RC_EDUCATION_TYPE,
  USER_NATION_TEST,
  USER_POLITICAL,
  RC_EDUCATION_LEVEL,
  PERSONAL_WORK_STATUS,
  YES_NO,
  PERSONAL_SKILL_LEVEL,
  SYSTEM_TALENTTYPE,
] = useDict(
  'identity_type',
  'user_sex',
  'rc_marriage',
  'rc_nation',
  'rc_politic',
  'rc_education_type',
  'user_nation_test',
  'user_political',
  'rc_education_level',
  'personal_work_status',
  'yes_no',
  'personal_skill_level',
  'system_talenttype',
)

const { data, execute, pending, queryParams, onFilter, onFilterReset, pagination, onChange } =
  useTable(filterFormRef)

const { onDelete } = useActions(execute)

// 重置密码方法
const handleResetPassword = async (id: number) => {
  confirm({
    title: '确认重置密码',
    content: '确定要重置该人才账号的密码吗？重置后密码将变为默认值',
    onOk: async () => {
      try {
        await resetPassword(id)
        message.success('密码重置成功')
      } catch (error) {
        message.error('密码重置失败，请重试')
      }
    },
  })
}

defineOptions({ name: 'TalentInfo' })
</script>
