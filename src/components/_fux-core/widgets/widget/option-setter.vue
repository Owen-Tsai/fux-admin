<template>
  <TFormItem label="选项" name="options">
    <TRadioGroup
      v-model:value="options.type"
      theme="button"
      variant="default-filled"
      :options="type === 'default' ? optionOpts : optionOpts.filter((e) => e.value !== 'dict')"
    />
  </TFormItem>
  <div class="w-full">
    <template v-if="options.type === 'static'">
      <template v-if="type === 'default'">
        <div
          v-for="(option, index) in options.value"
          :key="index"
          class="flex items-center gap-2 w-full mb-2"
        >
          <div class="flex-1 grid grid-cols-2 gap-2">
            <TInput v-model:value="option.label" class="!w-full" />
            <TInput v-model:value="option.value" class="!w-full" />
          </div>
          <TButton
            variant="text"
            theme="primary"
            shape="square"
            class="flex-none"
            @click="removeOption(index)"
          >
            <template #icon>
              <TIcon name="close" />
            </template>
          </TButton>
        </div>

        <TButton block @click="addOption">
          <template #icon>
            <TIcon name="add" />
            新增一项
          </template>
        </TButton>
      </template>

      <template v-else> </template>
    </template>

    <template v-if="options.type === 'dict'">
      <TSelect
        v-model:value="options.value"
        :options="dictTypes"
        filterable
        :keys="{ label: 'name', value: 'id' }"
        placeholder="请选择字典类型"
      />
    </template>

    <template v-if="options.type === 'expression'">
      <TInputAdornment prepend="{{$state." append="}}">
        <TInput v-model:value="options.value" class="min-w-0" />
      </TInputAdornment>
    </template>
  </div>
</template>

<script setup lang="ts">
import useFuxDesignerStore from '@/stores/fux-designer'
import { initialWidgetConfig } from '@fusionx/core/utils'
import type { WidgetMap } from '@fusionx/core/types'

const { type = 'default' } = defineProps<{
  type?: 'default' | 'tree-data'
}>()

type ModelType<T> = T extends 'default'
  ?
      | WidgetMap['select']['props']['options']
      | WidgetMap['checkbox']['props']['options']
      | WidgetMap['radio']['props']['options']
  : T extends 'tree-data'
    ? WidgetMap['cascader']['props']['options'] | WidgetMap['treeSelect']['props']['options']
    : never

const optionOpts = [
  { label: '静态', value: 'static' },
  { label: '字典', value: 'dict' },
  { label: '表达式', value: 'expression' },
]

const options = defineModel<ModelType<typeof type>>('options', { required: true })

const { dictTypes } = storeToRefs(useFuxDesignerStore())

const addOption = () => {
  options.value.value.push({
    label: '新选项',
    value: '',
  })
}

const removeOption = (idx: number) => {
  options.value.value.splice(idx, 1)
}

const optionCacheMap = ref<Map<string, any>>(new Map())

watch(
  () => options.value.type,
  (newType, oldType) => {
    if (oldType) {
      optionCacheMap.value.set(oldType, options.value.value)
    }
    if (newType && optionCacheMap.value.has(newType)) {
      options.value.value = optionCacheMap.value.get(newType)
    } else {
      options.value.value =
        newType === 'static' ? [...initialWidgetConfig.select!.props.options.value] : undefined
    }
  },
)
</script>
