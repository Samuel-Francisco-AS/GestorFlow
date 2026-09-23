import {
  workOrderStatusLabel,
  type WorkOrderStatus,
} from '@/features/work-orders/model'

const styles: Record<WorkOrderStatus, string> = {
  new: 'bg-muted text-foreground',
  in_progress: 'bg-primary-soft text-primary',
  waiting: 'bg-accent-soft text-accent-foreground',
  completed: 'bg-[#e8eee3] text-[#41613e]',
}

export function StatusBadge({ status }: { status: WorkOrderStatus }) {
  return (
    <span
      className={`inline-flex w-fit rounded-sm px-2.5 py-1 text-xs font-semibold ${styles[status]}`}
    >
      {workOrderStatusLabel[status]}
    </span>
  )
}
