import { ClipboardList, LayoutDashboard, UsersRound } from 'lucide-react'
import { useAuth } from '@/features/auth/auth-context'
import { Button } from '@/shared/ui/button'
import { NavLink, Outlet } from 'react-router'

const links = [
  { label: 'Visão geral', mobile: 'Início', to: '/', icon: LayoutDashboard },
  {
    label: 'Clientes',
    mobile: 'Clientes',
    to: '/clientes',
    icon: UsersRound,
    disabled: false,
  },
  {
    label: 'Ordens de serviço',
    mobile: 'Ordens',
    to: '/ordens',
    icon: ClipboardList,
    disabled: false,
  },
]

export function AppLayout() {
  const { mode, leave } = useAuth()
  return (
    <div className="min-h-svh bg-background lg:grid lg:grid-cols-[248px_minmax(0,1fr)]">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-white focus:p-3"
      >
        Pular para o conteúdo
      </a>
      <aside className="hidden min-h-svh flex-col border-r border-border bg-surface lg:flex">
        <NavLink
          to="/"
          className="flex items-center gap-3 px-7 py-8 text-lg font-bold tracking-tight"
          aria-label="GestorFlow, voltar ao início"
        >
          <span className="flex size-9 items-center justify-center rounded-md bg-primary text-white">
            <ClipboardList size={19} strokeWidth={1.8} />
          </span>
          GestorFlow
        </NavLink>
        <div className="px-7 pb-3 text-[11px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
          Espaço de trabalho
        </div>
        <nav aria-label="Navegação principal" className="space-y-1 px-3">
          {links.map(({ label, to, icon: Icon, disabled }) =>
            disabled ? (
              <span
                key={to}
                className="flex min-h-11 items-center gap-3 rounded-md px-4 text-sm text-muted-foreground/70"
                aria-label={`${label}, em breve`}
              >
                <Icon size={18} strokeWidth={1.8} />
                {label}
              </span>
            ) : (
              <NavLink
                key={to}
                to={to}
                end
                className={({ isActive }) =>
                  `flex min-h-11 items-center gap-3 rounded-md px-4 text-sm font-medium transition-colors ${isActive ? 'bg-primary-soft text-primary' : 'text-muted-foreground hover:bg-muted hover:text-foreground'}`
                }
              >
                <Icon size={18} strokeWidth={1.8} />
                {label}
              </NavLink>
            ),
          )}
        </nav>
        <div className="mt-auto border-t border-border px-7 py-6 text-xs leading-relaxed text-muted-foreground">
          Uma operação mais clara,
          <br />
          todos os dias.
        </div>
      </aside>
      <div className="min-w-0">
        <header className="flex h-16 items-center justify-between gap-2 border-b border-border bg-surface px-4 sm:px-8 lg:h-20 lg:px-10">
          <NavLink
            to="/"
            className="flex items-center gap-2.5 font-bold tracking-tight lg:hidden"
            aria-label="GestorFlow, voltar ao início"
          >
            <span className="flex size-8 items-center justify-center rounded-md bg-primary text-white">
              <ClipboardList size={17} />
            </span>
            GestorFlow
          </NavLink>
          <span className="hidden text-sm text-muted-foreground lg:block">
            Seu espaço de trabalho
          </span>
          <span className="rounded-full border border-border bg-white px-2 py-1.5 text-xs font-medium text-primary sm:px-3">
            <span className="sm:hidden">
              {mode === 'demo' ? 'Demo' : 'Conta'}
            </span>
            <span className="hidden sm:inline">
              {mode === 'demo' ? 'Ambiente de demonstração' : 'Conta pessoal'}
            </span>
          </span>
          <Button
            variant="outline"
            onClick={() => {
              void leave()
            }}
          >
            Sair
          </Button>
        </header>
        <main
          id="conteudo"
          className="mx-auto max-w-[1260px] px-5 pb-28 pt-8 sm:px-8 lg:px-10 lg:pb-12 lg:pt-10"
        >
          <Outlet />
        </main>
      </div>
      <nav
        aria-label="Navegação mobile"
        className="fixed inset-x-0 bottom-0 z-20 grid grid-cols-3 border-t border-border bg-surface/95 px-2 pb-[env(safe-area-inset-bottom)] backdrop-blur-sm lg:hidden"
      >
        {links.map(({ mobile, to, icon: Icon, disabled }) =>
          disabled ? (
            <span
              key={to}
              className="flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] text-muted-foreground/70"
              aria-label={`${mobile}, em breve`}
            >
              <Icon size={19} strokeWidth={1.8} />
              {mobile}
            </span>
          ) : (
            <NavLink
              key={to}
              to={to}
              end
              className={({ isActive }) =>
                `flex min-h-16 flex-col items-center justify-center gap-1 text-[11px] font-medium ${isActive ? 'text-primary' : 'text-muted-foreground'}`
              }
            >
              <Icon size={19} strokeWidth={1.8} />
              {mobile}
            </NavLink>
          ),
        )}
      </nav>
    </div>
  )
}
