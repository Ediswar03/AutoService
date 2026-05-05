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

import { cn } from '@/lib/utils'
import { Skeleton } from '@/components/ui/skeleton'

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
      toast.success('Permintaan berhasil disetujui')
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
      toast.success('Permintaan telah ditolak')
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
      <GudangHeader title="Persetujuan" description="Validasi dan verifikasi permintaan sparepart mekanik" />
      
      <div className="flex-1 overflow-auto p-4 sm:p-6 bg-slate-50/50 dark:bg-black/20">
        <div className="mx-auto max-w-7xl space-y-8">
          
          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-3">
            <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center border border-amber-100 dark:border-amber-500/20">
                  <Clock className="size-6 text-amber-600 dark:text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Pending Validasi</p>
                  <h3 className="text-2xl font-black text-amber-600 leading-none">{isLoading ? '...' : pendingRequests.length}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                  <Check className="size-6 text-emerald-600 dark:text-emerald-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Disetujui</p>
                  <h3 className="text-2xl font-black text-emerald-600 leading-none">{isLoading ? '...' : approvedRequests.length}</h3>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-2xl overflow-hidden">
              <CardContent className="p-5 flex items-center gap-4">
                <div className="size-12 rounded-2xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center border border-rose-100 dark:border-rose-500/20">
                  <X className="size-6 text-rose-600 dark:text-rose-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Total Ditolak</p>
                  <h3 className="text-2xl font-black text-rose-600 leading-none">{isLoading ? '...' : rejectedRequests.length}</h3>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <Tabs defaultValue="pending" className="space-y-8">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 bg-white dark:bg-zinc-900/50 p-3 rounded-[2rem] border border-slate-200 dark:border-white/5 shadow-sm">
              <TabsList className="bg-transparent gap-2">
                <TabsTrigger value="pending" className="rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-amber-500 data-[state=active]:text-white transition-all h-12">
                  <Clock className="size-4 mr-2" />
                  Pending
                  <Badge className="ml-3 bg-white/20 text-white border-none h-5 px-1.5 min-w-[24px] justify-center text-[10px] font-black">{pendingRequests.length}</Badge>
                </TabsTrigger>
                <TabsTrigger value="approved" className="rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-emerald-500 data-[state=active]:text-white transition-all h-12">
                  <Check className="size-4 mr-2" />
                  Disetujui
                </TabsTrigger>
                <TabsTrigger value="rejected" className="rounded-2xl px-6 py-3 text-[10px] font-black uppercase tracking-widest data-[state=active]:bg-rose-500 data-[state=active]:text-white transition-all h-12">
                  <X className="size-4 mr-2" />
                  Ditolak
                </TabsTrigger>
              </TabsList>
            </div>

            <TabsContent value="pending" className="mt-0">
              {isLoading ? (
                <div className="space-y-4">
                  <Skeleton className="h-32 w-full rounded-[2rem]" />
                  <Skeleton className="h-32 w-full rounded-[2rem]" />
                </div>
              ) : pendingRequests.length > 0 ? (
                <div className="grid gap-6">
                  {pendingRequests.map((req) => (
                    <Card key={req.id} className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-[2rem] overflow-hidden group hover:shadow-xl transition-all duration-500 border-l-8 border-l-amber-500">
                      <CardContent className="p-8">
                        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
                          <div className="space-y-6 flex-1">
                            <div className="flex flex-wrap items-center gap-4">
                              <div className="size-12 rounded-2xl bg-slate-50 dark:bg-black/20 flex items-center justify-center border border-slate-100 dark:border-white/5 group-hover:scale-110 transition-transform">
                                <FileText className="size-6 text-slate-400 group-hover:text-amber-500 transition-colors" />
                              </div>
                              <div>
                                <div className="flex items-center gap-3">
                                  <span className="text-xl font-black tracking-tighter text-slate-900 dark:text-white uppercase italic leading-none">
                                    SPK: {req.spk_number || 'N/A'}
                                  </span>
                                  <Badge className="bg-amber-500/10 text-amber-500 border-none text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded-lg">NEEDS ACTION</Badge>
                                </div>
                                <div className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-1.5 flex items-center gap-2">
                                  <span className="text-primary italic">{req.vehicle_plate || 'NO PLATE'}</span>
                                  <span className="opacity-30">•</span>
                                  <span>{formatDateString(req.created_at)}</span>
                                </div>
                              </div>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                              <div className="flex items-center gap-4 bg-slate-50 dark:bg-black/20 p-4 rounded-2xl border border-slate-100 dark:border-white/5">
                                <div className="size-10 rounded-xl bg-white dark:bg-zinc-800 flex items-center justify-center text-xs font-black text-slate-600 dark:text-zinc-400 border border-slate-100 dark:border-white/5 shadow-sm">
                                  {(req.mekanik_name || '??').substring(0, 2).toUpperCase()}
                                </div>
                                <div>
                                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Mekanik Pemohon</p>
                                  <p className="text-sm font-black text-slate-800 dark:text-zinc-200 uppercase italic">{req.mekanik_name || 'N/A'}</p>
                                </div>
                              </div>
                              <div className="flex flex-wrap gap-2 items-center">
                                {req.items.slice(0, 3).map((item: any, idx: number) => (
                                  <Badge key={idx} variant="outline" className="text-[9px] font-black uppercase tracking-widest bg-white dark:bg-transparent border-slate-200 dark:border-white/10 text-slate-500 px-3 py-1 rounded-xl">
                                    {item.sparepart_name} <span className="text-primary ml-1 italic">x{item.quantity}</span>
                                  </Badge>
                                ))}
                                {req.items.length > 3 && (
                                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">+{req.items.length - 3} lainnya</span>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
                            <Button className="h-12 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-widest text-[10px] rounded-2xl px-8 shadow-[0_4px_15px_rgba(16,185,129,0.3)] hover:scale-105 transition-all" disabled={isSubmitting} onClick={() => handleApprove(req.id)}>
                              <Check className="mr-2 size-4 font-black" />
                              Setujui Cepat
                            </Button>
                            
                            <Dialog open={selectedRequest?.id === req.id} onOpenChange={(open) => !open && setSelectedRequest(null)}>
                              <DialogTrigger asChild>
                                <Button variant="outline" className="h-12 rounded-2xl border-slate-200 dark:border-white/10 hover:bg-slate-50 dark:hover:bg-white/5 px-8" onClick={() => setSelectedRequest(req)}>
                                  <Eye className="mr-2 size-4 text-slate-400" />
                                  <span className="text-[10px] font-black uppercase tracking-widest">Detail & Opsi</span>
                                </Button>
                              </DialogTrigger>
                              <DialogContent className="max-w-md p-0 overflow-hidden rounded-[2.5rem] border-none shadow-2xl bg-white dark:bg-zinc-950 outline-none">
                                {selectedRequest && (
                                  <div className="flex flex-col">
                                    <div className="bg-[#0A0A0B] p-10 text-white relative overflow-hidden">
                                      <div className="absolute top-0 right-0 p-8 opacity-[0.03] rotate-12">
                                        <AlertTriangle className="size-40" />
                                      </div>
                                      <div className="absolute inset-0 bg-gradient-to-br from-amber-500/20 via-transparent to-transparent" />
                                      
                                      <div className="relative z-10">
                                        <Badge className="bg-amber-500 text-white border-none mb-6 font-black text-[10px] uppercase tracking-widest px-3 py-1 rounded-lg shadow-[0_0_15px_rgba(245,158,11,0.4)]">VALIDASI GUDANG</Badge>
                                        <h2 className="text-[1.75rem] font-black tracking-tighter uppercase italic leading-none mb-4">Request Sparepart</h2>
                                        <div className="flex items-center gap-3 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                                          <span className="text-amber-500 italic">SPK: {selectedRequest.spk_number}</span>
                                          <span className="opacity-30">•</span>
                                          <span>{selectedRequest.vehicle_plate}</span>
                                        </div>
                                      </div>
                                    </div>

                                    <div className="p-8 space-y-8">
                                      <div className="grid grid-cols-2 gap-8">
                                        <div className="space-y-2">
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Petugas Mekanik</p>
                                          <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic">{selectedRequest.mekanik_name || 'N/A'}</p>
                                        </div>
                                        <div className="space-y-2 text-right">
                                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Waktu Permohonan</p>
                                          <p className="text-sm font-black text-slate-900 dark:text-white uppercase italic">{formatDateString(selectedRequest.created_at)}</p>
                                        </div>
                                      </div>
                                      
                                      <div className="space-y-3">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Daftar Item ({selectedRequest.items.length})</p>
                                        <div className="rounded-[2rem] border border-slate-100 dark:border-white/5 overflow-hidden bg-slate-50/50 dark:bg-black/20">
                                          {selectedRequest.items.map((item: any, idx: number) => (
                                            <div key={idx} className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-white/5 last:border-0">
                                              <div>
                                                <p className="font-black text-slate-900 dark:text-white uppercase italic text-sm tracking-tight">{item.sparepart_name}</p>
                                                <p className="text-[10px] font-mono font-black text-slate-400 uppercase tracking-widest mt-0.5">{item.sparepart_code}</p>
                                              </div>
                                              <div className="flex items-center gap-2">
                                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Qty:</span>
                                                <Badge className="bg-[#0A0A0B] dark:bg-primary text-primary dark:text-black border-none font-black text-sm italic italic tracking-tighter rounded-lg px-3 py-1">x{item.quantity}</Badge>
                                              </div>
                                            </div>
                                          ))}
                                        </div>
                                      </div>

                                      <div className="space-y-3">
                                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest px-1">Justifikasi Penolakan</p>
                                        <Textarea 
                                          placeholder="Tulis alasan jika Anda memutuskan untuk menolak permintaan ini..." 
                                          value={rejectReason}
                                          onChange={(e) => setRejectReason(e.target.value)}
                                          className="min-h-[100px] rounded-2xl bg-slate-50 dark:bg-black/20 border-slate-200 dark:border-white/5 text-sm p-4 font-medium"
                                        />
                                      </div>
                                    </div>

                                    <div className="p-8 bg-slate-50 dark:bg-black/20 flex gap-3 border-t border-slate-100 dark:border-white/5">
                                      <Button variant="ghost" className="flex-1 h-14 text-[10px] font-black uppercase tracking-widest text-slate-500 rounded-2xl" onClick={() => setSelectedRequest(null)}>Kembali</Button>
                                      <Button variant="destructive" className="flex-1 h-14 text-[10px] font-black uppercase tracking-widest rounded-2xl" disabled={isSubmitting} onClick={() => handleReject(selectedRequest.id)}>Tolak</Button>
                                      <Button className="flex-1 h-14 bg-emerald-500 hover:bg-emerald-600 text-white text-[10px] font-black uppercase tracking-widest rounded-2xl shadow-[0_4px_15px_rgba(16,185,129,0.3)]" disabled={isSubmitting} onClick={() => handleApprove(selectedRequest.id)}>
                                        {isSubmitting ? <Loader2 className="size-4 animate-spin" /> : 'Setujui'}
                                      </Button>
                                    </div>
                                  </div>
                                )}
                              </DialogContent>
                            </Dialog>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card className="bg-white dark:bg-zinc-900 border-2 border-dashed border-slate-200 dark:border-white/5 rounded-[3rem]">
                  <CardContent className="flex flex-col items-center justify-center py-24 text-center">
                    <div className="size-20 rounded-full bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center mb-6">
                      <Check className="size-10 text-emerald-500" />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 dark:text-white uppercase italic tracking-tighter">Semua Beres!</h3>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] max-w-xs mt-3 leading-relaxed">
                      TIDAK ADA PERMINTAAN SPAREPART YANG MENUNGGU VALIDASI SAAT INI.
                    </p>
                  </CardContent>
                </Card>
              )}
            </TabsContent>

            <TabsContent value="approved" className="mt-0 space-y-4">
              {approvedRequests.map((req) => (
                <Card key={req.id} className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-2xl overflow-hidden group border-l-4 border-l-emerald-500 opacity-80 hover:opacity-100 transition-opacity">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-emerald-50 dark:bg-emerald-500/10 flex items-center justify-center border border-emerald-100 dark:border-emerald-500/20">
                          <Check className="size-5 text-emerald-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-black text-slate-900 dark:text-white uppercase italic text-sm tracking-tight">{req.spk_number || 'N/A'}</span>
                            <Badge className="bg-emerald-100 dark:bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border-none text-[8px] font-black uppercase px-2 py-0.5 rounded-md">APPROVED</Badge>
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{req.mekanik_name || 'N/A'} • {req.items.length} item</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-white/5 px-3 py-1 rounded-lg border border-slate-100 dark:border-white/5">{formatDateString(req.created_at)}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </TabsContent>

            <TabsContent value="rejected" className="mt-0 space-y-4">
              {rejectedRequests.map((req) => (
                <Card key={req.id} className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 shadow-sm rounded-2xl overflow-hidden group border-l-4 border-l-rose-500 opacity-80 hover:opacity-100 transition-opacity">
                  <CardContent className="p-5">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="size-10 rounded-xl bg-rose-50 dark:bg-rose-500/10 flex items-center justify-center border border-rose-100 dark:border-rose-500/20">
                          <X className="size-5 text-rose-600" />
                        </div>
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="font-black text-slate-900 dark:text-white uppercase italic text-sm tracking-tight">{req.spk_number || 'N/A'}</span>
                            <Badge className="bg-rose-100 dark:bg-rose-500/10 text-rose-700 dark:text-rose-400 border-none text-[8px] font-black uppercase px-2 py-0.5 rounded-md">REJECTED</Badge>
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mt-0.5">{req.mekanik_name || 'N/A'} • {req.items.length} item</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest bg-slate-50 dark:bg-white/5 px-3 py-1 rounded-lg border border-slate-100 dark:border-white/5">{formatDateString(req.created_at)}</p>
                      </div>
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
