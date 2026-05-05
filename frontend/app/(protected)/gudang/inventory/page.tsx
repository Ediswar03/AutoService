'use client'

import { useState, useMemo, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Search, Filter, Plus, Download, Eye, Edit, Trash2, ArrowUpDown, ChevronLeft, ChevronRight, ChevronDown, Package } from 'lucide-react'
import { cn } from '@/lib/utils'
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { formatCurrency, getStockStatusColor, getStockStatusLabel } from '@/lib/gudang-data'
import { GudangHeader } from '@/components/gudang/gudang-header'
import useSWR from 'swr'
import { fetcher } from '@/lib/api-client'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'

import { Skeleton } from '@/components/ui/skeleton'

const ITEMS_PER_PAGE = 10

function getStatusFromStock(quantity: number, minStock: number): 'ok' | 'minimum' | 'critical' {
  if (quantity <= 0) return 'critical'
  if (quantity <= minStock) return 'minimum'
  return 'ok'
}

function InventorySkeleton() {
  return (
    <div className="space-y-4">
      <div className="h-10 w-full bg-slate-100 dark:bg-white/5 animate-pulse rounded-xl" />
      {[...Array(5)].map((_, i) => (
        <div key={i} className="h-20 w-full bg-slate-50 dark:bg-white/5 animate-pulse rounded-2xl border border-slate-100 dark:border-white/5" />
      ))}
    </div>
  )
}

