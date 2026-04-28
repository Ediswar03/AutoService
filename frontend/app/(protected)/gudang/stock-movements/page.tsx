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
      <GudangHeader title="Pergerakan Stok" description="Riwayat transaksi barang masuk dan keluar dari gudang" />
      
      <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
        <div className="mx-auto max-w-7xl space-y-6">
          
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">Total Transaksi</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-900">{isLoading ? '...' : movements.length}</div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Transaksi Terkini</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-emerald-100 bg-emerald-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-emerald-600 uppercase tracking-widest">Barang Masuk</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <ArrowDownRight className="size-5 text-emerald-600" />
                  <span className="text-3xl font-bold text-emerald-600">+{isLoading ? '...' : inboundCount}</span>
                </div>
                <p className="text-[10px] text-emerald-600/80 font-bold uppercase mt-1">Unit diterima</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-blue-100 bg-blue-50/30">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-blue-600 uppercase tracking-widest">Barang Keluar</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-2">
                  <ArrowUpRight className="size-5 text-blue-600" />
                  <span className="text-3xl font-bold text-blue-600">-{isLoading ? '...' : outboundCount}</span>
                </div>
                <p className="text-[10px] text-blue-600/80 font-bold uppercase mt-1">Unit dikeluarkan</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-widest">Net Movement</CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-3xl font-bold ${isLoading ? 'text-slate-400' : (inboundCount - outboundCount >= 0 ? 'text-emerald-600' : 'text-red-500')}`}>
                  {isLoading ? '...' : (inboundCount - outboundCount >= 0 ? '+' : '')}{isLoading ? '' : inboundCount - outboundCount}
                </div>
                <p className="text-[10px] text-slate-400 font-bold uppercase mt-1">Selisih bersih</p>
              </CardContent>
            </Card>
          </div>

          {/* Filters Area */}
          <Card className="shadow-sm border-slate-200">
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-bold text-slate-800 uppercase tracking-wider">Filter Transaksi</CardTitle>
                <Button variant="outline" size="sm" className="h-8 text-xs font-bold border-slate-200 bg-white">
                  <Download className="mr-2 size-3" />
                  Export CSV
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-4">
                <div className="relative md:col-span-2">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    type="search"
                    placeholder="Cari part, kode, atau referensi..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-slate-50 border-slate-200 focus:bg-white transition-colors h-10"
                  />
                </div>
                
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="h-10 bg-slate-50 border-slate-200 font-semibold text-xs">
                    <SelectValue placeholder="Tipe Transaksi" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="PURCHASE">Pembelian</SelectItem>
                    <SelectItem value="SALE">Penjualan</SelectItem>
                    <SelectItem value="ADJUSTMENT_IN">Penyesuaian Masuk</SelectItem>
                    <SelectItem value="ADJUSTMENT_OUT">Penyesuaian Keluar</SelectItem>
                  </SelectContent>
                </Select>

                <Select value={dateFilter} onValueChange={setDateFilter}>
                  <SelectTrigger className="h-10 bg-slate-50 border-slate-200 font-semibold text-xs">
                    <Calendar className="mr-2 size-3 text-slate-400" />
                    <SelectValue placeholder="Periode" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Waktu</SelectItem>
                    <SelectItem value="today">Hari Ini</SelectItem>
                    <SelectItem value="week">7 Hari Terakhir</SelectItem>
                    <SelectItem value="month">30 Hari Terakhir</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Table Area */}
          <Card className="shadow-sm border-slate-200 overflow-hidden">
            <CardContent className="p-0">
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow className="hover:bg-transparent">
                    <TableHead className="w-[80px] font-bold text-slate-700">Aksi</TableHead>
                    <TableHead className="font-bold text-slate-700">Informasi Part</TableHead>
                    <TableHead className="font-bold text-slate-700">Jenis</TableHead>
                    <TableHead className="font-bold text-slate-700">Quantity</TableHead>
                    <TableHead className="font-bold text-slate-700">Oleh</TableHead>
                    <TableHead className="font-bold text-slate-700">Catatan</TableHead>
                    <TableHead className="font-bold text-slate-700">Waktu</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-48 text-center">
                        <div className="flex items-center justify-center">
                          <Loader2 className="size-8 animate-spin text-slate-300" />
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : movements.map((movement) => {
                    const positive = isPositive(movement.movementType)
                    return (
                      <TableRow key={movement.id} className="hover:bg-slate-50/50 transition-colors">
                        <TableCell>
                          <div className={`flex size-9 items-center justify-center rounded-xl ${
                            positive ? 'bg-emerald-100 text-emerald-600' : 'bg-blue-100 text-blue-600'
                          }`}>
                            {positive ? (
                              <ArrowDownRight className="size-4" />
                            ) : (
                              <ArrowUpRight className="size-4" />
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <p className="font-bold text-sm text-slate-900">{movement.sparepart?.name}</p>
                            <p className="text-[10px] text-slate-500 font-mono tracking-tighter uppercase">{movement.sparepart?.code}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono text-[10px] border-slate-200 bg-white text-slate-600 font-bold px-2">
                            {getMovementLabel(movement.movementType)}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <span className={`text-sm font-black ${positive ? 'text-emerald-600' : 'text-blue-600'}`}>
                            {positive ? '+' : '-'}{Math.abs(movement.quantity)}
                          </span>
                        </TableCell>
                        <TableCell className="text-xs font-semibold text-slate-600">{movement.createdBy?.name}</TableCell>
                        <TableCell className="text-xs text-slate-400 max-w-[180px] truncate">
                          {movement.notes || '-'}
                        </TableCell>
                        <TableCell className="text-[11px] font-bold text-slate-400">
                          {formatDate(movement.createdAt)}
                        </TableCell>
                      </TableRow>
                    )
                  })}
                </TableBody>
              </Table>

              {!isLoading && movements.length === 0 && (
                <div className="flex flex-col items-center justify-center py-20 bg-white">
                  <div className="size-16 rounded-full bg-slate-50 flex items-center justify-center mb-4">
                    <Package className="size-8 text-slate-200" />
                  </div>
                  <h3 className="text-lg font-bold text-slate-900">Data Kosong</h3>
                  <p className="text-sm text-slate-500">Tidak ada pergerakan stok yang sesuai dengan filter Anda.</p>
                </div>
              )}
            </CardContent>
          </Card>

        </div>
      </div>
    </>
  )
}
