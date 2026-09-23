export type DemoOrderStatus = 'new' | 'in_progress' | 'waiting' | 'completed'

export const demoCustomers = [
  {
    id: 'marina',
    name: 'Marina Albuquerque',
    phone: '(85) 98812-3401',
    email: 'marina@example.com',
    notes: 'Prefere contato pela manhã.',
    createdAt: '2026-07-12',
  },
  {
    id: 'aurora',
    name: 'Café Aurora',
    phone: '(85) 98724-1102',
    email: 'contato@cafeaurora.example',
    notes: 'Atendimento na unidade do Centro.',
    createdAt: '2026-06-18',
  },
  {
    id: 'joao',
    name: 'João Ferreira',
    phone: '(85) 99103-2266',
    email: '',
    notes: '',
    createdAt: '2026-08-03',
  },
  {
    id: 'estrela',
    name: 'Oficina Estrela',
    phone: '(85) 98675-8821',
    email: 'oficina@example.com',
    notes: '',
    createdAt: '2026-05-21',
  },
  {
    id: 'ana',
    name: 'Studio Ana Luz',
    phone: '(85) 99211-7403',
    email: 'ana@example.com',
    notes: 'Contato preferencial por e-mail.',
    createdAt: '2026-08-27',
  },
]

export const demoOrders: {
  id: string
  customerId: string
  title: string
  status: DemoOrderStatus
  value: number
  date: string
}[] = [
  {
    id: 'OS-1048',
    customerId: 'marina',
    title: 'Identidade visual',
    status: 'in_progress',
    value: 1850,
    date: '2026-09-22',
  },
  {
    id: 'OS-1047',
    customerId: 'aurora',
    title: 'Manutenção de equipamentos',
    status: 'waiting',
    value: 640,
    date: '2026-09-20',
  },
  {
    id: 'OS-1046',
    customerId: 'joao',
    title: 'Instalação de rede',
    status: 'in_progress',
    value: 980,
    date: '2026-09-18',
  },
  {
    id: 'OS-1045',
    customerId: 'estrela',
    title: 'Atualização do site',
    status: 'completed',
    value: 2200,
    date: '2026-09-14',
  },
  {
    id: 'OS-1044',
    customerId: 'ana',
    title: 'Material de divulgação',
    status: 'completed',
    value: 760,
    date: '2026-09-09',
  },
  {
    id: 'OS-1043',
    customerId: 'ana',
    title: 'Revisão de peças digitais',
    status: 'waiting',
    value: 420,
    date: '2026-09-05',
  },
]

export const formatCurrency = (value: number) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(
    value,
  )

export const formatDate = (value: string) =>
  new Intl.DateTimeFormat('pt-BR', {
    day: '2-digit',
    month: 'short',
    timeZone: 'UTC',
  }).format(new Date(`${value}T12:00:00Z`))

export const orderStatusLabel: Record<DemoOrderStatus, string> = {
  new: 'Novo',
  in_progress: 'Em andamento',
  waiting: 'Aguardando',
  completed: 'Concluído',
}
