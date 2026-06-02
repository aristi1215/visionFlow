import { useAuth, UserButton } from '@clerk/react'
import { Navigate, createFileRoute, Outlet, useMatches } from '@tanstack/react-router'
import { PanelLeft } from 'lucide-react'
import { useEffect } from 'react'
import { DashboardAside } from '@/components/DashboardAside'
import { ApiAuthBridge } from '@/components/ApiAuthBridge'
import { Button, ThemeToggle } from '@/components/ui'
import {
  DashboardHeaderProvider,
  useDashboardHeader,
} from '@/contexts/dashboardHeaderContext'
import {
  DashboardSidebarProvider,
  useDashboardSidebar,
} from '@/contexts/dashboardSidebarContext'

export const Route = createFileRoute('/dashboard')({
  component: DashboardLayout,
})

function DashboardLayout() {
  const { isLoaded, isSignedIn } = useAuth()

  if (!isLoaded) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background">
        <p className="text-sm text-muted-foreground">Loading…</p>
      </div>
    )
  }

  if (!isSignedIn) {
    return <Navigate to="/sign-in" />
  }

  return (
    <DashboardHeaderProvider>
      <DashboardSidebarProvider>
        <ApiAuthBridge />
        <DashboardShell />
      </DashboardSidebarProvider>
    </DashboardHeaderProvider>
  )
}

function DashboardShell() {
  const { header } = useDashboardHeader()
  const { isOpen, setIsOpen } = useDashboardSidebar()
  const matches = useMatches()
  const isFullBleed = matches.some(
    (m) => (m.staticData as { fullBleed?: boolean })?.fullBleed,
  )
  const isWorkflowEditor = matches.some(
    (m) => m.routeId === '/dashboard/workflows/$workflowId',
  )

  useEffect(() => {
    setIsOpen(!isWorkflowEditor)
  }, [isWorkflowEditor, setIsOpen])

  return (
    <div className="flex h-screen min-h-0 bg-background">
      <DashboardAside />
      <div className="flex min-h-0 flex-1 flex-col">
        <header className="flex h-16 shrink-0 items-center justify-between border-b border-border bg-card px-6">
          <div className="flex items-center gap-3">
            {!isOpen ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(true)}
                aria-label="Show sidebar"
                title="Show sidebar"
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            ) : null}
            <div>
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {header.subtitle}
              </p>
              <h1 className="font-display text-lg text-foreground">{header.title}</h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <UserButton />
          </div>
        </header>
        <main
          className={
            isFullBleed
              ? 'flex min-h-0 flex-1 flex-col overflow-hidden'
              : 'flex-1 overflow-auto p-6'
          }
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
