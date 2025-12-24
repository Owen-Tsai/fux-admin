<script setup lang="ts">
import dayjs from 'dayjs'
import type { ProfileVO } from '@/api/member/personal'

const { data } = defineProps<{
  data: ProfileVO['skillList']
}>()

const [skillLevels] = useDict('personal_skill_level')
</script>

<template>
  <template v-if="data && data.length > 0">
    <div v-for="item in data" :key="item.id" class="my-4">
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
  <TEmpty class="!my-4" v-else />
</template>
