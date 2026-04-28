"use client"

import { useState } from "react"
import { Plus, Search, Edit, Trash2, Car, MoreHorizontal, Loader2 } from "lucide-react"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
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

export default function CustomersPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [customerToDelete, setCustomerToDelete] = useState<any | null>(null)

  const { data: rawData, isLoading, mutate } = useSWR("/customers?limit=200&sortBy=createdAt&sortOrder=desc", fetcher)
  const customers: any[] = Array.isArray(rawData?.data) ? rawData.data : []

  const filteredCustomers = customers.filter((customer: any) => {
    const matchesSearch =
      (customer.name || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.email || "").toLowerCase().includes(searchQuery.toLowerCase()) ||
      (customer.phone || "").includes(searchQuery)
    const matchesType =
      typeFilter === "all" ||
      (typeFilter === "pribadi" && customer.customerType === "PRIBADI") ||
      (typeFilter === "korporat" && customer.customerType === "KORPORAT")
    return matchesSearch && matchesType
  })

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return
    try {
      await api.delete(`/customers/${customerToDelete.id}`)
      await mutate()
      toast.success("Pelanggan berhasil dihapus")
    } catch {
      toast.error("Gagal menghapus pelanggan")
    } finally {
      setCustomerToDelete(null)
      setDeleteDialogOpen(false)
    }
  }

  return (
    <>
      <AdminHeader title="Kelola Pelanggan" description="Daftar dan manajemen pelanggan" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Daftar Pelanggan</CardTitle>
                  <CardDescription>
                    Total {isLoading ? "..." : filteredCustomers.length} pelanggan terdaftar
                  </CardDescription>
                </div>
                <Link href="/admin/customers/create">
                  <Button>
                    <Plus className="mr-2 size-4" />
                    Tambah Pelanggan
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
                    placeholder="Cari nama, email, atau telepon..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select value={typeFilter} onValueChange={setTypeFilter}>
                  <SelectTrigger className="w-full sm:w-40">
                    <SelectValue placeholder="Tipe" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Tipe</SelectItem>
                    <SelectItem value="pribadi">Pribadi</SelectItem>
                    <SelectItem value="korporat">Korporat</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Table */}
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nama</TableHead>
                    <TableHead>Kontak</TableHead>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Kendaraan</TableHead>
                    <TableHead>Terdaftar</TableHead>
                    <TableHead className="w-12"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {isLoading ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        <Loader2 className="h-5 w-5 animate-spin inline mr-2" /> Memuat data pelanggan...
                      </TableCell>
                    </TableRow>
                  ) : filteredCustomers.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                        Tidak ada pelanggan ditemukan
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredCustomers.map((customer: any) => (
                      <TableRow key={customer.id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{customer.name}</p>
                            <p className="text-sm text-muted-foreground truncate max-w-[200px]">
                              {customer.address || "-"}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <p>{customer.email || "-"}</p>
                            <p className="text-muted-foreground">{customer.phone}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={customer.customerType === "KORPORAT" ? "default" : "secondary"}>
                            {customer.customerType === "KORPORAT" ? "Korporat" : "Pribadi"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Link
                            href={`/admin/vehicles?customer=${customer.id}`}
                            className="flex items-center gap-1 text-sm hover:underline text-primary"
                          >
                            <Car className="size-4" />
                            {customer._count?.vehicles ?? customer.vehicleCount ?? "-"} unit
                          </Link>
                        </TableCell>
                        <TableCell className="text-sm text-muted-foreground">
                          {customer.createdAt
                            ? new Date(customer.createdAt).toLocaleDateString("id-ID", {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
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
                                <Link href={`/admin/customers/${customer.id}/edit`} className="flex items-center w-full">
                                  <Edit className="mr-2 size-4" />
                                  Edit
                                </Link>
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem
                                className="text-destructive"
                                onClick={() => {
                                  setCustomerToDelete(customer)
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
                    ))
                  )}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Hapus Pelanggan?</AlertDialogTitle>
            <AlertDialogDescription>
              Anda yakin ingin menghapus pelanggan &quot;{customerToDelete?.name}&quot;?
              Tindakan ini tidak dapat dibatalkan.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Batal</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteCustomer}
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
