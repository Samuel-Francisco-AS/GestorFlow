import { AuthContext } from '@/features/auth/auth-context'
import { useEffect, useRef, useState, type PropsWithChildren } from 'react'
import { useQueryClient } from '@tanstack/react-query'
import type { Session } from '@supabase/supabase-js'
import { supabase } from '@/data/supabase/client'
import { Button } from '@/shared/ui/button'
import { Input } from '@/shared/ui/input'
import { shouldClearSessionCache } from '@/features/auth/session-transition'

function authMessage(error: unknown) {
  if (!(error instanceof Error))
    return 'Não foi possível concluir o acesso. Tente novamente.'
  switch (error.message) {
    case 'Invalid login credentials':
      return 'E-mail ou senha incorretos.'
    case 'Email not confirmed':
      return 'Confirme seu e-mail antes de entrar.'
    case 'User already registered':
      return 'Este e-mail já possui uma conta.'
    default:
      return 'Não foi possível concluir o acesso. Tente novamente.'
  }
}

export function AuthProvider({ children }: PropsWithChildren) {
  const queryClient = useQueryClient()
  const [session, setSession] = useState<Session | null>(null)
  const currentUserId = useRef<string | null>(null)
  const [ready, setReady] = useState(!supabase)
  const [demo, setDemo] = useState(
    () => sessionStorage.getItem('gestorflow-mode') === 'demo',
  )
  const [screen, setScreen] = useState<'entry' | 'signin' | 'signup'>('entry')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [message, setMessage] = useState('')
  const [pending, setPending] = useState(false)
  useEffect(() => {
    if (!supabase) return
    let active = true
    let authEventReceived = false
    const applySession = (next: Session | null) => {
      const nextUserId = next?.user.id ?? null
      if (shouldClearSessionCache(currentUserId.current, nextUserId)) {
        queryClient.clear()
      }
      currentUserId.current = nextUserId
      setSession(next)
      if (next) {
        sessionStorage.removeItem('gestorflow-mode')
        setDemo(false)
      }
    }
    supabase.auth
      .getSession()
      .then(({ data }) => {
        if (active) {
          if (!authEventReceived) applySession(data.session)
          setReady(true)
        }
      })
      .catch(() => {
        if (active) setReady(true)
      })
    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, next) => {
        if (active) {
          authEventReceived = true
          applySession(next)
          setReady(true)
        }
      },
    )
    return () => {
      active = false
      listener.subscription.unsubscribe()
    }
  }, [queryClient])
  async function leave() {
    if (session && supabase) await supabase.auth.signOut()
    queryClient.clear()
    currentUserId.current = null
    sessionStorage.removeItem('gestorflow-mode')
    setSession(null)
    setDemo(false)
    setScreen('entry')
  }
  async function submit(event: React.FormEvent) {
    event.preventDefault()
    if (!supabase || pending) return
    setPending(true)
    setMessage('')
    try {
      if (screen === 'signup') {
        const { data, error } = await supabase.auth.signUp({ email, password })
        if (error) throw error
        setMessage(
          data.session
            ? 'Conta criada. Você já pode usar o GestorFlow.'
            : 'Cadastro realizado. Confira seu e-mail para confirmar a conta.',
        )
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (error) throw error
      }
    } catch (error) {
      if (import.meta.env.DEV) console.error('Falha de autenticação:', error)
      setMessage(authMessage(error))
    } finally {
      setPending(false)
    }
  }
  if (!ready)
    return (
      <main className="grid min-h-svh place-items-center">
        Carregando sessão...
      </main>
    )
  if (session || demo)
    return (
      <AuthContext.Provider
        value={{
          mode: session ? 'authenticated' : 'demo',
          userId: session?.user.id ?? null,
          leave,
        }}
      >
        {children}
      </AuthContext.Provider>
    )
  return (
    <main className="grid min-h-svh place-items-center bg-background p-5">
      <section className="w-full max-w-md rounded-lg border border-border bg-surface p-7">
        <h1 className="font-display text-4xl">GestorFlow</h1>
        <p className="mt-3 text-muted-foreground">
          Organize clientes e serviços em um só lugar.
        </p>
        {screen === 'entry' ? (
          <div className="mt-7 grid gap-3">
            <Button
              onClick={() => {
                sessionStorage.setItem('gestorflow-mode', 'demo')
                setDemo(true)
              }}
            >
              Explorar demonstração
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setScreen('signin')
                setMessage('')
              }}
            >
              Entrar
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setScreen('signup')
                setMessage('')
              }}
            >
              Criar conta
            </Button>
          </div>
        ) : (
          <form onSubmit={submit} className="mt-7 space-y-4">
            <h2 className="font-display text-2xl">
              {screen === 'signin' ? 'Entrar' : 'Criar conta'}
            </h2>
            {!supabase && (
              <p role="alert" className="text-sm text-accent-foreground">
                Configure as variáveis Supabase para acessar uma conta.
              </p>
            )}
            <label className="block text-sm font-medium">
              E-mail
              <Input
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </label>
            <label className="block text-sm font-medium">
              Senha
              <Input
                type="password"
                required
                minLength={6}
                autoComplete={
                  screen === 'signin' ? 'current-password' : 'new-password'
                }
                value={password}
                onChange={(event) => setPassword(event.target.value)}
              />
            </label>
            {message && (
              <p role="status" className="text-sm">
                {message}
              </p>
            )}
            <Button type="submit" disabled={pending || !supabase}>
              {pending
                ? 'Aguarde...'
                : screen === 'signin'
                  ? 'Entrar'
                  : 'Criar conta'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                setScreen('entry')
                setMessage('')
              }}
            >
              Voltar
            </Button>
          </form>
        )}
      </section>
    </main>
  )
}
