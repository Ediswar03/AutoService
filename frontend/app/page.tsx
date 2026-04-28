'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, Wrench, Settings } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export default function HomePage() {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && user) {
        // Redirect based on role
        const routes: Record<string, string> = {
          admin: '/admin',
          kasir: '/admin',
          mekanik: '/mekanik',
          gudang: '/gudang',
          pimpinan: '/pimpinan',
        }
        const role = user.role.toLowerCase()
        router.push(routes[role] || '/admin')
      } else {
        router.push('/login')
      }
    }
  }, [isLoading, isAuthenticated, user, router])

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-muted/30">
      <div className="flex items-center gap-4 mb-6">
        <div className="relative flex items-center justify-center size-12 shrink-0">
          <Settings className="absolute size-12 text-[#FFC107]" />
          <Wrench className="absolute size-[22px] text-white -rotate-45" />
        </div>
        <div className="flex flex-col">
          <span className="text-3xl font-bold leading-tight tracking-tight">
            <span className="text-foreground">AUTO </span>
            <span className="text-[#FFC107]">SERVICE</span>
          </span>
          <span className="text-xs font-bold tracking-[0.4em] text-muted-foreground uppercase leading-none mt-1">Management System</span>
        </div>
      </div>
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
      <p className="mt-4 text-muted-foreground">Memuat aplikasi...</p>
    </div>
  )
}
