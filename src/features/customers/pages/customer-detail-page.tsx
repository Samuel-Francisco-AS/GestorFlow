import { ArrowLeft, Mail, Phone, Pencil, Plus } from 'lucide-react'
import { Link, useLocation, useParams } from 'react-router'

import {
  demoOrders,
  formatCurrency,
  formatDate,
  orderStatusLabel,
} from '@/data/demo'
import { useCustomers } from '@/features/customers/customer-context'
import { Button } from '@/shared/ui/button'

export function CustomerDetailPage() {
  const { id } = useParams()
  const { customers } = useCustomers()
  const location = useLocation()
  const customer = customers.find((item) => item.id === id)

  if (!customer)
    return (
      <section>
        <h1 className="font-display text-4xl">Cliente não encontrado</h1>
        <p className="mt-3 text-muted-foreground">
          O cadastro solicitado não está disponível nesta sessão.
        </p>
        <Button asChild className="mt-6">
          <Link to="/clientes">Voltar para clientes</Link>
        </Button>
      </section>
    )

  const orders = demoOrders.filter((order) => order.customerId === customer.id)
  return (
    <div>
      <Link
        to="/clientes"
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar para clientes
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
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Ficha do cliente
          </p>
          <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
            {customer.name}
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Cliente desde{' '}
            {new Intl.DateTimeFormat('pt-BR', {
              month: 'long',
              year: 'numeric',
              timeZone: 'UTC',
            }).format(new Date(`${customer.createdAt}T12:00:00Z`))}
          </p>
        </div>
        <Button asChild variant="outline">
          <Link to={`/clientes/${customer.id}/editar`}>
            <Pencil aria-hidden="true" />
            Editar cliente
          </Link>
        </Button>
      </header>
      <div className="grid gap-8 pt-8 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.4fr)]">
        <section
          aria-labelledby="contact-title"
          className="rounded-lg border border-border bg-surface p-6"
        >
          <h2 id="contact-title" className="font-display text-2xl">
            Contato e observações
          </h2>
          <dl className="mt-6 space-y-5">
            <div>
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Phone className="size-4" aria-hidden="true" />
                Telefone
              </dt>
              <dd className="mt-2 break-words text-sm">
                {customer.phone || 'Não informado'}
              </dd>
            </div>
            <div>
              <dt className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                <Mail className="size-4" aria-hidden="true" />
                E-mail
              </dt>
              <dd className="mt-2 break-words text-sm">
                {customer.email || 'Não informado'}
              </dd>
            </div>
            <div className="border-t border-border pt-5">
              <dt className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Observações
              </dt>
              <dd className="mt-2 whitespace-pre-wrap text-sm leading-relaxed">
                {customer.notes || 'Nenhuma observação registrada.'}
              </dd>
            </div>
          </dl>
        </section>
        <section aria-labelledby="history-title">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.16em] text-primary">
                Histórico demonstrativo
              </p>
              <h2 id="history-title" className="mt-1 font-display text-2xl">
                Ordens relacionadas
              </h2>
            </div>
            <Button type="button" disabled aria-describedby="order-hint">
              <Plus aria-hidden="true" />
              Nova ordem
            </Button>
          </div>
          <p id="order-hint" className="mt-2 text-xs text-muted-foreground">
            Criação de ordens disponível em uma próxima etapa.
          </p>
          {orders.length ? (
            <ul className="mt-5 divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
              {orders.map((order) => (
                <li
                  key={order.id}
                  className="flex flex-wrap items-center justify-between gap-3 p-5"
                >
                  <div>
                    <p className="text-sm font-semibold">{order.title}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {order.id} · {formatDate(order.date)} ·{' '}
                      {orderStatusLabel[order.status]}
                    </p>
                  </div>
                  <span className="text-sm font-semibold">
                    {formatCurrency(order.value)}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-5 rounded-lg border border-border bg-surface p-6 text-sm text-muted-foreground">
              Nenhuma ordem demonstrativa para este cliente.
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
