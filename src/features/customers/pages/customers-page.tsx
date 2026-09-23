import { ArrowRight, Plus, Search, UsersRound } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router'

import { useCustomers } from '@/features/customers/customer-context'
import { searchCustomers } from '@/features/customers/search'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

export function CustomersPage() {
  const { customers } = useCustomers()
  const [query, setQuery] = useState('')
  const filtered = searchCustomers(customers, query)

  return (
    <div>
      <header className="flex flex-col gap-5 border-b border-border pb-7 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.16em] text-primary">
            Relacionamento
          </p>
          <h1 className="font-display text-4xl tracking-tight sm:text-5xl">
            Clientes
          </h1>
          <p className="mt-3 text-sm text-muted-foreground">
            Pessoas e negócios que fazem parte da sua operação.
          </p>
        </div>
        <Button asChild>
          <Link to="/clientes/novo">
            <Plus aria-hidden="true" />
            Novo cliente
          </Link>
        </Button>
      </header>
      <section className="pt-7" aria-label="Lista de clientes">
        <div className="mb-5 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-sm">
            <Search
              className="pointer-events-none absolute left-3 top-3.5 size-4 text-muted-foreground"
              aria-hidden="true"
            />
            <label htmlFor="customer-search" className="sr-only">
              Pesquisar clientes
            </label>
            <Input
              id="customer-search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Pesquisar por nome ou contato"
              className="pl-10"
            />
          </div>
          <span className="text-sm text-muted-foreground">
            {filtered.length} {filtered.length === 1 ? 'cliente' : 'clientes'}
          </span>
        </div>
        {customers.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-10 text-center">
            <UsersRound
              className="mx-auto mb-4 size-8 text-primary"
              aria-hidden="true"
            />
            <h2 className="font-display text-2xl">Sua lista começa aqui</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Cadastre o primeiro cliente para organizar seus contatos.
            </p>
            <Button asChild className="mt-5">
              <Link to="/clientes/novo">Novo cliente</Link>
            </Button>
          </div>
        ) : filtered.length === 0 ? (
          <div className="rounded-lg border border-border bg-surface p-10 text-center">
            <h2 className="font-display text-2xl">Nenhum resultado</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Tente outro nome, telefone ou e-mail.
            </p>
          </div>
        ) : (
          <div className="overflow-hidden rounded-lg border border-border bg-surface">
            <div className="hidden grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.2fr)_30px] gap-4 border-b border-border px-5 py-3 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground md:grid">
              <span>Cliente</span>
              <span>Telefone</span>
              <span>E-mail</span>
              <span />
            </div>
            <ul className="divide-y divide-border">
              {filtered.map((customer) => (
                <li key={customer.id}>
                  <Link
                    to={`/clientes/${customer.id}`}
                    className="group flex min-h-20 items-center justify-between gap-4 px-5 py-4 transition-colors hover:bg-white focus-visible:bg-white md:grid md:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)_minmax(0,1.2fr)_30px]"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-semibold group-hover:text-primary">
                        {customer.name}
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground md:hidden">
                        {customer.phone ||
                          customer.email ||
                          'Contato não informado'}
                      </p>
                    </div>
                    <span className="hidden truncate text-sm text-muted-foreground md:block">
                      {customer.phone || '—'}
                    </span>
                    <span className="hidden truncate text-sm text-muted-foreground md:block">
                      {customer.email || '—'}
                    </span>
                    <ArrowRight
                      className="size-4 shrink-0 text-muted-foreground group-hover:text-primary"
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
