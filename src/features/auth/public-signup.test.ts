import { expect, it } from 'vitest'
import { publicSignupEnabled } from '@/features/auth/public-signup'

it('permite testar cadastro local e o desabilita por padrão em produção', () => {
  expect(publicSignupEnabled(undefined, true)).toBe(true)
  expect(publicSignupEnabled(undefined, false)).toBe(false)
  expect(publicSignupEnabled('false', true)).toBe(false)
  expect(publicSignupEnabled('invalid', true)).toBe(false)
  expect(publicSignupEnabled('true', false)).toBe(true)
})
