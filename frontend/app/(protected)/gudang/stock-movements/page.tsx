'use client'

import { useState } from 'react'
import { ArrowDownRight, ArrowUpRight, Search, Filter, Download, Calendar, Package, Loader2 } from 'lucide-react'
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
import { GudangHeader } from '@/components/gudang/gudang-header'
import useSWR from 'swr'
import { fetcher } from '@/lib/api-client'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'

import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

export default function StockMovementsPage() {
  const [searchQuery, setSearchQuery] = useState('')
  const [typeFilter, setTypeFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  const { data: movementsRaw, isLoading } = useSWR(
    `/inventory/stock-movements?limit=100&search=${searchQuery}${typeFilter !== 'all' ? `&type=${typeFilter}` : ''}`,
    fetcher
  )

  const movements: any[] = Array.isArray(movementsRaw?.data) ? movementsRaw.data : []

  const inboundCount = movements.filter(m => m.movementType.includes('IN') || m.movementType === 'PURCHASE').reduce((sum, m) => sum + Math.abs(m.quantity), 0)
  const outboundCount = movements.filter(m => m.movementType.includes('OUT') || m.movementType === 'SALE').reduce((sum, m) => sum + Math.abs(m.quantity), 0)

  const formatDate = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd MMM yyyy HH:mm', { locale: idLocale })
    } catch (e) {
      return dateStr
    }
  }

  const getMovementLabel = (type: string) => {
    switch (type) {
      case 'PURCHASE': return 'Pembelian'
      case 'SALE': return 'Penjualan'
      case 'ADJUSTMENT_IN': return 'Penyesuaian Masuk'
      case 'ADJUSTMENT_OUT': return 'Penyesuaian Keluar'
      case 'INITIAL': return 'Stok Awal'
      default: return type
    }
  }

  const isPositive = (type: string) => {
    return type.includes('IN') || type === 'PURCHASE' || type === 'INITIAL' || type === 'RETURN_CUSTOMER'
  }

  return (
    <>
      <GudangHeader title="Log Pergerakan" description="Riwayat lengkap barang masuk dan keluar dari gudang" />
      
      <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-black/20">
        <div className="mx-auto max-w-7xl space-y-8">
          
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-2xl overflow-hidden group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center border border-blue-100 dark:border-blue-500/20">
                  <Package className="size-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Transaksi</p>
                  <h3 className="text-2xl font-black text-slate-900 dark:text-white leading-none">{isLoading ? '...' : movements.length}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-2xl overflow-hidden group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                  <ArrowDownRight className="size-6 text-emerald-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Masuk</p>
                  <h3 className="text-2xl font-black text-emerald-600 leading-none">+{isLoading ? '...' : inboundCount}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-2xl overflow-hidden group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center border border-rose-100 dark:border-rose-500/20">
                  <ArrowUpRight className="size-6 text-rose-600" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Keluar</p>
                  <h3 className="text-2xl font-black text-rose-600 leading-none">-{isLoading ? '...' : outboundCount}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-2xl overflow-hidden group">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-slate-100 dark:bg-white/5 flex items-center justify-center border border-slate-200 dark:border-white/10">
                  <div className={cn(
                    "size-2.5 rounded-full",
                    inboundCount - outboundCount >= 0 ? "bg-emerald-500" : "bg-rose-500"
                  )} />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Net Movement</p>
                  <h3 className={cn(
                    "text-2xl font-black leading-none",
                    isLoading ? "text-slate-400" : (inboundCount - outboundCount >= 0 ? "text-emerald-600" : "text-rose-600")
                  )}>
                    {isLoading ? '...' : (inboundCount - outboundCount >= 0 ? '+' : '')}{isLoading ? '' : inboundCount - outboundCount}
                  </h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Filters Area */}
          <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-[2rem] overflow-hidden">
            <CardContent className="p-6">
              <div className="grid gap-4 md:grid-cols-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-4 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="search"
                    placeholder="Cari part, kode, atau referensi transaksi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="h-12 pl-11 rounded-2xl bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 focus:ring-primary/20 transition-all text-sm font-medium"
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-12 rounded-2xl bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 px-4 font-bold text-xs uppercase tracking-widest text-slate-600 dark:text-zinc-400">
                    <SelectValue placeholder="TIPE TRANSAKSI" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl p-2">
                    <SelectItem value="all" className="rounded-xl">SEMUA TIPE</SelectItem>
                    <SelectItem value="PURCHASE" className="rounded-xl">PEMBELIAN</SelectItem>
                    <SelectItem value="SALE" className="rounded-xl">PENJUALAN</SelectItem>
                    <SelectItem value="ADJUSTMENT_IN" className="rounded-xl">PENYESUAIAN MASUK</SelectItem>
                    <SelectItem value="ADJUSTMENT_OUT" className="rounded-xl">PENYESUAIAN KELUAR</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="h-12 rounded-2xl bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 px-4 font-bold text-xs uppercase tracking-widest text-slate-600 dark:text-zinc-400">
                    <Calendar className="mr-2 size-3 text-slate-400" />
                    <SelectValue placeholder="PERIODE" />
                  </SelectTrigger>
                  <SelectContent className="rounded-2xl p-2">
                    <SelectItem value="all" className="rounded-xl">SEMUA WAKTU</SelectItem>
                    <SelectItem value="today" className="rounded-xl">HARI INI</SelectItem>
                    <SelectItem value="week" className="rounded-xl">7 HARI TERAKHIR</SelectItem>
                    <SelectItem value="month" className="rounded-xl">30 HARI TERAKHIR</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Table Area */}
          <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-[2rem] overflow-hidden">
            <CardHeader className="p-8 pb-0 flex flex-row items-center justify-between space-y-0">
              <CardTitle className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">Riwayat Aktivitas Gudang</CardTitle>
              <Button variant="outline" size="sm" className="h-10 rounded-xl px-5 text-[10px] font-black uppercase tracking-widest border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5">
                <Download className="mr-2 size-3" />
                Export CSV
              </Button>
            </CardHeader>
            <CardContent className="p-0 mt-6">
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
                        <TableHead className="w-[80px] font-black text-[10px] uppercase tracking-widest text-slate-500 pl-8">Aksi</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500">Informasi Part</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500">Kategori</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500">Qty</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500">Petugas</TableHead>
                        <TableHead className="font-black text-[10px] uppercase tracking-widest text-slate-500">Waktu</TableHead>
                        <TableHead className="text-right font-black text-[10px] uppercase tracking-widest text-slate-500 pr-8">Catatan</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {movements.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={7} className="h-64 text-center">
                            <div className="flex flex-col items-center justify-center space-y-3 opacity-40">
                              <Package className="size-12" />
                              <p className="text-[10px] font-black uppercase tracking-[0.2em]">Tidak ada riwayat pergerakan</p>
                            </div>
                          </TableCell>
                        </TableRow>
                      ) : movements.map((movement) => {
                        const positive = isPositive(movement.movementType)
                        return (
                          <TableRow key={movement.id} className="hover:bg-slate-50 dark:hover:bg-white/[0.02] transition-colors border-slate-100 dark:border-white/5 h-20 group">
                            <TableCell className="pl-8">
                              <div className={cn(
                                "flex size-10 items-center justify-center rounded-xl border group-hover:scale-105 transition-transform",
                                positive ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" : "bg-rose-500/10 text-rose-500 border-rose-500/20"
                              )}>
                                {positive ? <ArrowDownRight className="size-5" /> : <ArrowUpRight className="size-5" />}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <p className="font-black text-slate-900 dark:text-white uppercase italic text-sm tracking-tight leading-none mb-1">{movement.sparepart?.name}</p>
                                <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest">{movement.sparepart?.code}</p>
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/10 text-[9px] font-black uppercase tracking-widest px-2.5 py-0.5 rounded-lg text-slate-500">
                                {getMovementLabel(movement.movementType)}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <span className={cn(
                                "text-base font-black italic tracking-tighter",
                                positive ? "text-emerald-500" : "text-rose-500"
                              )}>
                                {positive ? '+' : '-'}{Math.abs(movement.quantity)}
                              </span>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="size-6 rounded-full bg-slate-100 dark:bg-white/5 flex items-center justify-center text-[10px] font-black uppercase">
                                  {movement.createdBy?.name?.charAt(0) || 'U'}
                                </div>
                                <span className="text-[10px] font-black text-slate-700 dark:text-zinc-300 uppercase tracking-tight">{movement.createdBy?.name}</span>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <p className="text-[10px] font-black text-slate-900 dark:text-white leading-none mb-0.5">{formatDate(movement.createdAt).split(' ')[0]} {formatDate(movement.createdAt).split(' ')[1]}</p>
                                <p className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">{formatDate(movement.createdAt).split(' ').slice(3).join(' ')}</p>
                              </div>
                            </TableCell>
                            <TableCell className="text-right pr-8">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tight max-w-[150px] ml-auto truncate italic">
                                {movement.notes || 'Tanpa Catatan'}
                              </p>
                            </TableCell>
                          </TableRow>
                        )
                      })}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </>
  )
}
