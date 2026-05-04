'use client'

import React from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VehicleForm } from '@/components/admin/VehicleForm'
import { AdminHeader } from '@/components/admin/AdminHeader'
import { api } from '@/lib/api-client'
import { cn } from '@/lib/utils'
import useSWR from 'swr'
import { fetcher } from '@/lib/api-client'

export default function CreateVehiclePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')
  const [isClosing, setIsClosing] = React.useState(false)

  // Fetch existing vehicle data for edit mode
  const { data: vehicleData, isLoading: isLoadingVehicle } = useSWR(
    editId ? `/vehicles/${editId}` : null,
    fetcher
  )

  // Backend returns { data: { ... } } wrapped in ApiResponse
  const initialData = vehicleData?.data ?? vehicleData ?? undefined

  const handleClose = React.useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      router.back()
    }, 450)
  }, [router])

  const handleSubmit = async (data: any) => {
    try {
      if (editId) {
        await api.put(`/vehicles/${editId}`, data)
        toast.success('Kendaraan berhasil diperbarui')
      } else {
        await api.post('/vehicles', data)
        toast.success('Kendaraan berhasil ditambahkan')
      }
      handleClose()
    } catch (error: any) {
      const msg =
        error?.response?.data?.message ||
        error?.response?.data?.errors?.[0]?.message ||
        'Terjadi kesalahan saat menyimpan kendaraan'
      toast.error(msg)
    }
  }

  if (editId && isLoadingVehicle) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  return (
    <>
      <AdminHeader title={editId ? "Edit Kendaraan" : "Tambah Kendaraan"} description={editId ? "Ubah informasi kendaraan" : "Daftarkan kendaraan baru ke sistem"} />
      
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
          <div className="p-8 flex-1 overflow-y-auto">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                    {editId ? 'Edit' : 'Tambah'} <span className="text-primary">Kendaraan</span>
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">
                    {editId ? 'Ubah informasi kendaraan di bawah ini.' : 'Lengkapi data kendaraan baru di bawah ini.'}
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
                <VehicleForm
                  initialData={initialData}
                  onSubmit={handleSubmit}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
