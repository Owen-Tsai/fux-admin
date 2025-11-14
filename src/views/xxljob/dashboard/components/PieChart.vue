<template>
  <div :class="className" :style="{ height, width }" ref="chartRef" />
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch, nextTick } from 'vue'
import * as echarts from 'echarts'
import 'echarts/theme/macarons' // 主题

// -------------------------------
// 定义 Props 接口
// -------------------------------

interface PieChartData {
  jobSuccess: number
  jobFail: number
  jobRunning: number
}

const props = withDefaults(
  defineProps<{
    className?: string
    width?: string
    height?: string
    chartData: PieChartData
  }>(),
  {
    className: 'chart',
    width: '100%',
    height: '300px'
  }
)

// -------------------------------
// 图表 DOM 引用
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

const setOptions = (data: PieChartData) => {
  if (!chart) return

  chart.setOption({
    title: {
      text: '成功比例图',
      left: 'center'
    },
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b} : {c} ({d}%)'
    },
    legend: {
      bottom: '0',
      left: 'center'
      // orient: 'vertical'
    },
    series: [
      {
        name: '成功比例图',
        type: 'pie',
        roseType: 'radius', // 玫瑰图
        radius: [15, 95],
        center: ['50%', '50%'],
        data: [
          { value: data.jobSuccess, name: '成功' },
          { value: data.jobFail, name: '失败' },
          { value: data.jobRunning, name: '进行中' }
        ],
        animationEasing: 'cubicInOut',
        animationDuration: 2600
      }
    ]
  })
}

// -------------------------------
// 监听数据变化
// -------------------------------

watch(
  () => props.chartData,
  (newData) => {
    nextTick(() => {
      setOptions(newData)
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
  if (chart) {
    chart.dispose()
    chart = null
  }
})
</script>

<style scoped>
/* 如果需要覆盖 el-col 样式，请在父级处理 */
/* .el-col-lg-8 { width: 50%; } 不建议放在这里 */
</style>
