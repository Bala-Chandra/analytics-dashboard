<template>
  <div>
    <div v-for="item in items" :key="item.name" class="q-mb-md">
      <div class="row justify-between text-body2">
        <span>{{ item.name }}</span>
        <strong>{{ format(item.value) }}</strong>
      </div>
      <q-linear-progress
        :value="item.value / maxValue"
        size="8px"
        rounded
        class="q-mt-xs"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { CategoryMetric } from '@/types/analytics'

const props = defineProps<{ items: CategoryMetric[] }>()
const maxValue = computed(() => Math.max(...props.items.map((item) => item.value), 1))

function format(value: number) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(value)
}
</script>
