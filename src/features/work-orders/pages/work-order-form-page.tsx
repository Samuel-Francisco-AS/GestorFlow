import { localDate } from '@/shared/lib/local-date'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'

import { useCustomers } from '@/features/customers/customer-context'
import { Button } from '@/shared/ui/button'
import { WorkOrderForm } from '@/features/work-orders/components/work-order-form'
import type { WorkOrderInput } from '@/features/work-orders/schema'
import { useWorkOrders } from '@/features/work-orders/work-order-context'

export function WorkOrderFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const {
    customers,
    loading: customersLoading,
    error: customersError,
  } = useCustomers()
  const { orders, loading, error, createOrder, updateOrder } = useWorkOrders()
  const order = orders.find((item) => item.id === id)
  const editing = mode === 'edit'

  if (loading || customersLoading)
    return <p role="status">Carregando dados da ordem...</p>
  if (error || customersError)
    return (
      <p role="alert">
        Não foi possível carregar os dados da ordem. Tente novamente.
      </p>
    )

  if (editing && !order)
    return (
      <section>
        <h1 className="font-display text-4xl">Ordem não encontrada</h1>
        <p className="mt-3 text-muted-foreground">
          A ordem solicitada não está disponível nesta sessão.
        </p>
        <Link to="/ordens" className="mt-6 inline-block text-primary underline">
          Voltar para ordens
        </Link>
      </section>
    )

  const requestedCustomerId = searchParams.get('cliente') ?? ''
  const customerId = customers.some(
    (customer) => customer.id === requestedCustomerId,
  )
    ? requestedCustomerId
    : ''
  const initialValues: WorkOrderInput = order
    ? {
        customerId: order.customerId,
        title: order.title,
        description: order.description,
        value: order.value,
        status: order.status,
        date: order.date,
        notes: order.notes,
      }
    : {
        customerId,
        title: '',
        description: '',
        value: 0,
        status: 'new',
        date: localDate(),
        notes: '',
      }
  const backTo = editing && order ? `/ordens/${order.id}` : '/ordens'

  async function save(values: WorkOrderInput) {
    if (!customers.some((customer) => customer.id === values.customerId)) return
    if (editing && order) {
      await updateOrder(order.id, values)
      navigate(`/ordens/${order.id}`, {
        state: { flash: 'Ordem atualizada com sucesso.' },
      })
    } else {
      const created = await createOrder(values)
      navigate(`/ordens/${created.id}`, {
        state: { flash: 'Ordem criada com sucesso.' },
      })
    }
  }

  return (
    <div>
      <Link
        to={backTo}
        className="inline-flex min-h-11 items-center gap-2 text-sm font-medium text-primary hover:underline"
      >
        <ArrowLeft className="size-4" aria-hidden="true" />
        Voltar
      </Link>
      <header className="mt-5 border-b border-border pb-7">
        <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
          Ordens de serviço
        </p>
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
          {editing ? 'Editar ordem' : 'Nova ordem'}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {editing
            ? 'Atualize os dados do serviço.'
            : 'Registre as informações essenciais do serviço.'}
        </p>
      </header>
      {!editing && customers.length === 0 ? (
        <section className="mt-7 max-w-3xl rounded-lg border border-border bg-surface p-6 sm:p-8">
          <h2 className="font-display text-2xl">
            Cadastre um cliente primeiro
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            É necessário cadastrar um cliente antes de criar a ordem.
          </p>
          <Button asChild className="mt-5">
            <Link to="/clientes/novo?origem=ordem">Cadastrar cliente</Link>
          </Button>
        </section>
      ) : (
        <WorkOrderForm
          key={`${editing ? order?.id : 'create'}-${initialValues.customerId}`}
          customers={customers}
          initialValues={initialValues}
          onSubmit={save}
          cancelTo={backTo}
          submitLabel={editing ? 'Salvar alterações' : 'Criar ordem'}
          newCustomerTo={!editing ? '/clientes/novo?origem=ordem' : undefined}
        />
      )}
    </div>
  )
}
