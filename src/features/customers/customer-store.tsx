import { useState, type PropsWithChildren } from 'react'

import { demoCustomers } from '@/data/demo'
import { CustomerContext } from '@/features/customers/customer-context'
import type { Customer } from '@/features/customers/model'
import type { CustomerInput } from '@/features/customers/schema'

export function CustomerProvider({ children }: PropsWithChildren) {
  const [customers, setCustomers] = useState<Customer[]>(demoCustomers)

  function createCustomer(input: CustomerInput) {
    const customer = {
      ...input,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString().slice(0, 10),
    }
    setCustomers((current) => [customer, ...current])
    return customer
  }

  function updateCustomer(id: string, input: CustomerInput) {
    setCustomers((current) =>
      current.map((customer) =>
        customer.id === id ? { ...customer, ...input } : customer,
      ),
    )
  }

  return (
    <CustomerContext.Provider
      value={{ customers, createCustomer, updateCustomer }}
    >
      {children}
    </CustomerContext.Provider>
  )
}
