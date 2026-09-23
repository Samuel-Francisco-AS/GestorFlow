import { ArrowRight, ClipboardList, Plus, Search } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { formatCurrency, formatDate } from '@/data/demo'
import { useCustomers } from '@/features/customers/customer-context'
import { StatusBadge } from '@/features/work-orders/components/status-badge'
import {
  workOrderStatusLabel,
  workOrderStatuses,
  type WorkOrderStatus,
} from '@/features/work-orders/model'
import { filterWorkOrders } from '@/features/work-orders/search'
import { useWorkOrders } from '@/features/work-orders/work-order-context'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

export function WorkOrdersPage() {
  const { orders, loading, error } = useWorkOrders()
  const { customers } = useCustomers()
  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<WorkOrderStatus | 'all'>('all')
  const filtered = filterWorkOrders(orders, customers, query, status)
  const customerName = (id: string) =>
    customers.find((customer) => customer.id === id)?.name ??
    'Cliente não encontrado'

  if (loading) return <p role="status">Carregando ordens...</p>
  if (error)
    return (
      <p role="alert">Não foi possível carregar ordens. Tente novamente.</p>
    )

  return (
    <div>
      <header className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Operação
          </p>
          <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
            Ordens de serviço
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Acompanhe os serviços em cada etapa.
          </p>
        </div>
        <Button asChild>
          <Link to="/ordens/nova">
            <Plus aria-hidden="true" />
            Nova ordem
          </Link>
        </Button>
      </header>
      <section className="pt-7" aria-label="Lista de ordens">
        <div className="mb-5 flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div className="relative w-full md:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <label htmlFor="order-search" className="sr-only">
              Pesquisar ordens
            </label>
            <Input
              id="order-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="ID, cliente ou serviço"
              className="pl-10"
            />
          </div>
          <div className="w-full md:w-52">
            <label
              htmlFor="order-status-filter"
              className="mb-1 block text-xs font-semibold text-muted-foreground"
            >
              Status
            </label>
            <select
              id="order-status-filter"
              value={status}
              onChange={(event) =>
                setStatus(event.target.value as WorkOrderStatus | 'all')
              }
              className="h-11 w-full rounded-md border border-border bg-surface-strong px-3 text-sm"
            >
              <option value="all">Todos</option>
              {workOrderStatuses.map((item) => (
                <option key={item} value={item}>
                  {workOrderStatusLabel[item]}
                </option>
              ))}
            </select>
          </div>
        </div>
        <p className="mb-4 text-sm text-muted-foreground">
          {filtered.length} {filtered.length === 1 ? 'ordem' : 'ordens'}
        </p>
        {filtered.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-10 text-center">
            <ClipboardList
              className="mx-auto mb-4 size-8 text-primary"
              aria-hidden="true"
            />
            <h2 className="font-display text-2xl">Nenhuma ordem encontrada</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Ajuste a pesquisa ou o filtro de status.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="hidden grid-cols-[90px_minmax(0,1.2fr)_minmax(0,1.5fr)_110px_90px_90px_20px] gap-3 border-b border-border px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground lg:grid">
              <span>ID</span>
              <span>Cliente</span>
              <span>Serviço</span>
              <span>Status</span>
              <span>Data</span>
              <span>Valor</span>
              <span />
            </div>
            <ul className="divide-y divide-border">
              {filtered.map((order) => (
                <li key={order.id}>
                  <Link
                    to={`/ordens/${order.id}`}
                    className="group flex min-h-24 flex-wrap items-center justify-between gap-x-3 gap-y-2 px-5 py-4 hover:bg-white focus-visible:bg-white lg:grid lg:min-h-18 lg:grid-cols-[90px_minmax(0,1.2fr)_minmax(0,1.5fr)_110px_90px_90px_20px]"
                  >
                    <span className="text-xs font-semibold text-primary lg:text-sm">
                      {order.id}
                    </span>
                    <span className="w-full min-w-0 truncate text-sm font-semibold order-first lg:order-none lg:w-auto">
                      {customerName(order.customerId)}
                    </span>
                    <span className="w-full min-w-0 truncate text-sm lg:w-auto">
                      {order.title}
                    </span>
                    <StatusBadge status={order.status} />
                    <time
                      dateTime={order.date}
                      className="text-xs text-muted-foreground"
                    >
                      {formatDate(order.date)}
                    </time>
                    <span className="text-sm font-semibold">
                      {formatCurrency(order.value)}
                    </span>
                    <ArrowRight
                      className="hidden size-4 text-muted-foreground lg:block"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </section>
    </div>
  )
}
