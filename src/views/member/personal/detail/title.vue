<script setup lang="ts">
import dayjs from 'dayjs'
import type { ProfileVO } from '@/api/member/personal'

const { data } = defineProps<{
  data: ProfileVO['titleList']
}>()

const [titleLevels, professionalFields] = useDict('personal_title_level', 'tec_field')
</script>

<template>
  <template v-if="data && data.length > 0">
    <div v-for="item in data" :key="item.id" class="my-4">
      <TDescriptions bordered :label-style="{ width: '140px' }">
        <TDescriptionsItem label="职称名称">{{ item.titleName }}</TDescriptionsItem>
        <TDescriptionsItem label="职称等级">
          <DictTag :dict-data="titleLevels" :value="item.titleLevel" />
        </TDescriptionsItem>
        <TDescriptionsItem label="专业领域">
          <DictTag :dict-data="professionalFields" :value="item.professionalField" />
        </TDescriptionsItem>
        <TDescriptionsItem label="资格名称">{{ item.qualificationName }}</TDescriptionsItem>
        <TDescriptionsItem label="证书编号">{{ item.certificateNo }}</TDescriptionsItem>
        <TDescriptionsItem label="获得时间">
          {{ dayjs(item.obtainDate).format('YYYY-MM-DD') }}
        </TDescriptionsItem>
      </TDescriptions>
    </div>
  </template>
  <TEmpty class="!my-4" v-else />
</template>
