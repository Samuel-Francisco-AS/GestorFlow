import { useRef, useState, type PropsWithChildren } from 'react'

import { demoOrders } from '@/data/demo'
import {
  nextWorkOrderId,
  type WorkOrder,
  type WorkOrderStatus,
} from '@/features/work-orders/model'
import type { WorkOrderInput } from '@/features/work-orders/schema'
import { WorkOrderContext } from '@/features/work-orders/work-order-context'

export function WorkOrderProvider({ children }: PropsWithChildren) {
  const [orders, setOrders] = useState<WorkOrder[]>(demoOrders)
  const nextNumber = useRef(Number(nextWorkOrderId(demoOrders).slice(3)))

  function createOrder(input: WorkOrderInput) {
    const order = {
      ...input,
      id: `OS-${String(nextNumber.current++).padStart(4, '0')}`,
    }
    setOrders((current) => [order, ...current])
    return order
  }

  function updateOrder(id: string, input: WorkOrderInput) {
    setOrders((current) =>
      current.map((order) =>
        order.id === id ? { ...order, ...input } : order,
      ),
    )
  }

  function updateStatus(id: string, status: WorkOrderStatus) {
    setOrders((current) =>
      current.map((order) => (order.id === id ? { ...order, status } : order)),
    )
  }

  return (
    <WorkOrderContext.Provider
      value={{ orders, createOrder, updateOrder, updateStatus }}
    >
      {children}
    </WorkOrderContext.Provider>
  )
}
