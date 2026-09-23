import type { SupabaseClient } from '@supabase/supabase-js'
import type {
  CustomerRepository,
  WorkOrderRepository,
} from '@/data/repositories/contracts'
import type { Database } from '@/data/supabase/database'
import {
  fromCustomerRow,
  fromWorkOrderRow,
  toCustomerInsert,
  toWorkOrderInsert,
} from '@/data/supabase/mappers'
import type { CustomerInput } from '@/features/customers/schema'
import type { WorkOrderStatus } from '@/features/work-orders/model'
import type { WorkOrderInput } from '@/features/work-orders/schema'

export class SupabaseCustomerRepository implements CustomerRepository {
  constructor(private client: SupabaseClient<Database>) {}
  async list() {
    const { data, error } = await this.client
      .from('customers')
      .select('*')
      .order('created_at', { ascending: false })
    if (error) throw error
    return data.map(fromCustomerRow)
  }
  async getById(id: string) {
    const { data, error } = await this.client
      .from('customers')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return data ? fromCustomerRow(data) : null
  }
  async create(input: CustomerInput) {
    const { data, error } = await this.client
      .from('customers')
      .insert(toCustomerInsert(input))
      .select()
      .single()
    if (error) throw error
    return fromCustomerRow(data)
  }
  async update(id: string, input: CustomerInput) {
    const { data, error } = await this.client
      .from('customers')
      .update(toCustomerInsert(input))
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return fromCustomerRow(data)
  }
}
export class SupabaseWorkOrderRepository implements WorkOrderRepository {
  constructor(private client: SupabaseClient<Database>) {}
  async list() {
    const { data, error } = await this.client
      .from('work_orders')
      .select('*')
      .order('service_date', { ascending: false })
    if (error) throw error
    return data.map(fromWorkOrderRow)
  }
  async getById(id: string) {
    const { data, error } = await this.client
      .from('work_orders')
      .select('*')
      .eq('id', id)
      .maybeSingle()
    if (error) throw error
    return data ? fromWorkOrderRow(data) : null
  }
  async create(input: WorkOrderInput) {
    const { data, error } = await this.client
      .from('work_orders')
      .insert(toWorkOrderInsert(input))
      .select()
      .single()
    if (error) throw error
    return fromWorkOrderRow(data)
  }
  async update(id: string, input: WorkOrderInput) {
    const { data, error } = await this.client
      .from('work_orders')
      .update(toWorkOrderInsert(input))
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return fromWorkOrderRow(data)
  }
  async updateStatus(id: string, status: WorkOrderStatus) {
    const { data, error } = await this.client
      .from('work_orders')
      .update({ status })
      .eq('id', id)
      .select()
      .single()
    if (error) throw error
    return fromWorkOrderRow(data)
  }
}
