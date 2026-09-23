import { expect, it } from 'vitest'
import {
  DemoCustomerRepository,
  DemoWorkOrderRepository,
} from '@/data/repositories/demo'
it('isola dados demo por instância e mantém ID separado do código', async () => {
  const customers = new DemoCustomerRepository()
  const created = await customers.create({
    name: 'Papelaria Central',
    phone: '',
    email: '',
    notes: '',
  })
  expect(await customers.getById(created.id)).toEqual(created)
  expect(await new DemoCustomerRepository().getById(created.id)).toBeNull()
  const orders = new DemoWorkOrderRepository()
  const order = await orders.create({
    customerId: created.id,
    title: 'Cartão',
    description: '',
    value: 10,
    status: 'new',
    date: '2026-09-23',
    notes: '',
  })
  expect(order).toMatchObject({ id: 'demo-order-1049', code: 'OS-1049' })
  expect((await orders.updateStatus(order.id, 'completed')).status).toBe(
    'completed',
  )
})
