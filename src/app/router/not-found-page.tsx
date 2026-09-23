import { Link } from 'react-router'

import { Button } from '@/shared/ui/button'

export function NotFoundPage() {
  return (
    <main className="mx-auto flex min-h-svh max-w-content flex-col items-start justify-center gap-5 px-page">
      <span className="text-sm font-semibold text-primary">
        404 · GestorFlow
      </span>
      <h1 className="font-display text-5xl tracking-tight">
        Página não encontrada
      </h1>
      <p className="max-w-md text-muted-foreground">
        O endereço informado não corresponde a uma página disponível.
      </p>
      <Button asChild>
        <Link to="/">Voltar ao início</Link>
      </Button>
    </main>
  )
}
