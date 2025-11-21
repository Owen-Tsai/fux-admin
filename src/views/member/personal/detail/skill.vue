<script setup lang="ts">
import dayjs from 'dayjs'
import type { ProfileVO } from '@/api/member/personal'

const { data } = defineProps<{
  data: ProfileVO['skillList']
}>()

const [skillLevels] = useDict('personal_skill_level')
</script>

<template>
  <div v-for="item in data" :key="item.id">
    <TDescriptions bordered :column="3" :label-style="{ width: '140px' }">
      <TDescriptionsItem label="技能名称">{{ item.skillName }}</TDescriptionsItem>
      <TDescriptionsItem label="技能等级">
        <DictTag :dict-data="skillLevels" :value="item.skillLevel" />
      </TDescriptionsItem>
      <TDescriptionsItem label="获得时间">
        {{ dayjs(item.obtainDate).format('YYYY-MM-DD') }}
      </TDescriptionsItem>
    </TDescriptions>
  </div>
</template>
