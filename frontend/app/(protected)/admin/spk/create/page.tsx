'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { SPKForm } from '@/components/admin/SPKForm'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { useApiMutation, invalidateCache } from '@/hooks/useApi'
import { cn } from '@/lib/utils'
import type { SPKFormData, SPK } from '@/types'

export default function CreateSPKPage() {
  const router = useRouter()
  const [isClosing, setIsClosing] = React.useState(false)
  const { post, isLoading } = useApiMutation<SPKFormData, SPK>()

  const handleClose = React.useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      router.back()
    }, 450)
  }, [router])

  const handleSubmit = async (data: SPKFormData) => {
    await post('/work-orders', data, {
      onSuccess: (spk) => {
        toast.success('SPK berhasil dibuat')
        invalidateCache('/work-orders')
        handleClose()
      },
      onError: (error) => {
        toast.error(error)
      },
    })
  }

  return (
    <>
      <AdminHeader title="Buat SPK Baru" description="Surat Perintah Kerja untuk servis kendaraan" />
      
      <div className="absolute top-16 bottom-0 right-0 left-0 z-50 flex justify-end overflow-hidden">
        {/* Backdrop */}
        <div 
          className={cn(
            "absolute inset-0 bg-slate-950/20 backdrop-blur-md transition-opacity duration-500",
            isClosing ? "opacity-0" : "animate-in fade-in"
          )}
          onClick={handleClose}
        />
        
        {/* Drawer Content */}
        <div className={cn(
          "relative w-full max-w-4xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-white/10 flex flex-col transition-transform duration-500 ease-in-out",
          isClosing 
            ? "translate-x-full" 
            : "animate-in slide-in-from-right duration-500"
        )}>
          <div className="p-8 flex-1 overflow-y-auto">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                    Buat <span className="text-primary">SPK</span>
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">
                    Lengkapi data surat perintah kerja di bawah ini.
                  </p>
                </div>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="rounded-full hover:bg-red-500/10 hover:text-red-500 border-slate-200 dark:border-white/10"
                  onClick={handleClose}
                >
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              </div>

              <div className="bg-slate-50 dark:bg-slate-800/50 p-6 rounded-3xl border border-slate-100 dark:border-white/5">
                <SPKForm onSubmit={handleSubmit} isSubmitting={isLoading} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
