'use client'

import { useState } from 'react'
import { Check, X, Eye, Clock, AlertTriangle, FileText, Filter, ChevronRight, Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { GudangHeader } from '@/components/gudang/gudang-header'
import useSWR from 'swr'
import { fetcher, apiClient } from '@/lib/api-client'
import { format } from 'date-fns'
import { id as idLocale } from 'date-fns/locale'
import { toast } from 'sonner'
import type { PartRequest } from '@/types'

export default function ApprovalsPage() {
  const [selectedRequest, setSelectedRequest] = useState<PartRequest | null>(null)
  const [rejectReason, setRejectReason] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { data: requestsRaw, isLoading, mutate } = useSWR(
    '/gudang/part-requests?limit=100',
    fetcher
  )

  const requests: PartRequest[] = Array.isArray(requestsRaw?.data) ? requestsRaw.data : []

  const pendingRequests = requests.filter(r => r.status === 'pending')
  const approvedRequests = requests.filter(r => r.status === 'approved')
  const rejectedRequests = requests.filter(r => r.status === 'rejected')

  const handleApprove = async (id: string) => {
    setIsSubmitting(true)
    try {
      await apiClient.post(`/gudang/part-requests/${id}/approve`)
      toast.success('Permintaan disetujui')
      mutate()
      setSelectedRequest(null)
    } catch (error) {
      toast.error('Gagal menyetujui permintaan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleReject = async (id: string) => {
    if (!rejectReason) {
      toast.error('Alasan penolakan wajib diisi')
      return
    }
    setIsSubmitting(true)
    try {
      await apiClient.post(`/gudang/part-requests/${id}/reject`, { reason: rejectReason })
      toast.success('Permintaan ditolak')
      mutate()
      setSelectedRequest(null)
      setRejectReason('')
    } catch (error) {
      toast.error('Gagal menolak permintaan')
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDateString = (dateStr: string) => {
    try {
      return format(new Date(dateStr), 'dd MMM yyyy HH:mm', { locale: idLocale })
    } catch (e) {
      return dateStr
    }
  }

  return (
    <>
      <GudangHeader title="Validasi Permintaan" description="Kelola persetujuan permintaan sparepart dari mekanik" />
      
      <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
        <div className="mx-auto max-w-7xl space-y-6">
          
          {/* Stats Grid */}
          <div className="grid gap-4 md:grid-cols-4">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Total Pending</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-amber-500">{isLoading ? '...' : pendingRequests.length}</div>
                <p className="text-[10px] text-slate-400 font-medium">Menunggu validasi</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Disetujui</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-emerald-600">{isLoading ? '...' : approvedRequests.length}</div>
                <p className="text-[10px] text-slate-400 font-medium font-bold">Total disetujui</p>
              </CardContent>
            </Card>
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="pb-2">
                <CardTitle className="text-xs font-bold text-slate-500 uppercase tracking-wider">Ditolak</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-slate-400">{isLoading ? '...' : rejectedRequests.length}</div>
                <p className="text-[10px] text-slate-400 font-medium font-bold">Total ditolak</p>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="pending" className="space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <TabsList className="bg-slate-100 p-1 rounded-xl">
                <TabsTrigger value="pending" className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Clock className="size-4 mr-2" />
                  Pending
                  <Badge className="ml-2 bg-amber-500 text-white border-none h-5 px-1.5 min-w-[20px] justify-center">{pendingRequests.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="approved" className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <Check className="size-4 mr-2" />
                  Disetujui
                </TabsTrigger>
                <TabsTrigger value="rejected" className="rounded-lg px-4 py-2 text-sm data-[state=active]:bg-white data-[state=active]:shadow-sm">
                  <X className="size-4 mr-2" />
                  Ditolak
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="pending" className="mt-0">
              {isLoading ? (
                <div className="flex justify-center py-20">
                  <Loader2 className="size-8 animate-spin text-slate-300" />
                </div>
              ) : pendingRequests.length > 0 ? (
                <div className="space-y-4">
                  {pendingRequests.map((req) => (
                    <Card key={req.id} className="shadow-sm transition-all hover:shadow-md border-slate-200">
                      <CardContent className="p-6">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                          <div className="space-y-4 flex-1">
                            <div className="flex flex-wrap items-center gap-3">
                              <div className="size-10 rounded-xl bg-slate-100 flex items-center justify-center">
                                <FileText className="size-5 text-slate-500" />
                              </div>
                              <div>
                                <div className="flex items-center gap-2">
                                  <span className="font-mono font-bold text-slate-900">SPK: {req.spk_number || 'N/A'}</span>
                                </div>
                                <div className="text-[11px] text-slate-400 font-medium">
                                  {req.vehicle_plate || 'No Plate'} • {formatDateString(req.created_at)}
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="flex items-center gap-3 bg-slate-50 p-2.5 rounded-lg border border-slate-100">
                                <div className="size-8 rounded-full bg-white flex items-center justify-center text-xs font-bold text-slate-600 border border-slate-100">
                                  {(req.mekanik_name || '??').substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-tighter">Diminta Oleh</p>
                                  <p className="text-sm font-bold text-slate-700">{req.mekanik_name || 'Mekanik Tidak Diketahui'}</p>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-1.5 items-center">
                                {req.items.map((item: any, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-[10px] bg-white border-slate-200 text-slate-600 font-medium px-2 py-0">
                                    {item.sparepart_name} x{item.quantity}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-wrap lg:flex-col gap-2 shrink-0">
                            <Dialog open={selectedRequest?.id === req.id} onOpenChange={(open) => !open && setSelectedRequest(null)}>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="flex-1 lg:w-32 h-9 text-xs font-bold border-slate-200 hover:bg-slate-50" onClick={() => setSelectedRequest(req)}>
                                  <Eye className="mr-2 size-3 text-slate-500" />
                                  Detail
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md">
                                <DialogHeader>
                                  <DialogTitle>Detail Permintaan SPK: {req.spk_number || 'N/A'}</DialogTitle>
                                </DialogHeader>
                                <div className="space-y-4 py-4">
                                  <div className="grid grid-cols-2 gap-4 text-xs font-medium">
                                    <div className="bg-slate-50 p-3 rounded-xl">
                                      <p className="text-slate-400 mb-1">Mekanik</p>
                                      <p className="font-bold text-slate-900">{req.mekanik_name || 'N/A'}</p>
                                    </div>
                                    <div className="bg-slate-50 p-3 rounded-xl text-right">
                                      <p className="text-slate-400 mb-1">Tanggal</p>
                                      <p className="font-bold text-slate-900">{formatDateString(req.created_at)}</p>
                                    </div>
                                  </div>
                                  
                                  <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Daftar Item ({req.items.length})</p>
                                    <div className="rounded-xl border border-slate-100 overflow-hidden divide-y divide-slate-100 bg-white">
                                      {req.items.map((item: any, idx: number) => (
                                        <div key={idx} className="flex items-center justify-between p-3">
                                          <div>
                                            <p className="font-bold text-sm text-slate-900">{item.sparepart_name}</p>
                                            <p className="text-[10px] text-slate-400 font-mono">{item.sparepart_code}</p>
                                          </div>
                                          <div className="flex items-center gap-1.5">
                                            <span className="text-xs text-slate-400">Qty:</span>
                                            <Badge variant="secondary" className="bg-slate-900 text-[#FFC107] border-none font-bold">x{item.quantity}</Badge>
                                          </div>
                                        </div>
                                      ))}
                                    </div>
                                  </div>

                                  <div className="space-y-2">
                                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest pl-1">Alasan Penolakan (Opsional)</p>
                                    <Textarea 
                                      placeholder="Isi jika ingin menolak..." 
                                      value={rejectReason}
                                      onChange={(e) => setRejectReason(e.target.value)}
                                      className="min-h-[80px]"
                                    />
                                  </div>
                                </div>
                                <DialogFooter className="gap-2 sm:gap-0">
                                  <div className="flex flex-1 gap-2">
                                    <Button variant="destructive" className="flex-1 font-bold h-11" disabled={isSubmitting} onClick={() => handleReject(req.id)}>
                                      <X className="mr-2 size-4" />
                                      Tolak
                                    </Button>
                                    <Button className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white font-bold h-11" disabled={isSubmitting} onClick={() => handleApprove(req.id)}>
                                      {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Check className="mr-2 size-4" />}
                                      Setujui
                                    </Button>
                                  </div>
                                </DialogFooter>
                              </DialogContent>
                            </Dialog>

                            <div className="flex gap-2">
                              <Button className="h-9 px-4 text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg shadow-sm" disabled={isSubmitting} onClick={() => handleApprove(req.id)}>
                                <Check className="mr-2 size-3" />
                                Setujui
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="border-dashed border-2 border-slate-200 bg-white">
                  <CardContent className="flex flex-col items-center justify-center py-20 text-center">
                    <div className="size-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
                      <Check className="size-8 text-emerald-500" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900">Semua Beres!</h3>
                    <p className="text-sm text-slate-500 max-w-xs mt-1">Tidak ada permintaan pending yang menunggu validasi saat ini.</p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="approved" className="mt-0 space-y-4">
              {approvedRequests.map((req) => (
                <Card key={req.id} className="border-slate-200 shadow-sm opacity-80 transition-opacity hover:opacity-100">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-emerald-50 flex items-center justify-center">
                          <Check className="size-4 text-emerald-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-700 text-sm">{req.spk_number || 'N/A'}</span>
                            <Badge className="bg-emerald-100 text-emerald-700 border-none text-[8px] font-bold uppercase py-0 px-1.5 h-3.5">Approved</Badge>
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium">{req.mekanik_name || 'N/A'} • {req.items.length} item</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{formatDateString(req.created_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="rejected" className="mt-0 space-y-4">
              {rejectedRequests.map((req) => (
                <Card key={req.id} className="border-slate-200 shadow-sm opacity-80 hover:opacity-100 border-l-4 border-l-slate-300">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="size-9 rounded-lg bg-slate-100 flex items-center justify-center">
                          <X className="size-4 text-slate-500" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-bold text-slate-700 text-sm">{req.spk_number || 'N/A'}</span>
                            <Badge className="bg-slate-200 text-slate-600 border-none text-[8px] font-bold uppercase py-0 px-1.5 h-3.5">Rejected</Badge>
                          </div>
                          <p className="text-[10px] text-slate-400 font-medium">{req.mekanik_name || 'N/A'} • {req.items.length} item</p>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 bg-slate-50 px-2 py-1 rounded-md">{formatDateString(req.created_at)}</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>
          </Tabs>

        </div>
      </div>
    </>
  )
}
