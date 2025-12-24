<script setup lang="ts">
import Basic from './basic.vue'
import Work from './work.vue'
import Education from './education.vue'
import Patent from './patent.vue'
import Honor from './honor.vue'
import Publication from './publication.vue'
import Title from './title.vue'
import Skill from './skill.vue'
import { getDetail, type ProfileVO } from '@/api/member/personal'

const visible = ref(false)
const active = ref(0)
const id = ref<string>()

const { execute, pending, data } = useRequest(() => getDetail(id.value!))

function open(profile: ProfileVO) {
  active.value = 0
  id.value = profile.id!
  visible.value = true
  execute()
}

defineExpose({ open })
</script>

<template>
  <TDialog v-model:visible="visible" header="人才详情" :width="1000">
    <TLoading :loading="pending">
      <TTabs ref="wrapper" v-model:value="active">
        <TTabPanel label="基础要素" :value="0" class="!py-4">
          <Basic :profile="data" />
        </TTabPanel>
        <TTabPanel label="工作经历" :value="1">
          <Work :data="data?.workList" />
        </TTabPanel>
        <TTabPanel label="教育经历" :value="2">
          <Education :data="data?.educationList" />
        </TTabPanel>
        <TTabPanel label="专利信息" :value="3">
          <Patent :data="data?.patentList" />
        </TTabPanel>
        <TTabPanel label="荣誉奖励" :value="4">
          <Honor :data="data?.honorList" />
        </TTabPanel>
        <TTabPanel label="著作信息" :value="5">
          <Publication :data="data?.publicationList" />
        </TTabPanel>
        <TTabPanel label="职称信息" :value="6">
          <Title :data="data?.titleList" />
        </TTabPanel>
        <TTabPanel label="技能信息" :value="7">
          <Skill :data="data?.skillList" />
        </TTabPanel>
      </TTabs>
    </TLoading>

    <template #footer>
      <TButton @click="visible = false">关闭</TButton>
    </template>
  </TDialog>
</template>
