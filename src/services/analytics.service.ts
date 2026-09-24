import type { ApiResponse } from '@/types/api'
import type { AnalyticsQuery, DashboardAnalytics } from '@/types/analytics'
import { createRequestId, delay } from './api'

const regions = ['IN', 'US', 'EU']
const categories = ['electronics', 'fashion', 'home']

function hashQuery(query: AnalyticsQuery): number {
  const text = JSON.stringify(query)
  return [...text].reduce((sum, char) => sum + char.charCodeAt(0), 0)
}

export async function fetchDashboardAnalytics(
  query: AnalyticsQuery,
): Promise<ApiResponse<DashboardAnalytics>> {
  await delay(500 + (hashQuery(query) % 700))

  if (query.region === 'ERROR') {
    throw new Error('Analytics service temporarily unavailable')
  }

  const seed = hashQuery(query) % 100
  const category = query.category ?? 'all'
  const region = query.region ?? 'all'

  const revenueBase = 10_000_000 + seed * 31_000
  const ordersBase = 18_000 + seed * 73
  const customersBase = 12_000 + seed * 41

  const points = Array.from({ length: 12 }, (_, index) => ({
    date: `P${index + 1}`,
    value: Math.round(revenueBase * (0.055 + ((index * 7 + seed) % 18) / 1000)),
  }))

  const orderSeries = points.map((point, index) => ({
    date: point.date,
    value: Math.round(ordersBase * (0.055 + ((index * 5 + seed) % 14) / 1000)),
  }))

  const categories = ['Electronics', 'Fashion', 'Home', 'Beauty'].map((name, index) => ({
    name,
    value: Math.round(revenueBase * (0.32 - index * 0.045 + ((seed + index) % 5) / 100)),
  }))

  return {
    requestId: createRequestId(),
    data: {
      revenue: {
        value: revenueBase,
        previousValue: Math.round(revenueBase * 0.92),
        unit: 'currency',
      },
      orders: {
        value: ordersBase,
        previousValue: Math.round(ordersBase * 0.96),
        unit: 'number',
      },
      customers: {
        value: customersBase,
        previousValue: Math.round(customersBase * 0.94),
        unit: 'number',
      },
      conversionRate: {
        value: 3.7 + (seed % 20) / 10,
        previousValue: 3.4 + (seed % 15) / 10,
        unit: 'percent',
      },
      revenueSeries: points,
      orderSeries,
      categoryBreakdown: categories,
      topProducts: [
        { name: `${category === 'all' ? 'Premium' : category} Pro`, value: Math.round(revenueBase * 0.12) },
        { name: `${region === 'all' ? 'Global' : region} Essentials`, value: Math.round(revenueBase * 0.10) },
        { name: 'Business Plus', value: Math.round(revenueBase * 0.08) },
        { name: 'Starter', value: Math.round(revenueBase * 0.06) },
      ],
    },
  }
}

export const availableRegions = regions
export const availableCategories = categories
