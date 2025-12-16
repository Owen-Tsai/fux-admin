<template>
  <TDialog
    v-model:visible="visible"
    :confirm-loading="loading"
    header="日志详情"
    width="1000px"
    :footer="false"
  >
    <TLoading :loading="loading">
      <div style="min-height: 300px">
        <t-empty v-if="logList.length === 0" title="暂无数据"></t-empty>
        <div>
          <span v-for="(item, index) in logList" v-html="item" :key="index"></span>
          <TLoading v-if="!logEnded" text="加载中..." size="small" />
          <div v-show="logEnded" style="margin-top: 20px">
            <span style="color: green">[Rolling Log Finish]</span>
          </div>
        </div>
      </div>
    </TLoading>
  </TDialog>
</template>

<script lang="ts" setup>
import {
  getXxlLogDetailCat,
  type XxlJobLogDetailCatVo,
  type XxlJobLogVO,
} from '@/api/xxljob/joblog'

const visible = ref(false)
const loading = ref(false)
const logList = ref<string[]>([])
const isLogLoading = ref(false)
const logEnded = ref(false)
const handleCode = ref(0)

const logDetailCat = ref<XxlJobLogDetailCatVo>({
  logId: undefined,
  fromLineNum: 1,
})

const loadData = async () => {
  loading.value = true
  await pullLog()
  loading.value = false
}

const open = (row: XxlJobLogVO) => {
  logDetailCat.value.logId = row.id
  logDetailCat.value.fromLineNum = 1
  handleCode.value = row?.handleCode || 0
  logList.value = []
  loadData()
  visible.value = true
}

defineExpose({ open })

const pullLog = async () => {
  const res = await getXxlLogDetailCat(logDetailCat.value)
  if (res.logContent) logList.value.push(res.logContent)
  if(res.toLineNum)
    logDetailCat.value.fromLineNum = res.toLineNum + 1
  if (handleCode.value > 0)
    pullLogEnd()
  if (res.end || (res.fromLineNum >= (res?.toLineNum || res.fromLineNum)))
    pullLogEnd()
  if (!logEnded) {
    isLogLoading.value = true
    setTimeout(() => {
      pullLog()
    }, 2000)
  }
}

const pullLogEnd = () => {
  logEnded.value = true
  isLogLoading.value = false
}
</script>
