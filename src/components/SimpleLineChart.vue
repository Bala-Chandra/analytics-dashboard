<template>
  <div class="chart-wrap">
    <svg viewBox="0 0 600 220" preserveAspectRatio="none" role="img" :aria-label="title">
      <line x1="0" y1="200" x2="600" y2="200" stroke="currentColor" opacity="0.15" />
      <polyline
        :points="points"
        fill="none"
        stroke="currentColor"
        stroke-width="4"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </svg>
    <div class="row justify-between text-caption text-grey-6">
      <span>{{ firstLabel }}</span>
      <span>{{ lastLabel }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

interface Point {
  date: string
  value: number
}

const props = defineProps<{
  title: string
  data: Point[]
}>()

const points = computed(() => {
  if (!props.data.length) return ''
  const values = props.data.map((p) => p.value)
  const min = Math.min(...values)
  const max = Math.max(...values)
  const range = max - min || 1

  return props.data
    .map((point, index) => {
      const x = (index / Math.max(props.data.length - 1, 1)) * 600
      const y = 190 - ((point.value - min) / range) * 165
      return `${x},${y}`
    })
    .join(' ')
})

const firstLabel = computed(() => props.data[0]?.date ?? '')
const lastLabel = computed(() => props.data.at(-1)?.date ?? '')
</script>

<style scoped>
.chart-wrap {
  height: 240px;
}
svg {
  width: 100%;
  height: 210px;
}
</style>
