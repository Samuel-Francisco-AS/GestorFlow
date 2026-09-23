export const workOrderStatuses = [
  'new',
  'in_progress',
  'waiting',
  'completed',
] as const

export type WorkOrderStatus = (typeof workOrderStatuses)[number]

export type WorkOrder = {
  id: string
  customerId: string
  title: string
  description: string
  value: number
  status: WorkOrderStatus
  date: string
  notes: string
}

export const workOrderStatusLabel: Record<WorkOrderStatus, string> = {
  new: 'Novo',
  in_progress: 'Em andamento',
  waiting: 'Aguardando',
  completed: 'Concluído',
}

export function nextWorkOrderId(orders: WorkOrder[]) {
  const highest = orders.reduce((max, order) => {
    const number = /^OS-(\d+)$/.exec(order.id)?.[1]
    return number ? Math.max(max, Number(number)) : max
  }, 0)
  return `OS-${String(highest + 1).padStart(4, '0')}`
}
