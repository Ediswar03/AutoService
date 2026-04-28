"use client"

import { useState } from "react"
import { Package, Plus, Clock, CheckCircle2, XCircle, ChevronRight, Search, Car, User, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import useSWR from "swr"
import { fetcher } from "@/lib/api-client"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import { PartRequestDialog } from "@/components/mekanik/PartRequestDialog"
import { format } from "date-fns"
import { id } from "date-fns/locale"

type RequestStatus = "all" | "PENDING" | "APPROVED" | "REJECTED" | "RECEIVED"

const statusConfig: Record<string, { label: string; icon: any; className: string }> = {
  PENDING:  { label: "Menunggu",  icon: Clock,        className: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  APPROVED: { label: "Disetujui", icon: CheckCircle2, className: "bg-blue-500/10 text-blue-500 border-blue-500/20" },
  RECEIVED: { label: "Diterima",  icon: CheckCircle2, className: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  REJECTED: { label: "Ditolak",   icon: XCircle,      className: "bg-red-500/10 text-red-500 border-red-500/20" },
}

export default function PartsRequestPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState<RequestStatus>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [requestDialogOpen, setRequestDialogOpen] = useState(false)

  // Ambil work orders mekanik yang statusnya WAITING_PARTS
  const { data: woData, isLoading, mutate } = useSWR(
    user ? `/work-orders?assignedMechanicId=${user.id}&limit=100&sortBy=createdAt&sortOrder=desc` : null,
    fetcher
  )

  const { data: realRequestsRaw, mutate: mutateReal } = useSWR(
    '/gudang/part-requests?limit=100',
    fetcher
  )

  const realRequests: any[] = Array.isArray(realRequestsRaw?.data) ? realRequestsRaw.data : []

  const allJobs: any[] = Array.isArray(woData?.data) ? woData.data : []

  // Semua work order yang pernah ajukan parts (WAITING_PARTS = permintaan sedang berjalan)
  const partsRequests = realRequests.map((r: any) => {
    // Map status backend ke status UI
    let reqStatus = r.status.toUpperCase()
    if (reqStatus === 'APPROVED') reqStatus = 'APPROVED'
    if (reqStatus === 'REJECTED') reqStatus = 'REJECTED'
    if (reqStatus === 'FULFILLED') reqStatus = 'RECEIVED'
    
    return {
      ...r,
      reqStatus,
      // Map data untuk UI
      orderNumber: r.orderNumber,
      customer: { name: r.workOrder?.customer?.name || '-' },
      vehicle: r.workOrder?.vehicle || { brand: '-', model: '-', licensePlate: '-' },
      spareparts: r.items.map((i: any) => ({
        name: i.sparepart.name,
        quantity: i.quantity,
      })),
    }
  })

  const filtered = partsRequests.filter((req: any) => {
    const matchesStatus = activeTab === "all" || req.reqStatus === activeTab
    const spkNumber = req.orderNumber || req.spkNumber || ""
    const customerName = req.customer?.name || ""
    const plate = req.vehicle?.licensePlate || req.vehicle?.plateNumber || ""
    const matchesSearch =
      searchQuery === "" ||
      spkNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      plate.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  const counts = {
    all: partsRequests.length,
    PENDING:  partsRequests.filter((r: any) => r.reqStatus === "PENDING").length,
    APPROVED: partsRequests.filter((r: any) => r.reqStatus === "APPROVED").length,
    REJECTED: partsRequests.filter((r: any) => r.reqStatus === "REJECTED").length,
    RECEIVED: partsRequests.filter((r: any) => r.reqStatus === "RECEIVED").length,
  }

  return (
    <div className="space-y-6">
      {/* Search & Action */}
      <div className="flex gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-500" />
          <Input
            placeholder="Cari request parts..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 bg-zinc-900 border-white/5 focus:border-primary/50 transition-all rounded-xl"
          />
        </div>
        <Button
          className="bg-primary text-black font-black rounded-xl px-4 shadow-[0_4px_20px_rgba(var(--primary),0.3)]"
          onClick={() => setRequestDialogOpen(true)}
        >
          <Plus className="h-5 w-5" />
        </Button>
      </div>

      <PartRequestDialog 
        open={requestDialogOpen} 
        onOpenChange={setRequestDialogOpen} 
        onSuccess={() => {
          mutate()
          mutateReal()
        }}
      />

      {/* Status Filter */}
      <div className="overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as RequestStatus)} className="w-fit">
          <TabsList className="h-10 inline-flex items-center gap-2 bg-zinc-900/50 p-1 rounded-xl border border-white/5">
            <TabsTrigger value="all" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-4 data-[state=active]:bg-zinc-800 data-[state=active]:text-white">
              SEMUA ({counts.all})
            </TabsTrigger>
            <TabsTrigger value="PENDING" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-4 data-[state=active]:bg-amber-500/20 data-[state=active]:text-amber-400">
              PENDING ({counts.PENDING})
            </TabsTrigger>
            <TabsTrigger value="APPROVED" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-4 data-[state=active]:bg-blue-500/20 data-[state=active]:text-blue-400">
              APPROVED ({counts.APPROVED})
            </TabsTrigger>
            <TabsTrigger value="RECEIVED" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-4 data-[state=active]:bg-emerald-500/20 data-[state=active]:text-emerald-400">
              DITERIMA ({counts.RECEIVED})
            </TabsTrigger>
            <TabsTrigger value="REJECTED" className="rounded-lg text-[10px] font-black uppercase tracking-wider px-4 data-[state=active]:bg-red-500/20 data-[state=active]:text-red-400">
              DITOLAK ({counts.REJECTED})
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {isLoading ? (
          <Card className="bg-zinc-900/50 border-white/5">
            <CardContent className="py-12 text-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary mx-auto mb-3" />
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Memuat Data...</p>
            </CardContent>
          </Card>
        ) : filtered.length === 0 ? (
          <Card className="bg-zinc-900/50 border-white/5 border-dashed">
            <CardContent className="py-12 text-center">
              <Package className="h-12 w-12 text-zinc-700 mx-auto mb-4" />
              <p className="text-zinc-500 font-bold uppercase tracking-widest text-xs">Tidak ada permintaan parts</p>
            </CardContent>
          </Card>
        ) : (
          filtered.map((req: any) => {
            const config = statusConfig[req.reqStatus] || statusConfig.PENDING
            const Icon = config.icon
            const spkNumber = req.orderNumber || req.spkNumber || "-"
            const customerName = req.customer?.name || "-"
            const brand = req.vehicle?.brand || ""
            const model = req.vehicle?.model || ""
            const plate = req.vehicle?.licensePlate || req.vehicle?.plateNumber || "-"
            const parts = req.spareparts || []
            const totalItems = parts.reduce((acc: number, p: any) => acc + (p.quantity || 0), 0)
            const createdAt = req.createdAt ? new Date(req.createdAt) : new Date()

            return (
              <Card key={req.id} className="bg-zinc-900/60 border-white/5 hover:border-white/10 transition-all duration-300 rounded-2xl overflow-hidden group">
                <CardContent className="p-5 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="space-y-1">
                      <span className="font-mono text-[11px] font-black text-primary bg-primary/10 px-2.5 py-0.5 rounded border border-primary/20">
                        {spkNumber}
                      </span>
                      <div className="flex items-center gap-2 text-zinc-100 font-black uppercase italic tracking-tight text-sm pt-1">
                        <User className="h-3.5 w-3.5 text-zinc-500" />
                        {customerName}
                      </div>
                    </div>
                    <Badge variant="outline" className={cn("text-[10px] font-black uppercase border h-6 px-2.5", config.className)}>
                      <Icon className="h-3 w-3 mr-1.5" />
                      {config.label}
                    </Badge>
                  </div>

                  {/* Vehicle */}
                  <div className="flex items-center gap-2 text-[10px] font-bold text-zinc-500 uppercase tracking-widest pl-0.5">
                    <Car className="h-3 w-3" />
                    {brand} {model} {plate !== "-" && `• ${plate}`}
                  </div>

                  {/* Parts Summary */}
                  <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                    <div className="flex items-center justify-between mb-2 pb-2 border-b border-white/5">
                      <span className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">Suku Cadang</span>
                      <span className="text-[10px] font-mono text-primary">
                        {parts.length > 0 ? `${parts.length} jenis • ${totalItems} unit` : "Belum ada parts"}
                      </span>
                    </div>
                    {parts.length > 0 ? (
                      <div className="space-y-2">
                        {parts.slice(0, 3).map((p: any, i: number) => (
                          <div key={i} className="flex justify-between text-xs">
                            <span className="text-zinc-300 font-medium">{p.sparepart?.name || p.name || "-"}</span>
                            <span className="text-zinc-500 font-mono">x{p.quantity}</span>
                          </div>
                        ))}
                        {parts.length > 3 && (
                          <p className="text-[10px] text-zinc-600 italic">+{parts.length - 3} item lainnya...</p>
                        )}
                      </div>
                    ) : (
                      <p className="text-xs text-zinc-600 italic">Lihat detail SPK untuk informasi parts</p>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex items-center justify-between pt-2">
                    <div className="flex items-center gap-1.5 text-[10px] font-mono text-zinc-600 uppercase">
                      <Clock className="h-3 w-3" />
                      {createdAt.toLocaleDateString("id-ID", { day: "2-digit", month: "short" })}
                    </div>
                    <button className="flex items-center gap-1 text-[10px] font-black text-primary uppercase tracking-widest hover:gap-2 transition-all">
                      Detail <ChevronRight className="h-3 w-3" />
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
