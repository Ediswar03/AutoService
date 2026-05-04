'use client'

import React, { useState } from 'react'
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
import { cn } from '@/lib/utils'

export default function AddSupplierPage() {
  const router = useRouter()
  const [isClosing, setIsClosing] = React.useState(false)
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

  const handleClose = React.useCallback(() => {
    setIsClosing(true)
    setTimeout(() => {
      router.back()
    }, 450)
  }, [router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    try {
      await api.post('/inventory/suppliers', formData)
      toast.success('Supplier berhasil ditambahkan!')
      handleClose()
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
                    Tambah <span className="text-primary">Supplier</span>
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">
                    Lengkapi data pemasok baru di bawah ini.
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
                <form onSubmit={handleSubmit}>
                  <Card className="shadow-sm border-slate-200 dark:border-white/5">
                    <CardHeader>
                      <CardTitle>Profil Supplier</CardTitle>
                      <CardDescription>Informasi detail mengenai perusahaan pemasok</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="code">Kode Supplier</Label>
                          <Input id="code" placeholder="Contoh: SUP-001" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="name">Nama Perusahaan</Label>
                          <Input id="name" placeholder="Contoh: PT. Suku Cadang Indonesia" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="contactPerson">Contact Person</Label>
                          <Input id="contactPerson" placeholder="Contoh: Budi Santoso" value={formData.contactPerson} onChange={e => setFormData({...formData, contactPerson: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="paymentTerms">Tempo Pembayaran (Hari)</Label>
                          <Input id="paymentTerms" type="number" value={formData.paymentTerms} onChange={e => setFormData({...formData, paymentTerms: parseInt(e.target.value) || 0})} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="email">Email</Label>
                          <Input id="email" type="email" placeholder="supplier@example.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="phone">Nomor Telepon</Label>
                          <Input id="phone" placeholder="021-xxxxxxx atau 081xxxxxxx" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="address">Alamat Kantor</Label>
                        <Textarea id="address" placeholder="Alamat lengkap supplier..." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
                      </div>
                    </CardContent>
                  </Card>

                  <div className="mt-6 flex justify-end gap-3">
                    <Button variant="outline" type="button" onClick={handleClose}>
                      Batal
                    </Button>
                    <Button className="bg-orange-500 hover:bg-orange-600 text-white border-none shadow-sm" disabled={isLoading}>
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
          </div>
        </div>
      </div>
    </>
  )
}
