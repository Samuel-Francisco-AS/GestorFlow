import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router'

import { CustomerForm } from '@/features/customers/components/customer-form'
import { useCustomers } from '@/features/customers/customer-context'
import type { CustomerInput } from '@/features/customers/schema'

export function CustomerFormPage({ mode }: { mode: 'create' | 'edit' }) {
  const { id } = useParams()
  const navigate = useNavigate()
  const { customers, loading, createCustomer, updateCustomer } = useCustomers()
  const customer = customers.find((item) => item.id === id)
  const editing = mode === 'edit'

  if (loading) return <p role="status">Carregando clientes...</p>

  if (editing && !customer)
    return (
      <section>
        <h1 className="font-display text-4xl">Cliente não encontrado</h1>
        <Link
          to="/clientes"
          className="mt-6 inline-block text-primary underline"
        >
          Voltar para clientes
        </Link>
      </section>
    )

  async function save(values: CustomerInput) {
    if (editing && customer) {
      await updateCustomer(customer.id, values)
      navigate(`/clientes/${customer.id}`, {
        state: { flash: 'Cliente atualizado com sucesso.' },
      })
    } else {
      const created = await createCustomer(values)
      navigate(`/clientes/${created.id}`, {
        state: { flash: 'Cliente cadastrado com sucesso.' },
      })
    }
  }

  const backTo = editing && customer ? `/clientes/${customer.id}` : '/clientes'
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
          Clientes
        </p>
        <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
          {editing ? 'Editar cliente' : 'Novo cliente'}
        </h1>
        <p className="mt-3 text-sm text-muted-foreground">
          {editing
            ? 'Atualize os dados de contato e observações.'
            : 'Registre as informações essenciais para manter contato.'}
        </p>
      </header>
      <CustomerForm
        initialValues={
          customer
            ? {
                name: customer.name,
                phone: customer.phone,
                email: customer.email,
                notes: customer.notes,
              }
            : undefined
        }
        cancelTo={backTo}
        onSubmit={save}
        submitLabel={editing ? 'Salvar alterações' : 'Cadastrar cliente'}
      />
    </div>
  )
}
