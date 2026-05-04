"use client"

import { useSearchParams } from "next/navigation"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Suspense } from "react"
import useSWR from "swr"
import { fetcher } from "@/lib/api-client"
import { Loader2, User, Car, ClipboardList, Package, Search } from "lucide-react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"

function SearchResults() {
  const searchParams = useSearchParams()
  const query = searchParams.get('q') || ""

  const { data: customers, isLoading: lC } = useSWR(
    query ? `/customers?search=${encodeURIComponent(query)}&limit=5` : null, fetcher
  )
  const { data: vehicles, isLoading: lV } = useSWR(
    query ? `/vehicles?search=${encodeURIComponent(query)}&limit=5` : null, fetcher
  )
  const { data: workOrders, isLoading: lW } = useSWR(
    query ? `/work-orders?search=${encodeURIComponent(query)}&limit=5` : null, fetcher
  )
  const { data: spareparts, isLoading: lS } = useSWR(
    query ? `/inventory/spareparts?search=${encodeURIComponent(query)}&limit=5` : null, fetcher
  )

  const isLoading = lC || lV || lW || lS

  const customerList = customers?.data || customers || []
  const vehicleList = vehicles?.data || vehicles || []
  const workOrderList = workOrders?.data || workOrders || []
  const sparepartList = spareparts?.data || spareparts || []

  const totalResults = customerList.length + vehicleList.length + workOrderList.length + sparepartList.length

  if (!query) {
    return (
      <Card>
        <CardContent className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
          <Search className="size-12 opacity-30" />
          <p className="text-base">Ketik kata kunci di kolom pencarian di atas untuk mulai mencari</p>
        </CardContent>
      </Card>
    )
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-16">
        <Loader2 className="size-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <p className="text-sm text-muted-foreground">
        Menampilkan <span className="font-semibold text-foreground">{totalResults}</span> hasil untuk: <span className="font-semibold text-primary">"{query}"</span>
      </p>

      {/* Customers */}
      {customerList.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <User className="size-4 text-primary" /> Pelanggan ({customerList.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {customerList.map((c: any) => (
              <Link key={c.id} href={`/admin/customers?id=${c.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">{c.name || c.nama}</p>
                  <p className="text-sm text-muted-foreground">{c.phone || c.telepon} · {c.email || '-'}</p>
                </div>
                <Badge variant="outline">{c.type || c.tipe}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Work Orders */}
      {workOrderList.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <ClipboardList className="size-4 text-primary" /> SPK ({workOrderList.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {workOrderList.map((w: any) => (
              <Link key={w.id} href={`/admin/spk?id=${w.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">{w.orderNumber || w.nomor_spk}</p>
                  <p className="text-sm text-muted-foreground">{w.customer?.name || '-'} · {w.vehicle?.licensePlate || '-'}</p>
                </div>
                <Badge>{w.status}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Vehicles */}
      {vehicleList.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Car className="size-4 text-primary" /> Kendaraan ({vehicleList.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {vehicleList.map((v: any) => (
              <Link key={v.id} href={`/admin/vehicles?id=${v.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">{v.licensePlate || v.nomor_polisi}</p>
                  <p className="text-sm text-muted-foreground">{v.brand || v.merk} {v.model} · {v.customer?.name || '-'}</p>
                </div>
                <Badge variant="outline">{v.vehicleType}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Spareparts */}
      {sparepartList.length > 0 && (
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-base">
              <Package className="size-4 text-primary" /> Sparepart ({sparepartList.length})
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {sparepartList.map((s: any) => (
              <Link key={s.id} href={`/admin/spareparts?id=${s.id}`}
                className="flex items-center justify-between p-3 rounded-lg border hover:bg-muted/50 transition-colors">
                <div>
                  <p className="font-medium">{s.name || s.nama}</p>
                  <p className="text-sm text-muted-foreground">{s.code || s.kode} · Stok: {s.stockQuantity ?? s.stok ?? 0} {s.unit || s.satuan}</p>
                </div>
                <Badge variant="outline">{s.category}</Badge>
              </Link>
            ))}
          </CardContent>
        </Card>
      )}

      {totalResults === 0 && !isLoading && (
        <Card>
          <CardContent className="py-16 flex flex-col items-center gap-3 text-muted-foreground">
            <Search className="size-12 opacity-30" />
            <p className="text-base">Tidak ada hasil untuk "<span className="text-foreground font-medium">{query}</span>"</p>
            <p className="text-sm">Coba gunakan kata kunci yang berbeda</p>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export default function SearchPage() {
  return (
    <>
      <AdminHeader title="Pencarian Global" description="Cari Pelanggan, SPK, Kendaraan, atau Sparepart" />
      <div className="p-6 max-w-4xl mx-auto">
        <Suspense fallback={
          <div className="flex justify-center py-16">
            <Loader2 className="size-8 animate-spin text-primary" />
          </div>
        }>
          <SearchResults />
        </Suspense>
      </div>
    </>
  )
}
