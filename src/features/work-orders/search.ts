import type { Customer } from '@/features/customers/model'
import type { WorkOrder, WorkOrderStatus } from '@/features/work-orders/model'

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')

export function filterWorkOrders(
  orders: WorkOrder[],
  customers: Customer[],
  query: string,
  status: WorkOrderStatus | 'all',
) {
  const term = normalize(query.trim())
  const customerNames = new Map(
    customers.map((customer) => [customer.id, customer.name]),
  )
  return orders.filter((order) => {
    if (status !== 'all' && order.status !== status) return false
    return normalize(
      [order.code, customerNames.get(order.customerId) ?? '', order.title].join(
        ' ',
      ),
    ).includes(term)
  })
}
