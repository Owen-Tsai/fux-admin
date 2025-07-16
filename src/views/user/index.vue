<template>
  <div class="view">
    <div class="flex gap-4">
      <div class="min-w-0 w-1/4">
        <TCard>
          <FileUpload v-model:value="src" />
          <div>{{ src }}</div>
          <img v-if="src" :src="src" />
        </TCard>
      </div>
      <div class="min-w-0 w-3/4"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
const src = ref('')
</script>
