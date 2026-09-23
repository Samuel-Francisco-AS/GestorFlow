import { createContext, useContext } from 'react'

import type { Customer } from '@/features/customers/model'
import type { CustomerInput } from '@/features/customers/schema'

export type CustomerStore = {
  customers: Customer[]
  createCustomer: (input: CustomerInput) => Customer
  updateCustomer: (id: string, input: CustomerInput) => void
}

export const CustomerContext = createContext<CustomerStore | null>(null)

export function useCustomers() {
  const context = useContext(CustomerContext)
  if (!context) throw new Error('useCustomers requer CustomerProvider')
  return context
}
