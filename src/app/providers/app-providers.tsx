import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { BrowserRouter } from 'react-router'
import { CustomerProvider } from '@/features/customers/customer-store'
import { WorkOrderProvider } from '@/features/work-orders/work-order-store'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
})

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomerProvider>
        <WorkOrderProvider>
          <BrowserRouter>{children}</BrowserRouter>
        </WorkOrderProvider>
      </CustomerProvider>
    </QueryClientProvider>
  )
}
