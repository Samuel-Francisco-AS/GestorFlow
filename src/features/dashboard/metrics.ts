import type { WorkOrder } from '@/features/work-orders/model'
import { localDate } from '@/shared/lib/local-date'

export function deriveDashboardMetrics(orders: WorkOrder[], currentDate: Date) {
  const month = localDate(currentDate).slice(0, 7)
  const completed = orders.filter(
    (order) => order.status === 'completed' && order.date.startsWith(month),
  )
  return {
    inProgress: orders.filter((order) => order.status === 'in_progress').length,
    waiting: orders.filter((order) => order.status === 'waiting').length,
    completedThisMonth: completed.length,
    revenueThisMonth: completed.reduce((sum, order) => sum + order.value, 0),
    attention: orders.filter((order) => order.status === 'waiting'),
    recent: [...orders]
      .sort(
        (a, b) =>
          b.date.localeCompare(a.date) ||
          b.code.localeCompare(a.code) ||
          b.id.localeCompare(a.id),
      )
      .slice(0, 5),
  }
}
