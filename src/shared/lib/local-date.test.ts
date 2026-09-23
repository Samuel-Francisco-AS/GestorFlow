import { expect, it } from 'vitest'
import { localDate } from '@/shared/lib/local-date'
it('usa componentes da data local sem conversão UTC', () => {
  const date = new Date(2026, 8, 23, 23, 30)
  expect(localDate(date)).toBe('2026-09-23')
})
