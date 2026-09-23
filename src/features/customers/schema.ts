import { z } from 'zod'

export const customerSchema = z.object({
  name: z
    .string()
    .trim()
    .min(2, 'Informe um nome com pelo menos 2 caracteres.')
    .max(100, 'Use até 100 caracteres.'),
  phone: z.string().trim().max(30, 'Use até 30 caracteres.'),
  email: z.union([z.email('Informe um e-mail válido.'), z.literal('')]),
  notes: z.string().trim().max(500, 'Use até 500 caracteres.'),
})

export type CustomerInput = z.infer<typeof customerSchema>
