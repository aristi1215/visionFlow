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
        isOpen ? 'w-60' : 'w-0 overflow-hidden border-r-0',
        className,
      )}
    >
      <div className="flex w-60 shrink-0 flex-col">
        <div className="flex items-center justify-between px-5 py-4">
          <div>
            <h3 className="text-sm font-semibold tracking-tight text-sidebar-foreground">
              Vision Flow
            </h3>
            <p className="text-xs text-muted-foreground">Video workflow AI</p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={toggle}
            aria-label="Hide sidebar"
            title="Hide sidebar"
            className="h-8 w-8 shrink-0 px-0 text-muted-foreground hover:text-foreground"
          >
            <PanelLeftClose className="h-4 w-4" />
          </Button>
        </div>

        <nav className="flex flex-1 flex-col gap-0.5 px-3 py-2">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.label}
                to={item.to}
                className="flex items-center gap-2.5 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-sidebar-accent hover:text-foreground"
                activeProps={{
                  className:
                    'flex items-center gap-2.5 rounded-lg bg-primary/10 px-3 py-2 text-sm font-medium text-primary',
                }}
              >
                <Icon className="h-4 w-4 shrink-0" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="border-t border-sidebar-border px-5 py-4">
          <p className="text-xs text-muted-foreground">
            Build video analysis pipelines visually
          </p>
        </div>
      </div>
    </aside>
  )
}
