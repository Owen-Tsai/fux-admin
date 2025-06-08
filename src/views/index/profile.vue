<script setup lang="ts">
import useUserStore from '@/stores/user'
import { getDeptSimpleList } from '@/api/system/dept'
import { getIndexData } from '@/api/index'

const { user } = storeToRefs(useUserStore())

const { data: depts } = useRequest(getDeptSimpleList, {
  immediate: true,
})

const { data: stats, pending } = useRequest(getIndexData, {
  immediate: true,
})

const statistics = ref([{ label: '' }])
</script>

<template>
  <TCard>
    <div class="flex">
      <div class="w-11/24 relative">
        <div class="flex items-center gap-2 lg:gap-6 overflow-hidden">
          <TAvatar :image="user?.avatar" size="68px" class="flex-none" />
          <div class="text-truncate">
            <div class="text-xl lg:text-2xl text-truncate">欢迎回来，{{ user?.nickname }}</div>
            <div class="mt-2 flex items-center gap-4">
              <TTag theme="primary" variant="light-outline">超级管理员</TTag>
            </div>
          </div>
        </div>
        <div class="mt-4">
          <div class="grid grid-cols-2 text-secondary gap-2">
            <div class="flex items-center gap-2">
              <TIcon name="houses-1" />
              {{ depts?.find((d) => d.id === user?.deptId)?.name || '未分配部门' }}
            </div>
            <div class="flex items-center gap-2">
              <TIcon name="mobile" />
              {{ user?.mobile || '未绑定手机' }}
            </div>
            <div class="flex items-center gap-2 col-end-3 col-start-1">
              <TIcon name="time" />
              上次登录：8 小时前，山东省济南市
              <TTooltip>
                <template #content>
                  <div class="max-w-240px">
                    如果上次登录时间和位置与实际不符，请立即修改密码并通知运维工作人员
                  </div>
                </template>
                <TLink size="small" theme="warning">
                  <TIcon name="help-circle-filled" />
                  有疑问
                </TLink>
              </TTooltip>
            </div>
          </div>
        </div>

        <TTooltip content="编辑个人信息">
          <TButton variant="text" shape="square" theme="primary" class="!absolute right-4 top-0">
            <template #icon>
              <TIcon name="edit-2" />
            </template>
          </TButton>
        </TTooltip>
      </div>

      <div class="w-13/24 border-l-solid border-l-1 border-l-[var(--td-border-level-1-color)]">
        <div class="grid grid-cols-3"></div>
      </div>
    </div>
  </TCard>
</template>
