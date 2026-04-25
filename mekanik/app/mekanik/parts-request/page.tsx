"use client"

import { useState } from "react"
import { Package, Plus, Clock, CheckCircle2, XCircle, AlertCircle, ChevronRight, Search, Wrench, Car, User } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"

type RequestStatus = "all" | "pending" | "approved" | "rejected" | "received"

const mockPartsRequests = [
  {
    id: "1",
    spkNumber: "SPK-2024-001",
    customer: "Ahmad Sudirman",
    vehicle: "Toyota Avanza - B 1234 ABC",
    items: [
      { name: "Belt Kipas", quantity: 1, price: 150000 },
      { name: "Filter Udara", quantity: 1, price: 85000 },
    ],
    status: "pending" as const,
    requestedAt: new Date("2024-01-15T10:30:00"),
    notes: "Urgent - pelanggan menunggu",
  },
  {
    id: "2",
    spkNumber: "SPK-2024-002",
    customer: "Siti Rahayu",
    vehicle: "Honda Jazz - B 5678 DEF",
    items: [
      { name: "Oli Mesin 4L", quantity: 1, price: 450000 },
      { name: "Filter Oli", quantity: 1, price: 65000 },
    ],
    status: "approved" as const,
    requestedAt: new Date("2024-01-15T11:00:00"),
    notes: null,
  },
  {
    id: "3",
    spkNumber: "SPK-2024-004",
    customer: "Dewi Lestari",
    vehicle: "Suzuki Ertiga - B 3456 JKL",
    items: [
      { name: "Kampas Rem Depan", quantity: 1, price: 350000 },
    ],
    status: "rejected" as const,
    requestedAt: new Date("2024-01-14T15:00:00"),
    notes: "Stok sedang kosong, indent 2 hari",
  },
]

const statusConfig = {
  pending: { label: "Menunggu", icon: Clock, className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  approved: { label: "Disetujui", icon: CheckCircle2, className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  received: { label: "Diterima", icon: CheckCircle2, className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  rejected: { label: "Ditolak", icon: XCircle, className: "bg-red-500/10 text-red-500 border-red-500/20" },
}

export default function PartsRequestPage() {
  const [activeTab, setActiveTab] = useState<RequestStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredRequests = mockPartsRequests.filter((req) => {
    const matchesStatus = activeTab === "all" || req.status === activeTab
    const matchesSearch = 
      searchQuery === "" || 
      req.spkNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.vehicle.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.customer.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-6">
      {/* Search & Action */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input 
            placeholder="Cari request..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-900 border-white/5 focus:border-primary/50 transition-all rounded-xl"
          />
        </div>
        <Button className="bg-primary text-black font-black rounded-xl px-4 shadow-[0_4px_20px_rgba(var(--primary),0.3)]">
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      {/* Status Filter */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as RequestStatus)} className="w-fit">
          <TabsList className="h-10 inline-flex items-center gap-2 bg-zinc-900/50 p-1 rounded-xl border border-white/5">
            <TabsTrigger value="all" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-4 data-[state=active]:bg-zinc-800 data-[state=active]:text-white">SEMUA</TabsTrigger>
            <TabsTrigger value="pending" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-4 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">PENDING</TabsTrigger>
            <TabsTrigger value="approved" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-4 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">APPROVED</TabsTrigger>
            <TabsTrigger value="rejected" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-4 data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">REJECTED</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.map((req) => {
          const config = statusConfig[req.status]
          const totalItems = req.items.reduce((acc, item) => acc + item.quantity, 0)
          
          return (
            <Card key={req.id} className="bg-zinc-900/60 border-white/5 hover:border-white/10 transition-all duration-300 rounded-2xl overflow-hidden group">
              <CardContent className="p-5 space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <span className="font-mono text-[11px] font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20">
                      {req.spkNumber}
                    </span>
                    <div className="flex items-center gap-2 text-zinc-100 font-black uppercase italic tracking-tight text-sm pt-1">
                       <User className="h-3.5 w-3.5 text-zinc-500" />
                       {req.customer}
                    </div>
                  </div>
                  <Badge variant="outline" className={cn("text-[10px] font-black uppercase border h-6 px-2.5", config.className)}>
                    <config.icon className="h-3 w-3 mr-1.5" />
                    {config.label}
                  </Badge>
                </div>

                {/* Vehicle */}
                <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">
                  <Car className="h-3 w-3" />
                  {req.vehicle}
                </div>

                {/* Items Summary */}
                <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                  <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
                    <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Daftar Suku Cadang</span>
                    <span className="text-[10px] font-mono text-primary">{totalItems} Item</span>
                  </div>
                  <div className="space-y-2">
                    {req.items.map((item, i) => (
                      <div key={i} className="flex justify-between text-xs">
                        <span className="text-zinc-300 font-medium">{item.name}</span>
                        <span className="text-zinc-500 font-mono">x{item.quantity}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between pt-2">
                  <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-600 uppercase">
                    <Clock className="h-3 w-3" />
                    {req.requestedAt.toLocaleDateString("id-ID", { day: '2-digit', month: 'short' })}
                  </div>
                  <button className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest hover:gap-2 transition-all">
                    Detail <ChevronRight className="h-3 w-3" />
                  </button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}
