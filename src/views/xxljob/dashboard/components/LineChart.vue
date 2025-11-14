<template>
  <div :class="className" :style="{ height, width }" ref="chartRef" />
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, watch, ref, nextTick } from 'vue'
import * as echarts from 'echarts'
import 'echarts/theme/macarons' // 引入主题

// -------------------------------
// 定义 Props
// -------------------------------

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

// -------------------------------
// 模板引用
// -------------------------------

const chartRef = ref<HTMLDivElement | null>(null)
let chart: echarts.ECharts | null = null

// -------------------------------
// 初始化图表
// -------------------------------

const initChart = () => {
  if (!chartRef.value) return

  chart = echarts.init(chartRef.value, 'macarons')
  setOptions(props.chartData)

}

// -------------------------------
// 设置图表选项
// -------------------------------

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
      left: 10,
      right: 10,
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

// -------------------------------
// 监听数据变化
// -------------------------------

watch(
  () => props.chartData,
  (val) => {
    nextTick(() => {
      setOptions(val)
    })
  },
  { deep: true }
)

// -------------------------------
// 生命周期
// -------------------------------

onMounted(() => {
  nextTick(() => {
    initChart()
  })
})

onBeforeUnmount(() => {
  if (!chart) return

  // 销毁图表
  chart?.dispose()
  chart = null
})
</script>

<style scoped>
.chart {
  /* 可选基础样式 */
}
</style>
