import { describe, expect, it } from 'vitest'
import { mount } from '@vue/test-utils'
import { Quasar } from 'quasar'
import KpiCard from '@/components/KpiCard.vue'

describe('KpiCard', () => {
  it('renders a formatted currency KPI', () => {
    const wrapper = mount(KpiCard, {
      global: {
        plugins: [Quasar],
      },
      props: {
        title: 'Revenue',
        metric: {
          value: 12400000,
          previousValue: 11000000,
          unit: 'currency',
        },
        change: 12.7,
        loading: false,
      },
    })

    expect(wrapper.text()).toContain('₹')
    expect(wrapper.text()).toContain('Revenue')
    expect(wrapper.text()).toContain('12.7%')
  })
})
