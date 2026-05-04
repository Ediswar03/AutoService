'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import useSWR from 'swr'
import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import {
  CreditCard,
  Search,
  Eye,
  Printer,
  CheckCircle,
  Clock,
  AlertCircle,
  Loader2,
  Receipt,
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
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
import { Pagination } from '@/components/shared/Pagination'
import { fetcher, formatCurrency } from '@/lib/api-client'
import type { Invoice, PaginatedResponse } from '@/types'

export default function KasirPage() {
  const [page, setPage] = useState(1)
  const [search, setSearch] = useState('')
  const [status, setStatus] = useState<string>('all')
  const router = useRouter()

  const { data, isLoading, error } = useSWR<PaginatedResponse<Invoice>>(
    `/invoices?page=${page}&search=${search}&status=${status !== 'all' ? status : ''}`,
    fetcher
  )

  const getStatusBadge = (invoiceStatus: string) => {
    const status = invoiceStatus.toUpperCase();
    switch (status) {
      case 'PAID':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="mr-1 h-3 w-3" />Lunas</Badge>
      case 'PARTIAL':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="mr-1 h-3 w-3" />Sebagian</Badge>
      case 'SENT':
      case 'DRAFT':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="mr-1 h-3 w-3" />Belum Bayar</Badge>
      default:
        return <Badge variant="secondary">{invoiceStatus}</Badge>
    }
  }

  // Stats calculation
  const stats = {
    totalUnpaid: data?.data.filter(i => i.status === 'SENT' || i.status === 'DRAFT').length || 0,
    totalPartial: data?.data.filter(i => i.status === 'PARTIAL').length || 0,
    totalPaid: data?.data.filter(i => i.status === 'PAID').length || 0,
    pendingAmount: data?.data
      .filter(i => i.status !== 'PAID')
      .reduce((sum, i) => sum + (Number(i.grandTotal) - Number(i.amountPaid)), 0) || 0,
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Kasir</h1>
        <p className="text-muted-foreground">Kelola pembayaran dan invoice</p>
      </div>

      {/* Stats */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Belum Bayar</CardTitle>
            <AlertCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalUnpaid}</div>
            <p className="text-xs text-muted-foreground">Invoice</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Bayar Sebagian</CardTitle>
            <Clock className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPartial}</div>
            <p className="text-xs text-muted-foreground">Invoice</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Lunas</CardTitle>
            <CheckCircle className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalPaid}</div>
            <p className="text-xs text-muted-foreground">Invoice</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium">Total Pending</CardTitle>
            <CreditCard className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.pendingAmount)}</div>
            <p className="text-xs text-muted-foreground">Belum terbayar</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Receipt className="h-5 w-5" />
            Daftar Invoice
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-center mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari no. invoice, pelanggan..."
                className="pl-9"
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value)
                  setPage(1)
                }}
              />
            </div>
            <Select value={status} onValueChange={(val) => { setStatus(val); setPage(1); }}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filter status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Semua Status</SelectItem>
                <SelectItem value="SENT">Belum Bayar</SelectItem>
                <SelectItem value="PARTIAL">Bayar Sebagian</SelectItem>
                <SelectItem value="PAID">Lunas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {isLoading ? (
            <div className="flex justify-center py-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : error ? (
            <div className="text-center py-8 text-destructive">
              Gagal memuat data invoice
            </div>
          ) : !data?.data.length ? (
            <div className="text-center py-8 text-muted-foreground">
              Tidak ada invoice ditemukan
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>No. Invoice</TableHead>
                      <TableHead>Tanggal</TableHead>
                      <TableHead>Pelanggan</TableHead>
                      <TableHead>No. Polisi</TableHead>
                      <TableHead className="text-right">Total</TableHead>
                      <TableHead className="text-right">Terbayar</TableHead>
                      <TableHead className="text-right">Sisa</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Aksi</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {data.data.map((invoice: any) => (
                      <TableRow key={invoice.id}>
                        <TableCell className="font-mono font-medium">
                          {invoice.invoiceNumber}
                        </TableCell>
                        <TableCell>
                          {format(new Date(invoice.createdAt), 'dd MMM yyyy', { locale: id })}
                        </TableCell>
                        <TableCell>{invoice.customer?.name || '-'}</TableCell>
                        <TableCell className="font-mono">{invoice.workOrder?.vehicle?.licensePlate || '-'}</TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(Number(invoice.grandTotal))}
                        </TableCell>
                        <TableCell className="text-right text-green-600">
                          {formatCurrency(Number(invoice.amountPaid))}
                        </TableCell>
                        <TableCell className="text-right text-red-600">
                          {formatCurrency(Number(invoice.grandTotal) - Number(invoice.amountPaid))}
                        </TableCell>
                        <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => router.push(`/admin/invoices/${invoice.id}`)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            {invoice.status !== 'PAID' && (
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => router.push(`/admin/invoices/${invoice.id}?payment=true`)}
                              >
                                <CreditCard className="h-4 w-4" />
                              </Button>
                            )}
                            <Button variant="ghost" size="icon">
                              <Printer className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>

              {data.pagination && (
                <Pagination
                  currentPage={data.pagination.page}
                  totalPages={data.pagination.totalPages}
                  onPageChange={setPage}
                />
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
