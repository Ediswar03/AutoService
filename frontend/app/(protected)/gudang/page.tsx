"use client"

import Link from "next/link"
import {
  Package, AlertTriangle, ClipboardCheck, TrendingDown,
  ArrowUpRight, ArrowDownRight, Clock, ChevronRight,
  Boxes, ArrowRight, Loader2
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { DashboardCharts } from "@/components/gudang/dashboard-charts"
import { GudangHeader } from "@/components/gudang/gudang-header"
import { CriticalStockAlert } from "@/components/gudang/critical-stock-alert"
import useSWR from "swr"
import { fetcher } from "@/lib/api-client"

export default function GudangDashboard() {
  const { data: sparepartsRaw, isLoading: loadingStock } = useSWR(
    "/inventory/spareparts?limit=500",
    fetcher
  )
  const { data: movementsRaw, isLoading: loadingMovements } = useSWR(
    "/inventory/stock-movements?limit=10&sortBy=createdAt&sortOrder=desc",
    fetcher
  )

  const allItems: any[] = Array.isArray(sparepartsRaw?.data) ? sparepartsRaw.data : []
  const movements: any[] = Array.isArray(movementsRaw?.data) ? movementsRaw.data : []

  const criticalItems = allItems.filter(
    (i: any) => i.stockQuantity !== undefined && i.stockQuantity <= 0
  )
  const minimumItems = allItems.filter(
    (i: any) => i.stockQuantity !== undefined && i.stockQuantity > 0 && i.stockQuantity <= (i.minStock ?? 5)
  )

  const todayInbound = movements.filter((m: any) =>
    m.type === "PURCHASE" || m.type === "INITIAL" || m.type === "ADJUSTMENT_IN"
  ).reduce((sum: number, m: any) => sum + (m.quantity || 0), 0)

  const todayOutbound = movements.filter((m: any) =>
    m.type === "SALE" || m.type === "ADJUSTMENT_OUT"
  ).reduce((sum: number, m: any) => sum + Math.abs(m.quantity || 0), 0)

  const recentMovements = movements.slice(0, 5)

  return (
    <>
      <GudangHeader title="Dashboard" description="Ringkasan status inventori dan aktivitas gudang" />
      <CriticalStockAlert />

      <div className="flex-1 overflow-auto p-6 bg-slate-50/50">
        <div className="mx-auto max-w-7xl space-y-6">

          {/* Stats Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-slate-500">Total Parts</CardTitle>
                <div className="size-8 rounded-lg bg-slate-100 flex items-center justify-center">
                  <Package className="size-4 text-slate-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  {loadingStock ? <Loader2 className="h-5 w-5 animate-spin" /> : allItems.length.toLocaleString()}
                </div>
                <p className="text-xs text-slate-400 mt-1">Jenis suku cadang dalam stok</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-red-100 bg-red-50/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-red-600">Stok Kritis</CardTitle>
                <div className="size-8 rounded-lg bg-red-100 flex items-center justify-center">
                  <AlertTriangle className="size-4 text-red-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-red-600">
                  {loadingStock ? "..." : criticalItems.length}
                </div>
                <p className="text-xs text-red-500/80 mt-1">Perlu restock segera!</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-amber-100 bg-amber-50/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-amber-600">Stok Minimum</CardTitle>
                <div className="size-8 rounded-lg bg-amber-100 flex items-center justify-center">
                  <TrendingDown className="size-4 text-amber-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-600">
                  {loadingStock ? "..." : minimumItems.length}
                </div>
                <p className="text-xs text-amber-500/80 mt-1">Mendekati batas minimum</p>
              </CardContent>
            </Card>

            <Card className="shadow-sm border-blue-100 bg-blue-50/30">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-blue-600">Total Nilai Stok</CardTitle>
                <div className="size-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <ClipboardCheck className="size-4 text-blue-600" />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-600">
                  {loadingStock ? "..." : `Rp ${(
                    allItems.reduce((s: number, i: any) => s + Number(i.sellPrice || 0) * (i.stockQuantity || 0), 0) / 1_000_000
                  ).toFixed(0)}jt`}
                </div>
                <p className="text-xs text-blue-500/80 mt-1">Nilai total inventori aktif</p>
              </CardContent>
            </Card>
          </div>

          {/* Secondary Stats */}
          <div className="grid gap-4 md:grid-cols-3">
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-full bg-emerald-100 text-emerald-600 shrink-0">
                <ArrowDownRight className="size-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Inbound (Recent)</p>
                <h4 className="text-lg font-bold text-slate-900">
                  +{todayInbound} <span className="text-[10px] font-normal text-slate-400 ml-1">Unit</span>
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-full bg-blue-100 text-blue-600 shrink-0">
                <ArrowUpRight className="size-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Outbound (Recent)</p>
                <h4 className="text-lg font-bold text-slate-900">
                  -{todayOutbound} <span className="text-[10px] font-normal text-slate-400 ml-1">Unit</span>
                </h4>
              </div>
            </div>
            <div className="flex items-center gap-4 bg-white p-4 rounded-xl border border-slate-200 shadow-sm">
              <div className="flex size-10 items-center justify-center rounded-full bg-slate-100 text-slate-600 shrink-0">
                <Clock className="size-5" />
              </div>
              <div>
                <p className="text-xs text-slate-500 font-medium">Pergerakan Stok</p>
                <h4 className="text-lg font-bold text-slate-900">
                  {movements.length} <span className="text-[10px] font-normal text-slate-400 ml-1">Transaksi</span>
                </h4>
              </div>
            </div>
          </div>

          {/* Charts */}
          <DashboardCharts />

          {/* Lists Section */}
          <div className="grid gap-6 lg:grid-cols-2">
            {/* Critical Stock */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-50">
                <div>
                  <CardTitle className="text-lg">Stok Perlu Perhatian</CardTitle>
                  <CardDescription className="text-xs">Parts dengan stok kritis dan minimum</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 font-medium" asChild>
                  <Link href="/gudang/inventory?status=critical">Lihat Semua <ChevronRight className="ml-1 size-4" /></Link>
                </Button>
              </CardHeader>
              <CardContent className="pt-4 px-3">
                {loadingStock ? (
                  <div className="py-6 text-center text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                    <p className="text-xs">Memuat data...</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {[...criticalItems, ...minimumItems].slice(0, 5).map((item: any) => {
                      const isCritical = item.stockQuantity <= 0
                      return (
                        <div key={item.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-white hover:border-amber-200 transition-all">
                          <div className="flex items-center gap-3">
                            <div className={`size-2.5 rounded-full ${isCritical ? "bg-red-500 animate-pulse" : "bg-amber-500"}`} />
                            <div>
                              <p className="font-bold text-sm text-slate-900">{item.name}</p>
                              <p className="text-[11px] text-slate-500">{item.code} • {item.category}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-sm ${isCritical ? "text-red-500" : "text-amber-500"}`}>
                              {item.stockQuantity} / {item.minStock ?? 5}
                            </p>
                            <p className="text-[10px] text-slate-400 uppercase tracking-tighter">Stok / Min</p>
                          </div>
                        </div>
                      )
                    })}
                    {criticalItems.length === 0 && minimumItems.length === 0 && (
                      <p className="text-center text-sm text-slate-400 py-4">Semua stok dalam kondisi aman ✓</p>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Recent Movements */}
            <Card className="shadow-sm border-slate-200">
              <CardHeader className="flex flex-row items-center justify-between pb-3 border-b border-slate-50">
                <div>
                  <CardTitle className="text-lg">Pergerakan Stok Terbaru</CardTitle>
                  <CardDescription className="text-xs">Riwayat transaksi masuk dan keluar</CardDescription>
                </div>
                <Button variant="ghost" size="sm" className="text-blue-600 hover:text-blue-700 font-medium" asChild>
                  <Link href="/gudang/stock-movements">Lihat Riwayat <ChevronRight className="ml-1 size-4" /></Link>
                </Button>
              </CardHeader>
              <CardContent className="pt-4 px-3">
                {loadingMovements ? (
                  <div className="py-6 text-center text-slate-400">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto mb-2" />
                    <p className="text-xs">Memuat data...</p>
                  </div>
                ) : recentMovements.length === 0 ? (
                  <p className="text-center text-sm text-slate-400 py-4">Belum ada pergerakan stok</p>
                ) : (
                  <div className="space-y-2">
                    {recentMovements.map((movement: any) => {
                      const isIn = ["PURCHASE", "INITIAL", "ADJUSTMENT_IN"].includes(movement.type)
                      const date = movement.createdAt ? new Date(movement.createdAt) : null
                      return (
                        <div key={movement.id} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50/50 p-3 hover:bg-white hover:border-slate-200 transition-all">
                          <div className="flex items-center gap-3">
                            <div className={`flex size-10 items-center justify-center rounded-lg ${isIn ? "bg-emerald-100 text-emerald-600" : "bg-blue-100 text-blue-600"}`}>
                              {isIn ? <ArrowDownRight className="size-5" /> : <ArrowUpRight className="size-5" />}
                            </div>
                            <div>
                              <p className="font-bold text-sm text-slate-900">
                                {movement.sparepart?.name || "Part tidak diketahui"}
                              </p>
                              <p className="text-[11px] text-slate-500 font-mono">
                                {movement.reference || movement.type} • {movement.performedBy?.name || "-"}
                              </p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className={`font-bold text-sm ${isIn ? "text-emerald-600" : "text-blue-600"}`}>
                              {isIn ? "+" : "-"}{Math.abs(movement.quantity || 0)}
                            </p>
                            <p className="text-[10px] text-slate-400 font-medium">
                              {date ? date.toLocaleDateString("id-ID", { day: "2-digit", month: "short" }) : "-"}
                            </p>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions Footer */}
          <Card className="bg-slate-900 text-white overflow-hidden relative shadow-lg">
            <div className="absolute right-0 top-0 h-full w-1/3 bg-gradient-to-l from-amber-500/20 to-transparent pointer-events-none" />
            <CardContent className="p-8 relative z-10">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl font-bold text-[#FFC107] mb-2">Butuh Kelola Data Cepat?</h3>
                  <p className="text-slate-300 text-sm max-w-md">Akses menu utama untuk pengelolaan stok, supplier, dan laporan gudang secara instan.</p>
                </div>
                <div className="flex flex-wrap justify-center gap-3">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white font-bold px-6 py-5 rounded-xl transition-all hover:scale-105" asChild>
                    <Link href="/gudang/inventory">
                      <Boxes className="mr-2 size-5" />
                      Data Inventori
                    </Link>
                  </Button>
                  <Button variant="outline" className="border-slate-700 text-white hover:bg-slate-800 font-bold px-6 py-5 rounded-xl transition-all" asChild>
                    <Link href="/gudang/approvals">
                      Validasi Nota <ArrowRight className="ml-2 size-5" />
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  )
}
