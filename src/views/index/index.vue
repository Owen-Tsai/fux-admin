<template>
  <div class="view">
    <div class="flex gap-6 w-full">
      <div class="w-2/3">
        <Profile />
        <PolicyCalendar class="!mt-4" />
      </div>
      <div class="w-1/3">
        <Stats />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import Profile from './profile.vue'
import PolicyCalendar from './calendar.vue'
import Stats from './stats.vue'
</script>
