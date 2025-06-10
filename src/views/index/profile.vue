<script setup lang="ts">
import useUserStore from '@/stores/user'
import { getDeptSimpleList } from '@/api/system/dept'
import { getIndexData, type StatisticsVO } from '@/api/index'

const { user } = storeToRefs(useUserStore())

const { data: depts } = useRequest(getDeptSimpleList, {
  immediate: true,
})

const statistics = ref<StatisticsVO>([
  { title: '审核进度', value: 90.72, suffix: '%' },
  { title: '待审核', value: 56 },
  { title: '开放的业务', value: 12 },
  { title: '申报总量', value: 9287 },
  { title: '本月人才入库', value: 863, trend: 'increase' },
])
</script>

<template>
  <TCard>
    <div class="flex flex-col lg:flex-row">
      <div class="w-full lg:w-11/24 relative pb-6 lg:pb-0">
        <div class="flex items-center gap-2 lg:gap-6 overflow-hidden">
          <TAvatar :image="user?.avatar" size="68px" class="flex-none" />
          <div class="text-truncate">
            <div class="text-xl lg:text-2xl text-truncate">你好，{{ user?.nickname }}</div>
            <div class="mt-2 flex items-center gap-4">
              <TTag theme="primary" variant="light-outline">超级管理员</TTag>
            </div>
          </div>
        </div>
        <div class="mt-6">
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
              <TIcon name="setting" />
            </template>
          </TButton>
        </TTooltip>
      </div>

      <div
        class="w-full lg:w-13/24 lg:pl-6 pt-6 lg:pt-0 border-t-solid border-t-1 lg:border-t-0 lg:border-l-solid lg:border-l-1 border-[var(--td-border-level-1-color)] relative"
      >
        <div class="grid grid-cols-3 gap-4">
          <TStatistic
            v-for="(item, i) in statistics"
            :key="i"
            :title="item.title"
            :value="item.value"
            :suffix="item.suffix"
            :trend="item.trend"
            :color="
              item.trend === 'increase' ? 'green' : item.trend === 'decrease' ? 'red' : undefined
            "
            :animation="{ duration: 2000, valueFrom: 0 }"
            animation-start
          />
        </div>

        <TTooltip content="设置指标展示">
          <TButton variant="text" shape="square" theme="primary" class="!absolute right-0 bottom-0">
            <template #icon>
              <TIcon name="data-display" />
            </template>
          </TButton>
        </TTooltip>
      </div>
    </div>
  </TCard>
</template>
