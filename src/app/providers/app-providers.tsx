import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { PropsWithChildren } from 'react'
import { BrowserRouter } from 'react-router'
import { CustomerProvider } from '@/features/customers/customer-store'

const queryClient = new QueryClient({
  defaultOptions: { queries: { retry: 1, refetchOnWindowFocus: false } },
})

export function AppProviders({ children }: PropsWithChildren) {
  return (
    <QueryClientProvider client={queryClient}>
      <CustomerProvider>
        <BrowserRouter>{children}</BrowserRouter>
      </CustomerProvider>
    </QueryClientProvider>
  )
}
