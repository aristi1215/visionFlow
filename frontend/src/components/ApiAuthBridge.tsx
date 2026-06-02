import { useEffect } from 'react'
import { useAuth } from '@clerk/react'
import { setApiTokenGetter } from '@/lib/api/client'

export function ApiAuthBridge() {
  const { getToken, isLoaded } = useAuth()

  useEffect(() => {
    if (!isLoaded) return
    setApiTokenGetter(() => getToken())
  }, [getToken, isLoaded])

  return null
}
