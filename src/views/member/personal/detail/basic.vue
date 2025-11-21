<script setup lang="ts">
import dayjs from 'dayjs'
import type { ProfileVO } from '@/api/member/personal'

const { profile } = defineProps<{
  profile: ProfileVO
}>()

const [politicalOpts, eduLevelOpts, eduTypeOpts, degreeOpts, sexOpts] = useDict(
  'rc_politic',
  'rc_education_level',
  'rc_education_type',
  'user_degree',
  'user_sex',
)
</script>

<template>
  <TDescriptions bordered>
    <TDescriptionsItem label="姓名" name="name">
      {{ profile.name }}
    </TDescriptionsItem>
    <TDescriptionsItem label="证件号码" name="idcard">
      {{ profile.idcard }}
    </TDescriptionsItem>
    <TDescriptionsItem label="手机号" name="mobile">
      {{ profile.mobile }}
    </TDescriptionsItem>
    <TDescriptionsItem label="性别" name="sex">
      <DictTag :dict-data="sexOpts" :value="profile.sex" />
    </TDescriptionsItem>
    <TDescriptionsItem label="出生日期" name="birthday">
      {{ dayjs(profile.birthday).format('YYYY-MM-DD') }}
    </TDescriptionsItem>
    <TDescriptionsItem label="工作单位" name="companyid">
      {{ profile.companyName }}
    </TDescriptionsItem>
    <TDescriptionsItem label="政治面貌" name="politicalstatus">
      <DictTag :dict-data="politicalOpts" :value="profile.politicalstatus" />
    </TDescriptionsItem>
    <TDescriptionsItem label="邮箱" name="email">
      {{ profile.email }}
    </TDescriptionsItem>
    <TDescriptionsItem label="居住地址" name="address">
      {{ profile.address }}
    </TDescriptionsItem>
    <TDescriptionsItem label="邮政编码" name="postcode">
      {{ profile.postcode }}
    </TDescriptionsItem>
    <TDescriptionsItem label="毕业院校" name="eduschool">
      {{ profile.eduschool }}
    </TDescriptionsItem>
    <TDescriptionsItem label="毕业时间" name="edudate">
      {{ profile.edudate ? dayjs(profile.edudate).format('YYYY-MM-DD') : '' }}
    </TDescriptionsItem>
    <TDescriptionsItem label="最高学历" name="diploma">
      <DictTag :dict-data="eduLevelOpts" :value="profile.diploma" />
    </TDescriptionsItem>
    <TDescriptionsItem label="学历类型" name="diplomatype">
      <DictTag :dict-data="eduTypeOpts" :value="profile.diplomatype" />
    </TDescriptionsItem>
    <TDescriptionsItem label="学位" name="degree">
      <DictTag :dict-data="degreeOpts" :value="profile.degree" />
    </TDescriptionsItem>
    <TDescriptionsItem label="第一专业" name="firstmajor">
      {{ profile.firstmajor }}
    </TDescriptionsItem>
    <TDescriptionsItem label="个人简介" name="selfeval" class="col-span-2">
      {{ profile.selfeval }}
    </TDescriptionsItem>
  </TDescriptions>
</template>
