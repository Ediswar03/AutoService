"use client"
import Link from "next/link"
import { useState } from "react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { AlertTriangle, Plus, Search, Filter, Pencil, Trash2, Package, Receipt, Loader2 } from "lucide-react"
import { StatsCard } from "@/components/admin/stats-card"
import useSWR from "swr"
import { fetcher } from "@/lib/api-client"

export default function AdminInventoryPage() {
  const [search, setSearch] = useState("")

  const { data: rawData, isLoading } = useSWR(
    "/inventory/spareparts?limit=500&sortBy=name&sortOrder=asc",
    fetcher
  )
  const inventoryData: any[] = Array.isArray(rawData?.data) ? rawData.data : []

  const getStatus = (stock: number, minStock: number) => {
    if (stock <= 0) return "Kritis"
    if (stock <= minStock) return "Mendekati Minimum"
    return "Aman"
  }

  const getStockBadge = (status: string, stock: number) => {
    if (status === "Aman")
      return (
        <Badge className="bg-emerald-100 text-emerald-800 border-none px-3 font-semibold shadow-none">
          {stock} Pcs (Aman)
        </Badge>
      )
    if (status === "Mendekati Minimum")
      return (
        <Badge className="bg-amber-100 text-amber-800 border-none px-3 font-semibold shadow-none">
          {stock} Pcs (Warning)
        </Badge>
      )
    return (
      <Badge className="bg-red-100 text-red-800 border-none animate-pulse px-3 font-bold shadow-none">
        {stock} Pcs (Kritis)
      </Badge>
    )
  }

  const enriched = inventoryData.map((item: any) => {
    const stock = item.stockQuantity ?? item.stok ?? 0
    const minStock = item.minStock ?? item.stok_minimum ?? 5
    return {
      ...item,
      status: getStatus(stock, minStock),
      stock: stock,
    }
  })

  const criticalCount = enriched.filter((i) => i.status === "Kritis").length
  const totalValue = enriched.reduce(
    (sum, i) => sum + Number(i.sellPrice ?? i.harga_jual ?? 0) * (i.stock ?? 0),
    0
  )

  const filtered = enriched.filter(
    (item) =>
      (item.name ?? item.nama ?? "").toLowerCase().includes(search.toLowerCase()) ||
      (item.code ?? item.kode ?? "").toLowerCase().includes(search.toLowerCase())
  )

  return (
    <>
      <AdminHeader title="Stok Barang" description="Manajemen inventori suku cadang dan sparepart bengkel." />
      <div className="p-6 space-y-6">

        {/* Critical Alert */}
        {!isLoading && criticalCount > 0 && (
          <Alert variant="destructive" className="bg-red-50 border-red-200 text-red-900 shadow-sm flex items-center gap-2">
            <div className="bg-red-100 p-2 rounded-full self-start">
              <AlertTriangle className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <AlertTitle className="text-red-800 font-bold text-base mb-1">Peringatan Stok Kritis!</AlertTitle>
              <AlertDescription className="text-red-700">
                Terdapat <strong>{criticalCount}</strong> jenis barang yang stoknya habis atau di bawah batas minimum.
                Segera lakukan restock agar tidak mengganggu operasional bengkel.
              </AlertDescription>
            </div>
          </Alert>
        )}

        {/* Stats */}
        <div className="grid gap-4 sm:grid-cols-3">
          <StatsCard
            title="Total Item Suku Cadang"
            value={isLoading ? "..." : `${enriched.length} Item`}
            icon={Package}
          />
          <StatsCard
            title="Parts Status Kritis"
            value={isLoading ? "..." : criticalCount.toString()}
            icon={AlertTriangle}
          />
          <StatsCard
            title="Total Nilai Stok"
            value={isLoading ? "..." : `Rp ${(totalValue / 1_000_000).toFixed(1)}jt`}
            icon={Receipt}
          />
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex gap-2 w-full sm:w-auto">
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-2.5 top-2.5 size-4 text-slate-500" />
              <Input
                placeholder="Cari kode atau nama part..."
                className="pl-9 bg-white"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
            <Button variant="outline" className="bg-white font-medium">
              <Filter className="size-4 mr-2" /> Kategori
            </Button>
          </div>
          <Button asChild className="bg-[#FFC107] hover:bg-[#e0a800] text-slate-900 w-full sm:w-auto font-bold shadow-sm">
            <Link href="/admin/services">
              <Plus className="size-4 mr-2 stroke-[3px]" /> Tambah Part
            </Link>
          </Button>
        </div>

        {/* Table */}
        <Card>
          <CardContent className="p-0">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="font-semibold text-slate-900 pl-4">Kode Part</TableHead>
                  <TableHead className="font-semibold text-slate-900">Nama Part</TableHead>
                  <TableHead className="font-semibold text-slate-900">Kategori</TableHead>
                  <TableHead className="text-right font-semibold text-slate-900">Harga Jual</TableHead>
                  <TableHead className="font-semibold px-6 text-slate-900">Stok Terkini</TableHead>
                  <TableHead className="text-center font-semibold text-slate-900 pr-4">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Memuat data inventori...
                    </TableCell>
                  </TableRow>
                ) : filtered.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                      Tidak ada item ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  filtered.map((item: any) => (
                    <TableRow
                      key={item.id}
                      className={item.status === "Kritis" ? "bg-red-50/50" : ""}
                    >
                      <TableCell className="font-semibold text-slate-700 pl-4 font-mono">{item.code ?? item.kode ?? item.id.slice(0, 8)}</TableCell>
                      <TableCell className="font-bold text-slate-900 dark:text-slate-100">{item.name ?? item.nama}</TableCell>
                      <TableCell className="font-medium text-slate-600">{item.category?.name ?? item.category?.nama ?? item.category ?? "-"}</TableCell>
                      <TableCell className="text-right font-bold text-slate-800">
                        Rp {Number(item.sellPrice ?? item.harga_jual ?? 0).toLocaleString("id-ID")}
                      </TableCell>
                      <TableCell className="px-6">{getStockBadge(item.status, item.stock)}</TableCell>
                      <TableCell className="text-center pr-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button
                            asChild
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-amber-600 hover:text-amber-700 hover:bg-amber-50 border-amber-200"
                          >
                            <Link href="/admin/services">
                              <Pencil className="size-4" />
                            </Link>
                          </Button>
                          <Button
                            variant="outline"
                            size="icon"
                            className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50 border-red-200"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
