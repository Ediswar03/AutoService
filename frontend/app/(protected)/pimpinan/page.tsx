"use client"

import Link from "next/link"
import { BarChart3, CheckSquare, TrendingUp, Settings, ChevronRight, Loader2, FileText } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { PimpinanHeader } from "@/components/pimpinan/pimpinan-header"
import useSWR from "swr"
import { fetcher } from "@/lib/api-client"
import { useAuth } from "@/context/AuthContext"

const quickLinks = [
  {
    title: "Dashboard Analytics",
    description: "Lihat performa bengkel secara detail",
    icon: TrendingUp,
    href: "/pimpinan/dashboard",
    color: "bg-blue-500",
  },
  {
    title: "Approval Quotation",
    description: "Kelola persetujuan SPK",
    icon: CheckSquare,
    href: "/pimpinan/approvals",
    color: "bg-emerald-500",
  },
  {
    title: "Laporan",
    description: "Laporan inventory, mekanik, pendapatan",
    icon: BarChart3,
    href: "/pimpinan/reports",
    color: "bg-purple-500",
  },
  {
    title: "Pengaturan",
    description: "Konfigurasi sistem bengkel",
    icon: Settings,
    href: "/pimpinan/settings",
    color: "bg-amber-500",
  },
]

export default function PimpinanPage() {
  const { user } = useAuth()

  // Get current month range
  const now = new Date()
  const startDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-01`
  const endDate = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate()).padStart(2, "0")}`

  const { data: dashData, isLoading } = useSWR(
    `/reports/dashboard?startDate=${startDate}&endDate=${endDate}`,
    fetcher
  )
  const { data: woData } = useSWR(
    "/work-orders?status=PENDING&limit=100",
    fetcher
  )

  const dashboard = dashData?.data || dashData || {}
  const pendingCount = Array.isArray(woData?.data) ? woData.data.length : 0
  const revenue = dashboard.totalRevenue || dashboard.revenue || 0
  const completedOrders = dashboard.completedOrders || dashboard.totalCompleted || 0
  const avgRating = dashboard.avgRating || dashboard.customerSatisfaction || 4.8

  const stats = [
    {
      label: "Pendapatan Bulan Ini",
      value: isLoading ? "..." : `Rp ${(revenue / 1_000_000).toFixed(1)}jt`,
      color: "text-blue-600",
    },
    {
      label: "SPK Selesai",
      value: isLoading ? "..." : completedOrders.toString(),
      color: "text-emerald-600",
    },
    {
      label: "Menunggu Approval",
      value: isLoading ? "..." : pendingCount.toString(),
      color: "text-amber-600",
    },
    {
      label: "Rating Bengkel",
      value: isLoading ? "..." : Number(avgRating).toFixed(1),
      color: "text-purple-600",
    },
  ]

  return (
    <>
      <PimpinanHeader title="Dashboard Pimpinan" description="Selamat datang, Kepala Bengkel" />
      <div className="flex-1 overflow-auto p-6 space-y-6">
        {/* Welcome Card */}
        <Card className="bg-gradient-to-br from-slate-800 to-slate-900 text-white border-0">
          <CardContent className="pt-6 pb-6">
            <p className="text-white/70 text-sm">Selamat Datang,</p>
            <h2 className="text-2xl font-bold mt-1">{user?.name || "Kepala Bengkel"}</h2>
            <p className="text-white/60 text-sm mt-2">Kelola bengkel Anda dengan mudah melalui dashboard ini</p>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Menu Utama</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {quickLinks.map((link) => (
              <Link key={link.href} href={link.href}>
                <Card className="cursor-pointer hover:shadow-md transition-all hover:-translate-y-0.5 h-full">
                  <CardContent className="pt-6 pb-6 flex items-center gap-4">
                    <div className={`h-14 w-14 rounded-xl ${link.color} flex items-center justify-center shrink-0`}>
                      <link.icon className="h-7 w-7 text-white" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-semibold">{link.title}</p>
                      <p className="text-sm text-muted-foreground">{link.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Quick Stats from API */}
        <div>
          <h3 className="font-semibold text-lg mb-4">Ringkasan Bulan Ini</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((s) => (
              <Card key={s.label}>
                <CardContent className="pt-4 pb-4 text-center">
                  {isLoading ? (
                    <Loader2 className="h-6 w-6 animate-spin mx-auto text-muted-foreground" />
                  ) : (
                    <p className={`text-3xl font-bold ${s.color}`}>{s.value}</p>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">{s.label}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </>
  )
}
