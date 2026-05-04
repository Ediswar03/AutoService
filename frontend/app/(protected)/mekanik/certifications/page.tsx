"use client"

import { useState } from "react"
import { Award, CheckCircle2, Clock, ExternalLink, Trophy, BookOpen, Calendar, X, ShieldCheck, Download, Share2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogDescription,
} from "@/components/ui/dialog"

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
    color: "text-red-500 dark:text-red-400",
    bg: "bg-red-50 dark:bg-red-500/10",
    border: "border-red-100 dark:border-red-500/20",
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
    color: "text-blue-500 dark:text-blue-400",
    bg: "bg-blue-50 dark:bg-blue-500/10",
    border: "border-blue-100 dark:border-blue-500/20",
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
    color: "text-emerald-500 dark:text-emerald-400",
    bg: "bg-emerald-50 dark:bg-emerald-500/10",
    border: "border-emerald-100 dark:border-emerald-500/20",
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
    color: "text-slate-400 dark:text-zinc-500",
    bg: "bg-slate-50 dark:bg-zinc-500/10",
    border: "border-slate-200 dark:border-zinc-500/20",
  },
]

const levelConfig: Record<string, { label: string; className: string }> = {
  Intermediate: { label: "Intermediate", className: "bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 border-blue-100 dark:border-blue-500/20" },
  Advanced: { label: "Advanced", className: "bg-amber-50 dark:bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-100 dark:border-amber-500/20" },
  Expert: { label: "Expert", className: "bg-primary/5 dark:bg-primary/10 text-primary border-primary/20" },
}

