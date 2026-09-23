import { describe, expect, it } from 'vitest'
import { createDemoOrders } from '@/data/demo'
import { deriveDashboardMetrics } from '@/features/dashboard/metrics'
import { localDate } from '@/shared/lib/local-date'

describe('datas relativas da demonstração', () => {
  it.each([
    [new Date(2026, 8, 23), '2026-09-23', '2026-09-06'],
    [new Date(2026, 9, 1), '2026-10-01', '2026-10-01'],
    [new Date(2027, 0, 1), '2027-01-01', '2027-01-01'],
    [new Date(2027, 1, 28), '2027-02-28', '2027-02-11'],
    [new Date(2028, 1, 29), '2028-02-29', '2028-02-12'],
  ])('gera datas válidas e métricas no mês de %s', (reference, first, last) => {
    const orders = createDemoOrders(reference)
    const dates = orders.map((order) => order.date)
    const metrics = deriveDashboardMetrics(orders, reference)

    expect(dates[0]).toBe(first)
    expect(dates.at(-1)).toBe(last)
    expect(dates).toEqual([...dates].sort().reverse())
    expect(dates.every((date) => date <= localDate(reference))).toBe(true)
    expect(
      dates.every((date) => localDate(new Date(`${date}T12:00:00`)) === date),
    ).toBe(true)
    expect(orders.map((order) => order.code)).toEqual([
      'OS-1048',
      'OS-1047',
      'OS-1046',
      'OS-1045',
      'OS-1044',
      'OS-1043',
    ])
    expect(metrics.recent.map((order) => order.code)).toEqual([
      'OS-1048',
      'OS-1047',
      'OS-1046',
      'OS-1045',
      'OS-1044',
    ])
    expect(metrics.completedThisMonth).toBe(2)
    expect(metrics.revenueThisMonth).toBe(2960)
    expect(metrics.inProgress).toBe(2)
    expect(metrics.waiting).toBe(2)
  })
})
