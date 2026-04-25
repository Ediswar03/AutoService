"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { cn } from "@/lib/utils"
import { ClipboardList, Package, Star, Clock, CheckCircle2, AlertCircle, ChevronRight, Wrench, Car } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger 
} from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"
import { User, Phone, Calendar, MessageSquare, X } from "lucide-react"

// Mock data - replace with actual API calls
const mockMechanic = {
  name: "Budi Santoso",
  rating: 4.8,
  totalReviews: 120,
}

const mockStats = {
  pending: 5,
  inProgress: 2,
  completed: 8,
}

const mockTodayJobs = [
  {
    id: "1",
    spkNumber: "SPK-2024-001",
    customer: "Ahmad Sudirman",
    vehicle: { brand: "Toyota", model: "Avanza", year: 2020, plateNumber: "B 1234 ABC" },
    serviceType: "Service Berkala 10.000km",
    status: "in_progress" as const,
    estimatedDuration: 120,
    priority: "high" as const,
  },
  {
    id: "2",
    spkNumber: "SPK-2024-002",
    customer: "Siti Rahayu",
    vehicle: { brand: "Honda", model: "Jazz", year: 2019, plateNumber: "B 5678 DEF" },
    serviceType: "Ganti Oli + Tune Up",
    status: "pending" as const,
    estimatedDuration: 60,
    priority: "normal" as const,
  },
  {
    id: "3",
    spkNumber: "SPK-2024-003",
    customer: "Joko Widodo",
    vehicle: { brand: "Daihatsu", model: "Xenia", year: 2021, plateNumber: "B 9012 GHI" },
    serviceType: "Perbaikan AC",
    status: "pending" as const,
    estimatedDuration: 90,
    priority: "urgent" as const,
  },
]

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return "Selamat Pagi"
  if (hour < 15) return "Selamat Siang"
  if (hour < 18) return "Selamat Sore"
  return "Selamat Malam"
}

