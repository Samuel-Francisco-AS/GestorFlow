import { useMemo, type PropsWithChildren } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/features/auth/auth-context'
import { DemoWorkOrderRepository } from '@/data/repositories/demo'
import { SupabaseWorkOrderRepository } from '@/data/repositories/supabase'
import { supabase } from '@/data/supabase/client'
import { WorkOrderContext } from '@/features/work-orders/work-order-context'
import type { WorkOrderStatus } from '@/features/work-orders/model'
import type { WorkOrderInput } from '@/features/work-orders/schema'

export function WorkOrderProvider({ children }: PropsWithChildren) {
  const { mode, userId } = useAuth()
  const client = useQueryClient()
  const repository = useMemo(
    () =>
      mode === 'demo'
        ? new DemoWorkOrderRepository()
        : new SupabaseWorkOrderRepository(supabase!),
    [mode],
  )
  const key = ['orders', mode, userId]
  const query = useQuery({ queryKey: key, queryFn: () => repository.list() })
  const refresh = () => client.invalidateQueries({ queryKey: key })
  const create = useMutation({
    mutationFn: (input: WorkOrderInput) => repository.create(input),
    onSuccess: refresh,
  })
  const update = useMutation({
    mutationFn: ({ id, input }: { id: string; input: WorkOrderInput }) =>
      repository.update(id, input),
    onSuccess: refresh,
  })
  const status = useMutation({
    mutationFn: ({ id, value }: { id: string; value: WorkOrderStatus }) =>
      repository.updateStatus(id, value),
    onSuccess: refresh,
  })
  return (
    <WorkOrderContext.Provider
      value={{
        orders: query.data ?? [],
        loading: query.isPending,
        error: query.error,
        statusPending: status.isPending,
        createOrder: (input) => create.mutateAsync(input),
        updateOrder: (id, input) => update.mutateAsync({ id, input }),
        updateStatus: (id, value) => status.mutateAsync({ id, value }),
      }}
    >
      {children}
    </WorkOrderContext.Provider>
  )
}
