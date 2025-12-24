<script setup lang="ts">
import type { ProfileVO } from '@/api/member/company'

const visible = ref(false)
const [natureOpts, scaleOpts, fieldOpts, fundOpts] = useDict(
  'company_nature',
  'unit_scale',
  'tec_field',
  'registered_fund',
)

const data = ref<ProfileVO>()

function open(profile: ProfileVO) {
  data.value = profile
  visible.value = true
}

defineExpose({ open })
</script>

<template>
  <TDialog v-model:visible="visible" header="单位详情" :width="1000">
    <TDescriptions bordered :column="6" :label-style="{ width: '160px' }">
      <TDescriptionsItem label="单位（机构）名称" :span="3">
        {{ data?.name }}
      </TDescriptionsItem>
      <TDescriptionsItem label="统一社会信用代码" :span="3">
        {{ data?.creditrate }}
      </TDescriptionsItem>
      <TDescriptionsItem label="单位性质" :span="2">
        <DictTag :dict-data="natureOpts" :value="data?.unitnature" />
      </TDescriptionsItem>
      <TDescriptionsItem label="单位规模" :span="2">
        <DictTag :dict-data="scaleOpts" :value="data?.scalesize" />
      </TDescriptionsItem>
      <TDescriptionsItem label="注册资金" :span="2">
        <DictTag :dict-data="fundOpts" :value="data?.regfund" />
      </TDescriptionsItem>
      <TDescriptionsItem label="行业类别" :span="3">
        <DictTag :dict-data="fieldOpts" :value="data?.tradeinfoid" />
      </TDescriptionsItem>
      <TDescriptionsItem label="所属区县" :span="3">
        <div>TODO</div>
      </TDescriptionsItem>
      <TDescriptionsItem label="固定电话" :span="3">
        {{ data?.telphone }}
      </TDescriptionsItem>
      <TDescriptionsItem label="传真" :span="3">
        {{ data?.fax }}
      </TDescriptionsItem>
      <TDescriptionsItem label="业务范围" :span="6">
        {{ data?.businessScope }}
      </TDescriptionsItem>
      <TDescriptionsItem label="企业简介" :span="6">
        {{ data?.introduce }}
      </TDescriptionsItem>
    </TDescriptions>

    <template #footer>
      <TButton @click="visible = false">关闭</TButton>
    </template>
  </TDialog>
</template>
