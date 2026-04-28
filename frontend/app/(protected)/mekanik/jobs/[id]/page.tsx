'use client'

import { use, useState } from "react"
import Link from "next/link"
import { 
  Clock, Car, User, Phone, Calendar, 
  Wrench, ClipboardCheck, Package, CheckCircle2,
  AlertTriangle, MessageSquare, Info, ShieldCheck, Loader2
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import useSWR from "swr"
import { fetcher, apiClient } from "@/lib/api-client"
import { toast } from "sonner"
import { format } from "date-fns"
import { id as localeId } from "date-fns/locale"
import { PartRequestDialog } from "@/components/mekanik/PartRequestDialog"

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING: { label: "Pending", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  IN_PROGRESS: { label: "Dikerjakan", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  WAITING_PARTS: { label: "Tunggu Parts", className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  COMPLETED: { label: "Selesai", className: "bg-green-500/10 text-green-600 border-green-500/20" },
  CANCELLED: { label: "Dibatalkan", className: "bg-red-500/10 text-red-600 border-red-500/20" },
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  LOW: { label: "Low", className: "text-zinc-500" },
  NORMAL: { label: "Normal", className: "text-blue-400" },
  HIGH: { label: "High", className: "text-amber-400" },
  URGENT: { label: "Urgent", className: "text-red-400" },
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [isUpdating, setIsUpdating] = useState(false)
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)
  
  const { data: woData, isLoading, error, mutate } = useSWR(`/work-orders/${id}`, fetcher)
  const job = woData?.data

  const handleUpdateStatus = async (status: string) => {
    setIsUpdating(true)
    try {
      await apiClient.patch(`/work-orders/${id}/status`, { status })
      toast.success(`Status berhasil diubah ke ${status}`)
      mutate()
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal mengubah status")
    } finally {
      setIsUpdating(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading Job Data...</p>
      </div>
    )
  }

  if (error || !job) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] gap-6 px-6 text-center">
        <div className="size-20 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
          <AlertTriangle className="size-10 text-red-500" />
        </div>
        <div className="space-y-2">
          <h3 className="text-xl font-black uppercase italic text-white">Job Not Found</h3>
          <p className="text-zinc-500 text-sm">SPK tidak ditemukan atau Anda tidak memiliki akses.</p>
        </div>
        <Link href="/mekanik/jobs">
          <Button variant="outline" className="rounded-xl border-white/10 text-zinc-400 uppercase font-black text-xs h-12 px-8">
            Back to Jobs
          </Button>
        </Link>
      </div>
    )
  }

  const status = statusConfig[job.status] || { label: job.status, className: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20" }
  const priority = priorityConfig[job.priority] || { label: job.priority, className: "text-zinc-500" }

  return (
    <div className="space-y-6 pb-20">
      {/* Detail Header Info */}
      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Workshop Task</span>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">
            {job.orderNumber}
          </h2>
        </div>
        <Badge variant="outline" className={cn("text-[11px] font-black uppercase italic border-0 px-4 h-8 flex items-center shadow-inner", status.className)}>
          <div className="h-1.5 w-1.5 rounded-full bg-current mr-2 opacity-50" />
          {status.label}
        </Badge>
      </div>

      <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-y border-white/5 py-3 px-1">
         <span className="flex items-center gap-1.5">
           <Clock className="h-3 w-3" /> 
           {format(new Date(job.createdAt), 'HH:mm', { locale: localeId })} WIB
         </span>
         <span className="h-3 w-px bg-white/10" />
         <span className="flex items-center gap-1.5">
           <Calendar className="h-3 w-3" /> 
           {format(new Date(job.createdAt), 'dd MMM yyyy', { locale: localeId })}
         </span>
         <span className={cn("ml-auto font-bold uppercase", priority.className)}>PRIORITY: {priority.label}</span>
      </div>

      {/* Customer & Vehicle Grid */}
      <div className="grid gap-6">
        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2 px-1">
            <User className="h-3 w-3 text-primary" /> Informasi Pemilik
          </h4>
          <Card className="bg-zinc-900/50 rounded-2xl border border-white/5 overflow-hidden">
            <CardContent className="p-5 flex items-center justify-between">
              <div className="space-y-1">
                <p className="text-xl font-black text-zinc-100 uppercase italic tracking-tight">{job.customer?.name}</p>
                <p className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 leading-none">
                  <Phone className="h-3 w-3" /> {job.customer?.phone}
                </p>
                <p className="text-[10px] text-zinc-500 font-medium">{job.customer?.email || 'No email provided'}</p>
              </div>
              <Button size="icon" variant="outline" className="rounded-xl bg-zinc-950 border-white/10 text-primary active:scale-90 transition-transform">
                <Phone className="h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2 px-1">
            <Car className="h-3 w-3 text-primary" /> Spesifikasi Unit
          </h4>
          <div className="bg-zinc-900/50 rounded-3xl border border-white/5 p-4 grid grid-cols-2 gap-3">
            {[
              { label: "Merk/Model", value: `${job.vehicle?.brand} ${job.vehicle?.model}`, icon: Info },
              { label: "Plat Nomor", value: job.vehicle?.licensePlate, icon: ShieldCheck, isPrimary: true },
              { label: "Warna", value: job.vehicle?.color, icon: Info },
              { label: "Kilometer In", value: `${(job.odometerIn || 0).toLocaleString()} KM`, icon: Clock },
            ].map((item, idx) => (
              <div key={idx} className="bg-black/40 rounded-2xl p-4 border border-white/5 flex flex-col justify-center">
                <p className="text-[8px] text-zinc-600 font-black uppercase mb-1">{item.label}</p>
                <p className={cn("text-[11px] font-black uppercase truncate", item.isPrimary ? "text-primary font-mono" : "text-zinc-200")}>{item.value}</p>
              </div>
            ))}
            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 col-span-2">
              <p className="text-[8px] text-zinc-600 font-black uppercase mb-1">Nomor Rangka (VIN)</p>
              <p className="text-[11px] font-black text-zinc-400 font-mono tracking-wider">{job.vehicle?.vin || '-'}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2 px-1">
            <Wrench className="h-3 w-3 text-primary" /> Instruksi Kerja
          </h4>
          <div className="bg-zinc-900 rounded-[32px] border border-white/5 overflow-hidden">
            <div className="bg-primary/10 px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <span className="text-sm font-black text-primary uppercase italic tracking-tight">Main Complaint</span>
              {job.estimatedCompletion && (
                <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                  Est. {format(new Date(job.estimatedCompletion), 'dd MMM')}
                </span>
              )}
            </div>
            <div className="p-6 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-3 w-3 text-zinc-500" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Keluhan Pelanggan</span>
                </div>
                <div className="bg-black/30 rounded-2xl p-5 border border-white/5 border-dashed">
                  <p className="text-sm text-zinc-300 italic font-medium leading-relaxed">
                    &ldquo;{job.customerComplaints}&rdquo;
                  </p>
                </div>
              </div>
              
              {job.internalNotes && (
                <div>
                  <div className="flex items-center gap-2 mb-2 font-black">
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                    <span className="text-[10px] font-bold text-amber-500/70 uppercase tracking-wider">Catatan Service Advisor</span>
                  </div>
                  <div className="bg-amber-500/5 rounded-2xl p-5 border border-amber-500/10">
                    <p className="text-sm text-amber-200/70 font-medium italic">
                      &ldquo;{job.internalNotes}&rdquo;
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Primary Actions */}
      <div className="space-y-3 pt-4">
        {job.status === "PENDING" && (
          <Button 
            disabled={isUpdating}
            onClick={() => handleUpdateStatus('IN_PROGRESS')}
            className="w-full h-14 bg-primary text-black font-black uppercase text-sm tracking-[0.2em] shadow-[0_8px_30px_rgba(var(--primary),0.3)] rounded-2xl border-b-4 border-black/20 active:border-b-0 active:translate-y-1 transition-all"
          >
            {isUpdating ? <Loader2 className="animate-spin size-5" /> : <Play className="size-5 mr-3" />}
            MULAI KERJAKAN
          </Button>
        )}

        {job.status === "IN_PROGRESS" && (
          <>
            <Button 
              disabled={isUpdating}
              onClick={() => handleUpdateStatus('COMPLETED')}
              className="w-full h-14 bg-primary text-black font-black uppercase text-sm tracking-[0.2em] shadow-[0_8px_30px_rgba(var(--primary),0.3)] rounded-2xl border-b-4 border-black/20 active:border-b-0 active:translate-y-1 transition-all"
            >
              {isUpdating ? <Loader2 className="animate-spin size-5" /> : <CheckCircle2 className="h-5 w-5 mr-3" />}
              SELESAIKAN PEKERJAAN
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Button 
                variant="outline" 
                onClick={() => setRequestDialogOpen(true)}
                className="w-full h-14 bg-zinc-900 border-white/5 text-zinc-300 font-black uppercase text-[10px] tracking-widest rounded-2xl"
              >
                <Package className="h-4 w-4 mr-2" />
                Request Parts
              </Button>
              <Link href={`/mekanik/jobs/${id}/inspection`}>
                <Button variant="outline" className="w-full h-14 bg-zinc-900 border-white/5 text-zinc-300 font-black uppercase text-[10px] tracking-widest rounded-2xl">
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Inspeksi
                </Button>
              </Link>
            </div>
          </>
        )}

        {job.status === "WAITING_PARTS" && (
          <Button 
            disabled={isUpdating}
            onClick={() => handleUpdateStatus('IN_PROGRESS')}
            className="w-full h-14 bg-amber-500 text-black font-black uppercase text-sm tracking-[0.2em] shadow-[0_8px_30px_rgba(245,158,11,0.3)] rounded-2xl border-b-4 border-black/20 active:border-b-0 active:translate-y-1 transition-all"
          >
            {isUpdating ? <Loader2 className="animate-spin size-5" /> : <Wrench className="size-5 mr-3" />}
            PARTS READY: LANJUTKAN
          </Button>
        )}
      </div>

      <PartRequestDialog 
        open={requestDialogOpen} 
        onOpenChange={setRequestDialogOpen}
        workOrderId={id}
        onSuccess={() => {
          handleUpdateStatus('WAITING_PARTS')
          mutate()
        }}
      />
    </div>
  )
}

function Play({ className }: { className?: string }) {
  return (
    <svg className={className} fill="currentColor" viewBox="0 0 24 24">
      <path d="M8 5v14l11-7z" />
    </svg>
  )
}
