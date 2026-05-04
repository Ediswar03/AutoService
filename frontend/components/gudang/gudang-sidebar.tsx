"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Package,
  ClipboardCheck,
  ArrowLeftRight,
  Truck,
  FileText,
  Settings,
  LogOut,
  User,
  ChevronUp,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarSeparator,
} from "@/components/ui/sidebar"
import { Logo } from "@/components/ui/logo"
import { useAuth } from "@/context/AuthContext"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { fetcher } from "@/lib/api-client"
import useSWR from "swr"
import { resolvePhotoUrl } from "@/lib/resolve-photo"
import { cn } from "@/lib/utils"

const navItems = [
  { title: "Dashboard", href: "/gudang", icon: LayoutDashboard },
  { title: "Inventori", href: "/gudang/inventory", icon: Package },
  { title: "Validasi Nota", href: "/gudang/approvals", icon: ClipboardCheck },
  { title: "Pergerakan Stok", href: "/gudang/stock-movements", icon: ArrowLeftRight },
  { title: "Supplier", href: "/gudang/suppliers", icon: Truck },
  { title: "Laporan", href: "/gudang/reports", icon: FileText },
]

export function GudangSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  // Fetch fresh profile from API to get the latest photoUrl
  const { data: profileData } = useSWR(user ? "/auth/me" : null, fetcher)
  const profile = profileData?.data || profileData || user

  const rawPhoto = profile?.photoUrl || user?.photoUrl
  const displayPhoto = resolvePhotoUrl(rawPhoto)
  const displayName = profile?.name || user?.name || "Gudang Staff"
  const initials = displayName.substring(0, 2).toUpperCase()

  const isActive = (href: string) => {
    return pathname === href || (href !== "/gudang" && pathname.startsWith(href))
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border overflow-x-hidden">
      <SidebarHeader className="p-4">
        <Link href="/gudang">
          <Logo subtitle="Gudang" variant="white" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden pt-4">
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2 group-data-[collapsible=icon]:hidden">
            Menu Utama
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive(item.href)}
                    tooltip={item.title}
                    className={cn(
                      "relative transition-all duration-200 group/btn px-4 h-10 rounded-lg my-0.5",
                      isActive(item.href) 
                        ? "bg-primary/10 text-primary font-bold" 
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className={cn(
                        "size-[18px] transition-all", 
                        isActive(item.href) ? "text-primary scale-110" : "group-hover/btn:text-white"
                      )} />
                      <span className="font-medium text-[14px]">{item.title}</span>
                      {isActive(item.href) && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.6)]" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarSeparator className="mx-4 bg-white/10 my-4" />

        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-white/40 text-[10px] uppercase tracking-widest font-bold mb-2 group-data-[collapsible=icon]:hidden">
            Pengaturan
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  asChild
                  className="hover:bg-white/5 transition-colors text-slate-400 py-3.5 px-3 rounded-lg"
                  tooltip="Pengaturan"
                >
                  <Link href="/gudang/settings" className="flex items-center gap-3">
                    <Settings className="size-[18px]" />
                    <span className="font-medium text-[14px]">Pengaturan</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/5 bg-black/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton className="h-14 w-full flex items-center gap-3 px-3 rounded-xl hover:bg-white/5 transition-colors group">
                  <Avatar className="size-9 shrink-0 border-2 border-white/10 group-hover:border-primary transition-colors">
                    {displayPhoto ? (
                      <AvatarImage
                        src={displayPhoto}
                        alt={displayName}
                        onError={(e) => {
                          ;(e.currentTarget as HTMLImageElement).style.display = "none"
                        }}
                      />
                    ) : null}
                    <AvatarFallback className="bg-slate-800 text-primary font-bold text-xs">
                      {initials}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col items-start group-data-[collapsible=icon]:hidden overflow-hidden ml-1">
                    <span className="text-sm font-bold text-white truncate w-32">{displayName}</span>
                    <span className="text-[10px] text-slate-500 font-black uppercase tracking-widest leading-none">
                      Petugas Gudang
                    </span>
                  </div>
                  <ChevronUp className="ml-auto size-4 text-slate-500 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                side="top"
                className="w-[--radix-popper-anchor-width] bg-slate-900 border-white/10 text-white p-2 rounded-xl mb-2 shadow-2xl"
              >
                <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white rounded-lg cursor-pointer py-3">
                  <Link href="/gudang/settings" className="flex items-center gap-2">
                    <User className="size-4" />
                    <span className="text-sm">Profil Saya</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => logout()}
                  className="focus:bg-red-500/10 focus:text-red-500 rounded-lg cursor-pointer py-3 text-red-400"
                >
                  <LogOut className="size-4 mr-2" />
                  <span className="text-sm">Keluar Sistem</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
