import { Route, Routes } from 'react-router'

import { AppLayout } from '@/app/layouts/app-layout'
import { FoundationPage } from '@/app/router/foundation-page'
import { NotFoundPage } from '@/app/router/not-found-page'

export function AppRouter() {
  return (
    <Routes>
      <Route element={<AppLayout />}>
        <Route index element={<FoundationPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
