import { describe, expect, it } from 'vitest'
import { demoOrders } from '@/data/demo'
import { deriveDashboardMetrics } from '@/features/dashboard/metrics'

describe('dashboard derivado das ordens correntes', () => {
  it('calcula status e faturamento somente das concluídas do mês local', () => {
    const metrics = deriveDashboardMetrics(demoOrders, new Date(2026, 8, 23))
    expect(metrics.inProgress).toBe(2)
    expect(metrics.waiting).toBe(2)
    expect(metrics.completedThisMonth).toBe(2)
    expect(metrics.revenueThisMonth).toBe(2960)
    expect(metrics.attention.map((order) => order.code)).toEqual([
      'OS-1047',
      'OS-1043',
    ])
  })
  it('muda com o mês e com dados vazios', () => {
    expect(
      deriveDashboardMetrics(demoOrders, new Date(2026, 9, 1))
        .completedThisMonth,
    ).toBe(0)
    expect(deriveDashboardMetrics([], new Date(2026, 8, 23))).toMatchObject({
      inProgress: 0,
      waiting: 0,
      completedThisMonth: 0,
      revenueThisMonth: 0,
      attention: [],
      recent: [],
    })
  })
  it('ordena ordens recentes por data com desempate estável', () => {
    const metrics = deriveDashboardMetrics(
      [
        demoOrders[1],
        demoOrders[0],
        { ...demoOrders[0], id: 'z', code: 'OS-9999' },
      ],
      new Date(2026, 8, 23),
    )
    expect(metrics.recent.map((order) => order.code)).toEqual([
      'OS-9999',
      'OS-1048',
      'OS-1047',
    ])
  })
})
