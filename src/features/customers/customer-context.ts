import { createContext, useContext } from 'react'

import type { Customer } from '@/features/customers/model'
import type { CustomerInput } from '@/features/customers/schema'

export type CustomerStore = {
  customers: Customer[]
  loading: boolean
  error: Error | null
  createCustomer: (input: CustomerInput) => Promise<Customer>
  updateCustomer: (id: string, input: CustomerInput) => Promise<Customer>
}

export const CustomerContext = createContext<CustomerStore | null>(null)

export function useCustomers() {
  const context = useContext(CustomerContext)
  if (!context) throw new Error('useCustomers requer CustomerProvider')
  return context
}
