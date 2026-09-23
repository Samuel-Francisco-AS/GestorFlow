import type { Customer } from '@/features/customers/model'
import type { CustomerInput } from '@/features/customers/schema'
import type { WorkOrder, WorkOrderStatus } from '@/features/work-orders/model'
import type { WorkOrderInput } from '@/features/work-orders/schema'

export interface CustomerRepository {
  list(): Promise<Customer[]>
  getById(id: string): Promise<Customer | null>
  create(input: CustomerInput): Promise<Customer>
  update(id: string, input: CustomerInput): Promise<Customer>
}

export interface WorkOrderRepository {
  list(): Promise<WorkOrder[]>
  getById(id: string): Promise<WorkOrder | null>
  create(input: WorkOrderInput): Promise<WorkOrder>
  update(id: string, input: WorkOrderInput): Promise<WorkOrder>
  updateStatus(id: string, status: WorkOrderStatus): Promise<WorkOrder>
}
