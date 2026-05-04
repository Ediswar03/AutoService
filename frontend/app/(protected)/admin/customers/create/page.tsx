'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CustomerForm } from '@/components/admin/CustomerForm'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { useApiMutation, invalidateCache } from '@/hooks/useApi'
import { cn } from '@/lib/utils'
import type { CustomerFormData, Customer } from '@/types'

export default function CreateCustomerPage() {
  const router = useRouter()
  const [isClosing, setIsClosing] = React.useState(false)
  const { post, isLoading } = useApiMutation<CustomerFormData, Customer>()

  const handleClose = React.useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      router.back()
    }, 450) // Match animation duration
  }, [router])

  const handleSubmit = async (data: CustomerFormData) => {
    // Map frontend field names to backend field names
    const payload = {
      name: data.nama,
      phone: data.telepon,
      email: data.email || null,
      address: data.alamat,
      customerType: data.tipe === 'perusahaan' ? 'KORPORAT' : 'PRIBADI',
      companyName: data.nama_perusahaan || null,
      taxId: data.npwp || null,
      notes: null,
    }
    await post('/customers', payload as any, {
      onSuccess: () => {
        toast.success('Pelanggan berhasil ditambahkan')
        invalidateCache('/customers')
        handleClose()
      },
      onError: (error) => {
        toast.error(error)
      },
    })
  }

  return (
    <>
      <AdminHeader title="Tambah Pelanggan" description="Lengkapi data pelanggan baru" />
      
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
        "relative w-full max-w-2xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-white/10 flex flex-col transition-transform duration-500 ease-in-out",
        isClosing 
          ? "translate-x-full" 
          : "animate-in slide-in-from-right duration-500"
      )}>
        <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
          <div className="space-y-8">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                  Tambah <span className="text-primary">Pelanggan</span>
                </h2>
                <p className="text-slate-500 text-sm font-medium">
                  Lengkapi data pelanggan baru di bawah ini.
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
              <CustomerForm 
                onSubmit={handleSubmit} 
                isSubmitting={isLoading} 
                onCancel={handleClose} 
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  )
}
