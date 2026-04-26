"use client"

import { useTheme } from "next-themes"
import { Bell, Moon, Sun } from "lucide-react"
import { SidebarTrigger } from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { ChevronDown, Loader2 } from "lucide-react"
import { useState, useRef } from "react"
import { useAuth } from "@/context/AuthContext"
import { api, fetcher } from "@/lib/api-client"
import useSWR from "swr"
import { toast } from "sonner"

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

interface PimpinanHeaderProps {
  title?: string
  description?: string
}

export function PimpinanHeader({ title, description }: PimpinanHeaderProps) {
  const { theme, setTheme } = useTheme()
  const { user, logout, refreshUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Real Profile State
  const { data: profileData, mutate: mutateProfile } = useSWR(user ? "/auth/me" : null, fetcher)
  const profile = profileData?.data || profileData || user
  
  const [isUploading, setIsUploading] = useState(false)

  const displayPhoto = resolvePhotoUrl(profile?.photoUrl || user?.photoUrl)
  const displayName = profile?.name || user?.name || "Pimpinan"

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

        <Button variant="ghost" size="icon" className="relative rounded-full hover:bg-slate-100 dark:hover:bg-slate-800">
          <Bell className="size-5 text-slate-700 dark:text-slate-300" />
          <Badge
            className="absolute -top-1 -right-1 size-4 rounded-full p-0 flex items-center justify-center bg-[#FFC107] text-slate-900 border-2 border-white dark:border-slate-900"
          >
            5
          </Badge>
          <span className="sr-only">Notifikasi</span>
        </Button>

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
                <span className="text-xs text-slate-500 mt-1 uppercase">{user?.role || "PIMPINAN"}</span>
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
