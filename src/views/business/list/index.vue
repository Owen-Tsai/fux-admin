<template>
  <div class="w-full h-full relative">
    <!-- 待审核列表 -->
    <TLoading class="w-full h-full" :loading="loadingAppInfo">
      <div class="view">
        <div class="flex justify-between items-center mb-4">
          <div class="flex justify-between items-center">
            <div class="flex items-center gap-4">
              <div>
                <TAvatar :image="app?.iconFe" size="56px" shape="round">
                  {{ app?.name?.slice(0, 2) }}
                </TAvatar>
              </div>
              <div>
                <h2 class="my-0">{{ app?.name }} {{ isArchive ? '信息库' : '审核' }}</h2>
                <div class="flex items-center text-muted gap-10"></div>
              </div>
            </div>
          </div>
          <div>
            <TStatistic title="待审核" :value="data?.total || 0" />
          </div>
        </div>

        <!-- 审核列表筛选 -->
        <TCard class="query-form !mb-4">
          <TForm
            ref="queryForm"
            :data="query"
            layout="inline"
            class="flex flex-wrap gap-y-4 w-full"
            label-width="100px"
            @submit="onQueryChange()"
            @reset="onQueryChange(true)"
          >
            <TFormItem label="申请人" name="startUser" class="col">
              <TInput v-model:value="query.startUser" placeholder="请输入申请人" clearable />
            </TFormItem>
            <TFormItem label="审核状态" name="auditProcess" class="col">
              <TSelect
                v-model:value="query.auditProcess"
                :options="auditProcessOpts"
                placeholder="请选择审核状态"
                clearable
              />
            </TFormItem>
            <TFormItem v-show="expanded" label="申请时间" name="submitTime" class="col">
              <TDateRangePicker
                v-model:value="query.submitTime"
                placeholder="请选择申请时间"
                clearable
              />
            </TFormItem>
            <QueryActions
              v-model:expanded="expanded"
              :class="['col', expanded ? 'ml-2/3' : null]"
            />
          </TForm>
        </TCard>

        <!-- 审核列表 -->
        <TCard title="审核列表">
          <template #actions>
            <div class="flex items-center gap-2">
              <TTooltip content="重新载入">
                <TButton shape="square" variant="text" :loading="pending" @click="execute()">
                  <template #icon>
                    <Icon name="refresh" />
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
            <template #createTime="{ row }">
              {{ dayjs(row.createTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template #submitTime="{ row }">
              {{ dayjs(row.submitTime).format('YYYY-MM-DD HH:mm:ss') }}
            </template>
            <template #auditProcess="{ row }">
              <DictTag :dict-data="auditProcessOpts" :value="row.auditProcess" />
            </template>
            <template #actions="{ row }: TableScope<AuditEntryVO>">
              <TTooltip v-if="!isArchive" content="审核">
                <TButton theme="primary" variant="text" shape="square" @click="toAuditPage(row)">
                  <template #icon>
                    <Icon name="seal" />
                  </template>
                </TButton>
              </TTooltip>
              <TTooltip v-else content="查看详情">
                <TButton theme="primary" variant="text" shape="square">
                  <template #icon>
                    <Icon name="browse" />
                  </template>
                </TButton>
              </TTooltip>
            </template>
          </TTable>
        </TCard>
      </div>
    </TLoading>
  </div>
</template>

<script setup lang="ts">
import dayjs from 'dayjs'
import useAppInfo from './use-info'
import { useTable, columns } from './use-table'
import type { AuditEntryVO } from '@/api/business'
import type { FormInstanceFunctions } from 'tdesign-vue-next'

defineOptions({ name: 'BusinessAuditList' })

const expanded = ref(false)
const route = useRoute()

const queryForm = useTemplateRef<FormInstanceFunctions>('queryForm')

const { data, pending, query, pagination, onPageChange, onQueryChange, execute, toAuditPage } =
  useTable(queryForm)
const { app, loadingAppInfo } = useAppInfo()

const [auditProcessOpts] = useDict('app_audit_process')

const isArchive = computed(() => route.query.taskDefKey === 'All')
</script>
