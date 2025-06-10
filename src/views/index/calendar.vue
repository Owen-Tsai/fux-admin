<template>
  <TCard title="申报开放月历">
    <template #actions>
      <TLink theme="primary">自定义</TLink>
    </template>

    <div class="overflow-x-auto">
      <TLoading :loading="pending">
        <TCalendar
          :controller-config="{ weekend: { visible: false }, mode: { visible: false } }"
          mode="year"
        >
          <template #cellAppend="data: CalendarCell">
            <div
              v-if="data.date && calendarData[data.date?.getMonth()]"
              class="flex gap-2 flex-wrap"
            >
              <TTag
                v-for="(item, i) in calendarData[data.date.getMonth()]"
                :key="i"
                variant="light-outline"
              >
                {{ item.title }}
              </TTag>
            </div>
          </template>
        </TCalendar>
      </TLoading>
    </div>
  </TCard>
</template>

<script setup lang="ts">
import { type CalendarDataVO } from '@/api/index'
import type { CalendarCell } from 'tdesign-vue-next'

const calendarData = ref<CalendarDataVO>({
  2: [{ title: '子女入学' }],
  3: [{ title: '子女入学' }],
  4: [{ title: '子女入学' }],
  5: [{ title: '子女入学' }, { title: '高层次人才认定' }],
  6: [{ title: '子女入学' }, { title: '高层次人才认定' }],
  7: [{ title: '子女入学' }, { title: '高层次人才认定' }],
  8: [{ title: '高层次人才认定' }],
  9: [{ title: '高层次人才认定' }],
})

const [pending, setPending] = useToggle(true)

setTimeout(() => {
  setPending(false)
}, 1500)
</script>
