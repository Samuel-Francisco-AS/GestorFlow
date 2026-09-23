import { ArrowLeft, Check, Pencil } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router'
import { useState } from 'react'

import { formatCurrency, formatDate } from '@/data/demo'
import { useCustomers } from '@/features/customers/customer-context'
import { StatusBadge } from '@/features/work-orders/components/status-badge'
import {
  workOrderStatusLabel,
  workOrderStatuses,
  type WorkOrderStatus,
} from '@/features/work-orders/model'
import { useWorkOrders } from '@/features/work-orders/work-order-context'
import { Button } from '@/shared/ui/button'

export function WorkOrderDetailPage() {
  const { id } = useParams()
  const location = useLocation()
  const { orders, loading, error, statusPending, updateStatus } =
    useWorkOrders()
  const [feedback, setFeedback] = useState<
    'saving' | 'success' | 'error' | null
  >(null)
  const [confirming, setConfirming] = useState(false)
  const {
    customers,
    loading: customersLoading,
    error: customersError,
  } = useCustomers()
  const order = orders.find((item) => item.id === id)
  const customer = customers.find((item) => item.id === order?.customerId)

  if (loading || customersLoading)
    return <p role="status">Carregando dados da ordem...</p>
  if (error || customersError)
    return (
      <p role="alert">Não foi possível carregar a ordem. Tente novamente.</p>
    )

  if (!order)
    return (
      <section>
        <h1 className="font-display text-4xl">Ordem não encontrada</h1>
        <p className="mt-3 text-muted-foreground">
          A ordem solicitada não está disponível nesta sessão.
        </p>
        <Button asChild className="mt-6">
          <Link to="/ordens">Voltar para ordens</Link>
        </Button>
      </section>
    )

  async function changeStatus(value: WorkOrderStatus) {
    if (!order || statusPending) return
    setFeedback('saving')
    setConfirming(false)
    try {
      await updateStatus(order.id, value)
      setFeedback('success')
    } catch {
      setFeedback('error')
    }
  }

  return (
    <div>
      <Link
        to="/ordens"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar para ordens
      </Link>
      {location.state?.flash && (
        <div
          role="status"
          className="mt-3 rounded-md bg-primary-soft px-4 py-3 text-sm font-medium text-primary"
        >
          {location.state.flash}
        </div>
      )}
      <header className="mt-5 flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Ordem {order.code}
          </p>
          <h1 className="break-words font-display text-4xl tracking-tight sm:text-5xl">
            {order.title}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Registrada em {formatDate(order.date)}
          </p>
        </div>
        {statusPending ? (
          <Button variant="outline" disabled>
            <Pencil aria-hidden="true" />
            Editar ordem
          </Button>
        ) : (
          <Button asChild variant="outline">
            <Link to={`/ordens/${order.id}/editar`}>
              <Pencil aria-hidden="true" />
              Editar ordem
            </Link>
          </Button>
        )}
      </header>
      <div className="grid gap-8 pt-8 lg:grid-cols-[minmax(0,1.4fr)_minmax(260px,0.8fr)]">
        <section
          className="min-w-0 rounded-lg border border-border bg-surface p-5 sm:p-7"
          aria-labelledby="order-information"
        >
          <h2 id="order-information" className="font-display text-2xl">
            Detalhes do serviço
          </h2>
          <dl className="mt-6 grid gap-6 sm:grid-cols-2">
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Cliente
              </dt>
              <dd className="mt-2 text-sm font-semibold">
                {customer ? (
                  <Link
                    to={`/clientes/${customer.id}`}
                    className="text-primary hover:underline"
                  >
                    {customer.name}
                  </Link>
                ) : (
                  'Cliente não encontrado'
                )}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Valor
              </dt>
              <dd className="mt-2 text-sm font-semibold">
                {formatCurrency(order.value)}
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Data
              </dt>
              <dd className="mt-2 text-sm">
                <time dateTime={order.date}>{formatDate(order.date)}</time>
              </dd>
            </div>
            <div>
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </dt>
              <dd className="mt-2">
                <StatusBadge status={order.status} />
              </dd>
            </div>
            <div className="sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Descrição
              </dt>
              <dd className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">
                {order.description || 'Nenhuma descrição registrada.'}
              </dd>
            </div>
            <div className="border-t border-border pt-5 sm:col-span-2">
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Observações
              </dt>
              <dd className="mt-2 whitespace-pre-wrap break-words text-sm leading-relaxed">
                {order.notes || 'Nenhuma observação registrada.'}
              </dd>
            </div>
          </dl>
        </section>
        <aside className="min-w-0 space-y-6">
          <section
            className="rounded-lg border border-border bg-surface p-5"
            aria-labelledby="change-status"
          >
            <h2 id="change-status" className="font-display text-2xl">
              Andamento
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Selecione um status. A alteração é salva automaticamente.
            </p>
            <label
              htmlFor="detail-status"
              className="mt-5 block text-sm font-semibold"
            >
              Status da ordem
            </label>
            <select
              id="detail-status"
              value={order.status}
              disabled={statusPending}
              aria-describedby="status-help"
              onChange={(event) => {
                void changeStatus(event.target.value as WorkOrderStatus)
              }}
              className="mt-2 h-11 w-full rounded-md border border-border bg-surface-strong px-3 text-sm"
            >
              {workOrderStatuses.map((status) => (
                <option key={status} value={status}>
                  {workOrderStatusLabel[status]}
                </option>
              ))}
            </select>
            <p id="status-help" className="sr-only">
              A alteração é salva automaticamente.
            </p>
            <p
              role={feedback === 'error' ? 'alert' : 'status'}
              aria-live="polite"
              className={`mt-3 text-sm ${feedback === 'error' ? 'text-[#a13d31]' : 'text-primary'}`}
            >
              {feedback === 'saving'
                ? 'Salvando alteração...'
                : feedback === 'success'
                  ? 'Status atualizado.'
                  : feedback === 'error'
                    ? 'Não foi possível atualizar o status. Tente novamente.'
                    : `Status atual: ${workOrderStatusLabel[order.status]}.`}
            </p>
          </section>
          {order.status !== 'completed' && (
            <section
              className="rounded-lg border border-border bg-surface p-5"
              aria-labelledby="finish-service"
            >
              <h2 id="finish-service" className="font-display text-xl">
                Finalização do serviço
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">
                Use esta ação somente quando o trabalho estiver concluído.
              </p>
              {confirming ? (
                <div className="mt-4 space-y-3">
                  <p className="text-sm font-medium">
                    Confirmar a conclusão desta ordem?
                  </p>
                  <div className="flex flex-wrap gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      disabled={statusPending}
                      onClick={() => {
                        void changeStatus('completed')
                      }}
                    >
                      <Check aria-hidden="true" />
                      Confirmar conclusão
                    </Button>
                    <Button
                      type="button"
                      variant="ghost"
                      disabled={statusPending}
                      onClick={() => setConfirming(false)}
                    >
                      Cancelar
                    </Button>
                  </div>
                </div>
              ) : (
                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  disabled={statusPending}
                  onClick={() => setConfirming(true)}
                >
                  <Check aria-hidden="true" />
                  Concluir ordem
                </Button>
              )}
            </section>
          )}
          <section
            className="hidden rounded-lg border border-border bg-surface p-5 lg:block"
            aria-labelledby="other-orders"
          >
            <h2 id="other-orders" className="font-display text-xl">
              Outras ordens
            </h2>
            <ul className="mt-4 divide-y divide-border">
              {orders
                .filter((item) => item.id !== order.id)
                .slice(0, 5)
                .map((item) => (
                  <li key={item.id}>
                    <Link
                      to={`/ordens/${item.id}`}
                      className="block py-3 text-sm hover:text-primary"
                    >
                      <span className="block font-semibold">{item.title}</span>
                      <span className="text-xs text-muted-foreground">
                        {item.code} · {workOrderStatusLabel[item.status]}
                      </span>
                    </Link>
                  </li>
                ))}
            </ul>
          </section>
        </aside>
      </div>
    </div>
  )
}
