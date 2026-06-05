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
        <div className="h-5 w-5 animate-spin rounded-full border-2 border-primary border-t-transparent" />
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
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border/50 bg-background/80 px-6 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            {!isOpen ? (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(true)}
                aria-label="Show sidebar"
                title="Show sidebar"
                className="h-8 w-8 px-0"
              >
                <PanelLeft className="h-4 w-4" />
              </Button>
            ) : null}
            <h1 className="text-lg font-medium text-foreground">{header.title}</h1>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <UserButton />
          </div>
        </header>
        <main
          className={
            isFullBleed
              ? 'flex min-h-0 flex-1 flex-col overflow-hidden'
              : 'mx-auto w-full max-w-7xl flex-1 overflow-auto p-8'
          }
        >
          <Outlet />
        </main>
      </div>
    </div>
  )
}
