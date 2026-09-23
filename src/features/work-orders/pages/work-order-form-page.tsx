import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useParams, useSearchParams } from 'react-router'

import { useCustomers } from '@/features/customers/customer-context'
import { WorkOrderForm } from '@/features/work-orders/components/work-order-form'
import type { WorkOrderInput } from '@/features/work-orders/schema'
import { useWorkOrders } from '@/features/work-orders/work-order-context'

export function WorkOrderFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const { customers } = useCustomers()
  const { orders, createOrder, updateOrder } = useWorkOrders()
  const order = orders.find((item) => item.id === id)
  const editing = mode === 'edit'

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
        date: new Date().toISOString().slice(0, 10),
        notes: '',
      }
  const backTo = editing && order ? `/ordens/${order.id}` : '/ordens'

  function save(values: WorkOrderInput) {
    if (!customers.some((customer) => customer.id === values.customerId)) return
    if (editing && order) {
      updateOrder(order.id, values)
      navigate(`/ordens/${order.id}`, {
        state: { flash: 'Ordem atualizada com sucesso.' },
      })
    } else {
      const created = createOrder(values)
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
      <WorkOrderForm
        customers={customers}
        initialValues={initialValues}
        onSubmit={save}
        cancelTo={backTo}
        submitLabel={editing ? 'Salvar alterações' : 'Criar ordem'}
      />
    </div>
  )
}
