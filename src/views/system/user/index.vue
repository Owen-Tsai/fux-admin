<script setup lang="ts">
import { h } from 'vue'
import { SearchIcon } from 'tdesign-icons-vue-next'
import useDeptTree from './use-dept-tree'
import { columns, useUserTable } from './use-user-table'
import dayjs from 'dayjs'
import PasswordForm from './password-form.vue'
import RoleForm from './role-form.vue'
import Form from './form.vue'
import type { FormInstanceFunctions, TreeProps } from 'tdesign-vue-next'
import type { UserVO } from '@/api/system/user'

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')
const passwordForm = useTemplateRef<InstanceType<typeof PasswordForm>>('passwordForm')
const roleForm = useTemplateRef<InstanceType<typeof RoleForm>>('roleForm')
const form = useTemplateRef('form')

const { permission } = usePermission()

const { deptLoading, deptTree, filterText, filter, activeNodes } = useDeptTree()
const {
  data,
  query,
  onPageChange,
  onQueryChange,
  onDelete,
  onSetStatus,
  pagination,
  pending,
  execute,
} = useUserTable(queryForm)

const wrapper = useTemplateRef('wrapper')
const parentElement = useParentElement(wrapper)
const { height } = useElementSize(parentElement)

const expanded = ref(false)
const [commonStatus] = useDict('common_status')

const currentDeptName = ref('全部')

const onDeptActive: TreeProps['onActive'] = (_, ctx) => {
  currentDeptName.value = activeNodes.value[0] ? ctx.node.data.name : '全部'
  query.value.deptId = activeNodes.value[0] || undefined
  onQueryChange()
}

const onAdd = () => {
  form.value?.open()
  nextTick(() => {
    if (query.value.deptId) {
      form.value?.setDept(query.value.deptId)
    }
  })
}
</script>

<template>
  <div ref="wrapper" class="view">
    <div class="flex items-start flex-row-reverse lg:flex-row max-h-full h-auto">
      <div class="w-full lg:w-5/24 flex-none !sticky left-0 top-0 lg:pr-2">
        <TCard class="card" :style="{ height: height ? `${height}px` : '100%' }">
          <TInput
            v-model:value="filterText"
            placeholder="输入名称进行过滤"
            clearable
            class="flex-none"
            :prefix-icon="() => h(SearchIcon)"
          />
          <TLoading :loading="deptLoading" class="flex-1 min-h-0 mt-4">
            <TTree
              v-model:actived="activeNodes"
              :keys="{ label: 'name', value: 'id' }"
              :data="deptTree"
              :filter="filter"
              expand-all
              activable
              height="100%"
              @active="onDeptActive"
            />
          </TLoading>
        </TCard>
      </div>
      <div class="w-full lg:w-19/24 lg:pl-2">
        <TCard v-if="permission.has('system:user:query')" class="query-form !mb-4">
          <TForm
            ref="queryForm"
            :data="query"
            layout="inline"
            class="flex flex-wrap gap-y-4"
            label-width="64px"
            @submit="onQueryChange()"
            @reset="onQueryChange(true)"
          >
            <TFormItem label="用户账号" name="username" class="col">
              <TInput v-model:value="query.username" placeholder="请输入用户账号" />
            </TFormItem>
            <TFormItem label="用户名称" name="nickname" class="col">
              <TInput v-model:value="query.nickname" placeholder="请输入用户名称" />
            </TFormItem>
            <TFormItem v-show="expanded" label="手机号码" name="mobile" class="col">
              <TInput v-model:value="query.mobile" placeholder="请输入用户绑定的手机号码" />
            </TFormItem>
            <TFormItem v-show="expanded" label="注册时间" name="createTime" class="col">
              <TDateRangePicker v-model:value="query.createTime" value-type="YYYY-MM-DD" />
            </TFormItem>
            <TFormItem v-show="expanded" label="账号状态" name="status" class="col">
              <TSelect
                v-model:value="query.status"
                :options="commonStatus"
                placeholder="请选择账号状态"
              />
            </TFormItem>
            <QueryActions v-model:expanded="expanded" class="col" />
          </TForm>
        </TCard>

        <TCard :title="`${currentDeptName}用户列表`" bordred>
          <template #actions>
            <div class="flex items-center gap-2">
              <TButton v-if="permission.has('system:user:create')" theme="primary" @click="onAdd()">
                <template #icon>
                  <TIcon name="add" />
                </template>
                新增
              </TButton>

              <TTooltip content="重新载入">
                <TButton shape="square" variant="text" @click="execute()">
                  <template #icon>
                    <TIcon name="refresh" />
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
            <template #status="{ row }: TableScope<UserVO>">
              <TSwitch
                v-model:value="row.status"
                :custom-value="[0, 1]"
                :label="['启用', '停用']"
                @change="(v) => onSetStatus(row.id!, v as number)"
              />
            </template>
            <template #createTime="{ row }: TableScope<UserVO>">
              {{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template #actions="{ row }: TableScope<UserVO>">
              <div class="flex gap-2">
                <TTooltip content="编辑">
                  <TButton
                    shape="square"
                    theme="primary"
                    variant="text"
                    @click="form?.open(row.id)"
                  >
                    <template #icon>
                      <TIcon name="edit-2" />
                    </template>
                  </TButton>
                </TTooltip>
                <TDropdown>
                  <TButton shape="square" theme="primary" variant="text">
                    <template #icon>
                      <TIcon name="unfold-more" />
                    </template>
                  </TButton>
                  <TDropdownMenu>
                    <TDropdownItem @click="roleForm?.open(row)">设置角色</TDropdownItem>
                    <TDropdownItem divider @click="passwordForm?.open(row)">重置密码</TDropdownItem>
                    <TDropdownItem theme="error" @click="onDelete(row.id!)">删除用户</TDropdownItem>
                  </TDropdownMenu>
                </TDropdown>
              </div>
            </template>
          </TTable>
        </TCard>
      </div>
    </div>

    <PasswordForm ref="passwordForm" @success="execute()" />
    <RoleForm ref="roleForm" @success="execute()" />
    <Form ref="form" @success="execute()" />
  </div>
</template>

<style lang="scss" scoped>
.card :deep(.t-card__body) {
  @apply h-full flex flex-col;
}
</style>
