"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Clock, Car, User, Filter, ChevronRight, Search, MessageSquare } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { 
  Sheet, 
  SheetContent, 
  SheetDescription, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { Phone, Mail, FileText, Wrench, Package, ClipboardCheck, Calendar, X } from "lucide-react"

type FilterStatus = "all" | "pending" | "in_progress" | "waiting_parts" | "waiting_approval" | "completed"
type JobStatus = "pending" | "in_progress" | "waiting_parts" | "waiting_approval" | "completed"

interface Job {
  id: string
  spkNumber: string
  customer: string
  phone: string
  vehicle: { brand: string; model: string; year: number; plateNumber: string }
  serviceType: string
  description: string
  status: JobStatus
  priority: "low" | "normal" | "high" | "urgent"
  estimatedDuration: number
  assignedAt: Date
}

const mockJobs: Job[] = [
  {
    id: "1",
    spkNumber: "SPK-2024-001",
    customer: "Ahmad Sudirman",
    phone: "0812-3456-7890",
    vehicle: { brand: "Toyota", model: "Avanza", year: 2020, plateNumber: "B 1234 ABC" },
    serviceType: "Service Berkala 10.000km",
    description: "AC kurang dingin, suara mesin agak kasar",
    status: "in_progress",
    estimatedDuration: 120,
    priority: "high",
    assignedAt: new Date("2024-01-15T09:30:00"),
  },
  {
    id: "2",
    spkNumber: "SPK-2024-002",
    customer: "Siti Rahayu",
    phone: "0813-4567-8901",
    vehicle: { brand: "Honda", model: "Jazz", year: 2019, plateNumber: "B 5678 DEF" },
    serviceType: "Ganti Oli + Tune Up",
    description: "Rutin ganti oli dan pengecekan umum",
    status: "pending",
    estimatedDuration: 60,
    priority: "normal",
    assignedAt: new Date("2024-01-15T10:00:00"),
  },
  {
    id: "3",
    spkNumber: "SPK-2024-003",
    customer: "Joko Widodo",
    phone: "0814-5678-9012",
    vehicle: { brand: "Daihatsu", model: "Xenia", year: 2021, plateNumber: "B 9012 GHI" },
    serviceType: "Perbaikan AC",
    description: "AC tidak dingin sama sekali",
    status: "pending",
    estimatedDuration: 90,
    priority: "urgent",
    assignedAt: new Date("2024-01-15T08:00:00"),
  },
  {
    id: "4",
    spkNumber: "SPK-2024-004",
    customer: "Dewi Lestari",
    phone: "0815-6789-0123",
    vehicle: { brand: "Suzuki", model: "Ertiga", year: 2022, plateNumber: "B 3456 JKL" },
    serviceType: "Ganti Kampas Rem",
    description: "Rem bunyi dan kurang pakem",
    status: "waiting_parts",
    estimatedDuration: 45,
    priority: "high",
    assignedAt: new Date("2024-01-14T14:00:00"),
  },
  {
    id: "5",
    spkNumber: "SPK-2024-005",
    customer: "Andi Pratama",
    phone: "0816-7890-1234",
    vehicle: { brand: "Mitsubishi", model: "Xpander", year: 2020, plateNumber: "B 7890 MNO" },
    serviceType: "Service Berkala 20.000km",
    description: "Service rutin",
    status: "completed",
    estimatedDuration: 150,
    priority: "normal",
    assignedAt: new Date("2024-01-14T09:00:00"),
  },
]

