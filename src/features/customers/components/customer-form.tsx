import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { Link } from 'react-router'

import { customerSchema, type CustomerInput } from '@/features/customers/schema'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'

type Props = {
  initialValues?: CustomerInput
  onSubmit: (values: CustomerInput) => void
  cancelTo: string
  submitLabel: string
}

const emptyValues: CustomerInput = { name: '', phone: '', email: '', notes: '' }

export function CustomerForm({
  initialValues = emptyValues,
  onSubmit,
  cancelTo,
  submitLabel,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<CustomerInput>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialValues,
    mode: 'onSubmit',
  })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      className="mt-7 max-w-2xl space-y-5 rounded-lg border border-border bg-surface p-5 sm:p-8"
    >
      <div>
        <label
          htmlFor="customer-name"
          className="mb-2 block text-sm font-semibold"
        >
          Nome{' '}
          <span aria-hidden="true" className="text-accent-foreground">
            *
          </span>
          <span className="sr-only"> obrigatório</span>
        </label>
        <Input
          id="customer-name"
          autoComplete="name"
          {...register('name')}
          aria-required="true"
          aria-invalid={Boolean(errors.name)}
          aria-describedby={errors.name ? 'name-error' : undefined}
          placeholder="Nome da pessoa ou empresa"
        />
        {errors.name && (
          <p
            id="name-error"
            role="alert"
            className="mt-1.5 text-sm text-[#a13d31]"
          >
            {errors.name.message}
          </p>
        )}
      </div>
      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label
            htmlFor="customer-phone"
            className="mb-2 block text-sm font-semibold"
          >
            Telefone{' '}
            <span className="font-normal text-muted-foreground">
              (opcional)
            </span>
          </label>
          <Input
            id="customer-phone"
            type="tel"
            autoComplete="tel"
            {...register('phone')}
            aria-invalid={Boolean(errors.phone)}
            aria-describedby={errors.phone ? 'phone-error' : undefined}
            placeholder="(85) 99999-9999"
          />
          {errors.phone && (
            <p
              id="phone-error"
              role="alert"
              className="mt-1.5 text-sm text-[#a13d31]"
            >
              {errors.phone.message}
            </p>
          )}
        </div>
        <div>
          <label
            htmlFor="customer-email"
            className="mb-2 block text-sm font-semibold"
          >
            E-mail{' '}
            <span className="font-normal text-muted-foreground">
              (opcional)
            </span>
          </label>
          <Input
            id="customer-email"
            type="email"
            autoComplete="email"
            {...register('email')}
            aria-invalid={Boolean(errors.email)}
            aria-describedby={errors.email ? 'email-error' : undefined}
            placeholder="contato@exemplo.com"
          />
          {errors.email && (
            <p
              id="email-error"
              role="alert"
              className="mt-1.5 text-sm text-[#a13d31]"
            >
              {errors.email.message}
            </p>
          )}
        </div>
      </div>
      <div>
        <label
          htmlFor="customer-notes"
          className="mb-2 block text-sm font-semibold"
        >
          Observações{' '}
          <span className="font-normal text-muted-foreground">(opcional)</span>
        </label>
        <textarea
          id="customer-notes"
          {...register('notes')}
          aria-invalid={Boolean(errors.notes)}
          aria-describedby={errors.notes ? 'notes-error' : undefined}
          rows={4}
          placeholder="Detalhes úteis para o atendimento"
          className="w-full resize-y rounded-md border border-border bg-surface-strong px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground"
        />
        {errors.notes && (
          <p
            id="notes-error"
            role="alert"
            className="mt-1.5 text-sm text-[#a13d31]"
          >
            {errors.notes.message}
          </p>
        )}
      </div>
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