function InventoryContent() {
  const searchParams = useSearchParams()
  const initialStatus = searchParams.get('status') || 'all'
  
  const [searchQuery, setSearchQuery] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('all')
  const [supplierFilter, setSupplierFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState(initialStatus)
  const [sortBy, setSortBy] = useState<'name' | 'stock' | 'price'>('name')
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc')
  const [currentPage, setCurrentPage] = useState(1)

  const { data: rawData, isLoading } = useSWR('/inventory/spareparts?limit=1000', fetcher)
  
  const apiItems = Array.isArray(rawData?.data) ? rawData.data.map((item: any) => {
    const stock = item.stok !== undefined ? item.stok : (item.stockQuantity !== undefined ? item.stockQuantity : 0);
    const minS = item.stok_minimum !== undefined ? item.stok_minimum : (item.minStock !== undefined ? item.minStock : 5);
    
    return {
      ...item,
      id: item.id,
      partCode: item.kode || item.code || '-',
      name: item.nama || item.name || '-',
      currentStock: stock,
      minStock: minS,
      maxStock: item.max_stock || item.maxStock || 100,
      status: getStatusFromStock(stock, minS),
      supplier: item.supplier || { name: '-' },
      locationStr: item.lokasi_rak || item.location || '-',
      sellPrice: Number(item.harga_jual || item.sellPrice || 0),
      category: item.category?.nama || item.category || 'LAINNYA'
    }
  }) : []

  const inventoryItems = apiItems
  
  const categories = Array.from(new Set(inventoryItems.map((item: any) => item.category)))

  const uniqueSuppliers = useMemo(() => {
    const supplierNames = [...new Set(inventoryItems.map((item: any) => item.supplier.name))].filter(Boolean)
    return supplierNames as string[]
  }, [inventoryItems])

  const filteredItems = useMemo(() => {
    let items = [...inventoryItems]

    if (searchQuery) {
      const query = searchQuery.toLowerCase()
      items = items.filter(
        item =>
          item.name.toLowerCase().includes(query) ||
          item.partCode.toLowerCase().includes(query) ||
          item.category.toLowerCase().includes(query)
      )
    }

    if (categoryFilter !== 'all') {
      items = items.filter(item => item.category === categoryFilter)
    }

    if (supplierFilter !== 'all') {
      items = items.filter(item => item.supplier.name === supplierFilter)
    }

    if (statusFilter !== 'all') {
      items = items.filter((item: any) => item.status === statusFilter)
    }

    items.sort((a, b) => {
      let compareA: string | number
      let compareB: string | number

      switch (sortBy) {
        case 'name':
          compareA = a.name
          compareB = b.name
          break
        case 'stock':
          compareA = a.currentStock
          compareB = b.currentStock
          break
        case 'price':
          compareA = a.sellPrice
          compareB = b.sellPrice
          break
        default:
          compareA = a.name
          compareB = b.name
      }

      if (sortOrder === 'asc') {
        return compareA < compareB ? -1 : compareA > compareB ? 1 : 0
      } else {
        return compareA > compareB ? -1 : compareA < compareB ? 1 : 0
      }
    })

    return items
  }, [searchQuery, categoryFilter, supplierFilter, statusFilter, sortBy, sortOrder, inventoryItems])

  const totalPages = Math.ceil(filteredItems.length / ITEMS_PER_PAGE)
  const paginatedItems = filteredItems.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  )

  const handleSort = (column: 'name' | 'stock' | 'price') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')
    } else {
      setSortBy(column)
      setSortOrder('asc')
    }
  }

  const resetFilters = () => {
    setSearchQuery('')
    setCategoryFilter('all')
    setSupplierFilter('all')
    setStatusFilter('all')
    setCurrentPage(1)
  }

  return (
    <div className="space-y-8">
      {/* Page Header Area */}
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between bg-white dark:bg-zinc-900/50 p-6 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm">
        <div>
          <h2 className="text-2xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none">
            Manajemen Inventori
          </h2>
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mt-2">
            Total <span className="text-primary">{isLoading ? "..." : inventoryItems.length}</span> jenis suku cadang dalam sistem
          </p>
        </div>
        <div className="flex items-center gap-3">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="h-11 rounded-xl border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 px-6">
                <Download className="mr-2 size-4 text-slate-400" />
                <span className="text-xs font-black uppercase tracking-widest">Export</span>
                <ChevronDown className="ml-2 size-3 text-slate-300" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56 p-2 rounded-2xl">
              <DropdownMenuItem 
                className="rounded-xl cursor-pointer py-2.5"
                onClick={() => {
                  if (inventoryItems.length === 0) return toast.error("Tidak ada data untuk di-export")
                  const headers = ['Kode Part', 'Nama Part', 'Kategori', 'Stok', 'Min Stok', 'Harga Jual', 'Lokasi', 'Supplier']
                  const rows = inventoryItems.map((item: any) => [
                    item.partCode,
                    item.name,
                    item.category,
                    item.currentStock,
                    item.minStock,
                    item.sellPrice,
                    item.locationStr,
                    item.supplier?.name || '-'
                  ])
                  const csvContent = [
                    headers.join(','),
                    ...rows.map((row: any[]) => row.map((cell: any) => `"${String(cell).replace(/"/g, '""')}"`).join(','))
                  ].join('\n')
                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
                  const url = URL.createObjectURL(blob)
                  const link = document.createElement('a')
                  link.setAttribute('href', url)
                  link.setAttribute('download', `inventory_report_${new Date().toISOString().split('T')[0]}.csv`)
                  document.body.appendChild(link)
                  link.click()
                  document.body.removeChild(link)
                  toast.success("Laporan CSV berhasil diunduh!")
                }}
              >
                <div className="size-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center mr-3">
                  <Download className="size-4 text-blue-600" />
                </div>
                <span className="text-xs font-bold">Export CSV</span>
              </DropdownMenuItem>
              <DropdownMenuItem 
                className="rounded-xl cursor-pointer py-2.5"
                onClick={() => window.print()}
              >
                <div className="size-8 rounded-lg bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center mr-3">
                  <Eye className="size-4 text-amber-600" />
                </div>
                <span className="text-xs font-bold">Cetak / PDF</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
          
          <Button className="h-11 bg-orange-500 hover:bg-orange-600 text-white rounded-xl px-6 shadow-[0_4px_20px_rgba(249,115,22,0.3)] hover:scale-105 transition-all" asChild>
            <Link href="/gudang/inventory/add">
              <Plus className="mr-2 size-4 font-black" />
              <span className="text-xs font-black uppercase tracking-widest">Tambah Part</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* Filters */}
      <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-[2rem] overflow-hidden">
        <CardContent className="p-6">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
            <div className="relative lg:col-span-2">
              <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
              <Input
                type="search"
                placeholder="Cari nama part, kode, atau kategori..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-11 rounded-2xl bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 focus:ring-primary/20 transition-all text-sm font-medium"
              />
            </div>
            
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="h-12 rounded-2xl bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 px-4 font-bold text-xs uppercase tracking-widest text-slate-600 dark:text-zinc-400">
                <SelectValue placeholder="KATEGORI" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl p-2">
                <SelectItem value="all" className="rounded-xl">SEMUA KATEGORI</SelectItem>
                {categories.map((cat: any) => (
                  <SelectItem key={cat} value={cat} className="rounded-xl">{cat}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={supplierFilter} onValueChange={setSupplierFilter}>
              <SelectTrigger className="h-12 rounded-2xl bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 px-4 font-bold text-xs uppercase tracking-widest text-slate-600 dark:text-zinc-400">
                <SelectValue placeholder="SUPPLIER" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl p-2">
                <SelectItem value="all" className="rounded-xl">SEMUA SUPPLIER</SelectItem>
                {uniqueSuppliers.map((sup) => (
                  <SelectItem key={sup} value={sup} className="rounded-xl">{sup}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="h-12 rounded-2xl bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 px-4 font-bold text-xs uppercase tracking-widest text-slate-600 dark:text-zinc-400">
                <SelectValue placeholder="STATUS STOK" />
              </SelectTrigger>
              <SelectContent className="rounded-2xl p-2">
                <SelectItem value="all" className="rounded-xl">SEMUA STATUS</SelectItem>
                <SelectItem value="ok" className="rounded-xl text-emerald-600 font-bold">STOK AMAN</SelectItem>
                <SelectItem value="minimum" className="rounded-xl text-amber-600 font-bold">STOK MINIMUM</SelectItem>
                <SelectItem value="critical" className="rounded-xl text-red-600 font-bold">STOK KRITIS</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          {(searchQuery || categoryFilter !== 'all' || supplierFilter !== 'all' || statusFilter !== 'all') && (
            <div className="mt-4 flex items-center justify-between px-2 pt-2 border-t border-slate-100 dark:border-white/5">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Menampilkan <span className="text-slate-900 dark:text-white">{filteredItems.length}</span> item terfilter
              </span>
              <Button variant="ghost" size="sm" onClick={resetFilters} className="h-8 text-[10px] font-black uppercase text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-lg">
                Hapus Semua Filter
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Inventory Table */}
      <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-[2rem] overflow-hidden">
        <CardContent className="p-0">
          {isLoading ? (
            <div className="p-6">
              <InventorySkeleton />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader className="bg-slate-50 dark:bg-black/40">
                  <TableRow className="hover:bg-transparent border-slate-100 dark:border-white/5 h-14">
                    <TableHead className="w-[140px] font-black text-[10px] uppercase tracking-widest text-slate-500 pl-6">Kode Part</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500">
                      <button className="flex items-center gap-1 hover:text-primary transition-colors" onClick={() => handleSort('name')}>
                        Nama Part <ArrowUpDown className="size-3" />
                      </button>
                    </TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500">Kategori</TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500">
                      <button className="flex items-center gap-1 hover:text-primary transition-colors" onClick={() => handleSort('stock')}>
                        Stok <ArrowUpDown className="size-3" />
                      </button>
                    </TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500">
                      <button className="flex items-center gap-1 hover:text-primary transition-colors" onClick={() => handleSort('price')}>
                        Harga <ArrowUpDown className="size-3" />
                      </button>
                    </TableHead>
                    <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500">Status</TableHead>
                    <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-slate-500 pr-6">Aksi</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedItems.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center space-y-3 opacity-40">
                          <Package className="size-12" />
                          <p className="text-[10px] font-black uppercase tracking-[0.2em]">Tidak ada data ditemukan</p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : paginatedItems.map((item: any) => (
                    <TableRow key={item.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors border-slate-100 dark:border-white/5 group h-20">
                      <TableCell className="pl-6">
                        <span className="font-mono text-[10px] font-black text-slate-400 group-hover:text-primary transition-colors">
                          {item.partCode}
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          <p className="font-black text-slate-900 dark:text-white uppercase italic text-sm tracking-tight">{item.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-0.5">Loc: {item.locationStr}</p>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-lg text-slate-500">
                          {item.category}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <span className={`text-base font-black italic tracking-tighter ${
                            item.status === 'critical' ? 'text-red-500' : 
                            item.status === 'minimum' ? 'text-amber-500' : 
                            'text-emerald-500'
                          }`}>
                            {item.currentStock}
                          </span>
                          <span className="text-[9px] font-bold text-slate-400 uppercase">/ {item.maxStock}</span>
                        </div>
                      </TableCell>
                      <TableCell className="font-black italic text-sm text-slate-900 dark:text-white">
                        {formatCurrency(item.sellPrice)}
                      </TableCell>
                      <TableCell>
                        <Badge className={cn(
                          "text-[9px] font-black uppercase tracking-widest px-2.5 py-1 rounded-lg border",
                          item.status === 'critical' ? "bg-red-500/10 text-red-500 border-red-500/20" :
                          item.status === 'minimum' ? "bg-amber-500/10 text-amber-500 border-amber-500/20" :
                          "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                        )}>
                          {getStockStatusLabel(item.status)}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-right pr-6">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="sm" className="h-9 w-9 p-0 hover:bg-slate-100 dark:hover:bg-white/5 rounded-xl transition-all">
                              <ChevronDown className="size-4 text-slate-400 group-hover:text-primary transition-colors" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-48 p-2 rounded-2xl">
                            <DropdownMenuItem asChild className="rounded-xl py-2 cursor-pointer">
                              <Link href={`/gudang/inventory/${item.id}/detail`}>
                                <Eye className="mr-3 size-4 text-slate-400" />
                                <span className="text-xs font-bold">Detail Info</span>
                              </Link>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer">
                              <Edit className="mr-3 size-4 text-slate-400" />
                              <span className="text-xs font-bold">Edit Data</span>
                            </DropdownMenuItem>
                            <DropdownMenuSeparator className="my-2 opacity-50" />
                            <DropdownMenuItem className="rounded-xl py-2 cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600">
                              <Trash2 className="mr-3 size-4" />
                              <span className="text-xs font-bold">Hapus Part</span>
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

          {/* Pagination */}
          {!isLoading && paginatedItems.length > 0 && (
            <div className="flex items-center justify-between border-t border-slate-100 dark:border-white/5 px-8 py-6 bg-slate-50/50 dark:bg-black/20">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                Page <span className="text-slate-900 dark:text-white">{currentPage}</span> of {totalPages}
              </p>
              <div className="flex items-center gap-3">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-xl px-5 text-[10px] font-black uppercase tracking-widest border-slate-200 dark:border-white/10"
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="mr-2 size-3" />
                  Prev
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-10 rounded-xl px-5 text-[10px] font-black uppercase tracking-widest border-slate-200 dark:border-white/10"
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  disabled={currentPage === totalPages}
                >
                  Next
                  <ChevronRight className="ml-2 size-3" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default function InventoryPage() {
  return (
    <>
      <GudangHeader title="Inventori" description="Manajemen stok dan data suku cadang" />
      <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
        <div className="mx-auto max-w-7xl">
          <Suspense fallback={<div>Memuat data...</div>}>
            <InventoryContent />
          </Suspense>
        </div>
      </div>
    </>
  )
}
