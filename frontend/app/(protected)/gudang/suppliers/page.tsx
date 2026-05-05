'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Search, Plus, Truck, Mail, Phone, MapPin, Clock, Package, Edit, Trash2, MoreHorizontal, Eye } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog'
import { suppliers as mockSuppliers, type Supplier } from '@/lib/gudang-data'
import { GudangHeader } from '@/components/gudang/gudang-header'
import useSWR from 'swr'
import { fetcher } from '@/lib/api-client'
import { Loader2 } from 'lucide-react'

import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export default function SuppliersPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedSupplier, setSelectedSupplier] = useState<any | null>(null)

  const { data: rawData, isLoading } = useSWR('/inventory/suppliers', fetcher)
  const suppliers = Array.isArray(rawData?.data) ? rawData.data.map((s: any) => ({
    ...s,
    contact: s.contactPerson || '-',
    totalProducts: s._count?.spareparts || 0,
    status: s.isActive !== false ? 'active' : 'inactive'
  })) : []

  const filteredSuppliers = suppliers.filter((supplier: any) =>
    supplier.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    supplier.contact.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const activeSuppliersCount = suppliers.filter((s: any) => s.status === 'active').length
  const totalProducts = suppliers.reduce((sum: number, s: any) => sum + s.totalProducts, 0)

  return (
    <>
      <GudangHeader title="Partner Logistik" description="Kelola daftar pemasok dan kerjasama suku cadang" />
      
      <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-black/20">
        <div className="mx-auto max-w-7xl space-y-8">
          
          {/* Summary Cards */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-2xl overflow-hidden group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20 group-hover:scale-110 transition-transform">
                  <Truck className="size-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Supplier</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none">{suppliers.length}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-2xl overflow-hidden group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20 group-hover:scale-110 transition-transform">
                  <Badge className="bg-emerald-500 size-3 rounded-full p-0 animate-pulse" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Status Aktif</p>
                  <h3 className="text-2xl font-black text-emerald-600 leading-none">{activeSuppliersCount}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-2xl overflow-hidden group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center border border-amber-100 dark:border-amber-500/20 group-hover:scale-110 transition-transform">
                  <Package className="size-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">SKU Tersedia</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none">{totalProducts}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-2xl overflow-hidden group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10 group-hover:scale-110 transition-transform">
                  <Clock className="size-6 text-slate-600 dark:text-slate-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Avg Lead Time</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none">
                    {suppliers.length > 0 
                      ? Math.round(suppliers.reduce((sum: number, s: any) => sum + (s.paymentTerms || 0), 0) / suppliers.length) 
                      : 0} <span className="text-xs font-normal">Hari</span>
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white dark:bg-zinc-900/50 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm">
            <div className="relative w-full sm:w-96">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="Cari nama supplier atau kontak person..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-11 rounded-2xl bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 focus:ring-primary/20 transition-all text-sm font-medium"
              />
            </div>
            <Button className="h-12 bg-orange-500 hover:bg-orange-600 text-white rounded-2xl px-8 shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:scale-105 transition-all" asChild>
              <Link href="/gudang/suppliers/add">
                <Plus className="mr-2 size-5 font-black" />
                <span className="text-xs font-black uppercase tracking-widest">Tambah Supplier</span>
              </Link>
            </Button>
          </div>

          {/* Table */}
          <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-[2rem] overflow-hidden">
            <CardContent className="p-0">
              {isLoading ? (
                <div className="p-8 space-y-4">
                  <Skeleton className="h-12 w-full rounded-xl" />
                  <Skeleton className="h-20 w-full rounded-2xl" />
                  <Skeleton className="h-20 w-full rounded-2xl" />
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader className="bg-slate-50 dark:bg-black/40">
                      <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/5 h-14">
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500 pl-8">Nama Supplier</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500">PIC & Kontak</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500">Lead Time</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500">Produk</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500">Status</TableHead>
                        <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-slate-500 pr-8">Aksi</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredSuppliers.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="h-64 text-center">
                            <div className="flex flex-col items-center justify-center space-y-3 opacity-40">
                              <Truck className="size-12" />
                              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Tidak ada supplier ditemukan</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : filteredSuppliers.map((supplier: any) => (
                        <TableRow key={supplier.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors border-slate-100 dark:border-white/5 group h-24">
                          <TableCell className="pl-8">
                            <div className="flex items-center gap-4">
                              <div className="flex size-12 items-center justify-center rounded-2xl bg-white dark:bg-zinc-800 border border-slate-200 dark:border-white/5 shadow-sm group-hover:scale-105 transition-transform">
                                <Truck className="size-6 text-slate-400 group-hover:text-primary transition-colors" />
                              </div>
                              <div className="max-w-[200px]">
                                <p className="font-black text-slate-900 dark:text-white uppercase italic text-sm tracking-tight leading-none mb-1.5">{supplier.name}</p>
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                                  <MapPin className="size-3" />
                                  <span className="truncate">{supplier.address}</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="space-y-1.5">
                              <p className="text-xs font-black text-slate-700 dark:text-zinc-300 uppercase tracking-tight">{supplier.contact}</p>
                              <div className="flex items-center gap-3">
                                <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-bold">
                                  <Mail className="size-3" />
                                  <span>{supplier.email || '-'}</span>
                                </div>
                                <div className="flex items-center gap-1.5 text-[10px] font-black text-primary italic">
                                  <Phone className="size-3" />
                                  <span>{supplier.phone || '-'}</span>
                                </div>
                              </div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline" className="bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10 text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg text-slate-500">
                              {supplier.paymentTerms || 0} HARI
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Package className="size-4 text-slate-400" />
                              <span className="text-sm font-black italic text-slate-900 dark:text-white">{supplier.totalProducts}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge className={cn(
                              "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border",
                              supplier.status === 'active' ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-slate-200 text-slate-600"
                            )}>
                              {supplier.status === 'active' ? 'AKTIF' : 'NONAKTIF'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right pr-8">
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon" className="h-10 w-10 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all">
                                  <MoreHorizontal className="size-5 text-slate-400 group-hover:text-primary" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
                                <DropdownMenuItem className="rounded-xl py-3 cursor-pointer" onClick={() => setSelectedSupplier(supplier)}>
                                  <div className="size-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mr-3">
                                    <Eye className="size-4 text-blue-600" />
                                  </div>
                                  <span className="text-xs font-bold">Detail Partner</span>
                                </DropdownMenuItem>
                                <DropdownMenuItem className="rounded-xl py-3 cursor-pointer">
                                  <div className="size-8 rounded-lg bg-slate-50 dark:bg-white/5 flex items-center justify-center mr-3">
                                    <Edit className="size-4 text-slate-500" />
                                  </div>
                                  <span className="text-xs font-bold">Edit Kerjasama</span>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator className="my-2 opacity-50" />
                                <DropdownMenuItem className="rounded-xl py-3 cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600">
                                  <div className="size-8 rounded-lg bg-red-50 dark:bg-red-500/10 flex items-center justify-center mr-3">
                                    <Trash2 className="size-4 text-red-500" />
                                  </div>
                                  <span className="text-xs font-bold">Hapus Data</span>
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Detail Dialog */}
      <Dialog open={!!selectedSupplier} onOpenChange={() => setSelectedSupplier(null)}>
        <DialogContent className="max-w-md p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white dark:bg-zinc-950 outline-none">
          {selectedSupplier && (
            <div className="h-full flex flex-col">
              <div className="bg-[#0A0A0B] p-10 text-white relative overflow-hidden">
                <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
                  <Truck className="size-40" />
                </div>
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-transparent to-transparent" />
                
                <div className="relative z-10">
                  <Badge className="bg-emerald-500 text-white border-none mb-6 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.4)]">AKTIF</Badge>
                  <h2 className="text-[2.25rem] font-black tracking-tighter uppercase italic leading-none mb-4">{selectedSupplier.name}</h2>
                  <div className="flex items-center gap-3 text-slate-400 text-[10px] font-bold uppercase tracking-widest">
                    <MapPin className="size-4 text-primary" />
                    <span>{selectedSupplier.address}</span>
                  </div>
                </div>
              </div>

              <div className="p-10 space-y-8">
                <div className="grid grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Contact Person</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic">{selectedSupplier.contactPerson || '-'}</p>
                  </div>
                  <div className="space-y-2">
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Lead Time</p>
                    <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic">{selectedSupplier.paymentTerms || 0} Hari Kerja</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/[0.02] p-5 rounded-2xl border border-slate-100 dark:border-white/5">
                    <div className="size-12 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-blue-500 shadow-sm border border-slate-100 dark:border-white/5">
                      <Mail className="size-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Email Official</p>
                        <p className="font-bold text-slate-900 dark:text-zinc-100 text-sm">{selectedSupplier.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 bg-slate-50 dark:bg-white/[0.02] p-5 rounded-2xl border border-slate-100 dark:border-white/5">
                    <div className="size-12 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-emerald-500 shadow-sm border border-slate-100 dark:border-white/5">
                      <Phone className="size-6" />
                    </div>
                    <div>
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Telepon / WhatsApp</p>
                        <p className="font-bold text-slate-900 dark:text-zinc-100 text-sm">{selectedSupplier.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-amber-50 dark:bg-amber-500/5 rounded-[2rem] p-6 border border-amber-200/50 dark:border-amber-500/10">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                            <div className="size-12 rounded-xl bg-white dark:bg-zinc-900 flex items-center justify-center text-amber-500 shadow-sm">
                                <Package className="size-6" />
                            </div>
                            <span className="text-[10px] font-black text-amber-900 dark:text-amber-500 uppercase tracking-widest">Total SKU Tersuplai</span>
                        </div>
                        <span className="text-3xl font-black italic tracking-tighter text-amber-600">{selectedSupplier.totalProducts}</span>
                    </div>
                </div>
              </div>

              <div className="p-8 bg-slate-50 dark:bg-black/20 flex gap-3 border-t border-slate-100 dark:border-white/5">
                <Button variant="ghost" className="flex-1 h-12 text-[10px] font-black uppercase tracking-widest text-slate-500 rounded-xl" onClick={() => setSelectedSupplier(null)}>Tutup</Button>
                <Button className="flex-1 h-12 bg-[#0A0A0B] hover:bg-black text-white text-[10px] font-black uppercase tracking-widest rounded-xl transition-all">Edit Kerjasama</Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}
