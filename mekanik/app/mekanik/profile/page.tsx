"use client"

import Link from "next/link"
import { User, Mail, Phone, Calendar, Star, Award, Settings, LogOut, ChevronRight, Wrench, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"

const mockProfile = {
  name: "Budi Santoso",
  email: "budi.santoso@autoservis.com",
  phone: "0812-3456-7890",
  employeeId: "MK-001",
  joinDate: new Date("2020-03-15"),
  specialization: ["Mesin", "AC", "Kelistrikan"],
  certifications: [
    { name: "Toyota Certified Technician", year: 2021 },
    { name: "AC System Specialist", year: 2022 },
  ],
  stats: {
    totalJobs: 1250,
    rating: 4.8,
    totalReviews: 320,
    avgCompletionTime: 95,
    completionRate: 98.5,
  },
}

const menuItems = [
  { icon: Settings, label: "Pengaturan", href: "/mekanik/settings", color: "text-zinc-400", bg: "bg-zinc-800" },
  { icon: Award, label: "Sertifikasi", href: "/mekanik/certifications", color: "text-amber-400", bg: "bg-amber-500/10" },
]

export default function ProfilePage() {
  return (
    <div className="space-y-6 pb-8">
      {/* Profile Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-white/5 p-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex items-center gap-5">
          <div className="relative shrink-0">
            <div className="h-20 w-20 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center shadow-xl ring-2 ring-primary/20">
              <User className="h-10 w-10 text-primary" />
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-zinc-900 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 mb-0.5">Performance Mechanic</p>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none truncate">
              {mockProfile.name}
            </h2>
            <p className="text-[10px] font-mono text-zinc-500 mt-1">ID: {mockProfile.employeeId}</p>
            <div className="flex items-center gap-1.5 mt-2">
              <Star className="h-3.5 w-3.5 text-primary fill-primary" />
              <span className="font-black text-sm text-zinc-100">{mockProfile.stats.rating}</span>
              <span className="text-[10px] text-zinc-500">({mockProfile.stats.totalReviews} ulasan)</span>
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="relative z-10 mt-5 pt-5 border-t border-white/5 space-y-2.5">
          {[
            { icon: Mail, value: mockProfile.email },
            { icon: Phone, value: mockProfile.phone },
            { icon: Calendar, value: `Bergabung ${mockProfile.joinDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}` },
          ].map(({ icon: Icon, value }) => (
            <div key={value} className="flex items-center gap-3 text-[11px] text-zinc-400">
              <Icon className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Total Pekerjaan", value: mockProfile.stats.totalJobs.toLocaleString(), color: "text-primary" },
          { label: "Tingkat Selesai", value: `${mockProfile.stats.completionRate}%`, color: "text-emerald-400" },
          { label: "Rating", value: mockProfile.stats.rating.toString(), color: "text-amber-400" },
          { label: "Waktu Rata-rata", value: `${mockProfile.stats.avgCompletionTime}m`, color: "text-blue-400" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-zinc-900/80 border-white/5 rounded-2xl">
            <CardContent className="pt-4 pb-4 text-center">
              <p className={cn("text-2xl font-black italic", stat.color)}>{stat.value}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Specialization */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2 px-1">
          <Wrench className="h-3 w-3 text-primary" /> Spesialisasi
        </h4>
        <div className="flex flex-wrap gap-2">
          {mockProfile.specialization.map((spec) => (
            <Badge key={spec} className="bg-primary/10 text-primary border-primary/20 font-black uppercase text-[10px] tracking-wider px-3 py-1 rounded-xl">
              {spec}
            </Badge>
          ))}
        </div>
      </div>

      {/* Certifications */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2 px-1">
          <Award className="h-3 w-3 text-primary" /> Sertifikasi
        </h4>
        <div className="space-y-2">
          {mockProfile.certifications.map((cert, index) => (
            <div key={index} className="flex items-center gap-4 bg-zinc-900/60 border border-white/5 rounded-2xl p-4">
              <div className="h-10 w-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center shrink-0">
                <Award className="h-5 w-5 text-amber-400" />
              </div>
              <div className="flex-1">
                <p className="font-black text-sm text-zinc-200 uppercase">{cert.name}</p>
                <p className="text-[10px] font-mono text-zinc-600">{cert.year}</p>
              </div>
              <CheckCircle2 className="h-5 w-5 text-emerald-500 shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <Link key={index} href={item.href}>
              <div className="flex items-center justify-between bg-zinc-900/60 border border-white/5 hover:border-white/10 hover:bg-zinc-900 transition-all duration-300 rounded-2xl p-4 group cursor-pointer active:scale-[0.98]">
                <div className="flex items-center gap-4">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border border-white/5", item.bg)}>
                    <Icon className={cn("h-5 w-5", item.color)} />
                  </div>
                  <span className="font-bold text-sm text-zinc-200 uppercase tracking-wide">{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-primary transition-colors group-hover:translate-x-0.5 transition-transform" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Logout */}
      <Button variant="ghost" className="w-full h-12 rounded-2xl border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-black uppercase tracking-wider text-sm">
        <LogOut className="h-4 w-4 mr-2" />
        Keluar
      </Button>
    </div>
  )
}
