import { computed, ref } from 'vue'
import { defineStore } from 'pinia'
import { fetchDashboardAnalytics } from '@/services/analytics.service'
import type { AnalyticsQuery, DashboardAnalytics, KpiMetric } from '@/types/analytics'

const defaultQuery = (): AnalyticsQuery => ({
  from: '2026-09-01',
  to: '2026-09-24',
})

export const useAnalyticsStore = defineStore('analytics', () => {
  const query = ref<AnalyticsQuery>(defaultQuery())
  const data = ref<DashboardAnalytics | null>(null)
  const isLoading = ref(false)
  const error = ref<string | null>(null)
  const requestSequence = ref(0)

  const hasData = computed(() => data.value !== null)
  const isEmpty = computed(
    () =>
      hasData.value &&
      data.value!.revenueSeries.length === 0 &&
      data.value!.orderSeries.length === 0,
  )

  function percentageChange(metric: KpiMetric): number {
    if (metric.previousValue === 0) return 0
    return ((metric.value - metric.previousValue) / metric.previousValue) * 100
  }

  const revenueChange = computed(() =>
    data.value ? percentageChange(data.value.revenue) : 0,
  )
  const ordersChange = computed(() =>
    data.value ? percentageChange(data.value.orders) : 0,
  )
  const customersChange = computed(() =>
    data.value ? percentageChange(data.value.customers) : 0,
  )
  const conversionChange = computed(() =>
    data.value ? percentageChange(data.value.conversionRate) : 0,
  )

  async function loadAnalytics(nextQuery: AnalyticsQuery = query.value) {
    query.value = { ...nextQuery }
    const requestId = ++requestSequence.value
    isLoading.value = true
    error.value = null

    try {
      const response = await fetchDashboardAnalytics(query.value)

      // Latest-request-wins protection.
      if (requestId !== requestSequence.value) return

      data.value = response.data
    } catch (err) {
      if (requestId !== requestSequence.value) return
      error.value = err instanceof Error ? err.message : 'Unable to load analytics'
    } finally {
      if (requestId === requestSequence.value) {
        isLoading.value = false
      }
    }
  }

  return {
    query,
    data,
    isLoading,
    error,
    hasData,
    isEmpty,
    revenueChange,
    ordersChange,
    customersChange,
    conversionChange,
    loadAnalytics,
  }
})
