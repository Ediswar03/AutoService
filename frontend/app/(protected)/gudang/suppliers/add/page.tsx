'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { GudangHeader } from '@/components/gudang/gudang-header'
import { api } from '@/lib/api-client'
import { toast } from 'sonner'
import Link from 'next/link'

export default function AddSupplierPage() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    code: '',
    name: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    paymentTerms: 30,
    notes: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await api.post('/inventory/suppliers', formData)
      toast.success('Supplier berhasil ditambahkan!')
      router.push('/gudang/suppliers')
    } catch (error) {
      console.error(error)
      toast.error('Gagal menambahkan supplier. Periksa validasi data.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <GudangHeader title="Tambah Supplier" description="Daftarkan mitra pemasok baru" />
      <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
        <div className="mx-auto max-w-2xl">
          <Button variant="ghost" className="mb-4" asChild>
            <Link href="/gudang/suppliers">
              <ArrowLeft className="mr-2 size-4" />
              Kembali ke Daftar Supplier
            </Link>
          </Button>

          <form onSubmit={handleSubmit}>
            <Card className="shadow-sm border-slate-200">
              <CardHeader>
                <CardTitle>Profil Supplier</CardTitle>
                <CardDescription>Informasi detail mengenai perusahaan pemasok</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="code">Kode Supplier</Label>
                    <Input 
                      id="code" 
                      placeholder="Contoh: SUP-001" 
                      value={formData.code}
                      onChange={e => setFormData({...formData, code: e.target.value})}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="name">Nama Perusahaan</Label>
                    <Input 
                      id="name" 
                      placeholder="Contoh: PT. Suku Cadang Indonesia" 
                      value={formData.name}
                      onChange={e => setFormData({...formData, name: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="contactPerson">Contact Person</Label>
                    <Input 
                      id="contactPerson" 
                      placeholder="Contoh: Budi Santoso" 
                      value={formData.contactPerson}
                      onChange={e => setFormData({...formData, contactPerson: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="paymentTerms">Tempo Pembayaran (Hari)</Label>
                    <Input 
                      id="paymentTerms" 
                      type="number" 
                      value={formData.paymentTerms}
                      onChange={e => setFormData({...formData, paymentTerms: parseInt(e.target.value) || 0})}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input 
                      id="email" 
                      type="email" 
                      placeholder="supplier@example.com" 
                      value={formData.email}
                      onChange={e => setFormData({...formData, email: e.target.value})}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Nomor Telepon</Label>
                    <Input 
                      id="phone" 
                      placeholder="021-xxxxxxx atau 081xxxxxxx" 
                      value={formData.phone}
                      onChange={e => setFormData({...formData, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Alamat Kantor</Label>
                  <Textarea 
                    id="address" 
                    placeholder="Alamat lengkap supplier..." 
                    value={formData.address}
                    onChange={e => setFormData({...formData, address: e.target.value})}
                    required
                  />
                </div>
              </CardContent>
            </Card>

            <div className="mt-6 flex justify-end gap-3">
              <Button variant="outline" type="button" onClick={() => router.back()}>
                Batal
              </Button>
              <Button className="bg-[#FFC107] hover:bg-[#e0a800] text-slate-900 font-bold" disabled={isLoading}>
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Simpan Supplier
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </>
  )
}
