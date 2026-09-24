export interface AnalyticsQuery {
  from: string
  to: string
  region?: string | undefined
  category?: string | undefined
}

export interface KpiMetric {
  value: number
  previousValue: number
  unit: 'currency' | 'number' | 'percent'
}

export interface RevenuePoint {
  date: string
  value: number
}

export interface OrderPoint {
  date: string
  value: number
}

export interface CategoryMetric {
  name: string
  value: number
}

export interface DashboardAnalytics {
  revenue: KpiMetric
  orders: KpiMetric
  customers: KpiMetric
  conversionRate: KpiMetric
  revenueSeries: RevenuePoint[]
  orderSeries: OrderPoint[]
  categoryBreakdown: CategoryMetric[]
  topProducts: CategoryMetric[]
}
