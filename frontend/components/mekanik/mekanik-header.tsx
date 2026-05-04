"use client"

import { useTheme } from "next-themes"
import { Bell, Moon, Sun, ChevronDown, Loader2 } from "lucide-react"
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
import { useRef, useState } from "react"
import { useAuth } from "@/context/AuthContext"
import { api, fetcher } from "@/lib/api-client"
import useSWR from "swr"
import { toast } from "sonner"
import { resolvePhotoUrl } from "@/lib/resolve-photo"

interface MekanikHeaderProps {
  title?: string
  description?: string
}

export function MekanikHeader({ title, description }: MekanikHeaderProps) {
  const { theme, setTheme } = useTheme()
  const { user, logout, refreshUser } = useAuth()
  const fileInputRef = useRef<HTMLInputElement>(null)
  const [isUploading, setIsUploading] = useState(false)

  // Fetch fresh profile
  const { data: profileData, mutate: mutateProfile } = useSWR(user ? "/auth/me" : null, fetcher)
  const profile = profileData?.data || profileData || user

  const rawPhoto = profile?.photoUrl || user?.photoUrl
  const displayPhoto = resolvePhotoUrl(rawPhoto)
  const displayName = profile?.name || user?.name || "Mekanik"
  const initials = displayName.substring(0, 2).toUpperCase()

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setIsUploading(true)
    try {
      const formData = new FormData()
      formData.append("photo", file)
      await api.put("/auth/profile", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      })
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

  return (
    <header className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-4 border-b bg-white/80 backdrop-blur-md px-6 shadow-sm">
      <SidebarTrigger className="-ml-1" />
      <Separator orientation="vertical" className="h-6" />

      {title && (
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-slate-900 tracking-tight">{title}</h1>
          {description && (
            <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest leading-none mt-0.5">
              {description}
            </p>
          )}
        </div>
      )}

      <div className="ml-auto flex items-center gap-2 md:gap-4">
        {/* Status Indicator */}
        <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 border border-emerald-100 text-emerald-600 text-xs font-bold mr-2">
          <div className="size-2 rounded-full bg-emerald-500 animate-pulse" />
          System Online
        </div>

        {/* Theme Toggle */}
        <Button
          variant="ghost"
          size="icon"
          className="rounded-xl size-9 hover:bg-slate-50 transition-colors"
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
        >
          <Sun className="size-[18px] dark:hidden text-slate-600" />
          <Moon className="size-[18px] hidden dark:block text-slate-300" />
        </Button>

        {/* Notifications */}
        <Button
          variant="ghost"
          size="icon"
          className="relative rounded-xl size-9 hover:bg-slate-50 transition-colors"
        >
          <Bell className="size-[18px] text-slate-600" />
          <Badge className="absolute top-1.5 right-1.5 size-4 rounded-full p-0 flex items-center justify-center bg-amber-500 text-slate-900 border-2 border-white font-bold text-[9px]">
            2
          </Badge>
        </Button>

        <Separator orientation="vertical" className="h-6 hidden md:block" />

        {/* Profile Avatar */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <div className="flex items-center gap-3 cursor-pointer select-none hover:bg-slate-50 p-1.5 rounded-lg transition-colors">
              <Avatar className="size-9 border border-slate-200">
                {isUploading ? (
                  <div className="flex h-full w-full items-center justify-center bg-slate-100 rounded-full">
                    <Loader2 className="h-4 w-4 animate-spin text-orange-500" />
                  </div>
                ) : (
                  <>
                    {displayPhoto ? (
                      <AvatarImage
                        src={displayPhoto}
                        alt={displayName}
                        onError={(e) => {
                          ;(e.currentTarget as HTMLImageElement).style.display = "none"
                        }}
                      />
                    ) : null}
                    <AvatarFallback className="bg-slate-900 text-white font-bold text-xs">
                      {initials}
                    </AvatarFallback>
                  </>
                )}
              </Avatar>
              <div className="hidden md:flex flex-col">
                <span className="text-sm font-bold text-slate-900 leading-none">{displayName}</span>
                <span className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-widest font-bold">
                  {user?.role || "Mekanik"}
                </span>
              </div>
              <ChevronDown className="size-4 text-slate-400 hidden md:block" />
            </div>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuLabel>Akun Saya</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => fileInputRef.current?.click()}
              className="cursor-pointer"
            >
              Ubah Foto Profil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => logout()}
              className="cursor-pointer text-red-500"
            >
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
