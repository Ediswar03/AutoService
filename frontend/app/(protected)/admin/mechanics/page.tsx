"use client"

import Link from "next/link"
import { useState } from "react"
import { Plus, Search, Filter, Wrench, Star, MoreVertical, Edit, Trash2, Eye, Loader2 } from "lucide-react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { StatsCard } from "@/components/admin/stats-card"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import useSWR from "swr"
import { fetcher } from "@/lib/api-client"

export default function MechanicsPage() {
  const [search, setSearch] = useState("")

  // Ambil semua user dengan role MEKANIK dari API
  const { data: rawData, isLoading } = useSWR(
    "/reports/mechanics?startDate=2024-01-01&endDate=2026-12-31",
    fetcher
  )
  const { data: woData } = useSWR(
    "/work-orders?limit=1000&status=COMPLETED",
    fetcher
  )

  // Gunakan data mekanik dari report atau fallback ke empty
  const mechanicsData: any[] = Array.isArray(rawData) ? rawData : []
  const completedOrders: any[] = Array.isArray(woData?.data) ? woData.data : []

  const activeCount = mechanicsData.filter((m: any) => m.isActive !== false).length
  const avgRating =
    mechanicsData.length > 0
      ? (
          mechanicsData.reduce((sum: number, m: any) => sum + (m.avgRating || 4.5), 0) /
          mechanicsData.length
        ).toFixed(1)
      : "0"
  const completedThisMonth = completedOrders.filter((o: any) => {
    const d = new Date(o.createdAt || o.updatedAt)
    const now = new Date()
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear()
  }).length

  const filtered = mechanicsData.filter((m: any) =>
    (m.mechanicName || m.name || "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <AdminHeader title="Manajemen Mekanik" description="Kelola tim mekanik dan pantau performa mereka." />
      <div className="p-6 space-y-6">
        {/* KPI Cards */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatsCard
            title="Total Mekanik Aktif"
            value={isLoading ? "..." : activeCount.toString()}
            icon={Wrench}
          />
          <StatsCard
            title="Rata-rata Rating"
            value={isLoading ? "..." : avgRating.toString()}
            icon={Star}
          />
          <StatsCard
            title="SPK Selesai (Bulan Ini)"
            value={isLoading ? "..." : completedThisMonth.toString()}
            icon={Wrench}
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-2.5 size-4 text-slate-500" />
              <Input
                placeholder="Cari mekanik..."
                className="pl-9 bg-white"
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="bg-white">
              <Filter className="size-4 mr-2" /> Filter
            </Button>
          </div>
          <Button asChild className="bg-orange-500 hover:bg-orange-600 text-white w-full sm:w-auto shadow-sm">
            <Link href="/admin/mechanics/create">
              <Plus className="size-4 mr-2" /> Tambah mekanik baru
            </Link>
          </Button>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">No</TableHead>
                  <TableHead>Nama Mekanik</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">Total SPK</TableHead>
                  <TableHead>Rating</TableHead>
                  <TableHead className="text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Memuat data mekanik...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Tidak ada mekanik ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((mekanik: any, i: number) => {
                    const name = mekanik.mechanicName || mekanik.name || "-"
                    const isActive = mekanik.isActive !== false
                    const totalSPK = mekanik.totalOrders || mekanik.spkTotal || 0
                    const rating = mekanik.avgRating || mekanik.rating || 4.5
                    return (
                      <TableRow key={mekanik.id || mekanik.mechanicId || i}>
                        <TableCell className="text-center font-medium">{i + 1}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <Avatar className="size-8">
                              <AvatarImage src={mekanik.photoUrl || `https://i.pravatar.cc/150?u=${mekanik.mechanicId || i}`} />
                              <AvatarFallback>{name.substring(0, 2)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-bold text-slate-700 dark:text-slate-200">{name}</span>
                              {mekanik.email && <p className="text-xs text-muted-foreground">{mekanik.email}</p>}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={
                              isActive
                                ? "bg-emerald-100 text-emerald-800 hover:bg-emerald-200 border-none shadow-none"
                                : "bg-slate-100 text-slate-800 hover:bg-slate-200 border-none shadow-none"
                            }
                          >
                            {isActive ? "Aktif" : "Tidak Aktif"}
                          </Badge>
                        </TableCell>
                        <TableCell className="text-center font-semibold text-slate-700">{totalSPK}</TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Star className="size-4 fill-[#FFC107] text-[#FFC107]" />
                            <span className="font-bold text-slate-800">{Number(rating).toFixed(1)}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="size-4 text-slate-400" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem className="cursor-pointer font-medium text-slate-600">
                                <Eye className="size-4 mr-2" /> Detail
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer font-medium text-amber-600">
                                <Edit className="size-4 mr-2" /> Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem className="cursor-pointer font-medium text-red-600 focus:text-red-600">
                                <Trash2 className="size-4 mr-2" /> Hapus
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    )
                  })
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
