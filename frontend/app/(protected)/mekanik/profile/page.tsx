"use client"

import { useState, useRef } from "react"
import { User, Mail, Phone, Calendar, Star, Award, Settings, LogOut, ChevronRight, Wrench, CheckCircle2, Camera, Loader2, Save, Edit3 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { useAuth } from "@/context/AuthContext"
import { api } from "@/lib/api-client"
import { toast } from "sonner"
import useSWR from "swr"
import { fetcher } from "@/lib/api-client"
import Link from "next/link"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:3001"

function resolvePhotoUrl(photoUrl?: string | null): string | undefined {
  if (!photoUrl) return undefined
  if (photoUrl.startsWith("http")) return photoUrl
  if (photoUrl.startsWith("local:")) {
    const key = photoUrl.replace("local:", "")
    return `${BACKEND_URL}/api/v1/uploads/${key}`
  }
  try {
    const url = new URL(BACKEND_URL || "http://localhost:3001")
    return `http://${url.hostname}:9000/autoservis/${photoUrl}`
  } catch {
    return `http://localhost:9000/autoservis/${photoUrl}`
  }
}

const menuItems = [
  { icon: Settings, label: "Pengaturan",  href: "/mekanik/settings",       color: "text-zinc-400",  bg: "bg-zinc-800" },
  { icon: Award,    label: "Sertifikasi", href: "/mekanik/certifications",  color: "text-amber-400", bg: "bg-amber-500/10" },
]

export default function ProfilePage() {
  const { user, logout, refreshUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [editOpen,      setEditOpen]      = useState(false)
  const [isUploading,   setIsUploading]   = useState(false)
  const [isSaving,      setIsSaving]      = useState(false)
  const [previewImg,    setPreviewImg]    = useState<string | null>(null)
  const [selectedFile,  setSelectedFile]  = useState<File | null>(null)
  const [editForm,      setEditForm]      = useState({ name: "", phone: "", address: "" })

  // Fetch fresh profile from API
  const { data: profileData, mutate: mutateProfile } = useSWR("/auth/me", fetcher)
  const profile = profileData?.data || profileData || user

  // Fetch WO stats for mechanic
  const { data: woData } = useSWR(
    user ? `/work-orders?assignedMechanicId=${user.id}&limit=500` : null,
    fetcher
  )
  const allJobs: any[] = Array.isArray(woData?.data) ? woData.data : []
  const totalJobs        = allJobs.length
  const completedJobs    = allJobs.filter((j: any) => j.status === "COMPLETED" || j.status === "INVOICED").length
  const completionRate   = totalJobs > 0 ? ((completedJobs / totalJobs) * 100).toFixed(1) : "0"

  const displayName   = profile?.name || user?.name || "—"
  const displayEmail  = profile?.email || user?.email || "—"
  const displayPhone  = profile?.phone || user?.phone || "—"
  const displayPhoto  = resolvePhotoUrl(profile?.photoUrl || user?.photoUrl)
  const joinDate      = profile?.createdAt ? new Date(profile.createdAt) : null

  // ─── Photo Upload ───────────────────────────────────────
  const handlePhotoClick = () => fileInputRef.current?.click()

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setSelectedFile(file)
    setPreviewImg(URL.createObjectURL(file))
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("photo", file)
      await api.put("/auth/profile", formData, { headers: { "Content-Type": "multipart/form-data" } })
      await refreshUser()
      await mutateProfile()
      toast.success("Foto profil berhasil diperbarui!")
    } catch {
      toast.error("Gagal mengupload foto. Coba lagi.")
      setPreviewImg(null)
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  // ─── Edit Profile ────────────────────────────────────────
  const handleOpenEdit = () => {
    setEditForm({
      name:    displayName !== "—" ? displayName : "",
      phone:   displayPhone !== "—" ? displayPhone : "",
      address: profile?.address || "",
    })
    setEditOpen(true)
  }

  const handleSaveProfile = async () => {
    if (!editForm.name.trim()) { toast.error("Nama tidak boleh kosong"); return }
    setIsSaving(true)
    try {
      await api.put("/auth/profile", {
        name:    editForm.name,
        phone:   editForm.phone,
        address: editForm.address,
      })
      await refreshUser()
      await mutateProfile()
      setEditOpen(false)
      toast.success("Profil berhasil diperbarui!")
    } catch {
      toast.error("Gagal menyimpan profil")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="space-y-6 pb-8">
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Profile Hero */}
      <div className="relative overflow-hidden rounded-3xl bg-zinc-900 border border-white/5 p-6">
        <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
        <div className="relative z-10 flex items-center gap-5">
          {/* Avatar with upload */}
          <div className="relative shrink-0">
            <div
              className="h-20 w-20 rounded-2xl bg-zinc-950 border border-white/10 flex items-center justify-center shadow-xl ring-2 ring-primary/20 overflow-hidden cursor-pointer group"
              onClick={handlePhotoClick}
            >
              {isUploading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              ) : (previewImg || displayPhoto) ? (
                <img
                  src={previewImg || displayPhoto}
                  alt="avatar"
                  className="h-full w-full object-cover group-hover:opacity-70 transition-opacity"
                />
              ) : (
                <User className="h-10 w-10 text-primary group-hover:opacity-70 transition-opacity" />
              )}
              {/* Camera overlay */}
              <div className="absolute inset-0 bg-black/50 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                <Camera className="h-6 w-6 text-white" />
              </div>
            </div>
            <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-emerald-500 rounded-full border-2 border-zinc-900 shadow-[0_0_12px_rgba(16,185,129,0.6)]" />
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/80 mb-0.5">Performance Mechanic</p>
            <h2 className="text-2xl font-black italic uppercase tracking-tighter text-white leading-none truncate">
              {displayName}
            </h2>
            <p className="text-[10px] font-mono text-zinc-500 mt-1">
              {user?.role || "MEKANIK"}
            </p>
            <div className="flex items-center gap-1.5 mt-2">
              <Star className="h-3.5 w-3.5 text-primary fill-primary" />
              <span className="font-black text-sm text-zinc-100">{profile?.rating || "5.0"}</span>
              <span className="text-[10px] text-zinc-500">(rating mekanik)</span>
            </div>
          </div>

          {/* Edit Button */}
          <button
            onClick={handleOpenEdit}
            className="shrink-0 h-9 w-9 rounded-xl border border-white/10 bg-zinc-800 flex items-center justify-center hover:border-primary/40 hover:bg-primary/10 transition-all"
          >
            <Edit3 className="h-4 w-4 text-zinc-400" />
          </button>
        </div>

        {/* Contact Info */}
        <div className="relative z-10 mt-5 pt-5 border-t border-white/5 space-y-2.5">
          {[
            { icon: Mail,     value: displayEmail },
            { icon: Phone,    value: displayPhone !== "—" ? displayPhone : "Belum diisi" },
            { icon: Calendar, value: joinDate
                ? `Bergabung ${joinDate.toLocaleDateString("id-ID", { month: "long", year: "numeric" })}`
                : "Data tidak tersedia"
            },
          ].map(({ icon: Icon, value }) => (
            <div key={value} className="flex items-center gap-3 text-[11px] text-zinc-400">
              <Icon className="h-3.5 w-3.5 text-zinc-600 shrink-0" />
              <span className="font-medium">{value}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3">
        {[
          { label: "Total Pekerjaan",  value: totalJobs.toString(),     color: "text-primary" },
          { label: "Tingkat Selesai",  value: `${completionRate}%`,     color: "text-emerald-400" },
          { label: "Rating",           value: (profile?.rating || "5.0").toString(), color: "text-amber-400" },
          { label: "Sudah Selesai",    value: completedJobs.toString(), color: "text-blue-400" },
        ].map((stat) => (
          <Card key={stat.label} className="bg-zinc-900/80 border-white/5 rounded-2xl">
            <CardContent className="pt-4 pb-4 text-center">
              <p className={cn("text-2xl font-black italic", stat.color)}>{stat.value}</p>
              <p className="text-[9px] font-bold uppercase tracking-widest text-zinc-600 mt-0.5">{stat.label}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Role Badge */}
      <div className="space-y-3">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2 px-1">
          <Wrench className="h-3 w-3 text-primary" /> Role & Akses
        </h4>
        <div className="flex flex-wrap gap-2">
          <Badge className="bg-primary/10 text-primary border-primary/20 font-black uppercase text-[10px] tracking-wider px-3 py-1 rounded-xl">
            {profile?.role || user?.role || "MEKANIK"}
          </Badge>
          {profile?.isActive !== false && (
            <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/20 font-black uppercase text-[10px] tracking-wider px-3 py-1 rounded-xl">
              Aktif
            </Badge>
          )}
        </div>
      </div>

      {/* Menu Items */}
      <div className="space-y-2">
        {menuItems.map((item, index) => {
          const Icon = item.icon
          return (
            <Link key={index} href={item.href}>
              <div className="flex items-center justify-between bg-zinc-900/60 border border-white/5 hover:border-white/10 hover:bg-zinc-900 transition-all duration-300 rounded-2xl p-4 group cursor-pointer active:scale-[0.98]">
                <div className="flex items-center gap-4">
                  <div className={cn("h-10 w-10 rounded-xl flex items-center justify-center border border-white/5", item.bg)}>
                    <Icon className={cn("h-5 w-5", item.color)} />
                  </div>
                  <span className="font-bold text-sm text-zinc-200 uppercase tracking-wide">{item.label}</span>
                </div>
                <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-primary transition-colors" />
              </div>
            </Link>
          )
        })}
      </div>

      {/* Logout */}
      <Button
        onClick={() => logout()}
        variant="ghost"
        className="w-full h-12 rounded-2xl border border-red-500/20 text-red-400 hover:bg-red-500/10 hover:text-red-300 transition-all font-black uppercase tracking-wider text-sm"
      >
        <LogOut className="h-4 w-4 mr-2" />
        Keluar
      </Button>

      {/* Edit Profile Dialog */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="bg-zinc-900 border-white/10 text-white max-w-sm">
          <DialogHeader>
            <DialogTitle className="font-black uppercase tracking-tight">Edit Profil</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Nama Lengkap</Label>
              <Input
                value={editForm.name}
                onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                className="bg-zinc-800 border-white/10 focus:border-primary/50 rounded-xl"
                placeholder="Nama Lengkap"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">No. HP</Label>
              <Input
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className="bg-zinc-800 border-white/10 focus:border-primary/50 rounded-xl"
                placeholder="0812-xxxx-xxxx"
                type="tel"
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500">Alamat</Label>
              <Input
                value={editForm.address}
                onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                className="bg-zinc-800 border-white/10 focus:border-primary/50 rounded-xl"
                placeholder="Alamat lengkap"
              />
            </div>
          </div>
          <DialogFooter className="gap-2">
            <Button variant="ghost" onClick={() => setEditOpen(false)} className="border border-white/10 text-zinc-400">
              Batal
            </Button>
            <Button
              onClick={handleSaveProfile}
              disabled={isSaving}
              className="bg-primary text-black font-black rounded-xl"
            >
              {isSaving ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
              Simpan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
