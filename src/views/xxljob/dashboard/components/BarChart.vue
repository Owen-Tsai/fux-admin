<template>
  <div
    ref="chartRef"
    :class="className"
    :style="{ height, width }"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import 'echarts/theme/macarons'

interface BarChartData {
  jobSuccess: number
  jobFail: number
  jobRunning: number
}

const props = withDefaults(
  defineProps<{
    className?: string
    width?: string
    height?: string
    chartData: BarChartData
  }>(),
  {
    className: 'chart',
    width: '100%',
    height: '300px'
  }
)

const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

const animationDuration = 6000

const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value, 'macarons')
  setOptions(props.chartData)
}
const setOptions = (data: BarChartData) => {
  if (!chart) return

  console.log("initData============", data)
  chart.setOption({
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow'
      }
    },
    grid: {
      top: 70,
      left: '15%',
      right: '15%',
      bottom: 0,
      containLabel: true
    },
    xAxis: [{
      type: 'category',
      data: ['成功', '失败', '进行中'],
    }],
    yAxis: [{
      type: 'value'
    }],
    series: [
      {
        type: 'bar',
        barWidth: '30%',
        data: [ data.jobSuccess || 0, data.jobFail || 0, data.jobRunning || 0]
      }
    ]
  }, true)
}

watch(
() => props.chartData,
  (newData) => {
    console.log("newData============", newData)
      setOptions(newData)
  },
  { deep: true }
)

onMounted(() => {
  initChart()
})
onBeforeUnmount(() => {
  if (chart) {
    chart.dispose()
    chart = null
  }
})
</script>
