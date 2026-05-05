"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Plus, Search, Edit, Trash2, MoreHorizontal, User, Loader2 } from "lucide-react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { toast } from "sonner"
import useSWR from "swr"
import { fetcher, api } from "@/lib/api-client"
import Link from "next/link"

export default function VehiclesPage() {
  const searchParams = useSearchParams()
  const customerIdParam = searchParams.get("customer")

  const [searchQuery, setSearchQuery] = useState("")
  const [customerFilter, setCustomerFilter] = useState<string>(customerIdParam || "all")
  const [brandFilter, setBrandFilter] = useState<string>("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [vehicleToDelete, setVehicleToDelete] = useState<any | null>(null)

  const { data: vehiclesRaw, isLoading, mutate } = useSWR(
    "/vehicles?limit=500&sortBy=createdAt&sortOrder=desc",
    fetcher
  )
  const { data: customersRaw } = useSWR("/customers?limit=500", fetcher)

  const vehicles: any[] = Array.isArray(vehiclesRaw?.data) ? vehiclesRaw.data : []
  const customers: any[] = Array.isArray(customersRaw?.data) ? customersRaw.data : []

  const uniqueBrands = [...new Set(vehicles.map((v: any) => v.brand))].sort() as string[]

  const filteredVehicles = vehicles.filter((vehicle: any) => {
    const plate = vehicle.licensePlate || vehicle.plateNumber || ""
    const matchesSearch =
      plate.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vehicle.brand || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (vehicle.model || "").toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCustomer = customerFilter === "all" || vehicle.customerId === customerFilter
    const matchesBrand = brandFilter === "all" || vehicle.brand === brandFilter
    return matchesSearch && matchesCustomer && matchesBrand
  })

  const handleDelete = async () => {
    if (!vehicleToDelete) return
    try {
      await api.delete(`/vehicles/${vehicleToDelete.id}`)
      await mutate()
      toast.success("Kendaraan berhasil dihapus")
    } catch {
      toast.error("Gagal menghapus kendaraan")
    } finally {
      setVehicleToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <AdminHeader title="Kelola Kendaraan" description="Daftar dan manajemen kendaraan" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Daftar Kendaraan</CardTitle>
                  <CardDescription>
                    Total {isLoading ? "..." : filteredVehicles.length} kendaraan terdaftar
                  </CardDescription>
                </div>
                <Link href="/admin/vehicles/create">
                  <Button className="bg-orange-500 hover:bg-orange-600 text-white border-none shadow-sm">
                    <Plus className="mr-2 size-4" />
                    Tambah Kendaraan
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari no. plat, merk, atau model..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={customerFilter} onValueChange={setCustomerFilter}>
                  <SelectTrigger className="w-full sm:w-48">
                    <SelectValue placeholder="Pemilik" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Pemilik</SelectItem>
                    {customers.map((customer: any) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select value={brandFilter} onValueChange={setBrandFilter}>
                  <SelectTrigger className="w-full sm:w-36">
                    <SelectValue placeholder="Merk" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Merk</SelectItem>
                    {uniqueBrands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>No. Plat</TableHead>
                    <TableHead>Kendaraan</TableHead>
                    <TableHead>Pemilik</TableHead>
                    <TableHead>No. Rangka</TableHead>
                    <TableHead>No. Mesin</TableHead>
                    <TableHead>Terdaftar</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Memuat data kendaraan...
                      </TableCell>
                    </TableRow>
                  ) : filteredVehicles.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center py-8 text-muted-foreground">
                        Tidak ada kendaraan ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredVehicles.map((vehicle: any) => {
                      const plate = vehicle.licensePlate || vehicle.plateNumber || "-"
                      const ownerName = vehicle.customer?.name || "-"
                      return (
                        <TableRow key={vehicle.id}>
                          <TableCell className="font-medium font-mono">{plate}</TableCell>
                          <TableCell>
                            <div>
                              <p className="font-medium">
                                {vehicle.brand} {vehicle.model}
                              </p>
                              <p className="text-sm text-muted-foreground">
                                {vehicle.year}{vehicle.color ? ` - ${vehicle.color}` : ""}
                              </p>
                            </div>
                          </TableCell>
                          <TableCell>
                            {ownerName !== "-" ? (
                              <Link
                                href={`/admin/customers`}
                                className="flex items-center gap-1 hover:underline text-primary"
                              >
                                <User className="size-3" />
                                {ownerName}
                              </Link>
                            ) : (
                              <span className="text-muted-foreground">-</span>
                            )}
                          </TableCell>
                          <TableCell className="text-sm font-mono text-muted-foreground">
                            {vehicle.chassisNumber || vehicle.vin || "-"}
                          </TableCell>
                          <TableCell className="text-sm font-mono text-muted-foreground">
                            {vehicle.engineNumber || "-"}
                          </TableCell>
                          <TableCell className="text-sm text-muted-foreground">
                            {vehicle.createdAt
                              ? new Date(vehicle.createdAt).toLocaleDateString("id-ID", {
                                day: "2-digit", month: "short", year: "numeric",
                              })
                              : "-"}
                          </TableCell>
                          <TableCell>
                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="icon">
                                  <MoreHorizontal className="size-4" />
                                  <span className="sr-only">Menu</span>
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end">
                                <DropdownMenuItem asChild>
                                  <Link href={`/admin/vehicles/create?edit=${vehicle.id}`} className="flex items-center w-full">
                                    <Edit className="mr-2 size-4" />
                                    Edit
                                  </Link>
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem
                                  className="text-destructive"
                                  onClick={() => {
                                    setVehicleToDelete(vehicle)
                                    setDeleteDialogOpen(true)
                                  }}
                                >
                                  <Trash2 className="mr-2 size-4" />
                                  Hapus
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
      </div>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Kendaraan?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin menghapus kendaraan &quot;{vehicleToDelete?.licensePlate || vehicleToDelete?.plateNumber}&quot;?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Hapus
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
