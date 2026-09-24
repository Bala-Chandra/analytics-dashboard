<template>
  <q-card flat bordered class="kpi-card">
    <q-card-section>
      <div class="text-subtitle2 text-grey-7">{{ title }}</div>

      <q-skeleton
        v-if="loading"
        type="text"
        width="55%"
        class="q-mt-sm"
      />

      <div v-else class="text-h5 text-weight-bold q-mt-sm">
        {{ formattedValue }}
      </div>

      <div
        v-if="!loading"
        class="q-mt-sm text-caption"
        :class="changeClass"
      >
        {{ change >= 0 ? '+' : '' }}{{ change.toFixed(1) }}% vs previous period
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import type { KpiMetric } from '@/types/analytics'

const props = defineProps<{
  title: string
  metric?: KpiMetric | undefined
  change: number
  loading: boolean
}>()

const formattedValue = computed(() => {
  if (!props.metric) return '-'

  if (props.metric.unit === 'currency') {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      notation: 'compact',
      maximumFractionDigits: 1,
    }).format(props.metric.value)
  }

  if (props.metric.unit === 'percent') {
    return `${props.metric.value.toFixed(1)}%`
  }

  return new Intl.NumberFormat('en-IN', {
    notation: 'compact',
  }).format(props.metric.value)
})

const changeClass = computed(() =>
  props.change >= 0 ? 'text-positive' : 'text-negative',
)
</script>
