<template>
  <TCard title="人才数量实时统计">
    <template #actions>
      <TLink theme="primary">自定义</TLink>
    </template>
    <div>
      <Chart :option="option" :theme="isDark ? 'dark' : 'light'" autoresize class="h-260px" />
    </div>
  </TCard>
</template>

<script setup lang="ts">
import useAppStore from '@/stores/app'
import { graphic, type EChartsOption } from 'echarts'

const { isDark } = storeToRefs(useAppStore())

const option = ref<EChartsOption>({
  backgroundColor: 'transparent',
  grid: {
    right: 0,
    left: 0,
    top: 10,
    bottom: 24,
    containLabel: true,
  },
  xAxis: {
    type: 'category',
    offset: 2,
    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月', '8月', '9月', '10月', '11月', '12月'],
    axisLabel: {
      color: '#4E5969',
    },
    axisTick: {
      lineStyle: {
        color: '#E5E8EF',
      },
    },
    axisLine: {
      show: false,
    },
    splitLine: {
      show: true,
      interval: (idx: number) => {
        if (idx === 0) return false
        return true
      },
      lineStyle: {
        color: '#E5E8EF',
        type: 'dashed',
      },
    },
  },
  yAxis: {
    type: 'value',
    splitLine: {
      lineStyle: {
        type: 'dashed',
      },
    },
    axisLabel: {
      formatter: (val: number, idx: number) => {
        if (idx === 0) return `${val}`
        return `${val}k`
      },
    },
  },
  tooltip: {
    trigger: 'axis',
    className: 'echart-tooltip',
    textStyle: {
      color: 'var(--color-text-secondary)',
    },
  },
  series: [
    {
      type: 'line',
      smooth: true,
      data: [820, 932, 901, 934, 1290, 1330, 1320, 1108, 1159, 1284, 1340, 1380],
      showSymbol: false,
      symbolSize: 14,
      emphasis: {
        focus: 'series',
        itemStyle: {
          borderWidth: 3,
        },
      },
      lineStyle: {
        width: 3,
        color: new graphic.LinearGradient(0, 0, 1, 0, [
          {
            offset: 0,
            color: 'rgba(30, 231, 255, 1)',
          },
          {
            offset: 0.5,
            color: 'rgba(36, 154, 255, 1)',
          },
          {
            offset: 1,
            color: 'rgba(111, 66, 251, 1)',
          },
        ]),
      },
      areaStyle: {
        opacity: 0.8,
        color: new graphic.LinearGradient(0, 0, 0, 1, [
          {
            offset: 0,
            color: 'rgba(17, 126, 255, 0.16)',
          },
          {
            offset: 1,
            color: 'rgba(17, 128, 255, 0)',
          },
        ]),
      },
    },
  ],
})
</script>