const statusConfig = {
  pending: { label: "Pending", variant: "warning" as const, className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  in_progress: { label: "Dikerjakan", variant: "default" as const, className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  waiting_parts: { label: "Tunggu Parts", variant: "secondary" as const, className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  waiting_approval: { label: "Tunggu Approval", variant: "secondary" as const, className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  completed: { label: "Selesai", variant: "default" as const, className: "bg-green-500/10 text-green-600 border-green-500/20" },
}

const priorityConfig = {
  low: { label: "Low", className: "bg-gray-100 text-gray-600" },
  normal: { label: "Normal", className: "bg-blue-100 text-blue-600" },
  high: { label: "High", className: "bg-orange-100 text-orange-600" },
  urgent: { label: "Urgent", className: "bg-red-100 text-red-600" },
}

export default function MekanikDashboard() {
  const [greeting, setGreeting] = useState("")

  useEffect(() => {
    setGreeting(getGreeting())
  }, [])

  return (
    <div className="space-y-8">
      {/* Greeting Card */}
      <div className="relative group">
        <div className="absolute -inset-0.5 bg-gradient-to-r from-primary/30 to-transparent rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-700 ease-out"></div>
        <Card className="bg-zinc-900/90 backdrop-blur-2xl border-white/5 overflow-hidden relative rounded-2xl shadow-xl">
          <div className="absolute top-0 right-0 p-6 opacity-5">
            <Wrench className="h-24 w-24 text-white rotate-12" />
          </div>
          <div className="absolute inset-0 bg-gradient-to-br from-primary/10 via-transparent to-transparent opacity-40" />
          <CardContent className="pt-8 pb-8 px-6 relative z-10">
            <p className="text-primary text-[10px] font-black tracking-[0.2em] uppercase mb-1">{greeting || "Selamat Datang"},</p>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tighter text-white uppercase italic leading-none">
              {mockMechanic.name.split(' ')[0]}<span className="text-zinc-500"> {mockMechanic.name.split(' ').slice(1).join(' ')}</span>
            </h2>
            <div className="h-1 w-12 bg-primary mt-4 rounded-full" />
            <p className="text-zinc-500 text-[11px] mt-4 font-bold italic tracking-wide uppercase">Performance Mechanic</p>
          </CardContent>
        </Card>
      </div>
      {/* Promo Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black italic uppercase tracking-widest text-sm text-zinc-200">
            Promo Menarik
          </h3>
          <Link href="#" className="text-[10px] font-bold uppercase tracking-widest text-blue-400 hover:text-blue-300 transition-colors">
            Lihat Semua
          </Link>
        </div>
        
        <div className="relative group">
          <Card className="bg-zinc-900 border-white/5 overflow-hidden rounded-[32px] relative h-44 shadow-2xl">
            <div className="absolute inset-0 z-0">
               <Image 
                 src="/promo-servis.png" 
                 alt="Promo" 
                 fill 
                 className="object-cover opacity-60 group-hover:scale-105 transition-transform duration-700"
               />
               <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/60 to-transparent" />
            </div>
            
            <CardContent className="relative z-10 h-full flex flex-col justify-center p-8 space-y-1">
              <p className="text-[12px] font-black uppercase tracking-[0.2em] text-white/90">Diskon Servis</p>
              <h4 className="text-5xl font-black italic tracking-tighter text-primary">20%</h4>
              <p className="text-[10px] font-bold text-zinc-300 uppercase tracking-widest">sampai akhir bulan</p>
              <p className="text-[9px] font-medium text-zinc-500 mt-2">Diersis, minggu ke Mel 2024</p>
            </CardContent>
          </Card>
          
          {/* Pagination Dots */}
          <div className="flex justify-center gap-1.5 mt-4">
            <div className="h-1.5 w-1.5 rounded-full bg-white transition-all w-4" />
            <div className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
            <div className="h-1.5 w-1.5 rounded-full bg-zinc-800" />
          </div>
        </div>
      </div>

      {/* Status Summary */}
      <div className="grid grid-cols-3 gap-2.5 sm:gap-4 px-0.5">
        {[
          { label: "Pending", value: mockStats.pending, icon: AlertCircle, color: "text-amber-500", bg: "bg-amber-500/10", border: "border-amber-500/20" },
          { label: "Progres", value: mockStats.inProgress, icon: Wrench, color: "text-primary", bg: "bg-primary/10", border: "border-primary/20" },
          { label: "Selesai", value: mockStats.completed, icon: CheckCircle2, color: "text-emerald-500", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
        ].map((item) => (
          <Card key={item.label} className="bg-zinc-900/80 backdrop-blur-xl border-white/5 hover:bg-zinc-800/80 transition-all duration-300 cursor-pointer rounded-2xl group relative overflow-hidden active:scale-[0.97]">
            <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent" />
            <CardContent className="pt-4 pb-4 text-center px-1">
              <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center mx-auto mb-2 border transition-colors duration-300", item.bg, item.border, "group-hover:border-opacity-50")}>
                <item.icon className={cn("h-5 w-5", item.color)} />
              </div>
              <p className="text-2xl font-black italic text-zinc-100">{item.value}</p>
              <p className="text-[8px] font-black uppercase tracking-[0.2em] text-zinc-500 mt-0.5 opacity-80">{item.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 px-0.5">
        <Link href="/mekanik/jobs" className="outline-none group active:scale-[0.98] transition-transform">
          <Card className="bg-zinc-900/50 backdrop-blur-md border-white/5 hover:border-primary/40 hover:bg-zinc-900/80 transition-all duration-300 relative overflow-hidden rounded-2xl h-full shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-4 flex items-center gap-3 relative z-10">
              <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-center group-hover:bg-primary transition-all duration-300 shrink-0">
                <ClipboardList className="h-5 w-5 text-zinc-400 group-hover:text-black transition-colors duration-300" />
              </div>
              <div>
                <p className="font-black text-[12px] uppercase tracking-wider text-zinc-200 group-hover:text-white transition-colors leading-tight">Daftar SPK</p>
                <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mt-0.5">Buka Tugas</p>
              </div>
            </CardContent>
          </Card>
        </Link>
        <Link href="/mekanik/parts-request" className="outline-none group active:scale-[0.98] transition-transform">
          <Card className="bg-zinc-900/50 backdrop-blur-md border-white/5 hover:border-primary/40 hover:bg-zinc-900/80 transition-all duration-300 relative overflow-hidden rounded-2xl h-full shadow-lg">
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <CardContent className="p-4 flex items-center gap-3 relative z-10">
              <div className="h-10 w-10 rounded-xl bg-zinc-950 border border-white/5 flex items-center justify-center group-hover:bg-primary transition-all duration-300 shrink-0">
                <Package className="h-5 w-5 text-zinc-400 group-hover:text-black transition-colors duration-300" />
              </div>
              <div>
                <p className="font-black text-[12px] uppercase tracking-wider text-zinc-200 group-hover:text-white transition-colors leading-tight">Request Parts</p>
                <p className="text-[8px] text-zinc-500 uppercase font-black tracking-widest mt-0.5">Pengajuan</p>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>

      {/* Today Jobs */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="font-black italic uppercase tracking-widest text-sm flex items-center gap-2 text-zinc-200">
            <Clock className="h-4 w-4 text-primary" />
            Pekerjaan Hari Ini
          </h3>
          <Link href="/mekanik/jobs" className="text-[10px] sm:text-xs font-bold uppercase tracking-widest text-primary flex items-center gap-1 hover:gap-2 transition-all outline-none">
            Lihat Semua <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </div>
        <div className="space-y-3">
          {mockTodayJobs.map((job) => (
            <Sheet key={job.id}>
              <SheetTrigger asChild>
                <div className="block outline-none group cursor-pointer">
                  <Card className="bg-zinc-900/60 backdrop-blur-md border-white/5 hover:border-primary/30 hover:bg-zinc-900 transition-all duration-300 overflow-hidden rounded-2xl hover:shadow-lg">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-transparent group-hover:bg-primary transition-colors duration-300" />
                    <CardContent className="p-5 relative">
                      <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0 pr-2">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="font-mono text-xs font-bold text-primary bg-primary/10 px-2.5 py-1 rounded-md border border-primary/20 shadow-inner">
                              {job.spkNumber}
                            </span>
                            <Badge variant="outline" className={cn("text-[9px] uppercase font-black tracking-wider border-0 h-6 px-2", priorityConfig[job.priority].className)}>
                              {priorityConfig[job.priority].label}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-2 text-sm sm:text-base font-black text-zinc-100 mb-1.5 uppercase italic tracking-tight group-hover:text-white transition-colors">
                            <Car className="h-4 w-4 sm:h-5 sm:w-5 text-zinc-500 group-hover:text-primary transition-colors" />
                            <span className="truncate">
                              {job.vehicle.brand} {job.vehicle.model}
                            </span>
                          </div>
                          <p className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest flex items-center gap-2">
                            <span className="text-zinc-400">{job.vehicle.plateNumber}</span>
                            <span className="h-1 w-1 rounded-full bg-zinc-700" />
                            <span className="truncate">{job.serviceType}</span>
                          </p>
                        </div>
                        <Badge variant="outline" className={cn("text-[10px] font-black uppercase italic border-0 h-7 px-3 shadow-inner whitespace-nowrap", statusConfig[job.status].className)}>
                          {statusConfig[job.status].label}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </SheetTrigger>
              <SheetContent side="bottom" className="h-[92vh] bg-zinc-950 border-x border-t border-white/10 rounded-t-[40px] p-0 overflow-hidden max-w-md mx-auto inset-x-0 outline-none">
                <div className="h-full flex flex-col">
                  <div className="w-16 h-1.5 bg-white/10 rounded-full mx-auto mt-5 mb-2 shadow-inner" />
                  
                  <div className="flex-1 overflow-y-auto px-6 pb-28 pt-4 space-y-7 custom-scrollbar">
                    <SheetHeader className="text-left space-y-4">
                      <div className="flex items-center justify-between">
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
                         <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> 09:30 WIB</span>
                         <span className="h-3 w-px bg-white/10" />
                         <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> 15 Jan 2024</span>
                      </div>
                    </SheetHeader>

                    <div className="grid gap-6">
                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                          <User className="h-3 w-3 text-primary" /> Informasi Pemilik
                        </h4>
                        <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-5 flex items-center justify-between">
                          <div className="space-y-1">
                            <p className="text-xl font-black text-zinc-100 uppercase italic tracking-tight">{job.customer}</p>
                            <p className="text-xs font-mono text-zinc-400 flex items-center gap-2">0812-3456-7890</p>
                          </div>
                          <Button size="icon" variant="outline" className="rounded-xl bg-zinc-950 border-white/10 text-primary">
                            <Phone className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                          <Car className="h-3 w-3 text-primary" /> Spesifikasi Unit
                        </h4>
                        <div className="bg-zinc-900/50 rounded-2xl border border-white/5 p-3 grid grid-cols-2 xs:grid-cols-3 gap-2">
                          <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                            <p className="text-[8px] text-zinc-500 font-bold uppercase mb-0.5">Merk/Model</p>
                            <p className="text-[11px] font-black text-zinc-200 uppercase">{job.vehicle.brand} {job.vehicle.model}</p>
                          </div>
                          <div className="bg-black/40 rounded-xl p-3 border border-white/5">
                            <p className="text-[8px] text-zinc-500 font-bold uppercase mb-0.5">Plat Nomor</p>
                            <p className="text-[11px] font-black text-primary font-mono">{job.vehicle.plateNumber}</p>
                          </div>
                          <div className="bg-black/40 rounded-xl p-3 border border-white/5 col-span-2 xs:col-span-1">
                            <p className="text-[8px] text-zinc-500 font-bold uppercase mb-0.5">Tahun</p>
                            <p className="text-[11px] font-black text-zinc-200">2020</p>
                          </div>
                        </div>
                      </div>

                      <div className="space-y-3">
                        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                          <Wrench className="h-3 w-3 text-primary" /> Instruksi Kerja
                        </h4>
                        <div className="bg-zinc-900 rounded-3xl border border-white/5 overflow-hidden">
                          <div className="bg-primary/10 px-5 py-3 border-b border-white/5">
                            <span className="text-xs font-black text-primary uppercase italic">{job.serviceType}</span>
                          </div>
                          <div className="p-5">
                            <div className="bg-black/30 rounded-2xl p-4 border border-white/5 border-dashed">
                              <p className="text-sm text-zinc-300 italic font-medium leading-relaxed">
                                "AC kurang dingin dan suara mesin agak kasar saat engine idle."
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="bg-zinc-950 border-t border-white/10 p-6 flex items-center gap-4">
                    <SheetTrigger asChild>
                       <Button variant="ghost" className="h-14 w-14 rounded-2xl border border-white/5 text-zinc-500">
                          <X className="h-5 w-5" />
                       </Button>
                    </SheetTrigger>
                    <Link href={`/mekanik/jobs/${job.id}`} className="flex-1">
                      <Button className="w-full bg-primary text-black font-black uppercase text-sm tracking-[0.15em] h-14 shadow-[0_4px_25px_rgba(var(--primary),0.3)] rounded-2xl">
                         PREPARE WORKSPACE <ChevronRight className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          ))}
        </div>
      </div>

      {/* Rating Widget */}
      <Card className="bg-primary border-0 overflow-hidden relative group cursor-pointer rounded-3xl shadow-[0_10px_30px_-10px_rgba(var(--primary),0.6)] hover:-translate-y-1 transition-transform duration-300">
        <div className="absolute inset-0 bg-black/5 opacity-0 group-hover:opacity-10 transition-opacity duration-300" />
        <div className="absolute -right-6 -top-6 w-24 h-24 bg-white/20 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <CardContent className="pt-6 pb-6 px-6 relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4 sm:gap-5">
              <div className="h-14 w-14 rounded-2xl bg-black/15 flex items-center justify-center border border-black/10 shadow-inner group-hover:scale-105 transition-transform duration-300">
                <Star className="h-7 w-7 text-black fill-black" />
              </div>
              <div>
                <p className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-black/70 mb-1">Rating Mekanik</p>
                <div className="flex items-center gap-2">
                  <span className="text-4xl font-black italic text-black leading-none drop-shadow-sm">{mockMechanic.rating}</span>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-black/60 pt-1">Professional<br />Score</span>
                </div>
              </div>
            </div>
            <div className="h-10 w-10 flex items-center justify-center rounded-full bg-black/5 group-hover:bg-black/10 transition-colors duration-300">
              <ChevronRight className="h-5 w-5 text-black group-hover:translate-x-0.5 transition-transform" />
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
