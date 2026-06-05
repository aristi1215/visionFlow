import { Link } from '@tanstack/react-router'
import { ArrowRight, Brain, Network, Video } from 'lucide-react'
import { Badge, Button, ThemeToggle } from '@/components/ui'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: RouteComponent,
})

const features = [
  {
    icon: Video,
    title: 'Upload & analyze',
    desc: 'Drop in video files and let AI extract insights automatically.',
  },
  {
    icon: Network,
    title: 'Visual workflows',
    desc: 'Build analysis pipelines on a drag-and-drop canvas.',
  },
  {
    icon: Brain,
    title: 'AI-powered nodes',
    desc: 'Object detection, timelines, alerts — all connected visually.',
  },
]

function RouteComponent() {
  return (
    <div className="min-h-screen bg-background">
      <div
        className="pointer-events-none fixed inset-0"
        style={{ background: 'var(--gradient-hero)' }}
        aria-hidden
      />

      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary text-xs font-bold text-primary-foreground">
              VF
            </div>
            <span className="text-sm font-semibold tracking-tight">Vision Flow</span>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link to="/sign-in">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link to="/dashboard">
              <Button size="sm">
                Open dashboard
                <ArrowRight className="h-3.5 w-3.5" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="relative mx-auto max-w-6xl px-6">
        <section className="py-24 md:py-32">
          <div className="max-w-3xl space-y-6 animate-in">
            <Badge>Video workflow AI</Badge>
            <h1 className="text-5xl font-semibold tracking-tight text-foreground md:text-6xl">
              Analyze video with{' '}
              <span className="bg-gradient-to-r from-primary to-violet-500 bg-clip-text text-transparent">
                visual workflows
              </span>
            </h1>
            <p className="max-w-xl text-lg text-muted-foreground">
              Vision Flow lets you build AI-powered video analysis pipelines —
              upload, detect, timeline, and alert — all from an elegant visual canvas.
            </p>
            <div className="flex flex-wrap gap-3 pt-2">
              <Link to="/sign-in">
                <Button size="lg">
                  Get started
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link to="/dashboard">
                <Button variant="outline" size="lg">Open dashboard</Button>
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-4 pb-24 sm:grid-cols-3">
          {features.map((item, i) => {
            const Icon = item.icon
            return (
              <div
                key={item.title}
                className="group rounded-xl border border-border/50 bg-card/60 p-6 backdrop-blur-sm transition-all duration-200 hover:border-primary/30 hover-lift animate-in"
                style={{ animationDelay: `${i * 80}ms` }}
              >
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors group-hover:bg-primary/15">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="text-base font-semibold text-foreground">{item.title}</h3>
                <p className="mt-1.5 text-sm text-muted-foreground">{item.desc}</p>
              </div>
            )
          })}
        </section>
      </main>
    </div>
  )
}
