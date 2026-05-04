'use client'

import * as React from 'react'
import { usePathname } from 'next/navigation'
import { ThemeProvider } from '@/components/theme-provider'
import { useAuth } from '@/hooks/useAuth'

export function RootThemeProvider({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const { user } = useAuth()
  
  // Determine storage key based on the module and user
  const storageKey = React.useMemo(() => {
    let module = 'default'
    if (pathname.startsWith('/admin')) module = 'admin'
    else if (pathname.startsWith('/mekanik')) module = 'mekanik'
    else if (pathname.startsWith('/gudang')) module = 'gudang'
    else if (pathname.startsWith('/pimpinan')) module = 'pimpinan'
    
    // Include user ID to support per-user themes
    if (user?.id) {
      return `theme-user-${user.id}-${module}`
    }
    
    return `theme-${module}`
  }, [pathname, user?.id])

  return (
    <ThemeProvider
      attribute="class"
      defaultTheme="light"
      enableSystem
      storageKey={storageKey}
      disableTransitionOnChange
    >
      {children}
    </ThemeProvider>
  )
}
