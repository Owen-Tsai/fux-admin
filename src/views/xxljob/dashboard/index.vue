<template>
  <div class="">
    <!-- 调度统计 -->
    <panel-group :group-data="panelGroupData"/>
    <t-card title="调度报表" header-bordered>
      <TRow>
        <TCol :span="8">
          <div class="chart-wrapper">
            <line-chart :chart-data="lineChartData"/>
          </div>
        </TCol>
        <TCol :span="4">
          <div class="chart-wrapper">
            <div class="flex-center">
              <t-radio-group v-model="selectRadio" variant="default-filled">
                <t-radio-button value="pieChart" @Click="selectRadio = 'pieChart'">饼图</t-radio-button>
                <t-radio-button value="barChart" @Click="selectRadio = 'barChart'">柱状图</t-radio-button>
              </t-radio-group>
            </div>
            <div>
              <pie-chart :chart-data="pieCharData" v-if="selectRadio === 'pieChart'"/>
              <bar-chart :chart-data="pieCharData" v-if="selectRadio === 'barChart'"/>
            </div>
          </div>
        </TCol>
      </TRow>
      <template #actions>
        <t-space>
          <t-date-range-picker v-model="timeRange" enable-time-picker :need-confirm="true" allow-input format="YYYY-MM-DD HH:mm:ss" :default-time="['00:00:00', '23:59:59']" />
          <t-button @click="doGetDashBoardChartInfo">确定</t-button>
        </t-space>
      </template>
    </t-card>
  </div>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import { ref, computed, onMounted, watch } from 'vue'
import PanelGroup from './components/PanelGroup.vue'
import LineChart from './components/LineChart.vue'
import PieChart from './components/PieChart.vue'
import BarChart from "./components/BarChart.vue";
import {getDashboardChartInfo, getDashBoardPanelInfo} from "@/api/xxljob/joblog";

const panelGroupData = ref<{
  jobInfoCount: number
  jobLogCount: number
  executorCount: number
}>({
  jobInfoCount: 0,
  jobLogCount: 0,
  executorCount: 0,
})

const lineChartData = ref<{
  successData: number[]
  failData: number[]
  runningData: number[]
  lineCharDates: string[]
}>({
  successData: [],
  failData: [],
  runningData: [],
  lineCharDates: [],
})

const pieCharData = ref<{
  jobSuccess: number
  jobFail: number
  jobRunning: number
}>({
  jobSuccess: 0,
  jobFail: 0,
  jobRunning: 0,
})

const timeRange = ref([dayjs().subtract(6, 'day').startOf('day').toDate(), dayjs().endOf('day').toDate()]);
const selectRadio = ref('pieChart')

onMounted(() => {
  doGetDashBoardInfo()
  doGetDashBoardChartInfo()
})

const doGetDashBoardInfo = () => {
  getDashBoardPanelInfo().then((res) => {
    console.log("getDashBoardPanelInfo", res)
    const {
        jobInfoCount, jobLogCount, jobLogSuccessCount, executorCount
    } = res
    panelGroupData.value.jobInfoCount = jobInfoCount
    panelGroupData.value.jobLogCount = jobLogCount
    panelGroupData.value.executorCount = executorCount
  })
}
const doGetDashBoardChartInfo = () => {
  getDashboardChartInfo({
    startDate: dayjs(timeRange.value[0]),
    endDate: dayjs(timeRange.value[1]),
  }).then((res) => {
    console.log("doGetDashBoardChartInfo", res)
    const {
      triggerCountRunningTotal, triggerCountSucTotal, triggerCountFailTotal,
      triggerDayList, triggerDayCountRunningList, triggerDayCountFailList, triggerDayCountSucList
    } = res

    lineChartData.value = {
      successData: triggerDayCountSucList,
      failData: triggerDayCountFailList,
      runningData: triggerDayCountRunningList,
      lineCharDates: triggerDayList
    }

    pieCharData.value = {
      jobRunning: triggerCountRunningTotal,
      jobSuccess: triggerCountSucTotal,
      jobFail: triggerCountFailTotal
    }
  })
}

defineOptions({ name: 'XxlJobDashboard' })
</script>
