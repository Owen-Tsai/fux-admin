<script setup lang="ts">
import dayjs from 'dayjs'

const model = defineModel('value', { default: '' })
const visible = ref(false)
const message = useMessage()

const active = ref<MapKey>('second')

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

const appointOptsMap = {
  second: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 59],
  minute: [0, 5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 59],
  hour: Array.from({ length: 24 })
    .fill(0)
    .map((_, idx) => idx),
  day: Array.from({ length: 31 })
    .fill(0)
    .map((_, idx) => idx + 1),
  month: Array.from({ length: 12 })
    .fill(0)
    .map((_, idx) => idx + 1),
  week: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'].map((e, idx) => ({
    value: idx,
    label: e,
  })),
  year: yearOpts.value,
}

const getModelValue = (key: MapKey) => {
  const type = cronMap[key].type
  switch (type) {
    case -1:
      return ''
    case 0:
      return '*'
    case 1:
      return `${cronMap[key].range[0]}-${cronMap[key].range[1]}`
    case 2:
      return key === 'week'
        ? `${cronMap[key].loop[0]}#${cronMap[key].loop[1]}`
        : `${cronMap[key].loop[0]}/${cronMap[key].loop[1]}`
    case 3:
      return cronMap[key].appoint.length > 0 ? cronMap[key].appoint.join(',') : '*'
    case 4:
      return key === 'week' ? `${cronMap[key].last}L` : 'L'
    case 5:
      return '?'
    default:
      return '*'
  }
}

const setModelValue = (value: string[]) => {
  const keys: MapKey[] = ['second', 'minute', 'hour', 'day', 'month', 'week', 'year']
  value.forEach((val, idx) => {
    const key = keys[idx]
    if (val === '*') {
      cronMap[key].type = 0
    } else if (val.includes('-')) {
      // range
      const v = val.split('-')
      cronMap[key].type = 1
      cronMap[key].range = [Number(v[0]), Number(v[1])]
    } else if (val.includes('/')) {
      // loop
      const v = val.split('/')
      cronMap[key].type = 2
      cronMap[key].loop = [Number(v[0]), Number(v[1])]
    } else if (val.includes('#')) {
      // loop for week
      const v = val.split('#')
      cronMap[key].type = 2
      cronMap[key].loop = [Number(v[0]), Number(v[1])]
    } else if (val.includes('L')) {
      cronMap[key].type = 4
      if (key === 'week') {
        cronMap[key].last = Number(val.replace('L', ''))
      }
    } else if (val === '?') {
      cronMap[key].type = 5
    } else if (val === '') {
      cronMap[key].type = -1
    } else {
      cronMap[key].type = 3
      cronMap[key].appoint = val.split(',')
    }
  })
}

const valueSecond = computed(() => getModelValue('second'))
const valueMinute = computed(() => getModelValue('minute'))
const valueHour = computed(() => getModelValue('hour'))
const valueDay = computed(() => getModelValue('day'))
const valueMonth = computed(() => getModelValue('month'))
const valueWeek = computed(() => getModelValue('week'))
const valueYear = computed(() => getModelValue('year'))

const value = computed(
  () =>
    `${valueSecond.value} ${valueMinute.value} ${valueHour.value} ${valueDay.value} ${valueMonth.value} ${valueWeek.value} ${valueYear.value}`,
)

const setDefaultValue = () => {
  let arr = value.value?.split(' ')
  if (!arr || arr.length < 6) {
    message.warning('不合法的 CRON 表达式，已替换为默认值')
    arr = '* * * * * ?'.split(' ')
  }

  setModelValue(arr)
}

const submit = () => {
  model.value = value.value
  close()
}

defineExpose({
  open,
  close,
})

setDefaultValue()
</script>

<template>
  <TDialog v-model:visible="visible" header="Cron 表达式编辑器" @confirm="submit">
    <div>
      <TTabs v-model:value="active">
        <TTabPanel
          v-for="key in Object.keys(cronMap)"
          :key="key"
          :label="labelMap[key as MapKey]"
          :value="key"
        >
          <div class="">
            <div class="flex items-center gap-4 py-4">
              <TRadioGroup v-model:value="cronMap[active].type">
                <TRadio v-if="active === 'year'" :value="-1">忽略</TRadio>
                <TRadio :value="0">任意值</TRadio>
                <TRadio :value="1">范围</TRadio>
                <TRadio :value="2">间隔</TRadio>
                <TRadio :value="3">指定</TRadio>
                <TRadio v-if="active === 'day'" :value="4">本月最后一天</TRadio>
                <TRadio v-if="active === 'week'" :value="4">本月最后一周</TRadio>
                <TRadio :value="5">不指定</TRadio>
              </TRadioGroup>
            </div>

            <div class="mt-4">
              <!-- range -->
              <div v-if="cronMap[active].type === 1" class="flex items-center w-full gap-1">
                <span class="flex-none">范围：从</span>
                <TInputNumber
                  v-model:value="cronMap[active].range[0]"
                  theme="column"
                  class="flex-grow-0 min-w-0"
                />
                <span class="flex-none">~</span>
                <TInputNumber
                  v-model:value="cronMap[active].range[1]"
                  theme="column"
                  class="flex-grow-0 min-w-0"
                />
              </div>
              <!-- loop -->
              <template v-if="cronMap[active].type === 2">
                <template v-if="active === 'week'">
                  每月第
                  <TInputNumber v-model:value="cronMap[active].loop[0]" theme="column" />
                  周的
                  <TSelect
                    v-model:value="cronMap.week.loop[1]"
                    :options="appointOptsMap.week"
                    clearable
                  />
                  执行一次
                </template>
                <template v-else>
                  从
                  <TInputNumber v-model:value="cronMap[active].loop[0]" theme="column" />
                  {{ labelMap[active] }}
                  开始，每
                  <TInputNumber v-model:value="cronMap[active].loop[1]" theme="column" />
                  <span>{{ labelMap[active] }}</span>
                  执行一次
                </template>
              </template>
              <!-- appoint -->
              <template v-if="cronMap[active].type === 3">
                指定值：
                <TSelect
                  v-if="active === 'week'"
                  v-model:value="cronMap.week.appoint"
                  multiple
                  :options="appointOptsMap.week"
                  clearable
                />
                <TSelect
                  v-else
                  v-model:value="cronMap[active].appoint"
                  multiple
                  :options="appointOptsMap[active].map((e) => ({ value: e, label: e }))"
                />
              </template>
              <!-- last -->
              <template v-if="cronMap[active].type === 4 && active === 'week'">
                <TSelect v-model:value="cronMap.week.last" :options="appointOptsMap.week" clearable>
                </TSelect>
              </template>
            </div>
          </div>
        </TTabPanel>
      </TTabs>
    </div>

    <TDivider />

    <div class="mt-2">
      <div>配置的 CRON 表达式：</div>
      <div>{{ value }}</div>
    </div>
  </TDialog>
</template>
