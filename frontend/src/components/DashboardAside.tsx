import { Link } from '@tanstack/react-router'
import { Home, Network, PanelLeftClose, Settings2 } from 'lucide-react'

import { Button } from '@/components/ui'
import { useDashboardSidebar } from '@/contexts/dashboardSidebarContext'
import { cn } from '@/lib/cn'

const navItems = [
  { label: 'Overview', to: '/dashboard' as const, icon: Home },
  { label: 'Workflows', to: '/dashboard/workflows' as const, icon: Network },
  { label: 'Settings', to: '/dashboard/settings' as const, icon: Settings2 },
]

type DashboardAsideProps = {
  className?: string
}

export function DashboardAside({ className }: DashboardAsideProps) {
  const { isOpen, toggle } = useDashboardSidebar()

  return (
    <aside
      className={cn(
        'flex h-screen shrink-0 flex-col border-r border-sidebar-border bg-sidebar text-sidebar-foreground transition-[width] duration-200 ease-in-out',
        isOpen ? 'w-64' : 'w-0 overflow-hidden border-r-0',
        className,
      )}
    >
      <div className="flex w-64 shrink-0 flex-col">
        <div className="flex items-start justify-between border-b border-sidebar-border px-6 py-5">
          <div>
            <h3 className="text-xl font-display uppercase tracking-wider text-sidebar-foreground">
              Vision Flow 
            </h3>
            <p className="mt-0.5 text-xs text-sidebar-foreground/60">
              Video workflow AI
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            aria-label="Hide sidebar"
            title="Hide sidebar"
            className="shrink-0 text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-1 p-4">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-sidebar-foreground/80 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground"
                activeProps={{
                  className:
                    'flex items-center gap-3 rounded-lg bg-sidebar-accent px-3 py-2.5 text-sm font-medium text-orange-400',
                }}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border p-4">
          <div className="rounded-lg bg-sidebar-accent p-3">
            <p className="text-xs uppercase tracking-wider text-brown-400">
              Workflows
            </p>
            <p className="mt-1 text-sm text-sidebar-foreground/90">
              Build video analysis pipelines visually
            </p>
          </div>
        </div>
      </div>
    </aside>
  )
}
