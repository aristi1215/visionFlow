import { SignIn } from '@clerk/react'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-in')({
  component: SignInPage,
})

function SignInPage() {
  return (
    <div className="relative flex min-h-screen items-center justify-center bg-background p-6">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ background: 'var(--gradient-hero)' }}
        aria-hidden
      />
      <div className="relative animate-in">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-primary text-sm font-bold text-primary-foreground">
            VF
          </div>
          <h1 className="text-xl font-semibold tracking-tight">Sign in to Vision Flow</h1>
          <p className="mt-1 text-sm text-muted-foreground">Video workflow AI</p>
        </div>
        <SignIn
          routing="hash"
          fallbackRedirectUrl="/dashboard"
          forceRedirectUrl="/dashboard"
          appearance={{
            variables: {
              colorPrimary: '#0070f3',
              colorBackground: 'var(--card)',
              colorText: 'var(--foreground)',
              colorInputBackground: 'var(--muted)',
              colorInputText: 'var(--foreground)',
              borderRadius: '0.625rem',
              fontFamily: 'Geist, Inter, ui-sans-serif, system-ui, sans-serif',
            },
            elements: {
              card: 'shadow-xl border border-border/50 backdrop-blur-xl',
              headerTitle: 'hidden',
              headerSubtitle: 'hidden',
            },
          }}
        />
      </div>
    </div>
  )
}
