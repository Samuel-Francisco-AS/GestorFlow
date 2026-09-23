import { Outlet } from 'react-router'

export function AppLayout() {
  return (
    <div className="min-h-svh bg-background">
      <Outlet />
    </div>
  )
}
