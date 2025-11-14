<template>
  <TRow :gutter="32" type="flex" justify="center" class="panel-group">
    <TCol :span="4" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper">
          <TIcon name="address-book" class-name="card-panel-icon" size="50px" color="#40c9c6" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">任务总数</div>
          <div class="card-panel-num">
            <count-up :start-val="0" :end-val="groupData.jobInfoCount" :duration="2" />
          </div>
        </div>
      </div>
    </TCol>
    <TCol :span="4" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper">
          <TIcon name="git-branch" class-name="card-panel-icon" size="50px" color="#40c9c6" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">调度总次数</div>
          <div class="card-panel-num">
            <count-up :start-val="0" :end-val="groupData.jobLogCount" :duration="2" />
          </div>
        </div>
      </div>
    </TCol>
    <TCol :span="4" class="card-panel-col">
      <div class="card-panel">
        <div class="card-panel-icon-wrapper">
          <TIcon name="constraint" class-name="card-panel-icon" size="50px" color="#40c9c6" />
        </div>
        <div class="card-panel-description">
          <div class="card-panel-text">在线执行器数量</div>
          <div class="card-panel-num">
            <count-up :start-val="0" :end-val="groupData.executorCount" :duration="2" />
          </div>
        </div>
      </div>
    </TCol>
  </TRow>
</template>

<script setup lang="ts">
import { defineProps, withDefaults } from 'vue'

import CountUp from 'vue-countup-v3'

// -------------------------------
// 定义 Props 类型
// -------------------------------

interface GroupData {
  jobInfoCount: number
  jobLogCount: number
  executorCount: number
}

interface Props {
  groupData: GroupData
}

// 设置默认值（可选）
const props = withDefaults(defineProps<Props>(), {
  groupData: () => ({
    jobInfoCount: 0,
    jobLogCount: 0,
    executorCount: 0,
  }),
})

// -------------------------------
// 事件定义与方法
// -------------------------------

// 定义 emit 类型
const emit = defineEmits<{
  (e: 'handleSetLineChartData', type: string): void
}>()

// 点击卡片触发事件
const handleSetLineChartData = (type: string) => {
  emit('handleSetLineChartData', type)
}
</script>

<style lang="scss" scope>
.panel-group {
  margin-top: 18px;

  .card-panel-col {
    margin-bottom: 16px;
  }

  .card-panel {
    height: 108px;
    cursor: pointer;
    font-size: 12px;
    position: relative;
    overflow: hidden;
    color: #666;
    background: #fff;
    box-shadow: 4px 4px 40px rgba(0, 0, 0, 0.05);
    border-color: rgba(0, 0, 0, 0.05);

    &:hover {
      .card-panel-icon-wrapper {
        color: #fff;
      }

      .icon-people {
        background: #40c9c6;
      }

      .icon-message {
        background: #36a3f7;
      }

      .icon-money {
        background: #f4516c;
      }

      .icon-shoppingCard {
        background: #34bfa3;
      }
    }

    .icon-people {
      color: #40c9c6;
    }

    .icon-message {
      color: #36a3f7;
    }

    .icon-money {
      color: #f4516c;
    }

    .icon-shoppingCard {
      color: #34bfa3;
    }

    .card-panel-icon-wrapper {
      float: left;
      margin: 14px 0 0 14px;
      padding: 16px;
      transition: all 0.38s ease-out;
      border-radius: 6px;
    }

    .card-panel-icon {
      float: left;
      font-size: 48px;
    }

    .card-panel-description {
      float: right;
      font-weight: bold;
      margin: 26px;
      margin-left: 0px;

      .card-panel-text {
        line-height: 18px;
        color: rgba(0, 0, 0, 0.45);
        font-size: 16px;
        margin-bottom: 12px;
      }

    }

    .card-panel-num {
      font-size: 20px;
    }
  }
}
</style>
