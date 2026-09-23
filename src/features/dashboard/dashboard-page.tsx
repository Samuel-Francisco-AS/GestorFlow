import {
  CircleAlert,
  ClipboardList,
  Clock3,
  Plus,
  CheckCheck,
} from 'lucide-react'

import { formatCurrency, formatDate } from '@/data/demo'
import {
  workOrderStatusLabel as orderStatusLabel,
  type WorkOrderStatus,
} from '@/features/work-orders/model'
import { useCustomers } from '@/features/customers/customer-context'
import { useWorkOrders } from '@/features/work-orders/work-order-context'
import { deriveDashboardMetrics } from '@/features/dashboard/metrics'
import { Button } from '@/shared/ui/button'
import { Link } from 'react-router'

const statusStyles: Record<WorkOrderStatus, string> = {
  new: 'bg-muted text-foreground',
  in_progress: 'bg-primary-soft text-primary',
  waiting: 'bg-accent-soft text-accent-foreground',
  completed: 'bg-[#e8eee3] text-[#41613e]',
}

function StatusBadge({ status }: { status: WorkOrderStatus }) {
  return (
    <span
      className={`inline-flex w-fit rounded-sm px-2.5 py-1 text-xs font-semibold ${statusStyles[status]}`}
    >
      {orderStatusLabel[status]}
    </span>
  )
}

