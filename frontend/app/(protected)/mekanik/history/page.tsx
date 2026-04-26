"use client"

import { useState } from "react"
import { Car, Clock, Calendar, Star, TrendingUp, CheckCircle2, ChevronRight, Search, Award, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import useSWR from "swr"
import { fetcher } from "@/lib/api-client"
import { useAuth } from "@/context/AuthContext"

export default function HistoryPage() {
  const { user } = useAuth()
  const [searchQuery, setSearchQuery] = useState("")

  const { data: woData, isLoading } = useSWR(
    user
      ? `/work-orders?assignedMechanicId=${user.id}&status=COMPLETED&limit=100&sortBy=updatedAt&sortOrder=desc`
      : null,
    fetcher
  )
  const { data: invoicedData } = useSWR(
    user
      ? `/work-orders?assignedMechanicId=${user.id}&status=INVOICED&limit=100&sortBy=updatedAt&sortOrder=desc`
      : null,
    fetcher
  )

  const completedJobs: any[] = [
    ...(Array.isArray(woData?.data) ? woData.data : []),
    ...(Array.isArray(invoicedData?.data) ? invoicedData.data : []),
  ]

  const totalJobs = completedJobs.length
  const avgRating = 4.8 // Akan diisi dari API rating jika tersedia

  const filteredHistory = completedJobs.filter((job: any) => {
    const spkNumber = job.orderNumber || job.spkNumber || ""
    const customerName = job.customer?.name || ""
    const plate = job.vehicle?.licensePlate || job.vehicle?.plateNumber || ""
    return (
      searchQuery === "" ||
      spkNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plate.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  const stats = [
    { label: "Selesai",    value: isLoading ? "..." : totalJobs,     icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
    { label: "Rating",     value: avgRating,                          icon: Star,         color: "text-amber-400",   bg: "bg-amber-500/10" },
    { label: "WO Aktif",   value: "—",                                icon: Clock,        color: "text-blue-400",    bg: "bg-blue-500/10" },
    { label: "Performa",   value: totalJobs > 0 ? "98%" : "—",       icon: TrendingUp,   color: "text-primary",     bg: "bg-primary/10" },
  ]

  return (
    <div className="space-y-6">
      {/* Stats Summary */}
      <div className="grid grid-cols-2 gap-3">
        {stats.map((s) => (
          <Card key={s.label} className="bg-zinc-900 border-white/5 rounded-2xl overflow-hidden relative group">
            <div className={cn("absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity", s.bg)} />
            <CardContent className="p-4 flex items-center gap-3 relative z-10">
              <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center border border-white/5", s.bg)}>
                <s.icon className={cn("h-4 w-4", s.color)} />
              </div>
              <div>
                <p className={cn("text-xl font-black italic leading-none", s.color)}>{s.value}</p>
                <p className="text-[8px] font-black uppercase tracking-widest text-zinc-500 mt-1">{s.label}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
        <Input
          placeholder="Cari riwayat pekerjaan..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-10 bg-zinc-900 border-white/5 focus:border-primary/50 transition-all rounded-xl"
        />
      </div>

      {/* History List */}
      <div className="space-y-4">
        <h3 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Riwayat Selesai</h3>

        {isLoading ? (
          <Card className="bg-zinc-900/50 border-white/5">
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Memuat Riwayat...</p>
            </CardContent>
          </Card>
        ) : filteredHistory.length === 0 ? (
          <Card className="bg-zinc-900/50 border-white/5 border-dashed">
            <CardContent className="py-12 text-center">
              <CheckCircle2 className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">
                {searchQuery ? "Tidak ada riwayat ditemukan" : "Belum ada pekerjaan selesai"}
              </p>
            </CardContent>
          </Card>
        ) : (
          filteredHistory.map((job: any) => {
            const spkNumber   = job.orderNumber || job.spkNumber || "-"
            const customerName = job.customer?.name || "-"
            const brand = job.vehicle?.brand || ""
            const model = job.vehicle?.model || ""
            const plate = job.vehicle?.licensePlate || job.vehicle?.plateNumber || "-"
            const serviceType = job.services?.[0]?.service?.name || "Servis Umum"
            const completedAt = job.actualCompletion || job.updatedAt || job.createdAt
            const completedDate = completedAt ? new Date(completedAt) : null
            const grandTotal = Number(job.grandTotal || 0)

            return (
              <Card key={job.id} className="bg-zinc-900/60 border-white/5 hover:border-white/10 transition-all duration-300 rounded-2xl overflow-hidden group cursor-pointer active:scale-[0.98]">
                <CardContent className="p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-[11px] font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20 leading-none">
                          {spkNumber}
                        </span>
                        <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-black uppercase h-5 px-1.5">
                          ✓ Selesai
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2 text-zinc-100 font-black uppercase italic tracking-tight text-sm pt-2">
                        <Award className="h-3.5 w-3.5 text-zinc-500" />
                        {customerName}
                      </div>
                    </div>
                    <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-white/10 flex flex-col items-center justify-center shadow-inner">
                      <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                      <span className="text-[10px] font-black text-zinc-200 mt-0.5">5.0</span>
                    </div>
                  </div>

                  {/* Vehicle & Service */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">
                      <Car className="h-3 w-3 shrink-0" />
                      <span className="truncate">{brand} {model} {plate !== "-" && `• ${plate}`}</span>
                    </div>
                    <p className="text-sm font-black text-zinc-200 uppercase italic tracking-tight flex items-center gap-2 pl-0.5">
                      <Award className="h-3.5 w-3.5 text-primary" />
                      {serviceType}
                    </p>
                  </div>

                  {/* Total */}
                  {grandTotal > 0 && (
                    <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Total Tagihan</span>
                        <span className="text-sm font-black text-primary font-mono">
                          Rp {grandTotal.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2 border-t border-white/5">
                    <div className="flex items-center gap-4">
                      {completedDate && (
                        <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-600 uppercase">
                          <Calendar className="h-3 w-3" />
                          {completedDate.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                        </div>
                      )}
                    </div>
                    <button className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-[0.1em] group-hover:gap-2 transition-all">
                      Lihat <ChevronRight className="h-3 w-3" />
                    </button>
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
