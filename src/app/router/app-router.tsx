import { Route, Routes } from 'react-router'

import { AppLayout } from '@/app/layouts/app-layout'
import { DashboardPage } from '@/features/dashboard/dashboard-page'
import { CustomersPage } from '@/features/customers/pages/customers-page'
import { CustomerDetailPage } from '@/features/customers/pages/customer-detail-page'
import { CustomerFormPage } from '@/features/customers/pages/customer-form-page'
import { NotFoundPage } from '@/app/router/not-found-page'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="clientes" element={<CustomersPage />} />
        <Route
          path="clientes/novo"
          element={<CustomerFormPage mode="create" />}
        />
        <Route path="clientes/:id" element={<CustomerDetailPage />} />
        <Route
          path="clientes/:id/editar"
          element={<CustomerFormPage mode="edit" />}
        />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
