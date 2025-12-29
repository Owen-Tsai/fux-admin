<template>
  <div :class="className" :style="{ height, width }" ref="chartRef" />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref, nextTick } from 'vue'
import * as echarts from 'echarts'
import 'echarts/theme/macarons' // 引入主题

interface ChartData {
  successData: number[]
  failData: number[]
  runningData: number[]
  lineCharDates: string[]
}

const props = withDefaults(
  defineProps<{
    className?: string
    width?: string
    height?: string
    autoResize?: boolean
    chartData: ChartData
  }>(),
  {
    className: 'chart',
    width: '100%',
    height: '350px',
    autoResize: true
  }
)

const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value, 'macarons')
  setOptions(props.chartData)

}

const setOptions = (data: ChartData) => {
  if (!chart) return

  chart.setOption({
    xAxis: {
      type: 'category',
      data: data.lineCharDates,
      boundaryGap: false,
      axisTick: {
        show: false
      }
    },
    grid: {
      left: 30,
      right: 40,
      bottom: 20,
      top: 30,
      containLabel: true
    },
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'cross'
      },
      padding: [5, 10]
    },
    yAxis: {
      type: 'value',
      axisTick: {
        show: false
      }
    },
    legend: {
      data: ['成功', '失败', '进行中']
    },
    series: [
      {
        name: '成功',
        type: 'line',
        data: data.successData,
        smooth: true,
        itemStyle: {
          color: '#9ACD32'
        },
        lineStyle: {
          color: '#9ACD32',
          width: 2
        },
        animationDuration: 2800,
        animationEasing: 'cubicInOut'
      },
      {
        name: '失败',
        type: 'line',
        data: data.failData,
        smooth: true,
        itemStyle: {
          color: '#FF005A'
        },
        lineStyle: {
          color: '#FF005A',
          width: 2
        },
        animationDuration: 2800,
        animationEasing: 'quadraticOut'
      },
      {
        name: '进行中',
        type: 'line',
        data: data.runningData,
        smooth: true,
        itemStyle: {
          color: '#FFD700'
        },
        lineStyle: {
          color: '#FFD700',
          width: 2
        },
        animationDuration: 2800,
        animationEasing: 'quadraticOut'
      }
    ]
  })
}

watch(
  () => props.chartData,
  (val) => {
    nextTick(() => {
      setOptions(val)
    })
  },
  { deep: true }
)

onMounted(() => {
  nextTick(() => {
    initChart()
  })
})

onBeforeUnmount(() => {
  if (!chart) return

  chart?.dispose()
  chart = null
})
</script>
