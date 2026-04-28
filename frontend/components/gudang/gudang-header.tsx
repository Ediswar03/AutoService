"use client"

import { useTheme } from "next-themes"
import { Bell, Search, Calendar, ChevronDown, Moon, Sun } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/context/AuthContext"
import { api, fetcher } from "@/lib/api-client"
import useSWR from "swr"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

const BACKEND_URL = process.env.NEXT_PUBLIC_API_URL?.replace("/api/v1", "") || "http://localhost:3002"

function resolvePhotoUrl(photoUrl?: string | null): string | undefined {
  if (!photoUrl) return undefined
  if (photoUrl.startsWith("http")) return photoUrl
  
  // Handle local: prefix used by the backend when Minio is down
  if (photoUrl.startsWith("local:")) {
    const key = photoUrl.replace("local:", "")
    return `${BACKEND_URL}/api/v1/uploads/${key}`
  }
  
  // If it's just a filename or path (like avatars/...), try backend uploads first
  // then fallback to MinIO logic if that's what was intended
  if (photoUrl.includes('/') || photoUrl.length > 20) {
     return `${BACKEND_URL}/api/v1/uploads/${photoUrl}`
  }

  try {
    const url = new URL(BACKEND_URL || "http://localhost:3002")
    return `http://${url.hostname}:9000/autoservis/${photoUrl}`
  } catch {
    return `http://localhost:9000/autoservis/${photoUrl}`
  }
}

interface GudangHeaderProps {
  title?: string
  description?: string
}

export function GudangHeader({ title, description }: GudangHeaderProps) {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const { user, logout, refreshUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Real Profile State
  const { data: profileData, mutate: mutateProfile } = useSWR(user ? "/auth/me" : null, fetcher)
  const profile = profileData?.data || profileData || user
  
  const [isUploading, setIsUploading] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")

  // Add timestamp to photo URL to bypass cache
  const photoUrl = profile?.photoUrl || user?.photoUrl
  const displayPhoto = resolvePhotoUrl(photoUrl) 
    ? `${resolvePhotoUrl(photoUrl)}?t=${new Date().getTime()}`
    : undefined
  const displayName = profile?.name || user?.name || "Staf Gudang"

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("photo", file)
      await api.put("/auth/profile", formData, { headers: { "Content-Type": "multipart/form-data" } })
      await refreshUser()
      await mutateProfile()
      toast.success("Foto profil berhasil diperbarui!")
    } catch {
      toast.error("Gagal mengupload foto")
    } finally {
      setIsUploading(false)
      e.target.value = ""
    }
  }

  const handleEditName = async () => {
    const newName = window.prompt("Masukkan nama profil baru:", displayName)
    if (newName && newName.trim() !== "" && newName !== displayName) {
      try {
        await api.put("/auth/profile", { name: newName.trim() })
        await refreshUser()
        await mutateProfile()
        toast.success("Nama profil diperbarui")
      } catch {
        toast.error("Gagal memperbarui nama profil")
      }
    }
  }

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      router.push(`/gudang/inventory?search=${encodeURIComponent(searchQuery)}`)
    }
  }

  return (
    <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />

      {title && (
        <div className="flex flex-col">
          <h1 className="text-lg font-semibold">{title}</h1>
          {description && (
            <p className="text-sm text-muted-foreground">{description}</p>
          )}
        </div>
      )}

      <div className="ml-auto flex items-center gap-4">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="relative hidden md:flex items-center">
          <Search className="absolute left-2.5 size-4 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari part, kode, supplier..."
            className="h-9 w-64 rounded-full border border-slate-200 bg-slate-50 pl-9 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-amber-400 dark:border-slate-800 dark:bg-slate-900 dark:text-slate-100 dark:focus:ring-amber-400"
          />
        </form>

        {/* Date Button */}
        <Button variant="outline" className="hidden md:flex gap-2 text-slate-600 dark:text-slate-300 font-normal rounded-full">
          <Calendar className="size-4" />
          {new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}
          <ChevronDown className="size-4 text-slate-400" />
        </Button>

        {/* Theme Toggle */}
        <Button 
          variant="ghost" 
          size="icon" 
          className="rounded-full relative hover:bg-slate-100 dark:hover:bg-slate-800"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          <Sun className="size-5 dark:hidden text-slate-700" />
          <Moon className="size-5 hidden dark:block text-slate-300" />
          <span className="sr-only">Toggle theme</span>
        </Button>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
              <Bell className="size-5 text-slate-700 dark:text-slate-300" />
              <Badge
                className="absolute -top-1 -right-1 size-4 rounded-full p-0 flex items-center justify-center bg-[#FFC107] text-slate-900 border-2 border-white dark:border-slate-900"
              >
                5
              </Badge>
              <span className="sr-only">Notifikasi</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80">
            <DropdownMenuLabel>Notifikasi</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 px-4 cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-red-500" />
                <span className="font-medium text-sm">Stok Kritis: Engine Oil 5W-30</span>
              </div>
              <span className="text-xs text-muted-foreground ml-4">Sisa 8 unit - Minimum 15 unit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 px-4 cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-red-500" />
                <span className="font-medium text-sm">Stok Kritis: Car Battery 12V</span>
              </div>
              <span className="text-xs text-muted-foreground ml-4">Sisa 5 unit - Minimum 8 unit</span>
            </DropdownMenuItem>
            <DropdownMenuItem className="flex flex-col items-start gap-1 py-3 px-4 cursor-pointer">
              <div className="flex items-center gap-2">
                <div className="size-2 rounded-full bg-amber-500" />
                <span className="font-medium text-sm">3 Nota Menunggu Validasi</span>
              </div>
              <span className="text-xs text-muted-foreground ml-4">1 urgent, 2 normal</span>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-center text-sm text-amber-600 font-medium cursor-pointer">
              Lihat Semua Notifikasi
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <Separator orientation="vertical" className="h-8 hidden md:block" />

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer select-none hover:bg-slate-50 dark:hover:bg-slate-800 p-1.5 rounded-lg transition-colors">
              <Avatar className="size-9 border border-border">
                {isUploading ? (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 dark:bg-slate-800 rounded-full">
                    <Loader2 className="h-4 w-4 animate-spin text-primary" />
                  </div>
                ) : (
                  <>
                    <AvatarImage src={displayPhoto} alt={displayName} />
                    <AvatarFallback>{displayName.substring(0, 2).toUpperCase()}</AvatarFallback>
                  </>
                )}
              </Avatar>
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-bold text-slate-900 dark:text-slate-100 leading-none">{displayName}</span>
                <span className="text-xs text-slate-500 mt-1 uppercase">{user?.role || "GUDANG"}</span>
              </div>
              <ChevronDown className="size-4 text-slate-400 hidden md:block" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => fileInputRef.current?.click()} className="cursor-pointer">
              Ubah Foto Profil
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEditName} className="cursor-pointer">
              Edit Nama Profil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => logout()} className="cursor-pointer text-red-500 hover:text-red-600 focus:text-red-600">
              Keluar
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>

        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handlePhotoUpload} 
        />
      </div>
    </header>
  )
}
