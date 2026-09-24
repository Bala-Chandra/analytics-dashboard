<template>
  <q-page padding>
    <div class="dashboard-container">
      <div class="row items-center justify-between q-mb-lg">
        <div>
          <div class="text-h4 text-weight-bold">Analytics Dashboard</div>
          <div class="text-body2 text-grey-7">
            SaaS business performance overview
          </div>
        </div>
        <q-btn
          flat
          round
          icon="refresh"
          :loading="store.isLoading"
          aria-label="Refresh analytics"
          @click="refresh"
        />
      </div>

      <DashboardFilters
        v-model="filters"
        class="q-mb-lg"
        @update:model-value="applyFilters"
      />

      <q-banner v-if="store.error" rounded class="bg-red-1 text-negative q-mb-lg">
        <template #avatar>
          <q-icon name="error" />
        </template>
        {{ store.error }}
        <template #action>
          <q-btn flat label="Retry" @click="refresh" />
        </template>
      </q-banner>

      <div v-if="store.isEmpty" class="q-mb-lg">
        <q-card flat bordered>
          <q-card-section class="text-center q-pa-xl">
            <q-icon name="analytics" size="48px" color="grey-5" />
            <div class="text-h6 q-mt-md">No analytics data</div>
            <div class="text-body2 text-grey-7">
              Try changing the dashboard filters.
            </div>
          </q-card-section>
        </q-card>
      </div>

      <template v-else>
        <div class="row q-col-gutter-md q-mb-md">
          <div v-for="card in kpis" :key="card.title" class="col-12 col-sm-6 col-lg-3">
            <KpiCard
              :title="card.title"
              :metric="card.metric"
              :change="card.change"
              :loading="store.isLoading && !store.hasData"
            />
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12 col-lg-8">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6">Revenue</div>
                <div class="text-caption text-grey-7">Revenue trend for the selected period</div>
              </q-card-section>
              <q-card-section>
                <q-skeleton v-if="!store.data" height="240px" />
                <SimpleLineChart
                  v-else
                  title="Revenue trend"
                  :data="store.data.revenueSeries"
                />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-lg-4">
            <q-card flat bordered class="full-height">
              <q-card-section>
                <div class="text-h6">Sales / Revenue Breakdown</div>
              </q-card-section>
              <q-card-section>
                <BreakdownList :items="store.data?.categoryBreakdown ?? []" />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-lg-8">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6">Orders</div>
                <div class="text-caption text-grey-7">Order volume trend</div>
              </q-card-section>
              <q-card-section>
                <SimpleLineChart
                  v-if="store.data"
                  title="Order trend"
                  :data="store.data.orderSeries"
                />
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-lg-4">
            <q-card flat bordered>
              <q-card-section>
                <div class="text-h6">Top Products / Categories</div>
              </q-card-section>
              <q-card-section>
                <BreakdownList :items="store.data?.topProducts ?? []" />
              </q-card-section>
            </q-card>
          </div>
        </div>
      </template>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import DashboardFilters from '@/components/DashboardFilters.vue'
import KpiCard from '@/components/KpiCard.vue'
import SimpleLineChart from '@/components/SimpleLineChart.vue'
import BreakdownList from '@/components/BreakdownList.vue'
import { useAnalyticsStore } from '@/stores/analytics.store'
import type { AnalyticsQuery } from '@/types/analytics'

const store = useAnalyticsStore()

const filters = ref<AnalyticsQuery>({ ...store.query })

const kpis = computed(() => [
  {
    title: 'Revenue',
    metric: store.data?.revenue,
    change: store.revenueChange,
  },
  {
    title: 'Orders',
    metric: store.data?.orders,
    change: store.ordersChange,
  },
  {
    title: 'Customers',
    metric: store.data?.customers,
    change: store.customersChange,
  },
  {
    title: 'Conversion Rate',
    metric: store.data?.conversionRate,
    change: store.conversionChange,
  },
])

async function refresh() {
  await store.loadAnalytics(filters.value)
}

async function applyFilters() {
  await store.loadAnalytics(filters.value)
}

onMounted(refresh)

defineExpose({ applyFilters })
</script>

<style scoped>
.dashboard-container {
  max-width: 1440px;
  margin: 0 auto;
}
</style>
