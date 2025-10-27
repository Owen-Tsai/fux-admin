<template>
  <TDescriptions v-for="(entry, i) in data" :key="i" bordered>
    <TDescriptionsItem v-for="(field, j) in widget.props.widgets" :key="j">
      <component
        :is="viewModeWidgetToRender(field.type)"
        :widget="field"
        :model="entry[field.props.field.name || field.uid]"
      />
    </TDescriptionsItem>
  </TDescriptions>
</template>

<script setup lang="ts">
import request from '@/utils/request'
import { viewModeWidgetToRender } from '@fusionx/core/utils'
import type { WidgetMap } from '@fusionx/core/types'

const { widget } = defineProps<{
  widget: WidgetMap['dataTable']
}>()

const URL_PREFIX = widget.props.url || ''

const data = ref<any[]>([])
const loading = ref(false)

const loadData = async () => {
  loading.value = true
  // TODO: 开发 list-all 接口，不使用分页返回数据
  const url = `${URL_PREFIX}/page`
  const res = await request.get({
    url,
    params: {
      pageNo: 1,
      pageSize: 100,
      // TODO: delareId: appParamsCtx.applyId
    },
  })

  data.value = res.list
  loading.value = false
}

loadData()
</script>
