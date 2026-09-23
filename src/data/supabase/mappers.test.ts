import { describe, expect, it } from 'vitest'
import {
  fromCents,
  fromCustomerRow,
  fromWorkOrderRow,
  toCents,
  toCustomerInsert,
  toWorkOrderInsert,
} from '@/data/supabase/mappers'
import type { CustomerRow, WorkOrderRow } from '@/data/supabase/database'

const customer: CustomerRow = {
  id: 'customer-uuid',
  owner_id: 'owner-uuid',
  name: 'Marina Albuquerque',
  phone: '',
  email: '',
  notes: '',
  created_at: '2026-09-23T20:00:00Z',
  updated_at: '2026-09-23T20:00:00Z',
}
const order: WorkOrderRow = {
  id: 'order-uuid',
  owner_id: 'owner-uuid',
  customer_id: customer.id,
  order_number: 1001,
  order_code: 'OS-1001',
  title: 'Serviço',
  description: '',
  value_cents: 85050,
  status: 'new',
  service_date: '2026-09-23',
  notes: '',
  created_at: '2026-09-23T20:00:00Z',
  updated_at: '2026-09-23T20:00:00Z',
}
describe('mappers Supabase', () => {
  it('mapeia cliente sem confiar em owner_id', () => {
    expect(fromCustomerRow(customer)).toMatchObject({
      id: customer.id,
      createdAt: customer.created_at,
    })
    expect(
      toCustomerInsert({
        name: customer.name,
        phone: '',
        email: '',
        notes: '',
      }),
    ).not.toHaveProperty('owner_id')
  })
  it('separa UUID do código e converte centavos', () => {
    expect(fromWorkOrderRow(order)).toMatchObject({
      id: 'order-uuid',
      code: 'OS-1001',
      value: 850.5,
      date: '2026-09-23',
    })
    const input = toWorkOrderInsert({
      customerId: customer.id,
      title: 'Serviço',
      description: '',
      value: 850.5,
      status: 'new',
      date: '2026-09-23',
      notes: '',
    })
    expect(input.value_cents).toBe(85050)
    expect(input).not.toHaveProperty('owner_id')
    expect(input).not.toHaveProperty('order_code')
  })
  it('protege precisão monetária e valores fora do limite seguro', () => {
    expect(toCents(0.29)).toBe(29)
    expect(fromCents(29)).toBe(0.29)
    expect(() => toCents(1.234)).toThrow()
    expect(() => fromCents(Number.MAX_SAFE_INTEGER + 1)).toThrow()
  })
})
