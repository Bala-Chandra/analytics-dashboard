import { beforeEach, describe, expect, it } from 'vitest'
import { setActivePinia, createPinia } from 'pinia'
import { useAnalyticsStore } from '@/stores/analytics.store'

describe('analytics store', () => {
  beforeEach(() => {
    setActivePinia(createPinia())
  })

  it('starts without analytics data', () => {
    const store = useAnalyticsStore()
    expect(store.data).toBeNull()
    expect(store.isLoading).toBe(false)
    expect(store.error).toBeNull()
  })

  it('loads analytics successfully and derives KPI change', async () => {
    const store = useAnalyticsStore()
    await store.loadAnalytics()

    expect(store.data).not.toBeNull()
    expect(store.data?.revenue.value).toBeGreaterThan(0)
    expect(store.revenueChange).toBeGreaterThan(0)
  })

  it('handles service errors', async () => {
    const store = useAnalyticsStore()

    await store.loadAnalytics({
      from: '2026-09-01',
      to: '2026-09-24',
      region: 'ERROR',
    })

    expect(store.data).toBeNull()
    expect(store.error).toContain('temporarily unavailable')
  })

  it('protects against stale responses', async () => {
    const store = useAnalyticsStore()
    const first = store.loadAnalytics({
      from: '2026-09-01',
      to: '2026-09-10',
      region: 'IN',
    })
    const second = store.loadAnalytics({
      from: '2026-09-01',
      to: '2026-09-24',
      region: 'US',
    })

    await Promise.all([first, second])

    expect(store.query.region).toBe('US')
    expect(store.data).not.toBeNull()
  })
})
