import { describe, expect, it } from 'vitest'

import { demoCustomers, demoOrders } from '@/data/demo'
import { nextWorkOrderId } from '@/features/work-orders/model'
import { workOrderSchema } from '@/features/work-orders/schema'
import { filterWorkOrders } from '@/features/work-orders/search'

const validOrder = {
  customerId: 'marina',
  title: 'Identidade visual',
  description: '',
  value: 0,
  status: 'new',
  date: '2026-09-23',
  notes: '',
}

describe('ordens de serviço', () => {
  it('valida os campos essenciais e datas reais', () => {
    expect(workOrderSchema.safeParse(validOrder).success).toBe(true)
    for (const values of [
      { customerId: '' },
      { title: '' },
      { status: 'cancelled' },
      { date: '2026-02-30' },
      { value: -1 },
      { value: Number.NaN },
    ])
      expect(
        workOrderSchema.safeParse({ ...validOrder, ...values }).success,
      ).toBe(false)
  })

  it('pesquisa ID, cliente e serviço com acentos e combina com status', () => {
    expect(
      filterWorkOrders(demoOrders, demoCustomers, 'os-1048', 'all').map(
        (order) => order.id,
      ),
    ).toEqual(['OS-1048'])
    expect(
      filterWorkOrders(demoOrders, demoCustomers, 'cafe aurora', 'waiting').map(
        (order) => order.id,
      ),
    ).toEqual(['OS-1047'])
    expect(
      filterWorkOrders(demoOrders, demoCustomers, 'identidade', 'waiting'),
    ).toEqual([])
    expect(
      filterWorkOrders(demoOrders, demoCustomers, 'revisao', 'all').map(
        (order) => order.id,
      ),
    ).toEqual(['OS-1043'])
  })

  it('gera o próximo ID sem reutilizar um número da sessão', () => {
    expect(nextWorkOrderId(demoOrders)).toBe('OS-1049')
    expect(
      nextWorkOrderId([{ ...demoOrders[0], id: 'OS-9999' }, ...demoOrders]),
    ).toBe('OS-10000')
  })
})
