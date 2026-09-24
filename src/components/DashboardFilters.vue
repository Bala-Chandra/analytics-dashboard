<template>
  <q-card flat bordered>
    <q-card-section class="row q-col-gutter-md items-end">
      <q-input
        v-model="localFrom"
        outlined
        dense
        type="date"
        label="From"
        class="col-12 col-sm-3"
      />
      <q-input
        v-model="localTo"
        outlined
        dense
        type="date"
        label="To"
        class="col-12 col-sm-3"
      />
      <q-select
        v-model="localRegion"
        outlined
        dense
        clearable
        :options="regions"
        label="Region"
        class="col-12 col-sm-2"
      />
      <q-select
        v-model="localCategory"
        outlined
        dense
        clearable
        :options="categories"
        label="Category"
        class="col-12 col-sm-2"
      />
      <q-btn
        color="primary"
        label="Apply"
        :disable="!localFrom || !localTo"
        class="col-12 col-sm-auto"
        @click="apply"
      />
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import {
  availableCategories,
  availableRegions,
} from '@/services/analytics.service'
import type { AnalyticsQuery } from '@/types/analytics'

const props = defineProps<{ modelValue: AnalyticsQuery }>()
const emit = defineEmits<{ 'update:modelValue': [AnalyticsQuery] }>()

const localFrom = ref(props.modelValue.from)
const localTo = ref(props.modelValue.to)
const localRegion = ref(props.modelValue.region)
const localCategory = ref(props.modelValue.category)

const regions = availableRegions
const categories = availableCategories

function apply() {
  emit('update:modelValue', {
    from: localFrom.value,
    to: localTo.value,
    region: localRegion.value || undefined,
    category: localCategory.value || undefined,
  })
}
</script>
