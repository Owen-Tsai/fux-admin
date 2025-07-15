<template>
  <div class="view">
    <div class="flex gap-6 w-full flex-wrap lg:flex-nowrap">
      <div class="w-full lg:w-2/3">
        <Profile />
        <PolicyCalendar class="!mt-4" />
        <TalentChart class="!mt-4" />
      </div>
      <div class="w-full lg:w-1/3">
        <Stats />
        <FrequentActions class="!mt-4" />
        <Notifications class="!mt-4" />
        <Help class="!mt-4" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Profile from './profile.vue'
import PolicyCalendar from './calendar.vue'
import Stats from './stats.vue'
import FrequentActions from './frequent-actions.vue'
import Notifications from './notifications.vue'
import TalentChart from './talent-chart.vue'
import Help from './help.vue'
</script>
