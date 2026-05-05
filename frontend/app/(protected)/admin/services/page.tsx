"use client"

import { useState } from "react"
import { Plus, Edit, Trash2, Search, Package, Wrench, Loader2, X, Clock, Banknote } from "lucide-react"
import { AdminHeader } from "@/components/admin/AdminHeader"
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
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { toast } from "sonner"
import useSWR from "swr"
import { fetcher, api } from "@/lib/api-client"
import { cn } from "@/lib/utils"

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
  const [drawerOpen, setDrawerOpen]     = useState(false)
  const [isClosing, setIsClosing]       = useState(false)
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
    setDrawerOpen(true)
  }

  const handleEdit = (item: any) => {
    setEditingItem(item)
    setFormData({
      name:        item.name || "",
      price:       activeTab === "services" ? (item.basePrice || item.price || 0) : (item.sellPrice || 0),
      description: item.description || "",
      duration:    item.estimatedDuration || item.duration || 60,
    })
    setDrawerOpen(true)
  }

  const handleClose = () => {
    setIsClosing(true)
    setTimeout(() => {
      setDrawerOpen(false)
      setIsClosing(false)
      setEditingItem(null)
    }, 450)
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
      handleClose()
    } catch {
      toast.error(`Gagal ${editingItem ? "memperbarui" : "menambah"} ${activeTab === "services" ? "layanan" : "part"}`)
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDelete = async (item: any) => {
    if (!confirm(`Hapus ${activeTab === "services" ? "layanan" : "part"} "${item.name}"?`)) return
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
              <TabsList className="bg-slate-100 dark:bg-zinc-900 rounded-xl p-1">
                <TabsTrigger value="services" className="gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm">
                  <Wrench className="size-4" />Layanan Servis
                </TabsTrigger>
                <TabsTrigger value="parts" className="gap-2 rounded-lg data-[state=active]:bg-white dark:data-[state=active]:bg-zinc-800 data-[state=active]:shadow-sm">
                  <Package className="size-4" />Spare Parts
                </TabsTrigger>
              </TabsList>
              <Button className="bg-orange-500 hover:bg-orange-600 text-white shadow-sm rounded-xl" onClick={handleAdd}>
                <Plus className="mr-2 size-4" />
                Tambah {activeTab === "services" ? "Layanan" : "Part"}
              </Button>
            </div>

            <Card className="border-none shadow-sm overflow-hidden">
              <CardHeader className="pb-0">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <CardTitle className="text-xl font-bold">
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
              <CardContent className="pt-6">
                <div className="relative mb-6">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari nama layanan atau part..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9 bg-slate-50/50 dark:bg-zinc-900/50 border-none rounded-xl h-11"
                  />
                </div>

                {/* Services Tab */}
                <TabsContent value="services" className="mt-0">
                  <div className="rounded-xl border border-slate-100 dark:border-white/5 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50/50 dark:bg-zinc-900/50">
                        <TableRow>
                          <TableHead className="font-bold">Nama Layanan</TableHead>
                          <TableHead className="font-bold">Deskripsi</TableHead>
                          <TableHead className="text-center font-bold">Durasi (min)</TableHead>
                          <TableHead className="text-right font-bold">Harga Dasar</TableHead>
                          <TableHead className="w-24 font-bold"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-12">
                              <Loader2 className="h-6 w-6 animate-spin inline text-primary" />
                            </TableCell>
                          </TableRow>
                        ) : filteredServices.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={5} className="text-center py-12 text-muted-foreground">
                              Tidak ada layanan ditemukan
                            </TableCell>
                          </TableRow>
                        ) : filteredServices.map((service: any) => (
                          <TableRow key={service.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/30">
                            <TableCell className="font-bold">{service.name}</TableCell>
                            <TableCell className="text-muted-foreground max-w-[200px] truncate">
                              {service.description || "-"}
                            </TableCell>
                            <TableCell className="text-center">
                              <span className="bg-blue-50 dark:bg-blue-500/10 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-md text-xs font-bold">
                                {service.estimatedDuration || "60"} min
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-black text-slate-900 dark:text-white">
                              {formatCurrency(Number(service.basePrice || service.price || 0))}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => handleEdit(service)}>
                                  <Edit className="size-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-destructive" onClick={() => handleDelete(service)}>
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>

                {/* Parts Tab */}
                <TabsContent value="parts" className="mt-0">
                  <div className="rounded-xl border border-slate-100 dark:border-white/5 overflow-hidden">
                    <Table>
                      <TableHeader className="bg-slate-50/50 dark:bg-zinc-900/50">
                        <TableRow>
                          <TableHead className="font-bold">Kode</TableHead>
                          <TableHead className="font-bold">Nama Part</TableHead>
                          <TableHead className="font-bold">Kategori</TableHead>
                          <TableHead className="text-center font-bold">Stok</TableHead>
                          <TableHead className="text-right font-bold">Harga Jual</TableHead>
                          <TableHead className="w-24 font-bold"></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {isLoading ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-12">
                              <Loader2 className="h-6 w-6 animate-spin inline text-primary" />
                            </TableCell>
                          </TableRow>
                        ) : filteredParts.length === 0 ? (
                          <TableRow>
                            <TableCell colSpan={6} className="text-center py-12 text-muted-foreground">
                              Tidak ada part ditemukan
                            </TableCell>
                          </TableRow>
                        ) : filteredParts.map((part: any) => (
                          <TableRow key={part.id} className="hover:bg-slate-50/50 dark:hover:bg-zinc-900/30">
                            <TableCell className="font-mono text-xs font-bold text-slate-400">{part.code || "-"}</TableCell>
                            <TableCell className="font-bold">{part.name}</TableCell>
                            <TableCell className="text-muted-foreground text-sm">{part.category || "-"}</TableCell>
                            <TableCell className="text-center">
                              <span className={cn(
                                "px-2 py-1 rounded-md text-xs font-bold",
                                part.stockQuantity <= 0 ? "bg-red-50 text-red-500" : part.stockQuantity <= (part.minStock ?? 5) ? "bg-amber-50 text-amber-600" : "bg-emerald-50 text-emerald-600"
                              )}>
                                {part.stockQuantity}
                              </span>
                            </TableCell>
                            <TableCell className="text-right font-black text-slate-900 dark:text-white">
                              {formatCurrency(Number(part.sellPrice || 0))}
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-1">
                                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8" onClick={() => handleEdit(part)}>
                                  <Edit className="size-4" />
                                </Button>
                                <Button variant="ghost" size="icon" className="rounded-full h-8 w-8 text-destructive" onClick={() => handleDelete(part)}>
                                  <Trash2 className="size-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                </TabsContent>
              </CardContent>
            </Card>
          </Tabs>
        </div>
      </div>

      {/* Drawer Implementation */}
      {drawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end overflow-hidden">
          {/* Backdrop */}
          <div 
            className={cn(
              "absolute inset-0 bg-slate-950/20 backdrop-blur-md transition-opacity duration-500",
              isClosing ? "opacity-0" : "animate-in fade-in"
            )}
            onClick={handleClose}
          />
          
          {/* Drawer Content */}
          <div className={cn(
            "relative w-full max-w-xl bg-white dark:bg-zinc-900 h-full shadow-2xl border-l border-white/10 flex flex-col transition-transform duration-500 ease-in-out",
            isClosing 
              ? "translate-x-full" 
              : "animate-in slide-in-from-right"
          )}>
            <div className="p-8 flex-1 overflow-y-auto custom-scrollbar">
              <div className="space-y-8">
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <h2 className="text-3xl font-black tracking-tighter uppercase italic">
                      {editingItem ? "Edit" : "Tambah"} <span className="text-primary">{activeTab === "services" ? "Layanan" : "Part"}</span>
                    </h2>
                    <p className="text-slate-500 text-sm font-medium">
                      {editingItem ? "Ubah informasi item di bawah ini." : `Daftarkan ${activeTab === "services" ? "layanan" : "spare part"} baru ke dalam katalog.`}
                    </p>
                  </div>
                  <Button 
                    variant="outline" 
                    size="icon" 
                    className="rounded-full hover:bg-red-500/10 hover:text-red-500 border-slate-200 dark:border-white/10"
                    onClick={handleClose}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>

                <div className="bg-slate-50 dark:bg-zinc-950 p-6 rounded-3xl border border-slate-100 dark:border-white/5 space-y-6">
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">Nama {activeTab === "services" ? "Layanan" : "Spare Part"}</Label>
                      <Input
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder={activeTab === "services" ? "Contoh: Ganti Oli Mesin" : "Contoh: Oli Shell Helix 10W-40"}
                        className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 rounded-xl h-11"
                        required
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                          <Banknote className="size-3 inline mr-1 mb-0.5" />
                          Harga {activeTab === "services" ? "Dasar" : "Jual"}
                        </Label>
                        <Input
                          type="number"
                          min={0}
                          value={formData.price || ""}
                          onChange={(e) => setFormData({ ...formData, price: parseInt(e.target.value) || 0 })}
                          placeholder="150000"
                          className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 rounded-xl h-11"
                          required
                        />
                      </div>
                      
                      {activeTab === "services" && (
                        <div className="space-y-2">
                          <Label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                            <Clock className="size-3 inline mr-1 mb-0.5" />
                            Estimasi Durasi (menit)
                          </Label>
                          <Input
                            type="number"
                            min={0}
                            value={formData.duration || ""}
                            onChange={(e) => setFormData({ ...formData, duration: parseInt(e.target.value) || 60 })}
                            placeholder="60"
                            className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 rounded-xl h-11"
                          />
                        </div>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">Deskripsi (Opsional)</Label>
                      <Textarea
                        value={formData.description || ""}
                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        placeholder="Berikan deskripsi singkat tentang item ini..."
                        rows={4}
                        className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 rounded-2xl resize-none"
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-2">
                    <Button variant="outline" className="flex-1 rounded-xl h-11" onClick={handleClose} disabled={isSubmitting}>Batal</Button>
                    <Button 
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white rounded-xl h-11 shadow-md shadow-orange-500/20" 
                      onClick={handleSave} 
                      disabled={!formData.name || !formData.price || isSubmitting}
                    >
                      {isSubmitting ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      ) : (
                        <Plus className="mr-2 h-4 w-4" />
                      )}
                      {editingItem ? "Simpan Perubahan" : `Tambah ${activeTab === "services" ? "Layanan" : "Part"}`}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
