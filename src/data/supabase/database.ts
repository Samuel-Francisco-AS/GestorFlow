export type CustomerRow = {
  id: string
  owner_id: string
  name: string
  phone: string
  email: string
  notes: string
  created_at: string
  updated_at: string
}
export type WorkOrderRow = {
  id: string
  owner_id: string
  customer_id: string
  order_number: number
  order_code: string
  title: string
  description: string
  value_cents: number
  status: 'new' | 'in_progress' | 'waiting' | 'completed'
  service_date: string
  notes: string
  created_at: string
  updated_at: string
}
export type Database = {
  public: {
    Tables: {
      customers: {
        Row: CustomerRow
        Insert: Pick<CustomerRow, 'name'> &
          Partial<Pick<CustomerRow, 'phone' | 'email' | 'notes'>>
        Update: Partial<Pick<CustomerRow, 'name' | 'phone' | 'email' | 'notes'>>
        Relationships: []
      }
      work_orders: {
        Row: WorkOrderRow
        Insert: Pick<WorkOrderRow, 'customer_id' | 'title' | 'service_date'> &
          Partial<
            Pick<
              WorkOrderRow,
              'description' | 'value_cents' | 'status' | 'notes'
            >
          >
        Update: Partial<
          Pick<
            WorkOrderRow,
            | 'customer_id'
            | 'title'
            | 'description'
            | 'value_cents'
            | 'status'
            | 'service_date'
            | 'notes'
          >
        >
        Relationships: []
      }
    }
    Views: Record<string, never>
    Functions: Record<string, never>
    Enums: Record<string, never>
    CompositeTypes: Record<string, never>
  }
}
