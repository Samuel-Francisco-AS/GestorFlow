import {
  workOrderStatusLabel,
  type WorkOrder,
  type WorkOrderStatus,
} from '@/features/work-orders/model'
import { localDate } from '@/shared/lib/local-date'

export type DemoOrderStatus = WorkOrderStatus

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

const demoOrderTemplates: Omit<WorkOrder, 'date'>[] = [
  {
    id: 'demo-order-1048',
    code: 'OS-1048',
    customerId: 'marina',
    title: 'Identidade visual',
    description:
      'Criação de identidade visual para materiais digitais e impressos.',
    notes: 'Apresentar propostas iniciais na próxima reunião.',
    status: 'in_progress',
    value: 1850,
  },
  {
    id: 'demo-order-1047',
    code: 'OS-1047',
    customerId: 'aurora',
    title: 'Manutenção de equipamentos',
    description: 'Revisão preventiva dos equipamentos do café.',
    notes: 'Aguardando confirmação de horário.',
    status: 'waiting',
    value: 640,
  },
  {
    id: 'demo-order-1046',
    code: 'OS-1046',
    customerId: 'joao',
    title: 'Instalação de rede',
    description: 'Instalação e configuração da rede do escritório.',
    notes: '',
    status: 'in_progress',
    value: 980,
  },
  {
    id: 'demo-order-1045',
    code: 'OS-1045',
    customerId: 'estrela',
    title: 'Atualização do site',
    description: 'Atualização das páginas de serviços e contato.',
    notes: '',
    status: 'completed',
    value: 2200,
  },
  {
    id: 'demo-order-1044',
    code: 'OS-1044',
    customerId: 'ana',
    title: 'Material de divulgação',
    description: 'Produção de peças para divulgação da nova campanha.',
    notes: '',
    status: 'completed',
    value: 760,
  },
  {
    id: 'demo-order-1043',
    code: 'OS-1043',
    customerId: 'ana',
    title: 'Revisão de peças digitais',
    description: 'Ajustes nas peças digitais existentes.',
    notes: 'Aguardando retorno sobre as versões enviadas.',
    status: 'waiting',
    value: 420,
  },
]

const demoDayOffsets = [0, 2, 4, 8, 13, 17]

export function createDemoOrders(referenceDate: Date): WorkOrder[] {
  return demoOrderTemplates.map((order, index) => ({
    ...order,
    date: localDate(
      new Date(
        referenceDate.getFullYear(),
        referenceDate.getMonth(),
        Math.max(1, referenceDate.getDate() - demoDayOffsets[index]),
      ),
    ),
  }))
}

export const demoOrders = createDemoOrders(new Date())

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

export const orderStatusLabel = workOrderStatusLabel
