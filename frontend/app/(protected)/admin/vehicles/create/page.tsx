'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { VehicleForm } from '@/components/admin/VehicleForm'
import { api } from '@/lib/api-client'
import useSWR from 'swr'
import { fetcher } from '@/lib/api-client'

export default function CreateVehiclePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const editId = searchParams.get('edit')

  // Fetch existing vehicle data for edit mode
  const { data: vehicleData, isLoading: isLoadingVehicle } = useSWR(
    editId ? `/vehicles/${editId}` : null,
    fetcher
  )

  // Backend returns { data: { ... } } wrapped in ApiResponse
  const initialData = vehicleData?.data ?? vehicleData ?? undefined

  const handleSubmit = async (data: any) => {
    try {
      if (editId) {
        await api.put(`/vehicles/${editId}`, data)
        toast.success('Kendaraan berhasil diperbarui')
      } else {
        await api.post('/vehicles', data)
        toast.success('Kendaraan berhasil ditambahkan')
      }
      router.push('/admin/vehicles')
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
    <div className="space-y-6 p-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={() => router.back()}>
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div>
          <h2 className="text-2xl font-bold tracking-tight">
            {editId ? 'Edit Kendaraan' : 'Tambah Kendaraan'}
          </h2>
          <p className="text-muted-foreground">
            {editId ? 'Ubah informasi kendaraan' : 'Daftarkan kendaraan baru ke sistem'}
          </p>
        </div>
      </div>

      <VehicleForm
        initialData={initialData}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
