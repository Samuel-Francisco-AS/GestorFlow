import { createContext, useContext } from 'react'

import type { WorkOrder, WorkOrderStatus } from '@/features/work-orders/model'
import type { WorkOrderInput } from '@/features/work-orders/schema'

export type WorkOrderStore = {
  orders: WorkOrder[]
  loading: boolean
  error: Error | null
  statusPending: boolean
  createOrder: (input: WorkOrderInput) => Promise<WorkOrder>
  updateOrder: (id: string, input: WorkOrderInput) => Promise<WorkOrder>
  updateStatus: (id: string, status: WorkOrderStatus) => Promise<WorkOrder>
}

export const WorkOrderContext = createContext<WorkOrderStore | null>(null)

export function useWorkOrders() {
  const context = useContext(WorkOrderContext)
  if (!context) throw new Error('useWorkOrders requer WorkOrderProvider')
  return context
}
