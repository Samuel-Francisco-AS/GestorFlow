import type { Customer } from '@/features/customers/model'

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLocaleLowerCase('pt-BR')

export function searchCustomers(customers: Customer[], query: string) {
  const term = normalize(query.trim())
  if (!term) return customers
  return customers.filter((customer) =>
    normalize(
      [customer.name, customer.phone, customer.email].join(' '),
    ).includes(term),
  )
}
