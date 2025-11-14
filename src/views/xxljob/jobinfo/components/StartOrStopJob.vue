<template>
  <TDialog
    v-model:visible="visible"
    :confirm-loading="loading"
    :header="title"
    :body="content"
    @confirm="onConfirm"
    width="500px"
  >
  </TDialog>
</template>

<script lang="ts" setup>
import {DialogPlugin, type FormInstanceFunctions, MessagePlugin} from 'tdesign-vue-next'
import {nextTriggerTime, startJob, stopJob} from "@/api/xxljob/jobinfo";

const emit = defineEmits(['success'])

const visible = ref(false)
const loading = ref(false)
const mode = ref<'start' | 'stop'>('start')
const jobId = ref<number>(0)
const title = ref('启动确认')
const content = ref('确认将任务状态更改为启动状态吗')


const open = (targetMode: 'start' | 'stop', id: number) => {
  jobId.value = id
  mode.value = targetMode
  title.value = targetMode === 'start' ? '启动确认' : '停止确认'
  content.value = targetMode === 'start' ? '确认将任务状态更改为启动状态吗' : '确认将任务状态更改为停止状态吗'
  visible.value = true
}

const onConfirm = () => {
  console.log('确认', mode.value)
  if (mode.value === 'start')
    onStartJob()
  else
    onStopJob()
}


// 启动任务
const onStartJob = () => {
  console.log('启动确认', mode.value)
    startJob(jobId.value).then(() => {
      MessagePlugin.success({ content: `任务启动成功`})
      emit('success')
      visible.value = false
    }).catch((err) => {
      MessagePlugin.error({ content: `任务启动失败:${err.message}`});
    })
}

// 停止任务
const onStopJob = () => {
  console.log('停止', mode.value)
    stopJob(jobId.value).then(() => {
      MessagePlugin.success({ content: `任务停止成功`})
      emit('success')
      visible.value = false
    }).catch((err) => {
      MessagePlugin.error({ content: `任务停止失败:${err.message}`});
    })
}


defineExpose({ open })
</script>
