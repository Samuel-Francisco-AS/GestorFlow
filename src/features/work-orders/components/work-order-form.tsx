import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { useState } from 'react'
import { Link } from 'react-router'

import type { Customer } from '@/features/customers/model'
import {
  workOrderStatusLabel,
  workOrderStatuses,
} from '@/features/work-orders/model'
import {
  workOrderSchema,
  type WorkOrderInput,
} from '@/features/work-orders/schema'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

type Props = {
  customers: Customer[]
  initialValues: WorkOrderInput
  onSubmit: (values: WorkOrderInput) => Promise<void>
  cancelTo: string
  submitLabel: string
  newCustomerTo?: string
}

const errorClass = 'mt-1.5 text-sm text-[#a13d31]'
const textAreaClass =
  'w-full resize-y rounded-md border border-border bg-surface-strong px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground'

export function WorkOrderForm({
  customers,
  initialValues,
  onSubmit,
  cancelTo,
  submitLabel,
  newCustomerTo,
}: Props) {
  const [submitError, setSubmitError] = useState('')
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<WorkOrderInput>({
    resolver: zodResolver(workOrderSchema),
    defaultValues: initialValues,
    mode: 'onSubmit',
  })

  return (
    <form
      onSubmit={handleSubmit(async (values) => {
        setSubmitError('')
        try {
          await onSubmit(values)
        } catch {
          setSubmitError(
            'Não foi possível salvar. Confira sua conexão e tente novamente.',
          )
        }
      })}
      noValidate
      className="mt-7 max-w-3xl space-y-5 rounded-lg border border-border bg-surface p-5 sm:p-8"
    >
      <div>
        <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="order-customer" className="text-sm font-semibold">
            Cliente{' '}
            <span aria-hidden="true" className="text-accent-foreground">
              *
            </span>
            <span className="sr-only"> obrigatório</span>
          </label>
          {newCustomerTo && (
            <Link
              to={newCustomerTo}
              className="inline-flex min-h-11 items-center text-sm font-semibold text-primary hover:underline"
              onClick={(event) => {
                if (
                  isDirty &&
                  !window.confirm(
                    'Os dados preenchidos nesta ordem serão descartados. Continuar?',
                  )
                )
                  event.preventDefault()
              }}
            >
              + Novo cliente
            </Link>
          )}
        </div>
        <select
          id="order-customer"
          {...register('customerId')}
          aria-required="true"
          aria-invalid={Boolean(errors.customerId)}
          aria-describedby={
            errors.customerId ? 'order-customer-error' : undefined
          }
          className="h-11 w-full rounded-md border border-border bg-surface-strong px-3 text-sm"
        >
          <option value="">Selecione um cliente</option>
          {customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.name}
            </option>
          ))}
        </select>
        {errors.customerId && (
          <p id="order-customer-error" role="alert" className={errorClass}>
            {errors.customerId.message}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="order-title"
          className="mb-2 block text-sm font-semibold"
        >
          Título/serviço{' '}
          <span aria-hidden="true" className="text-accent-foreground">
            *
          </span>
          <span className="sr-only"> obrigatório</span>
        </label>
        <Input
          id="order-title"
          {...register('title')}
          aria-required="true"
          aria-invalid={Boolean(errors.title)}
          aria-describedby={errors.title ? 'order-title-error' : undefined}
          placeholder="Ex.: Manutenção de equipamentos"
        />
        {errors.title && (
          <p id="order-title-error" role="alert" className={errorClass}>
            {errors.title.message}
          </p>
        )}
      </div>
      <div>
        <label
          htmlFor="order-description"
          className="mb-2 block text-sm font-semibold"
        >
          Descrição{' '}
          <span className="font-normal text-muted-foreground">(opcional)</span>
        </label>
        <textarea
          id="order-description"
          {...register('description')}
          aria-invalid={Boolean(errors.description)}
          aria-describedby={
            errors.description ? 'order-description-error' : undefined
          }
          rows={3}
          className={textAreaClass}
          placeholder="O que será realizado?"
        />
        {errors.description && (
          <p id="order-description-error" role="alert" className={errorClass}>
            {errors.description.message}
          </p>
        )}
      </div>
      <div className="grid gap-5 sm:grid-cols-3">
        <div>
          <label
            htmlFor="order-value"
            className="mb-2 block text-sm font-semibold"
          >
            Valor (R$)
          </label>
          <Input
            id="order-value"
            type="number"
            min="0"
            step="0.01"
            {...register('value', { valueAsNumber: true })}
            aria-invalid={Boolean(errors.value)}
            aria-describedby={errors.value ? 'order-value-error' : undefined}
          />
          {errors.value && (
            <p id="order-value-error" role="alert" className={errorClass}>
              {errors.value.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="order-date"
            className="mb-2 block text-sm font-semibold"
          >
            Data
          </label>
          <Input
            id="order-date"
            type="date"
            {...register('date')}
            aria-invalid={Boolean(errors.date)}
            aria-describedby={errors.date ? 'order-date-error' : undefined}
          />
          {errors.date && (
            <p id="order-date-error" role="alert" className={errorClass}>
              {errors.date.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="order-status"
            className="mb-2 block text-sm font-semibold"
          >
            Status
          </label>
          <select
            id="order-status"
            {...register('status')}
            aria-invalid={Boolean(errors.status)}
            aria-describedby={errors.status ? 'order-status-error' : undefined}
            className="h-11 w-full rounded-md border border-border bg-surface-strong px-3 text-sm"
          >
            {workOrderStatuses.map((status) => (
              <option key={status} value={status}>
                {workOrderStatusLabel[status]}
              </option>
            ))}
          </select>
          {errors.status && (
            <p id="order-status-error" role="alert" className={errorClass}>
              {errors.status.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="order-notes"
          className="mb-2 block text-sm font-semibold"
        >
          Observações{' '}
          <span className="font-normal text-muted-foreground">(opcional)</span>
        </label>
        <textarea
          id="order-notes"
          {...register('notes')}
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={errors.notes ? 'order-notes-error' : undefined}
          rows={3}
          className={textAreaClass}
          placeholder="Informações úteis para o acompanhamento"
        />
        {errors.notes && (
          <p id="order-notes-error" role="alert" className={errorClass}>
            {errors.notes.message}
          </p>
        )}
      </div>
      {submitError && (
        <p role="alert" className="text-sm text-[#a13d31]">
          {submitError}
        </p>
      )}
      <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">
        <Button asChild variant="outline">
          <Link to={cancelTo}>Cancelar</Link>
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {submitLabel}
        </Button>
      </div>
    </form>
  )
}
