import { Route, Routes } from 'react-router'

import { AppLayout } from '@/app/layouts/app-layout'
import { DashboardPage } from '@/features/dashboard/dashboard-page'
import { NotFoundPage } from '@/app/router/not-found-page'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<DashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
