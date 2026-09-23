import { z } from 'zod'

import { workOrderStatuses } from '@/features/work-orders/model'

const validDate = (value: string) => {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T12:00:00Z`)
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  )
}

export const workOrderSchema = z.object({
  customerId: z.string().min(1, 'Selecione um cliente.'),
  title: z
    .string()
    .trim()
    .min(1, 'Informe o serviço.')
    .max(120, 'Use até 120 caracteres.'),
  description: z.string().trim().max(1000, 'Use até 1000 caracteres.'),
  value: z
    .number({ error: 'Informe um valor numérico.' })
    .nonnegative('O valor não pode ser negativo.'),
  status: z.enum(workOrderStatuses, { error: 'Selecione um status válido.' }),
  date: z.string().refine(validDate, 'Informe uma data válida.'),
  notes: z.string().trim().max(1000, 'Use até 1000 caracteres.'),
})

export type WorkOrderInput = z.infer<typeof workOrderSchema>
