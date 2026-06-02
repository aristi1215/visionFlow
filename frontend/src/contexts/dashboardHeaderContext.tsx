import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from 'react'

type DashboardHeaderState = {
  title: string
  subtitle: string
}

const defaultHeader: DashboardHeaderState = {
  title: 'Dashboard',
  subtitle: 'Overview',
}

const DashboardHeaderContext = createContext<{
  header: DashboardHeaderState
  setHeader: (header: DashboardHeaderState) => void
}>({
  header: defaultHeader,
  setHeader: () => {},
})

export function DashboardHeaderProvider({ children }: { children: ReactNode }) {
  const [header, setHeader] = useState(defaultHeader)

  return (
    <DashboardHeaderContext.Provider value={{ header, setHeader }}>
      {children}
    </DashboardHeaderContext.Provider>
  )
}

export function useDashboardHeader() {
  return useContext(DashboardHeaderContext)
}

export function useSetDashboardHeader(header: DashboardHeaderState) {
  const { setHeader } = useDashboardHeader()

  useEffect(() => {
    setHeader(header)
    return () => setHeader(defaultHeader)
  }, [header.subtitle, header.title, setHeader])
}
