<script setup lang="ts">
import dayjs from 'dayjs'

const model = defineModel('value', { default: '' })
const visible = ref(false)

const open = () => {
  visible.value = true
}

const close = () => {
  visible.value = false
}

type MapValue = {
  type: number
  range: number[]
  loop: number[]
  appoint: string[]
  last?: number
}

type MapKey = 'second' | 'minute' | 'hour' | 'day' | 'month' | 'week' | 'year'

const yearOpts = computed(() => {
  const now = dayjs()
  return [now.year(), now.year() + 100]
})

const labelMap = {
  second: '秒',
  minute: '分',
  hour: '时',
  day: '日',
  month: '月',
  week: '周',
  year: '年',
}

const cronMap = reactive<Record<MapKey, MapValue>>({
  second: {
    type: 0,
    range: [1, 2],
    loop: [0, 1],
    appoint: [],
  },
  minute: {
    type: 0,
    range: [1, 2],
    loop: [0, 1],
    appoint: [],
  },
  hour: {
    type: 0,
    range: [1, 2],
    loop: [0, 1],
    appoint: [],
  },
  day: {
    type: 0,
    range: [1, 2],
    loop: [1, 1],
    appoint: [],
  },
  month: {
    type: 0,
    range: [1, 2],
    loop: [1, 1],
    appoint: [],
  },
  week: {
    type: 5,
    range: [2, 3],
    loop: [0, 2],
    last: 2,
    appoint: [],
  },
  year: {
    type: -1,
    range: [yearOpts.value[0], yearOpts.value[1]],
    loop: [yearOpts.value[0], 1],
    appoint: [],
  },
})

defineExpose({
  open,
  close,
})
</script>

<template>
  <TDialog v-model:visible="visible" header="Cron 表达式编辑器">
    <TTabs>
      <TTabPane
        v-for="key in Object.keys(cronMap)"
        :key="key"
        :label="labelMap[key as MapKey]"
        :value="key"
      >
        123
      </TTabPane>
    </TTabs>
  </TDialog>
</template>
