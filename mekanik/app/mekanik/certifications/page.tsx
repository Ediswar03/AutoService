"use client"

import { Award, CheckCircle2, Clock, ExternalLink, Star, Trophy, BookOpen, Calendar } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

const certifications = [
  {
    id: "1",
    name: "Toyota Certified Technician",
    issuer: "Toyota Motor Corporation",
    year: 2021,
    expiry: 2026,
    level: "Advanced",
    status: "active",
    description: "Sertifikasi resmi teknisi mesin Toyota, mencakup diagnosis, perbaikan, dan pemeliharaan mesin Toyota seluruh lini produk.",
    skills: ["Engine Diagnosis", "Transmission", "Emission Control"],
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
  },
  {
    id: "2",
    name: "AC System Specialist",
    issuer: "Denso Training Academy",
    year: 2022,
    expiry: 2025,
    level: "Expert",
    status: "active",
    description: "Keahlian mendalam dalam sistem pendingin kendaraan, termasuk diagnosis, pengisian refrigeran, dan perbaikan komponen AC.",
    skills: ["AC Diagnosis", "Refrigerant Handling", "Compressor Repair"],
    color: "text-blue-400",
    bg: "bg-blue-500/10",
    border: "border-blue-500/20",
  },
  {
    id: "3",
    name: "EV & Hybrid Technician",
    issuer: "Kementerian Perindustrian RI",
    year: 2023,
    expiry: 2028,
    level: "Intermediate",
    status: "active",
    description: "Sertifikasi teknisi kendaraan listrik dan hybrid, mencakup keselamatan tegangan tinggi dan diagnosis sistem baterai.",
    skills: ["High Voltage Safety", "Battery Diagnosis", "Electric Motor"],
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
  },
  {
    id: "4",
    name: "Automotive Electrician",
    issuer: "BNSP - Badan Nasional Sertifikasi Profesi",
    year: 2020,
    expiry: 2023,
    level: "Advanced",
    status: "expired",
    description: "Sertifikasi kelistrikan otomotif meliputi wiring diagrams, ECU programming, dan troubleshooting sistem elektronik kendaraan.",
    skills: ["Wiring Diagnosis", "ECU Programming", "CAN Bus"],
    color: "text-zinc-500",
    bg: "bg-zinc-500/10",
    border: "border-zinc-500/20",
  },
]

const levelConfig: Record<string, { label: string; className: string }> = {
  Intermediate: { label: "Intermediate", className: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  Advanced: { label: "Advanced", className: "bg-amber-500/10 text-amber-400 border-amber-500/20" },
  Expert: { label: "Expert", className: "bg-primary/10 text-primary border-primary/20" },
}

const stats = {
  total: certifications.length,
  active: certifications.filter((c) => c.status === "active").length,
  expired: certifications.filter((c) => c.status === "expired").length,
}

export default function CertificationsPage() {
  return (
    <div className="space-y-6 pb-8">

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-zinc-100", icon: BookOpen },
          { label: "Aktif", value: stats.active, color: "text-emerald-400", icon: CheckCircle2 },
          { label: "Kedaluwarsa", value: stats.expired, color: "text-red-400", icon: Clock },
        ].map((s) => (
          <Card key={s.label} className="bg-zinc-900/80 border-white/5 rounded-2xl">
            <CardContent className="pt-4 pb-4 text-center">
              <s.icon className={cn("h-5 w-5 mx-auto mb-1.5", s.color)} />
              <p className={cn("text-2xl font-black italic", s.color)}>{s.value}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievement Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-primary p-5">
        <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/20 rounded-full blur-2xl" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-black/15 flex items-center justify-center border border-black/10">
            <Trophy className="h-7 w-7 text-black" />
          </div>
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-black/70">Pencapaian</p>
            <p className="text-xl font-black italic uppercase tracking-tight text-black leading-tight">
              {stats.active} Sertifikat Aktif
            </p>
            <p className="text-[10px] font-bold text-black/60 mt-0.5">Terus tingkatkan keahlian Anda!</p>
          </div>
        </div>
      </div>

      {/* Certification List */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2 px-1">
          <Award className="h-3 w-3 text-primary" /> Daftar Sertifikasi
        </h4>

        {certifications.map((cert) => (
          <Card
            key={cert.id}
            className={cn(
              "border rounded-2xl overflow-hidden transition-all duration-300",
              cert.status === "expired"
                ? "bg-zinc-900/40 border-white/5 opacity-70"
                : "bg-zinc-900/60 border-white/5 hover:border-white/10"
            )}
          >
            <CardContent className="p-5 space-y-4">
              {/* Header */}
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3 flex-1 min-w-0">
                  <div className={cn("h-11 w-11 rounded-xl flex items-center justify-center border shrink-0", cert.bg, cert.border)}>
                    <Award className={cn("h-5 w-5", cert.color)} />
                  </div>
                  <div className="min-w-0">
                    <p className={cn("text-sm font-black uppercase tracking-tight leading-tight", cert.status === "expired" ? "text-zinc-500" : "text-zinc-100")}>
                      {cert.name}
                    </p>
                    <p className="text-[10px] text-zinc-500 font-medium mt-0.5 truncate">{cert.issuer}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Badge variant="outline" className={cn("text-[9px] font-black uppercase border h-5 px-2", levelConfig[cert.level].className)}>
                    {levelConfig[cert.level].label}
                  </Badge>
                  {cert.status === "active" ? (
                    <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 border text-[9px] font-black uppercase h-5 px-2">
                      ✓ Aktif
                    </Badge>
                  ) : (
                    <Badge className="bg-red-500/10 text-red-400 border-red-500/20 border text-[9px] font-black uppercase h-5 px-2">
                      Kedaluwarsa
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                {cert.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-1.5">
                {cert.skills.map((skill) => (
                  <span
                    key={skill}
                    className={cn("text-[9px] font-black uppercase tracking-wide px-2.5 py-1 rounded-lg border", cert.bg, cert.color, cert.border)}
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-white/5">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-500">
                    <Calendar className="h-3 w-3" />
                    <span>Terbit {cert.year}</span>
                  </div>
                  <div className={cn("flex items-center gap-1.5 text-[10px] font-mono font-bold", cert.status === "expired" ? "text-red-400" : "text-zinc-500")}>
                    <Clock className="h-3 w-3" />
                    <span>{cert.status === "expired" ? `Kedaluwarsa ${cert.expiry}` : `Berlaku s/d ${cert.expiry}`}</span>
                  </div>
                </div>
                <button className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-primary hover:text-primary/80 transition-colors">
                  Detail <ExternalLink className="h-3 w-3" />
                </button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
