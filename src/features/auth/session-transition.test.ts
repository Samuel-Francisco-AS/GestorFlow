import { describe, expect, it } from 'vitest'
import { shouldClearSessionCache } from '@/features/auth/session-transition'

describe('transições de identidade da sessão', () => {
  it('limpa ao entrar e ao recuperar inicialmente uma sessão existente', () => {
    expect(shouldClearSessionCache(null, 'user-a')).toBe(true)
  })

  it('preserva o cache na renovação do token da mesma identidade', () => {
    expect(shouldClearSessionCache('user-a', 'user-a')).toBe(false)
  })

  it('limpa ao trocar de conta', () => {
    expect(shouldClearSessionCache('user-a', 'user-b')).toBe(true)
  })

  it('limpa ao encerrar a sessão', () => {
    expect(shouldClearSessionCache('user-a', null)).toBe(true)
  })

  it('preserva o cache quando não há identidade antes ou depois', () => {
    expect(shouldClearSessionCache(null, null)).toBe(false)
  })
})
