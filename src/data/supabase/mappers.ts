import type { CustomerRow, WorkOrderRow } from '@/data/supabase/database'
import type { Customer } from '@/features/customers/model'
import type { CustomerInput } from '@/features/customers/schema'
import type { WorkOrder } from '@/features/work-orders/model'
import type { WorkOrderInput } from '@/features/work-orders/schema'

export const fromCustomerRow = (row: CustomerRow): Customer => ({
  id: row.id,
  name: row.name,
  phone: row.phone,
  email: row.email,
  notes: row.notes,
  createdAt: row.created_at,
})
export const toCustomerInsert = (input: CustomerInput) => ({
  name: input.name,
  phone: input.phone,
  email: input.email,
  notes: input.notes,
})
export function toCents(value: number): number {
  if (!Number.isFinite(value) || value < 0)
    throw new Error('Valor monetário inválido.')
  const cents = Math.round((value + Number.EPSILON) * 100)
  if (!Number.isSafeInteger(cents) || Math.abs(cents / 100 - value) > 0.000001)
    throw new Error('Use no máximo duas casas decimais.')
  return cents
}
export function fromCents(cents: number): number {
  if (!Number.isSafeInteger(cents))
    throw new Error('Valor monetário fora do limite seguro.')
  return cents / 100
}
export const fromWorkOrderRow = (row: WorkOrderRow): WorkOrder => ({
  id: row.id,
  code: row.order_code,
  customerId: row.customer_id,
  title: row.title,
  description: row.description,
  value: fromCents(row.value_cents),
  status: row.status,
  date: row.service_date,
  notes: row.notes,
})
export const toWorkOrderInsert = (input: WorkOrderInput) => ({
  customer_id: input.customerId,
  title: input.title,
  description: input.description,
  value_cents: toCents(input.value),
  status: input.status,
  service_date: input.date,
  notes: input.notes,
})
