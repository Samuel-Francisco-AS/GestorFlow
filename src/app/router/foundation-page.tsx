import { ArrowUpRight, Layers3, MoveRight } from 'lucide-react'

import { Badge } from '@/shared/ui/badge'
import { Button } from '@/shared/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/ui/card'
import { Input } from '@/shared/ui/input'
import { Separator } from '@/shared/ui/separator'
import { Skeleton } from '@/shared/ui/skeleton'

export function FoundationPage() {
  return (
    <div className="mx-auto max-w-content px-page">
      <header className="flex min-h-20 items-center justify-between gap-4 border-b border-border">
        <div className="flex items-center gap-3 font-semibold tracking-tight">
          <span
            className="flex size-9 items-center justify-center rounded-md bg-primary text-primary-foreground"
            aria-hidden="true"
          >
            <Layers3 className="size-5" strokeWidth={1.8} />
          </span>
          GestorFlow
        </div>
        <Badge variant="outline">GF-0 · Fundação</Badge>
      </header>

      <main className="grid gap-12 py-12 md:grid-cols-[minmax(0,1.1fr)_minmax(18rem,0.9fr)] md:items-center md:gap-16 md:py-20">
        <section className="max-w-2xl">
          <Badge variant="warm">Base técnica em revisão</Badge>
          <h1 className="mt-6 max-w-xl font-display text-5xl leading-[1.08] tracking-tight md:text-6xl">
            Uma base para trabalhar melhor.
          </h1>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-muted-foreground">
            O GestorFlow começa com uma linguagem clara, componentes essenciais
            e espaço para a operação ganhar forma.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-3">
            <Button type="button">
              Botão principal <MoveRight aria-hidden="true" />
            </Button>
            <Button type="button" variant="outline">
              Ação secundária <ArrowUpRight aria-hidden="true" />
            </Button>
          </div>
          <p className="mt-5 text-sm text-muted-foreground">
            Superfície temporária para verificar a fundação visual.
          </p>
        </section>

        <Card className="shadow-soft">
          <CardHeader>
            <div className="mb-4 flex items-center justify-between gap-4">
              <Badge>Componentes prontos</Badge>
              <span className="text-xs font-medium text-muted-foreground">
                01 / Fundação
              </span>
            </div>
            <CardTitle>Elementos de interface</CardTitle>
            <CardDescription>
              Uma amostra dos primitives disponíveis para o próximo passo.
            </CardDescription>
          </CardHeader>
          <Separator />
          <CardContent className="space-y-6 pt-6">
            <div className="space-y-2">
              <label htmlFor="foundation-input" className="text-sm font-medium">
                Campo de exemplo
              </label>
              <Input
                id="foundation-input"
                placeholder="Digite para testar o foco"
              />
            </div>
            <div className="flex flex-wrap gap-2">
              <Badge>Em andamento</Badge>
              <Badge variant="warm">Atenção</Badge>
              <Badge variant="outline">Neutro</Badge>
            </div>
            <Separator />
            <div className="space-y-3" aria-label="Exemplo de carregamento">
              <Skeleton className="h-3 w-2/3" />
              <Skeleton className="h-3 w-full" />
              <Skeleton className="h-3 w-4/5" />
            </div>
          </CardContent>
        </Card>
      </main>

      <footer className="flex flex-wrap justify-between gap-3 border-t border-border py-6 text-xs text-muted-foreground">
        <span>GestorFlow · organização com clareza</span>
        <span>React · Vite · Tailwind CSS</span>
      </footer>
    </div>
  )
}
