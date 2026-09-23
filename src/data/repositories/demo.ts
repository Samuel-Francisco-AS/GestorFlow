import { demoCustomers, demoOrders } from '@/data/demo'
import type {
  CustomerRepository,
  WorkOrderRepository,
} from '@/data/repositories/contracts'
import type { Customer } from '@/features/customers/model'
import type { CustomerInput } from '@/features/customers/schema'
import type { WorkOrder, WorkOrderStatus } from '@/features/work-orders/model'
import { nextWorkOrderCode } from '@/features/work-orders/model'
import type { WorkOrderInput } from '@/features/work-orders/schema'

export class DemoCustomerRepository implements CustomerRepository {
  private customers: Customer[] = structuredClone(demoCustomers)
  async list() {
    return [...this.customers]
  }
  async getById(id: string) {
    return this.customers.find((item) => item.id === id) ?? null
  }
  async create(input: CustomerInput) {
    const customer = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
    }
    this.customers = [customer, ...this.customers]
    return customer
  }
  async update(id: string, input: CustomerInput) {
    const customer = await this.getById(id)
    if (!customer) throw new Error('Cliente não encontrado.')
    const updated = { ...customer, ...input }
    this.customers = this.customers.map((item) =>
      item.id === id ? updated : item,
    )
    return updated
  }
}

export class DemoWorkOrderRepository implements WorkOrderRepository {
  private orders: WorkOrder[] = structuredClone(demoOrders)
  async list() {
    return [...this.orders]
  }
  async getById(id: string) {
    return this.orders.find((item) => item.id === id) ?? null
  }
  async create(input: WorkOrderInput) {
    const code = nextWorkOrderCode(this.orders)
    const order = { ...input, id: `demo-order-${code.slice(3)}`, code }
    this.orders = [order, ...this.orders]
    return order
  }
  async update(id: string, input: WorkOrderInput) {
    const order = await this.getById(id)
    if (!order) throw new Error('Ordem não encontrada.')
    const updated = { ...order, ...input }
    this.orders = this.orders.map((item) => (item.id === id ? updated : item))
    return updated
  }
  async updateStatus(id: string, status: WorkOrderStatus) {
    const order = await this.getById(id)
    if (!order) throw new Error('Ordem não encontrada.')
    const updated = { ...order, status }
    this.orders = this.orders.map((item) => (item.id === id ? updated : item))
    return updated
  }
}
