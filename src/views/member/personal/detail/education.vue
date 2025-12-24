<script setup lang="ts">
import dayjs from 'dayjs'
import type { ProfileVO } from '@/api/member/personal'

const { data } = defineProps<{
  data: ProfileVO['educationList']
}>()

const [educationLevels] = useDict('education_level')
</script>

<template>
  <template v-if="data && data.length > 0">
    <div v-for="item in data" :key="item.id" class="my-4">
      <TDescriptions bordered :column="12" :label-style="{ width: '140px' }">
        <TDescriptionsItem label="学校名称" :span="6">{{ item.schoolName }}</TDescriptionsItem>
        <TDescriptionsItem label="学历层次" :span="3">
          <DictTag :dict-data="educationLevels" :value="item.educationLevel" />
        </TDescriptionsItem>
        <TDescriptionsItem label="专业名称" :span="3">{{ item.major }}</TDescriptionsItem>
        <TDescriptionsItem label="入学时间" :span="6">
          {{ dayjs(item.startDate).format('YYYY-MM-DD') }}
        </TDescriptionsItem>
        <TDescriptionsItem label="毕业时间" :span="6">
          {{ dayjs(item.endDate).format('YYYY-MM-DD') }}
        </TDescriptionsItem>
        <TDescriptionsItem label="学位证书编号" :span="6">
          {{ item.degreeCertificateNo }}
        </TDescriptionsItem>
        <TDescriptionsItem label="毕业证书编号" :span="6">{{ item.diplomaNo }}</TDescriptionsItem>
      </TDescriptions>
    </div>
  </template>
  <TEmpty class="!my-4" v-else />
</template>
