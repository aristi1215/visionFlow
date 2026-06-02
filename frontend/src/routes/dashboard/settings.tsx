import { createFileRoute } from '@tanstack/react-router'
import { useSetDashboardHeader } from '@/contexts/dashboardHeaderContext'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui'

export const Route = createFileRoute('/dashboard/settings')({
  component: SettingsPage,
})

function SettingsPage() {
  useSetDashboardHeader({ title: 'Settings', subtitle: 'Account' })

  return (
    <Card className="max-w-lg">
      <CardHeader>
        <CardTitle>Account</CardTitle>
        <CardDescription>
          Your account is managed by Clerk. Use the profile button in the header
          to update your profile or sign out.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground">
          Additional settings will be available in a future release.
        </p>
      </CardContent>
    </Card>
  )
}
