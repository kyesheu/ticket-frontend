<template>
  <div class="skeleton-wrap">
    <div v-for="i in rows" :key="i" class="skeleton-row" :style="{ width: rowWidths[(i - 1) % rowWidths.length] }">
      <div class="skeleton-block" :style="{ width: '100%' }" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  rows?: number
}>(), {
  rows: 5,
})

const rowWidths = ['94%', '88%', '96%', '82%', '92%']
</script>

<style scoped>
.skeleton-wrap { padding: 16px; }
.skeleton-row { margin-bottom: 16px; }
.skeleton-block {
  height: 14px; border-radius: 4px;
  background: linear-gradient(90deg, #f2f3f5 25%, #e8eaed 50%, #f2f3f5 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
}
@keyframes shimmer {
  0% { background-position: 200% 0; }
  100% { background-position: -200% 0; }
}
</style>