const statusConfig = {
  pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  in_progress: { label: "Dikerjakan", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  waiting_parts: { label: "Tunggu Parts", className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  waiting_approval: { label: "Tunggu Approval", className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  completed: { label: "Selesai", className: "bg-green-500/10 text-green-600 border-green-500/20" },
}

const priorityConfig = {
  low: { label: "Low", className: "bg-gray-100 text-gray-600" },
  normal: { label: "Normal", className: "bg-blue-100 text-blue-600" },
  high: { label: "High", className: "bg-orange-100 text-orange-600" },
  urgent: { label: "Urgent", className: "bg-red-100 text-red-600" },
}

export default function JobsListPage() {
  const [activeTab, setActiveTab] = useState<FilterStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredJobs = mockJobs.filter((job) => {
    const matchesStatus = (activeTab as string) === "all" || job.status === activeTab
    const matchesSearch =
      searchQuery === "" ||
      job.spkNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.customer.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.vehicle.plateNumber.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const statusCounts = {
    all: mockJobs.length,
    pending: mockJobs.filter((j) => j.status === "pending").length,
    in_progress: mockJobs.filter((j) => j.status === "in_progress").length,
    waiting_parts: mockJobs.filter((j) => j.status === "waiting_parts").length,
    waiting_approval: mockJobs.filter((j) => j.status === "waiting_approval").length,
    completed: mockJobs.filter((j) => j.status === "completed").length,
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

      {/* Filter Tabs - Scrollable on mobile */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as FilterStatus)} className="w-fit">
          <TabsList className="h-10 inline-flex items-center gap-2 bg-zinc-900/50 p-1 rounded-xl border border-white/5">
            <TabsTrigger value="all" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4 data-[state=active]:bg-primary data-[state=active]:text-black transition-all">
              Semua ({statusCounts.all})
            </TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              Pending ({statusCounts.pending})
            </TabsTrigger>
            <TabsTrigger value="in_progress" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4 data-[state=active]:bg-blue-500 data-[state=active]:text-white">
              Progres ({statusCounts.in_progress})
            </TabsTrigger>
            <TabsTrigger value="waiting_parts" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4 data-[state=active]:bg-orange-500 data-[state=active]:text-white">
              Parts ({statusCounts.waiting_parts})
            </TabsTrigger>
            <TabsTrigger value="completed" className="rounded-lg text-[10px] font-bold uppercase tracking-wider px-4 data-[state=active]:bg-emerald-500 data-[state=active]:text-white">
              Selesai ({statusCounts.completed})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Jobs List */}
      <div className="space-y-3">
        {filteredJobs.length === 0 ? (
          <Card className="bg-zinc-900/50 border-white/5 border-dashed">
            <CardContent className="py-12 text-center">
               <ClipboardCheck className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
               <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Tidak ada SPK ditemukan</p>
            </CardContent>
          </Card>
        ) : (
          filteredJobs.map((job) => (
            <Sheet key={job.id}>
              <SheetTrigger asChild>
                <Card className="cursor-pointer bg-zinc-900/50 border-white/5 hover:border-primary/30 hover:bg-zinc-900/80 transition-all duration-300 relative overflow-hidden group rounded-2xl">
                  <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-primary transition-colors duration-300" />
                  <CardContent className="pt-5 pb-5">
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 mb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2 rounded-md border border-primary/20">
                            {job.spkNumber}
                          </span>
                          <Badge variant="outline" className={cn("text-[10px] font-black uppercase tracking-wider border-0 h-5 px-2", priorityConfig[job.priority].className)}>
                            {priorityConfig[job.priority].label}
                          </Badge>
                        </div>
                      </div>
                      <Badge variant="outline" className={cn("text-[10px] font-black uppercase italic border-0 h-6 px-3 shadow-inner", statusConfig[job.status].className)}>
                        {statusConfig[job.status].label}
                      </Badge>
                    </div>

                    {/* Customer Info */}
                    <div className="flex items-center gap-2 text-sm font-bold text-zinc-100 uppercase tracking-tight mb-2">
                      <User className="h-4 w-4 text-zinc-500 group-hover:text-primary transition-colors" />
                      <span>{job.customer}</span>
                    </div>

                    {/* Vehicle Info */}
                    <div className="flex items-center gap-2 text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-4">
                      <Car className="h-3.5 w-3.5 text-zinc-600" />
                      <span>
                        {job.vehicle.brand} {job.vehicle.model} <span className="mx-1">&bull;</span> {job.vehicle.plateNumber}
                      </span>
                    </div>

                    {/* Service Type */}
                    <p className="text-sm font-black text-zinc-200 uppercase italic mb-1 tracking-tight">{job.serviceType}</p>
                    <p className="text-xs text-zinc-500 line-clamp-1 mb-4 font-medium">{job.description}</p>

                    {/* Footer */}
                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-500 uppercase tracking-widest">
                        <Clock className="h-3 w-3 text-primary" />
                        <span>Est. {job.estimatedDuration} menit</span>
                      </div>
                      <div className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-[0.1em] group-hover:gap-2 transition-all">
                        <span>Lihat Detail</span>
                        <ChevronRight className="h-3 w-3" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[92vh] bg-zinc-950 border-x border-t border-white/10 rounded-t-[40px] p-0 overflow-hidden max-w-md mx-auto inset-x-0 outline-none">
                <div className="h-full flex flex-col">
                  {/* Pull Indicator */}
                  <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mt-5 mb-2 shadow-inner" />
                  
                  <div className="flex-1 overflow-y-auto px-6 pb-28 pt-4 space-y-7 custom-scrollbar">
                    {/* Header Precision */}
                    <SheetHeader className="text-left space-y-4">
                      <div className="flex items-center justify-between items-center">
                         <div className="space-y-1">
                            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-primary/80">Workshop Task Order</span>
                            <SheetTitle className="text-4xl font-black italic uppercase tracking-tighter text-white leading-none flex items-center gap-3">
                              {job.spkNumber}
                              <div className="h-2 w-2 rounded-full bg-primary animate-pulse" />
                            </SheetTitle>
                         </div>
                         <Badge variant="outline" className={cn("text-[11px] font-black uppercase italic border-0 px-4 h-8 flex items-center shadow-[inset_0_1px_10px_rgba(0,0,0,0.5)]", statusConfig[job.status].className)}>
                            <div className="h-1.5 w-1.5 rounded-full bg-current mr-2 opacity-50" />
                            {statusConfig[job.status].label}
                         </Badge>
                      </div>
                      <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-y border-white/5 py-3">
                         <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> {job.assignedAt.toLocaleTimeString("id-ID", {hour: '2-digit', minute: '2-digit'})} WIB</span>
                         <span className="h-3 w-px bg-white/10" />
                         <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> {job.assignedAt.toLocaleDateString("id-ID", {day: '2-digit', month: 'short', year: 'numeric'})}</span>
                         <span className="h-3 w-px bg-white/10 ml-auto" />
                         <span className={cn("font-bold", priorityConfig[job.priority].className)}>PRIORITY: {priorityConfig[job.priority].label}</span>
                      </div>
                    </SheetHeader>

                    <div className="grid gap-6">
                      {/* Section: Customer & Vehicle Sharp Layout */}
                      <div className="grid grid-cols-1 gap-4">
                         <div className="space-y-3">
                            <div className="flex items-center justify-between">
                               <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                                  <User className="h-3 w-3 text-primary" /> Informasi Pemilik
                               </h4>
                            </div>
                            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-5 relative group overflow-hidden">
                               <div className="absolute top-0 right-0 p-4 opacity-5 pointer-events-none">
                                  <User className="h-16 w-16 text-white" />
                               </div>
                               <div className="flex items-center justify-between relative z-10">
                                  <div className="space-y-1">
                                     <p className="text-xl font-black text-zinc-100 uppercase italic tracking-tight">{job.customer}</p>
                                     <p className="text-xs font-mono text-zinc-400 flex items-center gap-2">
                                        <Phone className="h-3 w-3" /> {job.phone}
                                     </p>
                                  </div>
                                  <Button size="icon" variant="outline" className="rounded-xl bg-zinc-950 border-white/10 hover:border-primary/50 text-primary transition-all active:scale-90">
                                     <Phone className="h-4 w-4" />
                                  </Button>
                               </div>
                            </div>
                         </div>

                         <div className="space-y-3">
                            <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                               <Car className="h-3 w-3 text-primary" /> Spesifikasi Unit
                            </h4>
                            <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-3 grid grid-cols-2 xs:grid-cols-3 gap-2">
                               <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex flex-col justify-center">
                                  <p className="text-[8px] text-zinc-500 font-bold uppercase mb-0.5">Merk/Model</p>
                                  <p className="text-[11px] font-black text-zinc-200 uppercase leading-tight">{job.vehicle.brand} {job.vehicle.model}</p>
                               </div>
                               <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex flex-col justify-center">
                                  <p className="text-[8px] text-zinc-500 font-bold uppercase mb-0.5">Plat Nomor</p>
                                  <p className="text-[11px] font-black text-primary font-mono leading-tight">{job.vehicle.plateNumber}</p>
                               </div>
                               <div className="bg-black/40 rounded-xl p-3 border border-white/5 flex flex-col justify-center col-span-2 xs:col-span-1">
                                  <p className="text-[8px] text-zinc-500 font-bold uppercase mb-0.5">Tahun Produksi</p>
                                  <p className="text-[11px] font-black text-zinc-200 leading-tight">{job.vehicle.year}</p>
                               </div>
                            </div>
                         </div>
                      </div>

                      {/* Section: Service Technical Card */}
                      <div className="space-y-3">
                         <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                            <Wrench className="h-3 w-3 text-primary" /> Instruksi Kerja
                         </h4>
                         <div className="bg-zinc-900 rounded-3xl border border-white/5 overflow-hidden">
                            <div className="bg-primary/10 px-5 py-3 border-b border-white/5 flex items-center justify-between">
                               <span className="text-xs font-black text-primary uppercase italic">{job.serviceType}</span>
                               <span className="text-[9px] font-mono text-zinc-500">{job.estimatedDuration} MIN EST</span>
                            </div>
                            <div className="p-5 space-y-4">
                               <div>
                                  <div className="flex items-center gap-2 mb-2">
                                     <MessageSquare className="h-3 w-3 text-zinc-500" />
                                     <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Laporan Keluhan</span>
                                  </div>
                                  <div className="bg-black/30 rounded-2xl p-4 border border-white/5 border-dashed">
                                     <p className="text-sm text-zinc-300 italic font-medium leading-relaxed">
                                        &ldquo;{job.description}&rdquo;
                                     </p>
                                  </div>
                               </div>
                               <div className="flex gap-2">
                                  <Badge className="bg-zinc-800 text-zinc-400 border-0 text-[9px] uppercase font-bold tracking-tighter">Engine Systems</Badge>
                                  <Badge className="bg-zinc-800 text-zinc-400 border-0 text-[9px] uppercase font-bold tracking-tighter">Routine Maint</Badge>
                               </div>
                            </div>
                         </div>
                      </div>
                    </div>
                  </div>

                  {/* High Precision Bottom Actions */}
                  <div className="bg-zinc-950 border-t border-white/10 p-6 flex items-center gap-4">
                    <SheetTrigger asChild>
                       <Button variant="ghost" className="h-14 w-14 rounded-2xl border border-white/5 text-zinc-500 hover:text-white transition-all active:scale-95">
                          <X className="h-5 w-5" />
                       </Button>
                    </SheetTrigger>
                    <Link href={`/mekanik/jobs/${job.id}`} className="flex-1">
                      <Button className="w-full bg-primary hover:bg-primary/90 text-black font-black uppercase text-sm tracking-[0.15em] h-14 shadow-[0_4px_25px_rgba(var(--primary),0.3)] rounded-2xl border-b-2 border-black/20 group relative overflow-hidden">
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
          ))
        )}
      </div>
    </div>
  )
}
