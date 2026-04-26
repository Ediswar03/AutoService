"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Clock, Car, User, ChevronRight, Search, MessageSquare, Loader2, ClipboardCheck, Phone, Calendar } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"
import { Wrench, X } from "lucide-react"
import useSWR from "swr"
import { fetcher } from "@/lib/api-client"
import { useAuth } from "@/context/AuthContext"

type FilterStatus = "all" | "PENDING" | "IN_PROGRESS" | "WAITING_PARTS" | "COMPLETED"

const statusConfig: Record<string, { label: string; className: string }> = {
  PENDING:       { label: "Pending",       className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  IN_PROGRESS:   { label: "Dikerjakan",    className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  WAITING_PARTS: { label: "Tunggu Parts",  className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  QUALITY_CHECK: { label: "Cek Kualitas",  className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  COMPLETED:     { label: "Selesai",       className: "bg-green-500/10 text-green-600 border-green-500/20" },
  INVOICED:      { label: "Ditagihkan",    className: "bg-teal-500/10 text-teal-600 border-teal-500/20" },
  CANCELLED:     { label: "Dibatalkan",    className: "bg-red-500/10 text-red-600 border-red-500/20" },
}

const priorityConfig: Record<string, { label: string; className: string }> = {
  LOW:    { label: "Low",    className: "bg-gray-100 text-gray-600" },
  NORMAL: { label: "Normal", className: "bg-blue-100 text-blue-600" },
  HIGH:   { label: "High",   className: "bg-orange-100 text-orange-600" },
  URGENT: { label: "Urgent", className: "bg-red-100 text-red-600" },
}

export default function JobsListPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<FilterStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const { data: woData, isLoading } = useSWR(
    user ? `/work-orders?assignedMechanicId=${user.id}&limit=100&sortBy=createdAt&sortOrder=desc` : null,
    fetcher
  )

  const allJobs: any[] = Array.isArray(woData?.data) ? woData.data : []

  const filteredJobs = allJobs.filter((job: any) => {
    const matchesStatus = activeTab === "all" || job.status === activeTab
    const spkNumber   = job.orderNumber || job.spkNumber || ""
    const customerName = job.customer?.name || ""
    const plate        = job.vehicle?.licensePlate || job.vehicle?.plateNumber || ""
    const matchesSearch =
      searchQuery === "" ||
      spkNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plate.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const statusCounts = {
    all:           allJobs.length,
    PENDING:       allJobs.filter((j: any) => j.status === "PENDING").length,
    IN_PROGRESS:   allJobs.filter((j: any) => j.status === "IN_PROGRESS").length,
    WAITING_PARTS: allJobs.filter((j: any) => j.status === "WAITING_PARTS").length,
    COMPLETED:     allJobs.filter((j: any) => j.status === "COMPLETED" || j.status === "INVOICED").length,
  }

  return (
    <div className="p-4 space-y-4">
      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Cari SPK, pelanggan, plat..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Filter Tabs */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterStatus)} className="w-fit">
          <TabsList className="h-10 inline-flex items-center gap-2 bg-zinc-900/50 p-1 rounded-xl border border-white/5">
            <TabsTrigger value="all" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4 data-[state=active]:bg-primary data-[state=active]:text-black transition-all">
              Semua ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="PENDING" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Pending ({statusCounts.PENDING})
            </TabsTrigger>
            <TabsTrigger value="IN_PROGRESS" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Progres ({statusCounts.IN_PROGRESS})
            </TabsTrigger>
            <TabsTrigger value="WAITING_PARTS" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Parts ({statusCounts.WAITING_PARTS})
            </TabsTrigger>
            <TabsTrigger value="COMPLETED" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              Selesai ({statusCounts.COMPLETED})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {isLoading ? (
          <Card className="bg-zinc-900/50 border-white/5">
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Memuat Tugas...</p>
            </CardContent>
          </Card>
        ) : filteredJobs.length === 0 ? (
          <Card className="bg-zinc-900/50 border-white/5 border-dashed">
            <CardContent className="py-12 text-center">
              <ClipboardCheck className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Tidak ada SPK ditemukan</p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job: any) => {
            const spkNumber    = job.orderNumber || job.spkNumber || "-"
            const customerName = job.customer?.name || "-"
            const phone        = job.customer?.phone || "-"
            const plate        = job.vehicle?.licensePlate || job.vehicle?.plateNumber || "-"
            const brand        = job.vehicle?.brand || ""
            const model        = job.vehicle?.model || ""
            const year         = job.vehicle?.year || ""
            const serviceType  = job.services?.[0]?.service?.name || job.serviceType || "Servis Umum"
            const complaint    = job.customerComplaints || job.description || "-"
            const priority     = job.priority || "NORMAL"
            const status       = job.status || "PENDING"
            const pConfig      = priorityConfig[priority] || priorityConfig.NORMAL
            const sConfig      = statusConfig[status] || statusConfig.PENDING
            const createdAt    = job.createdAt ? new Date(job.createdAt) : new Date()

            return (
              <Sheet key={job.id}>
                <SheetTrigger asChild>
                  <Card className="cursor-pointer bg-zinc-900/50 border-white/5 hover:border-primary/30 hover:bg-zinc-900/80 transition-all duration-300 relative overflow-hidden group rounded-2xl">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-primary transition-colors duration-300" />
                    <CardContent className="pt-5 pb-5">
                      {/* Header */}
                      <div className="flex items-start justify-between gap-2 mb-4">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 rounded-md border border-primary/20">
                            {spkNumber}
                          </span>
                          <Badge variant="outline" className={cn("text-[10px] font-black uppercase tracking-wider border-0 h-5 px-2", pConfig.className)}>
                            {pConfig.label}
                          </Badge>
                        </div>
                        <Badge variant="outline" className={cn("text-[10px] font-black uppercase italic border-0 h-6 px-3 shadow-inner", sConfig.className)}>
                          {sConfig.label}
                        </Badge>
                      </div>

                      {/* Customer Info */}
                      <div className="flex items-center gap-2 text-sm font-bold text-zinc-100 uppercase tracking-tight mb-2">
                        <User className="h-4 w-4 text-zinc-500 group-hover:text-primary transition-colors" />
                        <span>{customerName}</span>
                      </div>

                      {/* Vehicle Info */}
                      <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-4">
                        <Car className="h-3.5 w-3.5 text-zinc-600" />
                        <span>
                          {brand} {model} {year && `(${year})`}
                          {plate !== "-" && <span className="mx-1">&bull;</span>}
                          {plate}
                        </span>
                      </div>

                      {/* Service */}
                      <p className="text-sm font-black text-zinc-200 uppercase italic mb-1 tracking-tight">{serviceType}</p>
                      <p className="text-xs text-zinc-500 line-clamp-1 mb-4 font-medium">{complaint}</p>

                      {/* Footer */}
                      <div className="flex items-center justify-between pt-4 border-t border-white/5">
                        <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                          <Clock className="h-3 w-3 text-primary" />
                          <span>{createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}</span>
                        </div>
                        <div className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-[0.1em] group-hover:gap-2 transition-all">
                          <span>Lihat Detail</span>
                          <ChevronRight className="h-3 w-3" />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </SheetTrigger>

                {/* Detail Sheet */}
                <SheetContent side="bottom" className="h-[92vh] bg-zinc-950 border-x border-t border-white/10 rounded-t-[40px] p-0 overflow-hidden max-w-md mx-auto inset-x-0 outline-none">
                  <div className="h-full flex flex-col">
                    <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mt-5 mb-2 shadow-inner" />
                    <div className="flex-1 overflow-y-auto px-6 pb-28 pt-4 space-y-7">
                      <SheetHeader className="text-left space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/80">Workshop Task Order</span>
                            <SheetTitle className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none flex items-center gap-3">
                              {spkNumber}
                              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            </SheetTitle>
                          </div>
                          <Badge variant="outline" className={cn("text-[11px] font-black uppercase italic border-0 px-4 h-8 flex items-center shadow-[inset_0_1px_10px_rgba(0,0,0,0.5)]", sConfig.className)}>
                            <div className="h-1.5 w-1.5 rounded-full bg-current mr-2 opacity-50" />
                            {sConfig.label}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-y border-white/5 py-3">
                          <span className="flex items-center gap-1.5">
                            <Clock className="h-3 w-3" />
                            {createdAt.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB
                          </span>
                          <span className="h-3 w-px bg-white/10" />
                          <span className="flex items-center gap-1.5">
                            <Calendar className="h-3 w-3" />
                            {createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" })}
                          </span>
                          <span className="h-3 w-px bg-white/10 ml-auto" />
                          <span className={cn("font-bold", pConfig.className)}>PRIORITY: {pConfig.label}</span>
                        </div>
                      </SheetHeader>

                      <div className="grid gap-6">
                        {/* Customer */}
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                            <User className="h-3 w-3 text-primary" /> Informasi Pemilik
                          </h4>
                          <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-5 relative overflow-hidden">
                            <div className="flex items-center justify-between">
                              <div className="space-y-1">
                                <p className="text-xl font-black text-zinc-100 uppercase italic tracking-tight">{customerName}</p>
                                <p className="text-xs font-mono text-zinc-400 flex items-center gap-2">
                                  <Phone className="h-3 w-3" /> {phone}
                                </p>
                              </div>
                              <Button size="icon" variant="outline" className="rounded-xl bg-zinc-950 border-white/10 hover:border-primary/50 text-primary transition-all active:scale-90">
                                <Phone className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>

                        {/* Vehicle */}
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                            <Car className="h-3 w-3 text-primary" /> Spesifikasi Unit
                          </h4>
                          <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-3 grid grid-cols-3 gap-2">
                            <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                              <p className="text-[8px] text-zinc-500 font-bold uppercase mb-0.5">Merk/Model</p>
                              <p className="text-[11px] font-black text-zinc-200 uppercase leading-tight">{brand} {model}</p>
                            </div>
                            <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                              <p className="text-[8px] text-zinc-500 font-bold uppercase mb-0.5">Plat Nomor</p>
                              <p className="text-[11px] font-black text-primary font-mono leading-tight">{plate}</p>
                            </div>
                            <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                              <p className="text-[8px] text-zinc-500 font-bold uppercase mb-0.5">Tahun</p>
                              <p className="text-[11px] font-black text-zinc-200 leading-tight">{year || "-"}</p>
                            </div>
                          </div>
                        </div>

                        {/* Service */}
                        <div className="space-y-3">
                          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                            <Wrench className="h-3 w-3 text-primary" /> Instruksi Kerja
                          </h4>
                          <div className="bg-zinc-900 rounded-3xl border border-white/5 overflow-hidden">
                            <div className="bg-primary/10 px-5 py-3 border-b border-white/5 flex items-center justify-between">
                              <span className="text-xs font-black text-primary uppercase italic">{serviceType}</span>
                            </div>
                            <div className="p-5">
                              <div className="bg-black/30 rounded-2xl p-4 border border-white/5 border-dashed">
                                <p className="text-sm text-zinc-300 italic font-medium leading-relaxed">
                                  &ldquo;{complaint}&rdquo;
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Actions */}
                    <div className="bg-zinc-950 border-t border-white/10 p-6 flex items-center gap-4">
                      <SheetTrigger asChild>
                        <Button variant="ghost" className="h-14 w-14 rounded-2xl border border-white/5 text-zinc-500 hover:text-white transition-all active:scale-95">
                          <X className="h-5 w-5" />
                        </Button>
                      </SheetTrigger>
                      <Link href={`/mekanik/jobs/${job.id}`} className="flex-1">
                        <Button className="w-full bg-primary hover:bg-primary/90 text-black font-black uppercase text-sm tracking-[0.15em] h-14 shadow-[0_4px_25px_rgba(255,193,7,0.3)] rounded-2xl border-b-2 border-black/20 group relative overflow-hidden">
                          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
                          <span className="relative z-10 flex items-center justify-center gap-2">
                            PREPARE WORKSPACE <ChevronRight className="h-4 w-4" />
                          </span>
                        </Button>
                      </Link>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            )
          })
        )}
      </div>
    </div>
  )
}
