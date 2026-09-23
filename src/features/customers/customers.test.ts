import { describe, expect, it } from 'vitest'

import { demoCustomers } from '@/data/demo'
import { customerSchema } from '@/features/customers/schema'
import { searchCustomers } from '@/features/customers/search'

describe('customerSchema', () => {
  it('exige nome e rejeita e-mail inválido', () => {
    const result = customerSchema.safeParse({
      name: ' ',
      phone: '',
      email: 'email-invalido',
      notes: '',
    })
    expect(result.success).toBe(false)
    if (!result.success)
      expect(result.error.flatten().fieldErrors).toMatchObject({
        name: ['Informe um nome com pelo menos 2 caracteres.'],
        email: ['Informe um e-mail válido.'],
      })
  })

  it('aceita somente nome e normaliza espaços', () => {
    expect(
      customerSchema.parse({
        name: '  Nova Cliente  ',
        phone: '',
        email: '',
        notes: '',
      }).name,
    ).toBe('Nova Cliente')
  })
})

describe('searchCustomers', () => {
  it('encontra nomes com ou sem acento e contato', () => {
    expect(
      searchCustomers(demoCustomers, 'cafe').map((customer) => customer.name),
    ).toEqual(['Café Aurora'])
    expect(
      searchCustomers(demoCustomers, '98812').map((customer) => customer.name),
    ).toEqual(['Marina Albuquerque'])
    expect(searchCustomers(demoCustomers, 'nada')).toEqual([])
  })
})
