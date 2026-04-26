"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Search, Package, Wrench, Loader2 } from "lucide-react"
import { AdminHeader } from "@/components/admin/admin-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import useSWR from "swr"
import { fetcher, api } from "@/lib/api-client"

function formatCurrency(amount: number) {
  return new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount)
}

interface ServiceForm {
  name: string
  price: number | string
  description: string
  duration?: number | string
}

export default function ServicesPage() {
  const [searchQuery, setSearchQuery]   = useState("")
  const [dialogOpen, setDialogOpen]     = useState(false)
  const [editingItem, setEditingItem]   = useState<any | null>(null)
  const [activeTab, setActiveTab]       = useState<"services" | "parts">("services")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData]         = useState<ServiceForm>({ name: "", price: 0, description: "", duration: 60 })

  // Services API
  const { data: servicesRaw, isLoading: loadingServices, mutate: mutateServices } = useSWR(
    "/services?limit=500&sortBy=name&sortOrder=asc",
    fetcher
  )
  // Spareparts API (as catalog)
  const { data: partsRaw, isLoading: loadingParts, mutate: mutateParts } = useSWR(
    "/inventory/spareparts?limit=500&sortBy=name&sortOrder=asc",
    fetcher
  )

  const services: any[] = Array.isArray(servicesRaw?.data) ? servicesRaw.data : []
  const parts: any[]    = Array.isArray(partsRaw?.data) ? partsRaw.data : []

  const filteredServices = services.filter((s: any) =>
    (s.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  )
  const filteredParts = parts.filter((p: any) =>
    (p.name || "").toLowerCase().includes(searchQuery.toLowerCase())
  )

  const handleAdd = () => {
    setEditingItem(null)
    setFormData({ name: "", price: 0, description: "", duration: 60 })
    setDialogOpen(true)
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      name:        item.name || "",
      price:       activeTab === "services" ? (item.basePrice || item.price || 0) : (item.sellPrice || 0),
      description: item.description || "",
      duration:    item.estimatedDuration || item.duration || 60,
    })
    setDialogOpen(true)
  }

  const handleSave = async () => {
    if (!formData.name || !formData.price) return
    setIsSubmitting(true)
    try {
      if (activeTab === "services") {
        const payload = {
          name: formData.name,
          basePrice: Number(formData.price),
          description: formData.description,
          estimatedDuration: Number(formData.duration) || 60,
        }
        if (editingItem) {
          await api.put(`/services/${editingItem.id}`, payload)
          toast.success("Layanan berhasil diperbarui")
        } else {
          await api.post("/services", payload)
          toast.success("Layanan berhasil ditambahkan")
        }
        await mutateServices()
      } else {
        const payload = {
          name:      formData.name,
          sellPrice: Number(formData.price),
          description: formData.description,
        }
        if (editingItem) {
          await api.put(`/inventory/spareparts/${editingItem.id}`, payload)
          toast.success("Part berhasil diperbarui")
        } else {
          await api.post("/inventory/spareparts", payload)
          toast.success("Part berhasil ditambahkan")
        }
        await mutateParts()
      }
      setDialogOpen(false)
    } catch {
      toast.error(`Gagal ${editingItem ? "memperbarui" : "menambah"} ${activeTab === "services" ? "layanan" : "part"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (item: any) => {
    try {
      if (activeTab === "services") {
        await api.delete(`/services/${item.id}`)
        await mutateServices()
        toast.success("Layanan dihapus")
      } else {
        await api.delete(`/inventory/spareparts/${item.id}`)
        await mutateParts()
        toast.success("Part dihapus")
      }
    } catch {
      toast.error("Gagal menghapus item")
    }
  }

  const isLoading = activeTab === "services" ? loadingServices : loadingParts

  return (
    <>
      <AdminHeader title="Katalog Layanan" description="Kelola daftar layanan dan spare parts" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-5xl space-y-6">
          <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "services" | "parts")}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-6">
              <TabsList>
                <TabsTrigger value="services" className="gap-2">
                  <Wrench className="size-4" />Layanan Servis
                </TabsTrigger>
                <TabsTrigger value="parts" className="gap-2">
                  <Package className="size-4" />Spare Parts
                </TabsTrigger>
              </TabsList>
              <Button onClick={handleAdd}>
                <Plus className="mr-2 size-4" />
                Tambah {activeTab === "services" ? "Layanan" : "Part"}
              </Button>
            </div>

            <Card>
              <CardHeader>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle>
                      {activeTab === "services" ? "Daftar Layanan Servis" : "Daftar Spare Parts"}
                    </CardTitle>
                    <CardDescription>
                      {isLoading ? "Memuat..." : activeTab === "services"
                        ? `${filteredServices.length} layanan tersedia`
                        : `${filteredParts.length} spare parts tersedia`}
                    </CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama layanan atau part..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>

                {/* Services Tab */}
                <TabsContent value="services" className="mt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nama Layanan</TableHead>
                        <TableHead>Deskripsi</TableHead>
                        <TableHead className="text-center">Durasi (min)</TableHead>
                        <TableHead className="text-right">Harga Dasar</TableHead>
                        <TableHead className="w-24"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin inline mr-2" />Memuat layanan...
                          </TableCell>
                        </TableRow>
                      ) : filteredServices.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                            Tidak ada layanan ditemukan
                          </TableCell>
                        </TableRow>
                      ) : filteredServices.map((service: any) => (
                        <TableRow key={service.id}>
                          <TableCell className="font-medium">{service.name}</TableCell>
                          <TableCell className="text-muted-foreground max-w-[200px] truncate">
                            {service.description || "-"}
                          </TableCell>
                          <TableCell className="text-center text-muted-foreground">
                            {service.estimatedDuration || "-"}
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(Number(service.basePrice || service.price || 0))}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(service)}>
                                <Edit className="size-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(service)}>
                                <Trash2 className="size-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>

                {/* Parts Tab */}
                <TabsContent value="parts" className="mt-0">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Kode</TableHead>
                        <TableHead>Nama Part</TableHead>
                        <TableHead>Kategori</TableHead>
                        <TableHead className="text-center">Stok</TableHead>
                        <TableHead className="text-right">Harga Jual</TableHead>
                        <TableHead className="w-24"></TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {isLoading ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8">
                            <Loader2 className="h-5 w-5 animate-spin inline mr-2" />Memuat parts...
                          </TableCell>
                        </TableRow>
                      ) : filteredParts.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                            Tidak ada part ditemukan
                          </TableCell>
                        </TableRow>
                      ) : filteredParts.map((part: any) => (
                        <TableRow key={part.id}>
                          <TableCell className="font-mono text-xs text-muted-foreground">{part.code || "-"}</TableCell>
                          <TableCell className="font-medium">{part.name}</TableCell>
                          <TableCell className="text-muted-foreground">{part.category || "-"}</TableCell>
                          <TableCell className="text-center">
                            <span className={part.stockQuantity <= 0 ? "text-red-500 font-bold" : part.stockQuantity <= (part.minStock ?? 5) ? "text-amber-500 font-semibold" : "text-emerald-600"}>
                              {part.stockQuantity}
                            </span>
                          </TableCell>
                          <TableCell className="text-right font-medium">
                            {formatCurrency(Number(part.sellPrice || 0))}
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-1">
                              <Button variant="ghost" size="icon" onClick={() => handleEdit(part)}>
                                <Edit className="size-4" />
                              </Button>
                              <Button variant="ghost" size="icon" onClick={() => handleDelete(part)}>
                                <Trash2 className="size-4 text-destructive" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </div>

      {/* Add/Edit Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingItem
                ? `Edit ${activeTab === "services" ? "Layanan" : "Part"}`
                : `Tambah ${activeTab === "services" ? "Layanan" : "Part"} Baru`}
            </DialogTitle>
            <DialogDescription>
              {editingItem ? "Ubah informasi di bawah ini" : "Isi informasi untuk item baru"}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="name">Nama</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={activeTab === "services" ? "Ganti Oli Mesin" : "Oli Shell Helix"}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="price">Harga {activeTab === "services" ? "Dasar" : "Jual"} (Rp)</Label>
              <Input
                id="price"
                type="number"
                min={0}
                value={formData.price || ""}
                onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                placeholder="150000"
                required
              />
            </div>
            {activeTab === "services" && (
              <div className="space-y-2">
                <Label htmlFor="duration">Estimasi Durasi (menit)</Label>
                <Input
                  id="duration"
                  type="number"
                  min={0}
                  value={formData.duration || ""}
                  onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                  placeholder="60"
                />
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi (Opsional)</Label>
              <Textarea
                id="description"
                value={formData.description || ""}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Deskripsi singkat..."
                rows={2}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)} disabled={isSubmitting}>Batal</Button>
            <Button onClick={handleSave} disabled={!formData.name || !formData.price || isSubmitting}>
              {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              {editingItem ? "Simpan" : "Tambah"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}
