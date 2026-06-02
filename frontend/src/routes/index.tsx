import { Link } from '@tanstack/react-router'
import { Badge, Button, ThemeToggle } from '@/components/ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-card">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
              OnDeck
            </p>
            <h1 className="font-display text-2xl text-foreground">
              Workflows
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Link
              to="/dashboard"
              className="inline-flex h-10 items-center justify-center rounded-lg bg-primary px-4 text-sm font-medium tracking-wide text-primary-foreground shadow-sm transition-colors hover:bg-orange-600"
            >
              Open dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-6 py-16">
        <div className="max-w-3xl space-y-6">
          <Badge variant="brown">Enterprise logistics</Badge>
          <h2 className="font-display text-5xl leading-tight text-foreground">
            Your last logistics hire, built for operators.
          </h2>
          <p className="text-lg text-muted-foreground">
            An elegant, enterprise-grade platform inspired by Cartage — warm
            tones, confident typography, and full dark mode support.
          </p>
          <div className="flex flex-wrap gap-3 pt-2">
            <Link to="/sign-in">
              <Button size="lg">Get started</Button>
            </Link>
            <Link to="/dashboard">
              <Button variant="outline" size="lg">
                Open dashboard
              </Button>
            </Link>
          </div>
        </div>

        <section className="mt-16 grid gap-4 sm:grid-cols-3">
          {[
            { title: 'Operator', desc: 'Always on — email, calls, and ERP.' },
            { title: 'Concierge', desc: 'Carriers, customers, and follow-ups.' },
            { title: 'Architect', desc: 'Lane intelligence that improves weekly.' },
          ].map((item) => (
            <div
              key={item.title}
              className="rounded-xl border border-border bg-card p-6 shadow-sm"
            >
              <Badge variant="orange" className="mb-3">
                {item.title}
              </Badge>
              <p className="text-sm text-muted-foreground">{item.desc}</p>
            </div>
          ))}
        </section>
      </main>
    </div>
  )
}
