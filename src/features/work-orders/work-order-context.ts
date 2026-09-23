import { createContext, useContext } from 'react'

import type { WorkOrder, WorkOrderStatus } from '@/features/work-orders/model'
import type { WorkOrderInput } from '@/features/work-orders/schema'

export type WorkOrderStore = {
  orders: WorkOrder[]
  createOrder: (input: WorkOrderInput) => WorkOrder
  updateOrder: (id: string, input: WorkOrderInput) => void
  updateStatus: (id: string, status: WorkOrderStatus) => void
}

export const WorkOrderContext = createContext<WorkOrderStore | null>(null)

export function useWorkOrders() {
  const context = useContext(WorkOrderContext)
  if (!context) throw new Error('useWorkOrders requer WorkOrderProvider')
  return context
}
