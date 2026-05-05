'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { ThemeProvider } from '@/components/theme-provider'
import { useTheme } from 'next-themes'
import { useAuth } from '@/hooks/useAuth'
import { apiClient } from '@/lib/api-client'

function ThemeSync() {
  const { user } = useAuth()
  const { setTheme, theme } = useTheme()
  
  const hasSynced = React.useRef(false)

  // 1. Initial Sync from backend (only once per user session)
  React.useEffect(() => {
    if (user?.theme && typeof setTheme === 'function' && !hasSynced.current) {
      setTheme(user.theme)
      hasSynced.current = true
    }
  }, [user?.id, user?.theme, setTheme])

  // Reset sync flag if user changes (logout/login)
  React.useEffect(() => {
    if (!user) hasSynced.current = false
  }, [user?.id])

  // 2. Save theme to backend when changed locally
  React.useEffect(() => {
    const saveTheme = async () => {
      if (user && theme && (theme === 'light' || theme === 'dark') && theme !== user.theme) {
        try {
          await apiClient.patch('/auth/profile', { theme })
        } catch (error) {
          console.error('Failed to sync theme to backend', error)
        }
      }
    }
    
    const timer = setTimeout(saveTheme, 1000)
    return () => clearTimeout(timer)
  }, [theme, user?.id, user?.theme])

  return null
}

export function RootThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user } = useAuth()
  
  const storageKey = React.useMemo(() => {
    let moduleName = 'default'
    if (pathname.startsWith('/admin')) moduleName = 'admin'
    else if (pathname.startsWith('/mekanik')) moduleName = 'mekanik'
    else if (pathname.startsWith('/gudang')) moduleName = 'gudang'
    else if (pathname.startsWith('/pimpinan')) moduleName = 'pimpinan'
    
    if (user?.id) {
      return `theme-user-${user.id}-${moduleName}`
    }
    
    return `theme-${moduleName}`
  }, [pathname, user?.id])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      storageKey={storageKey}
      disableTransitionOnChange
    >
      <ThemeSync />
      {children}
    </ThemeProvider>
  )
}
