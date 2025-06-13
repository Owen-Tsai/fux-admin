<template>
  <div class="icon-select w-full">
    <TPopup :overlay-inner-style="{ width: `${width}px` }" trigger="click">
      <TInput ref="el" v-model:value="value" clearable>
        <template #prefix-icon>
          <TIcon v-show="value" :name="value" />
        </template>
      </TInput>
      <template #content>
        <div class="p-4">
          <TInput v-model:value="searchText" placeholder="搜索图标" />
          <div class="grid grid-cols-10 my-4">
            <div
              v-for="item in pages[current]"
              :key="item.stem"
              class="inline-flex items-center justify-center p-1 group hover:bg-[var(--td-bg-color-container-active)] rounded cursor-pointer"
              @click="onSelect(item.stem)"
            >
              <TIcon
                :name="item.stem"
                size="24px"
                class="group-hover:text-[var(--td-brand-color)]"
              />
            </div>
          </div>
          <TPagination
            v-model:current="current"
            :total="filtered.length"
            :page-size="PAGE_SIZE"
            :show-page-size="false"
            size="small"
          />
        </div>
      </template>
    </TPopup>
  </div>
</template>

<script setup lang="ts">
import { manifest } from 'tdesign-icons-vue-next'
import { chunk } from 'lodash-es'

const PAGE_SIZE = 50

const value = defineModel<string>('value')
const el = useTemplateRef('el')

const searchText = ref('')
const current = ref(1)

const filtered = computed(() => {
  return manifest.filter((item) => {
    const label = item.stem
    return label.includes(searchText.value)
  })
})

const pages = computed(() => [[], ...chunk(filtered.value, PAGE_SIZE)])

const { width } = useElementSize(el)

const onSelect = (name: string) => {
  value.value = name
}

watchDebounced(
  searchText,
  (val) => {
    if (val) {
      current.value = 1
    }
  },
  { debounce: 200 },
)
</script>
