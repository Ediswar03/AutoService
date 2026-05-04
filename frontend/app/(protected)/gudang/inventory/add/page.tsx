'use client'

import React, { useState } from 'react'
import { useRouter } from 'next/navigation'
import { ArrowLeft, Save, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { GudangHeader } from '@/components/gudang/gudang-header'
import { api } from '@/lib/api-client'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'

export default function AddInventoryPage() {
  const router = useRouter()
  const [isClosing, setIsClosing] = React.useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'LAINNYA',
    description: '',
    brand: '',
    stockQuantity: 0,
    minStock: 5,
    maxStock: 100,
    buyPrice: 0,
    sellPrice: 0,
    location: '',
    unit: 'PCS',
    supplierId: null as string | null
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
      const payload = {
        nama: formData.name,
        kode: formData.code,
        category: formData.category,
        deskripsi: formData.description,
        brand: formData.brand,
        stok: formData.stockQuantity,
        stok_minimum: formData.minStock,
        max_stock: formData.maxStock,
        harga_beli: formData.buyPrice,
        harga_jual: formData.sellPrice,
        lokasi_rak: formData.location,
        satuan: formData.unit,
        supplier_id: formData.supplierId ? parseInt(formData.supplierId) : null
      }
      await api.post('/inventory/spareparts', payload)
      toast.success('Suku cadang berhasil ditambahkan!')
      handleClose()
    } catch (error) {
      console.error(error)
      toast.error('Gagal menambahkan suku cadang. Periksa validasi data.')
    } finally {
      setIsLoading(false)
    }
  }

  const categories = [
    { value: 'OLI_PELUMAS', label: 'Oli & Pelumas' },
    { value: 'FILTER', label: 'Filter' },
    { value: 'BRAKE', label: 'Sistem Rem' },
    { value: 'SUSPENSION', label: 'Suspensi' },
    { value: 'ENGINE', label: 'Mesin' },
    { value: 'TRANSMISSION', label: 'Transmisi' },
    { value: 'ELECTRICAL', label: 'Kelistrikan' },
    { value: 'BODY', label: 'Body' },
    { value: 'AC', label: 'AC' },
    { value: 'TIRE_WHEEL', label: 'Ban & Velg' },
    { value: 'ACCESSORIES', label: 'Aksesoris' },
    { value: 'CONSUMABLE', label: 'Bahan Habis Pakai' },
    { value: 'LAINNYA', label: 'Lainnya' },
  ]

  return (
    <>
      <GudangHeader title="Tambah Part Baru" description="Masukkan detail suku cadang baru ke sistem" />
      
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
          "relative w-full max-w-3xl bg-white dark:bg-slate-900 h-full shadow-2xl border-l border-white/10 flex flex-col transition-transform duration-500 ease-in-out",
          isClosing 
            ? "translate-x-full" 
            : "animate-in slide-in-from-right duration-500"
        )}>
          <div className="p-8 flex-1 overflow-y-auto">
            <div className="space-y-8">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                    Tambah <span className="text-primary">Part Baru</span>
                  </h2>
                  <p className="text-slate-500 text-sm font-medium">
                    Lengkapi detail suku cadang di bawah ini.
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
                      <CardTitle>Informasi Produk</CardTitle>
                      <CardDescription>Detail dasar mengenai suku cadang</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="name">Nama Part</Label>
                          <Input id="name" placeholder="Contoh: Oli Mesin 10W-40" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="code">Kode Part</Label>
                          <Input id="code" placeholder="Contoh: OIL-001" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})} required />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="category">Kategori</Label>
                          <Select value={formData.category} onValueChange={v => setFormData({...formData, category: v})}>
                            <SelectTrigger><SelectValue placeholder="Pilih Kategori" /></SelectTrigger>
                            <SelectContent>
                              {categories.map(cat => (
                                <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="brand">Merk / Brand</Label>
                          <Input id="brand" placeholder="Contoh: Shell, Denso, dll" value={formData.brand} onChange={e => setFormData({...formData, brand: e.target.value})} />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="unit">Satuan</Label>
                          <Select value={formData.unit} onValueChange={v => setFormData({...formData, unit: v})}>
                            <SelectTrigger><SelectValue placeholder="Pilih Satuan" /></SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PCS">Pcs</SelectItem>
                              <SelectItem value="LITER">Liter</SelectItem>
                              <SelectItem value="SET">Set</SelectItem>
                              <SelectItem value="BOX">Box</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="location">Lokasi Rak</Label>
                          <Input id="location" placeholder="Contoh: Rak A-1" value={formData.location} onChange={e => setFormData({...formData, location: e.target.value})} />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="description">Deskripsi</Label>
                        <Textarea id="description" placeholder="Keterangan tambahan mengenai produk..." value={formData.description} onChange={e => setFormData({...formData, description: e.target.value})} />
                      </div>

                      <div className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="stockQuantity">Stok Awal</Label>
                          <Input id="stockQuantity" type="number" value={formData.stockQuantity} onChange={e => setFormData({...formData, stockQuantity: parseInt(e.target.value) || 0})} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="minStock">Min Stok</Label>
                          <Input id="minStock" type="number" value={formData.minStock} onChange={e => setFormData({...formData, minStock: parseInt(e.target.value) || 0})} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="maxStock">Max Stok</Label>
                          <Input id="maxStock" type="number" value={formData.maxStock} onChange={e => setFormData({...formData, maxStock: parseInt(e.target.value) || 0})} required />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="buyPrice">Harga Beli</Label>
                          <Input id="buyPrice" type="number" value={formData.buyPrice} onChange={e => setFormData({...formData, buyPrice: parseInt(e.target.value) || 0})} required />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="sellPrice">Harga Jual</Label>
                          <Input id="sellPrice" type="number" value={formData.sellPrice} onChange={e => setFormData({...formData, sellPrice: parseInt(e.target.value) || 0})} required />
                        </div>
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
                          Simpan Produk
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
