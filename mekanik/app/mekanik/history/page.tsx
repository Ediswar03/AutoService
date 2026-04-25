"use client"

import { useState } from "react"
import { Car, Clock, Calendar, Star, TrendingUp, CheckCircle2, ChevronRight, Search, User, Award } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"

const mockHistory = [
  {
    id: "1",
    spkNumber: "SPK-2024-005",
    customer: "Andi Pratama",
    vehicle: { brand: "Mitsubishi", model: "Xpander", plateNumber: "B 7890 MNO" },
    serviceType: "Service Berkala 20.000km",
    completedAt: new Date("2024-01-14T16:00:00"),
    duration: 145,
    rating: 5,
    review: "Mekanik sangat teliti dan profesional",
  },
  {
    id: "2",
    spkNumber: "SPK-2024-004",
    customer: "Dewi Lestari",
    vehicle: { brand: "Suzuki", model: "Ertiga", plateNumber: "B 3456 JKL" },
    serviceType: "Ganti Kampas Rem",
    completedAt: new Date("2024-01-13T14:30:00"),
    duration: 50,
    rating: 4,
    review: "Bagus, tapi agak lama menunggu parts",
  },
  {
    id: "3",
    spkNumber: "SPK-2024-003",
    customer: "Rudi Hermawan",
    vehicle: { brand: "Toyota", model: "Innova", plateNumber: "B 2345 PQR" },
    serviceType: "Perbaikan AC + Tune Up",
    completedAt: new Date("2024-01-12T17:00:00"),
    duration: 180,
    rating: 5,
    review: "AC dingin lagi, mesin halus. Mantap!",
  },
]

const stats = {
  totalJobs: 45,
  avgDuration: 95,
  avgRating: 4.8,
  completionRate: 98,
}

export default function HistoryPage() {
  const [searchQuery, setSearchQuery] = useState("")

  const filteredHistory = mockHistory.filter((job) => {
    return (
      searchQuery === "" ||
      job.spkNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })

  return (
    <div className="space-y-6">
      {/* Stats Summary - Floating Tiles */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Selesai", value: stats.totalJobs, icon: CheckCircle2, color: "text-emerald-400", bg: "bg-emerald-500/10" },
          { label: "Rating", value: stats.avgRating, icon: Star, color: "text-amber-400", bg: "bg-amber-500/10" },
          { label: "Waktu Rata", value: `${stats.avgDuration}m`, icon: Clock, color: "text-blue-400", bg: "bg-blue-500/10" },
          { label: "Tingkat", value: `${stats.completionRate}%`, icon: TrendingUp, color: "text-primary", bg: "bg-primary/10" },
        ].map((s) => (
          <Card key={s.label} className="bg-zinc-900 border-white/5 rounded-2xl overflow-hidden relative group">
            <div className={cn("absolute inset-0 opacity-5 group-hover:opacity-10 transition-opacity", s.bg)} />
            <CardContent className="p-4 flex items-center gap-3 relative z-10">
              <div className={cn("h-9 w-9 rounded-xl flex items-center justify-center border border-white/5", s.bg)}>
                <s.icon className={cn("h-4.4 w-4.5", s.color)} />
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
        
        {filteredHistory.map((job) => (
          <Card key={job.id} className="bg-zinc-900/60 border-white/5 hover:border-white/10 transition-all duration-300 rounded-2xl overflow-hidden group cursor-pointer active:scale-[0.98]">
            <CardContent className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[11px] font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20 leading-none">
                      {job.spkNumber}
                    </span>
                    <Badge variant="outline" className="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 text-[9px] font-black uppercase h-5 px-1.5">
                      ✓ Selesai
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-100 font-black uppercase italic tracking-tight text-sm pt-2">
                     <User className="h-3.5 w-3.5 text-zinc-500" />
                     {job.customer}
                  </div>
                </div>
                <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-white/10 flex flex-col items-center justify-center shadow-inner">
                   <Star className="h-3.5 w-3.5 text-amber-400 fill-amber-400" />
                   <span className="text-[10px] font-black text-zinc-200 mt-0.5">{job.rating}.0</span>
                </div>
              </div>

              {/* Service & Vehicle */}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">
                  <Car className="h-3 w-3 shrink-0" />
                  <span className="truncate">{job.vehicle.brand} {job.vehicle.model} <span className="mx-1">&bull;</span> {job.vehicle.plateNumber}</span>
                </div>
                <p className="text-sm font-black text-zinc-200 uppercase italic tracking-tight flex items-center gap-2 pl-0.5">
                  <Award className="h-3.5 w-3.5 text-primary" />
                  {job.serviceType}
                </p>
              </div>

              {/* Review Snippet if exists */}
              {job.review && (
                <div className="bg-black/30 rounded-xl p-3 border border-white/5 border-dashed">
                  <p className="text-[11px] text-zinc-400 italic font-medium leading-relaxed">
                    &ldquo;{job.review}&rdquo;
                  </p>
                </div>
              )}

              {/* Footer */}
              <div className="flex items-center justify-between pt-2 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-600 uppercase">
                    <Calendar className="h-3 w-3" />
                    {job.completedAt.toLocaleDateString("id-ID", { day: '2-digit', month: 'short' })}
                  </div>
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-600 uppercase">
                    <Clock className="h-3 w-3 font-bold" />
                    {job.duration}M
                  </div>
                </div>
                <button className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-[0.1em] group-hover:gap-2 transition-all">
                  Lihat <ChevronRight className="h-3 w-3" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
