import { useMemo, type PropsWithChildren } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/auth-context'
import { DemoCustomerRepository } from '@/data/repositories/demo'
import { SupabaseCustomerRepository } from '@/data/repositories/supabase'
import { supabase } from '@/data/supabase/client'
import { CustomerContext } from '@/features/customers/customer-context'
import type { CustomerInput } from '@/features/customers/schema'

export function CustomerProvider({ children }: PropsWithChildren) {
  const { mode, userId } = useAuth()
  const client = useQueryClient()
  const repository = useMemo(
    () =>
      mode === 'demo'
        ? new DemoCustomerRepository()
        : new SupabaseCustomerRepository(supabase!),
    [mode],
  )
  const key = ['customers', mode, userId]
  const query = useQuery({ queryKey: key, queryFn: () => repository.list() })
  const create = useMutation({
    mutationFn: (input: CustomerInput) => repository.create(input),
    onSuccess: () => client.invalidateQueries({ queryKey: key }),
  })
  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: CustomerInput }) =>
      repository.update(id, input),
    onSuccess: () => client.invalidateQueries({ queryKey: key }),
  })
  return (
    <CustomerContext.Provider
      value={{
        customers: query.data ?? [],
        loading: query.isPending,
        error: query.error,
        createCustomer: (input) => create.mutateAsync(input),
        updateCustomer: (id, input) => update.mutateAsync({ id, input }),
      }}
    >
      {children}
    </CustomerContext.Provider>
  )
}
