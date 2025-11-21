<script setup lang="ts">
import { ref } from 'vue'
import Basic from './basic.vue'
import Work from './work.vue'
import Education from './education.vue'
import Patent from './patent.vue'
import Honor from './honor.vue'
import Publication from './publication.vue'
import Title from './title.vue'
import Skill from './skill.vue'
import type { ProfileVO } from '@/api/member/personal'

const visible = ref(false)
const active = ref(0)

const data = ref<ProfileVO>()

function open(profile: ProfileVO) {
  data.value = profile
  visible.value = true
}

defineExpose({ open })
</script>

<template>
  <TDialog v-model:visible="visible" header="人才详情" width="80%">
    <TTabs ref="wrapper" v-model:value="active">
      <TTabPanel label="基础要素" :value="0">
        <Basic class="!py-4" v-if="data" :profile="data" />
      </TTabPanel>
      <TTabPanel label="工作经历" :value="1">
        <Work class="!py-4" :data="data?.workList" />
      </TTabPanel>
      <TTabPanel label="教育经历" :value="2">
        <Education class="!py-4" :data="data?.educationList" />
      </TTabPanel>
      <TTabPanel label="专利信息" :value="3">
        <Patent class="!py-4" :data="data?.patentList" />
      </TTabPanel>
      <TTabPanel label="荣誉奖励" :value="4">
        <Honor class="!py-4" :data="data?.honorList" />
      </TTabPanel>
      <TTabPanel label="著作信息" :value="5">
        <Publication class="!py-4" :data="data?.publicationList" />
      </TTabPanel>
      <TTabPanel label="职称信息" :value="6">
        <Title class="!py-4" :data="data?.titleList" />
      </TTabPanel>
      <TTabPanel label="技能信息" :value="7">
        <Skill class="!py-4" :data="data?.skillList" />
      </TTabPanel>
    </TTabs>

    <template #footer>
      <TButton @click="visible = false">关闭</TButton>
    </template>
  </TDialog>
</template>
