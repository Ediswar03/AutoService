"use client"

import { use } from "react"
import Link from "next/link"
import { 
  Clock, Car, User, Phone, Mail, Calendar, FileText, 
  Wrench, ClipboardCheck, Package, CheckCircle2, ChevronRight,
  AlertTriangle, MessageSquare, X, Info, ShieldCheck
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

// Mock job data
const mockJobDetail = {
  id: "1",
  spkNumber: "SPK-2024-001",
  customer: {
    name: "Ahmad Sudirman",
    phone: "0812-3456-7890",
    email: "ahmad@email.com",
  },
  vehicle: {
    brand: "Toyota",
    model: "Avanza",
    year: 2020,
    plateNumber: "B 1234 ABC",
    color: "Silver Metalik",
    kilometer: 45000,
    vin: "MHFM1BA3J4K123456",
  },
  service: {
    type: "Service Berkala 10.000km",
    description: "AC kurang dingin, suara mesin agak kasar saat idle, dan rem terasa kurang pakem",
    notes: "Pelanggan minta prioritas AC karena sering bepergian jauh",
  },
  status: "in_progress" as const,
  priority: "high" as const,
  estimatedDuration: 120,
  createdAt: new Date("2024-01-15T09:30:00"),
  startedAt: new Date("2024-01-15T10:00:00"),
}

const statusConfig = {
  pending: { label: "Pending", className: "bg-yellow-500/10 text-yellow-600 border-yellow-500/20" },
  in_progress: { label: "Dikerjakan", className: "bg-blue-500/10 text-blue-600 border-blue-500/20" },
  waiting_parts: { label: "Tunggu Parts", className: "bg-orange-500/10 text-orange-600 border-orange-500/20" },
  waiting_approval: { label: "Tunggu Approval", className: "bg-purple-500/10 text-purple-600 border-purple-500/20" },
  completed: { label: "Selesai", className: "bg-green-500/10 text-green-600 border-green-500/20" },
}

const priorityConfig = {
  low: { label: "Low", className: "text-zinc-500" },
  normal: { label: "Normal", className: "text-blue-400" },
  high: { label: "High", className: "text-amber-400" },
  urgent: { label: "Urgent", className: "text-red-400" },
}

export default function JobDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const job = mockJobDetail

  return (
    <div className="space-y-6 pb-20">
      {/* Detail Header Info */}
      <div className="flex items-center justify-between px-1">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-zinc-500">Workshop Task</span>
          <h2 className="text-3xl font-black italic uppercase tracking-tighter text-white leading-none">
            {job.spkNumber}
          </h2>
        </div>
        <Badge variant="outline" className={cn("text-[11px] font-black uppercase italic border-0 px-4 h-8 flex items-center shadow-inner", statusConfig[job.status].className)}>
          <div className="h-1.5 w-1.5 rounded-full bg-current mr-2 opacity-50" />
          {statusConfig[job.status].label}
        </Badge>
      </div>

      <div className="flex items-center gap-4 text-[10px] font-mono text-zinc-500 uppercase tracking-widest border-y border-white/5 py-3 px-1">
         <span className="flex items-center gap-1.5"><Clock className="h-3 w-3" /> 09:30 WIB</span>
         <span className="h-3 w-px bg-white/10" />
         <span className="flex items-center gap-1.5"><Calendar className="h-3 w-3" /> 15 Jan 2024</span>
         <span className={cn("ml-auto font-bold", priorityConfig[job.priority].className)}>PRIORITY: {priorityConfig[job.priority].label}</span>
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
                <p className="text-xl font-black text-zinc-100 uppercase italic tracking-tight">{job.customer.name}</p>
                <p className="text-xs font-mono text-zinc-400 flex items-center gap-1.5 leading-none">
                  <Phone className="h-3 w-3" /> {job.customer.phone}
                </p>
                <p className="text-[10px] text-zinc-500 font-medium">{job.customer.email}</p>
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
              { label: "Merk/Model", value: `${job.vehicle.brand} ${job.vehicle.model}`, icon: Info },
              { label: "Plat Nomor", value: job.vehicle.plateNumber, icon: ShieldCheck, isPrimary: true },
              { label: "Warna", value: job.vehicle.color, icon: Info },
              { label: "Kilometer", value: `${job.vehicle.kilometer.toLocaleString()} KM`, icon: Clock },
            ].map((item, idx) => (
              <div key={idx} className="bg-black/40 rounded-2xl p-4 border border-white/5 flex flex-col justify-center">
                <p className="text-[8px] text-zinc-600 font-black uppercase mb-1">{item.label}</p>
                <p className={cn("text-[11px] font-black uppercase truncate", item.isPrimary ? "text-primary font-mono" : "text-zinc-200")}>{item.value}</p>
              </div>
            ))}
            <div className="bg-black/40 rounded-2xl p-4 border border-white/5 col-span-2">
              <p className="text-[8px] text-zinc-600 font-black uppercase mb-1">Nomor Rangka (VIN)</p>
              <p className="text-[11px] font-black text-zinc-400 font-mono tracking-wider">{job.vehicle.vin}</p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2 px-1">
            <Wrench className="h-3 w-3 text-primary" /> Instruksi Kerja
          </h4>
          <div className="bg-zinc-900 rounded-[32px] border border-white/5 overflow-hidden">
            <div className="bg-primary/10 px-6 py-4 border-b border-white/5 flex items-center justify-between">
              <span className="text-sm font-black text-primary uppercase italic tracking-tight">{job.service.type}</span>
              <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest">{job.estimatedDuration}M EST</span>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <MessageSquare className="h-3 w-3 text-zinc-500" />
                  <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Keluhan Pelanggan</span>
                </div>
                <div className="bg-black/30 rounded-2xl p-5 border border-white/5 border-dashed">
                  <p className="text-sm text-zinc-300 italic font-medium leading-relaxed">
                    &ldquo;{job.service.description}&rdquo;
                  </p>
                </div>
              </div>
              
              {job.service.notes && (
                <div>
                  <div className="flex items-center gap-2 mb-2 font-black">
                    <AlertTriangle className="h-3 w-3 text-amber-500" />
                    <span className="text-[10px] font-bold text-amber-500/70 uppercase tracking-wider">Catatan Service Advisor</span>
                  </div>
                  <div className="bg-amber-500/5 rounded-2xl p-5 border border-amber-500/10">
                    <p className="text-sm text-amber-200/70 font-medium italic">
                      &ldquo;{job.service.notes}&rdquo;
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
        {job.status === "in_progress" && (
          <>
            <Button className="w-full h-14 bg-primary text-black font-black uppercase text-sm tracking-[0.2em] shadow-[0_8px_30px_rgba(var(--primary),0.3)] rounded-2xl border-b-4 border-black/20 active:border-b-0 active:translate-y-1 transition-all">
              <CheckCircle2 className="h-5 w-5 mr-3" />
              Selesaikan Pekerjaan
            </Button>
            <div className="grid grid-cols-2 gap-3">
              <Link href="/mekanik/parts-request">
                <Button variant="outline" className="w-full h-14 bg-zinc-900 border-white/5 text-zinc-300 font-black uppercase text-[10px] tracking-widest rounded-2xl">
                  <Package className="h-4 w-4 mr-2" />
                  Request Parts
                </Button>
              </Link>
              <Link href={`/mekanik/jobs/${id}/inspection`}>
                <Button variant="outline" className="w-full h-14 bg-zinc-900 border-white/5 text-zinc-300 font-black uppercase text-[10px] tracking-widest rounded-2xl">
                  <ClipboardCheck className="h-4 w-4 mr-2" />
                  Inspeksi
                </Button>
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  )
}