export default function CertificationsPage() {
  const [selectedCert, setSelectedCert] = useState<typeof certifications[0] | null>(null)

  const stats = {
    total: certifications.length,
    active: certifications.filter((c) => c.status === "active").length,
    expired: certifications.filter((c) => c.status === "expired").length,
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Stats */}
      <div className="grid grid-cols-3 gap-3">
        {[
          { label: "Total", value: stats.total, color: "text-slate-800 dark:text-zinc-100", icon: BookOpen },
          { label: "Aktif", value: stats.active, color: "text-emerald-500 dark:text-emerald-400", icon: CheckCircle2 },
          { label: "Expired", value: stats.expired, color: "text-red-500 dark:text-red-400", icon: Clock },
        ].map((s) => (
          <Card key={s.label} className="bg-white/80 dark:bg-zinc-900/80 border-slate-200 dark:border-white/5 rounded-2xl shadow-sm dark:shadow-none transition-colors">
            <CardContent className="pt-4 pb-4 text-center">
              <s.icon className={cn("h-5 w-5 mx-auto mb-1.5", s.color)} />
              <p className={cn("text-2xl font-black italic", s.color)}>{s.value}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-slate-400 dark:text-zinc-600 mt-0.5">{s.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Achievement Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-primary p-5 shadow-lg shadow-primary/20">
        <div className="absolute -right-6 -top-6 w-28 h-28 bg-white/20 rounded-full blur-2xl" />
        <div className="relative z-10 flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-black/10 flex items-center justify-center border border-black/5">
            <Trophy className="h-7 w-7 text-white dark:text-black" />
          </div>
          <div className="text-white dark:text-black">
            <p className="text-[10px] font-black uppercase tracking-[0.2em] opacity-70">Pencapaian</p>
            <p className="text-xl font-black italic uppercase tracking-tight leading-tight">
              {stats.active} Sertifikat Aktif
            </p>
            <p className="text-[10px] font-bold opacity-60 mt-0.5">Terus tingkatkan keahlian Anda!</p>
          </div>
        </div>
      </div>

      {/* Certification List */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-600 flex items-center gap-2 px-1">
          <Award className="h-3 w-3 text-primary" /> Daftar Sertifikasi
        </h4>

        {certifications.map((cert) => (
          <Card
            key={cert.id}
            className={cn(
              "border rounded-2xl overflow-hidden transition-all duration-300 shadow-sm dark:shadow-none",
              cert.status === "expired"
                ? "bg-slate-50 dark:bg-zinc-900/40 border-slate-200 dark:border-white/5 opacity-70"
                : "bg-white/80 dark:bg-zinc-900/60 border-slate-200 dark:border-white/5 hover:border-slate-300 dark:hover:border-white/10"
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
                    <p className={cn("text-sm font-black uppercase tracking-tight leading-tight", cert.status === "expired" ? "text-slate-400 dark:text-zinc-500" : "text-slate-900 dark:text-zinc-100")}>
                      {cert.name}
                    </p>
                    <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-medium mt-0.5 truncate">{cert.issuer}</p>
                  </div>
                </div>
                <div className="flex flex-col items-end gap-1.5 shrink-0">
                  <Badge variant="outline" className={cn("text-[9px] font-black uppercase border h-5 px-2", levelConfig[cert.level].className)}>
                    {levelConfig[cert.level].label}
                  </Badge>
                  {cert.status === "active" ? (
                    <Badge className="bg-emerald-50 dark:bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-100 dark:border-emerald-500/20 border text-[9px] font-black uppercase h-5 px-2">
                      ✓ Aktif
                    </Badge>
                  ) : (
                    <Badge className="bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 border-red-100 dark:border-red-500/20 border text-[9px] font-black uppercase h-5 px-2">
                      Expired
                    </Badge>
                  )}
                </div>
              </div>

              {/* Description */}
              <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed font-medium line-clamp-2">
                {cert.description}
              </p>

              {/* Footer */}
              <div className="flex items-center justify-between pt-3 border-t border-slate-100 dark:border-white/5">
                <div className="flex items-center gap-3">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-slate-500 dark:text-zinc-500">
                    <Calendar className="h-3 w-3" />
                    <span>{cert.year}</span>
                  </div>
                  <div className={cn("flex items-center gap-1.5 text-[10px] font-mono font-bold", cert.status === "expired" ? "text-red-500 dark:text-red-400" : "text-slate-400 dark:text-zinc-500")}>
                    <Clock className="h-3 w-3" />
                    <span>{cert.expiry}</span>
                  </div>
                </div>

                <Dialog>
                  <DialogTrigger asChild>
                    <button 
                      onClick={() => setSelectedCert(cert)}
                      className="flex items-center gap-1 text-[9px] font-black uppercase tracking-wider text-primary hover:text-primary/80 transition-all active:scale-95 py-1 px-2 rounded-lg bg-primary/5 border border-primary/10"
                    >
                      Detail <ExternalLink className="h-3 w-3" />
                    </button>
                  </DialogTrigger>
                  <DialogContent className="bg-white dark:bg-zinc-950 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white max-w-sm rounded-3xl p-0 overflow-hidden">
                    {selectedCert && (
                      <div className="flex flex-col">
                        <DialogHeader className="hidden">
                          <DialogTitle>{selectedCert.name}</DialogTitle>
                          <DialogDescription>{selectedCert.issuer}</DialogDescription>
                        </DialogHeader>
                        <div className={cn("h-24 flex flex-col justify-end p-6 relative overflow-hidden", selectedCert.bg)}>
                          <div className="absolute top-0 right-0 p-4">
                            <ShieldCheck className={cn("h-16 w-16 opacity-10", selectedCert.color)} />
                          </div>
                          <Badge className={cn("w-fit mb-2 uppercase font-black tracking-widest text-[8px]", levelConfig[selectedCert.level].className)}>
                            {selectedCert.level} Level
                          </Badge>
                          <h3 className="text-xl font-black uppercase italic tracking-tighter leading-none text-slate-900 dark:text-white">
                            {selectedCert.name}
                          </h3>
                        </div>
                        <div className="p-6 space-y-6">
                          <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500">Penerbit Sertifikat</p>
                            <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">{selectedCert.issuer}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500">Deskripsi Keahlian</p>
                            <p className="text-[11px] text-slate-600 dark:text-zinc-400 leading-relaxed font-medium italic">
                              &ldquo;{selectedCert.description}&rdquo;
                            </p>
                          </div>
                          <div className="space-y-3">
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500">Kompetensi Inti</p>
                            <div className="flex flex-wrap gap-1.5">
                              {selectedCert.skills.map((skill) => (
                                <span
                                  key={skill}
                                  className={cn("text-[9px] font-black uppercase tracking-wide px-2.5 py-1 rounded-lg border shadow-sm dark:shadow-none", selectedCert.bg, selectedCert.color, selectedCert.border)}
                                >
                                  {skill}
                                </span>
                              ))}
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-4 pt-2">
                            <div className="bg-slate-50 dark:bg-black/40 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                              <p className="text-[8px] font-black uppercase text-slate-500 dark:text-zinc-600 mb-1">Berlaku Dari</p>
                              <p className="text-xs font-mono font-bold text-slate-800 dark:text-zinc-200">{selectedCert.year}</p>
                            </div>
                            <div className="bg-slate-50 dark:bg-black/40 p-3 rounded-2xl border border-slate-100 dark:border-white/5">
                              <p className="text-[8px] font-black uppercase text-slate-500 dark:text-zinc-600 mb-1">Masa Berlaku</p>
                              <p className={cn("text-xs font-mono font-bold", selectedCert.status === "expired" ? "text-red-500" : "text-emerald-500")}>
                                {selectedCert.expiry}
                              </p>
                            </div>
                          </div>
                          <div className="flex gap-2 pt-2">
                            <Button className="flex-1 bg-primary text-white dark:text-black font-black uppercase tracking-widest text-[10px] rounded-xl h-11">
                              <Download className="h-3 w-3 mr-2" /> Download PDF
                            </Button>
                            <Button variant="outline" className="h-11 w-11 rounded-xl border-slate-200 dark:border-white/10 text-slate-500 dark:text-zinc-400">
                              <Share2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    )}
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