export function DashboardPage() {
  const {
    customers,
    loading: customersLoading,
    error: customersError,
  } = useCustomers()
  const { orders, loading: ordersLoading, error: ordersError } = useWorkOrders()
  const now = new Date()
  const {
    inProgress,
    waiting,
    completedThisMonth,
    revenueThisMonth,
    attention,
    recent,
  } = deriveDashboardMetrics(orders, now)
  const customerName = (id: string) =>
    customers.find((customer) => customer.id === id)?.name ?? 'Cliente'
  const greeting =
    now.getHours() < 12
      ? 'Bom dia'
      : now.getHours() < 18
        ? 'Boa tarde'
        : 'Boa noite'
  const dateLabel = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  }).format(now)
  const monthLabel = new Intl.DateTimeFormat('pt-BR', {
    month: 'long',
    year: 'numeric',
  }).format(now)
  if (customersLoading || ordersLoading)
    return <p role="status">Carregando dashboard...</p>
  if (customersError || ordersError)
    return (
      <p role="alert">
        Não foi possível carregar o dashboard. Tente novamente.
      </p>
    )

  return (
    <div className="space-y-9">
      <section className="flex flex-col gap-5 border-b border-border pb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
            {dateLabel}
          </p>
          <h1 className="font-display text-[2.45rem] leading-[1.08] tracking-tight sm:text-5xl">
            {greeting}. Sua operação
            <br className="hidden sm:block" /> em perspectiva.
          </h1>
          <p className="mt-3 text-sm text-muted-foreground sm:text-base">
            Acompanhe os serviços do seu negócio em um só lugar.
          </p>
        </div>
        <div className="shrink-0">
          <Button asChild>
            <Link to="/ordens/nova">
              <Plus aria-hidden="true" />
              Nova ordem
            </Link>
          </Button>
        </div>
      </section>

      <section aria-labelledby="overview-title">
        <div className="mb-4 flex items-center justify-between">
          <h2
            id="overview-title"
            className="text-sm font-semibold uppercase tracking-[0.12em]"
          >
            Visão geral
          </h2>
          <span className="text-xs text-muted-foreground">{monthLabel}</span>
        </div>
        <div className="grid grid-cols-2 gap-px overflow-hidden rounded-lg border border-border bg-border lg:grid-cols-4">
          <div
            data-testid="metric-in-progress"
            className="bg-surface p-5 sm:p-6"
          >
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs sm:text-sm">Em andamento</span>
              <ClipboardList className="size-4" aria-hidden="true" />
            </div>
            <p className="mt-5 font-display text-4xl leading-none">
              {inProgress}
            </p>
            <p className="mt-3 text-xs text-muted-foreground">
              Serviços em execução
            </p>
          </div>
          <div data-testid="metric-waiting" className="bg-surface p-5 sm:p-6">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs sm:text-sm">Aguardando</span>
              <Clock3 className="size-4" aria-hidden="true" />
            </div>
            <p className="mt-5 font-display text-4xl leading-none">{waiting}</p>
            <p className="mt-3 text-xs text-muted-foreground">
              Precisam de acompanhamento
            </p>
          </div>
          <div data-testid="metric-completed" className="bg-surface p-5 sm:p-6">
            <div className="flex items-center justify-between text-muted-foreground">
              <span className="text-xs sm:text-sm">Concluídas no mês</span>
              <CheckCheck className="size-4" aria-hidden="true" />
            </div>
            <p className="mt-5 font-display text-4xl leading-none">
              {completedThisMonth}
            </p>
            <p className="mt-3 flex items-center gap-1 text-xs text-[#41613e]">
              Entregas finalizadas
            </p>
          </div>
          <div
            data-testid="metric-revenue"
            className="bg-primary p-5 text-white sm:p-6"
          >
            <div className="flex items-center justify-between text-white/75">
              <span className="text-xs sm:text-sm">Faturamento do mês</span>
            </div>
            <p className="mt-5 font-display text-[1.75rem] leading-none sm:text-[2rem]">
              {formatCurrency(revenueThisMonth)}
            </p>
            <p className="mt-3 text-xs text-white/70">
              Valor das ordens concluídas
            </p>
          </div>
        </div>
      </section>

      <div className="grid gap-8 xl:grid-cols-[minmax(0,1.7fr)_minmax(275px,0.8fr)]">
        <section aria-labelledby="recent-title" className="min-w-0">
          <div className="mb-4 flex items-end justify-between gap-3">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
                Atividade
              </p>
              <h2 id="recent-title" className="mt-1 font-display text-2xl">
                Ordens recentes
              </h2>
            </div>
            <span className="text-xs text-muted-foreground">
              Últimos registros
            </span>
          </div>
          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="hidden grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)_110px_90px] gap-3 border-b border-border px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
              <span>Cliente / serviço</span>
              <span>Status</span>
              <span>Valor</span>
              <span>Data</span>
            </div>
            <ul className="divide-y divide-border">
              {recent.map((order) => (
                <li
                  key={order.id}
                  className="flex flex-wrap items-center gap-x-4 gap-y-3 px-5 py-4 md:grid md:grid-cols-[minmax(0,1.5fr)_minmax(0,1.5fr)_110px_90px] md:gap-3"
                >
                  <div className="min-w-0 flex-1 basis-full md:basis-auto">
                    <p className="truncate text-sm font-semibold">
                      {customerName(order.customerId)}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-muted-foreground">
                      {order.title} · {order.code}
                    </p>
                  </div>
                  <StatusBadge status={order.status} />
                  <span className="ml-auto text-sm font-semibold md:ml-0">
                    {formatCurrency(order.value)}
                  </span>
                  <time
                    dateTime={order.date}
                    className="w-full text-xs text-muted-foreground md:w-auto"
                  >
                    {formatDate(order.date)}
                  </time>
                </li>
              ))}
              {recent.length === 0 && (
                <li className="px-5 py-6 text-sm text-muted-foreground">
                  Nenhuma ordem registrada.
                </li>
              )}
            </ul>
          </div>
        </section>
        <section aria-labelledby="attention-title">
          <div className="mb-4">
            <p className="text-xs font-semibold uppercase tracking-[0.15em] text-primary">
              Acompanhar
            </p>
            <h2 id="attention-title" className="mt-1 font-display text-2xl">
              Atenção necessária
            </h2>
          </div>
          <div className="rounded-lg border border-border bg-surface p-5">
            <div className="mb-5 flex items-center gap-2 text-sm font-semibold">
              <CircleAlert
                className="size-4 text-accent-foreground"
                aria-hidden="true"
              />
              {attention.length} ordens aguardando
            </div>
            <ul className="space-y-4">
              {attention.map((order) => (
                <li key={order.id} className="border-l-2 border-[#c59656] pl-3">
                  <p className="text-sm font-semibold">
                    {customerName(order.customerId)}
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {order.title} · desde {formatDate(order.date)}
                  </p>
                </li>
              ))}
              {attention.length === 0 && (
                <li className="text-sm text-muted-foreground">
                  Nenhuma ordem aguardando acompanhamento.
                </li>
              )}
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}
