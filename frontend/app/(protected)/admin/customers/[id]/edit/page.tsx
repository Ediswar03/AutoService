'use client'

import { useRouter } from 'next/navigation'
import { toast } from 'sonner'
import { ArrowLeft, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { CustomerForm } from '@/components/admin/CustomerForm'
import { api, fetcher } from '@/lib/api-client'
import useSWR from 'swr'
import type { CustomerFormData } from '@/types'

export default function EditCustomerPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const { id } = params

  // Fetch customer data
  const { data: rawData, isLoading } = useSWR(`/customers/${id}`, fetcher)
  const customer = rawData?.data ?? rawData

  // Map backend fields → frontend form fields
  const initialData = customer
    ? {
        nama:            customer.name          ?? '',
        alamat:          customer.address        ?? '',
        telepon:         customer.phone          ?? '',
        email:           customer.email          ?? '',
        nik:             customer.taxId          ?? '',
        tipe:            customer.customerType === 'KORPORAT' ? 'perusahaan' : 'individu' as const,
        nama_perusahaan: customer.companyName    ?? '',
        npwp:            customer.taxId          ?? '',
      }
    : undefined

  const handleSubmit = async (data: CustomerFormData) => {
    // Map frontend fields → backend fields
    const payload = {
      name:         data.nama,
      phone:        data.telepon,
      email:        data.email    || null,
      address:      data.alamat,
      customerType: data.tipe === 'perusahaan' ? 'KORPORAT' : 'PRIBADI',
      companyName:  data.nama_perusahaan || null,
      taxId:        data.npwp           || null,
    }

    try {
      await api.put(`/customers/${id}`, payload)
      toast.success('Data pelanggan berhasil diperbarui')
      router.push('/admin/customers')
    } catch (error: any) {
      const msg =
        error?.response?.data?.message || 'Gagal memperbarui data pelanggan'
      toast.error(msg)
    }
  }

  if (isLoading) {
    return (
      <div className="flex h-48 items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
      </div>
    )
  }

  if (!customer) {
    return (
      <div className="flex h-48 items-center justify-center text-muted-foreground">
        Pelanggan tidak ditemukan
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
          <h2 className="text-2xl font-bold tracking-tight">Edit Pelanggan</h2>
          <p className="text-muted-foreground">
            Ubah data pelanggan <span className="font-semibold">{customer.name}</span>
          </p>
        </div>
      </div>

      <CustomerForm
        initialData={initialData as any}
        onSubmit={handleSubmit}
      />
    </div>
  )
}
