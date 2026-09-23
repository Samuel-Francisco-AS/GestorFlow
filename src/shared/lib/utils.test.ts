import { describe, expect, it } from 'vitest'

import { cn } from './utils'

describe('cn', () => {
  it('resolve classes conflitantes e ignora condicionais falsas', () => {
    expect(cn('px-2', { hidden: false }, 'px-4')).toBe('px-4')
  })
})
