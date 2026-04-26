"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  ClipboardList,
  Package,
  History,
  UserCircle,
  Wrench,
  Settings,
  LogOut
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar"

import { useAuth } from "@/context/AuthContext"

const navItems = [
  { title: "Dashboard", href: "/mekanik", icon: LayoutDashboard },
  { title: "Daftar SPK", href: "/mekanik/jobs", icon: ClipboardList },
  { title: "Permintaan Parts", href: "/mekanik/parts-request", icon: Package },
  { title: "Riwayat", href: "/mekanik/history", icon: History },
  { title: "Profil", href: "/mekanik/profile", icon: UserCircle },
]

export function MekanikSidebar() {
  const pathname = usePathname()
  const { logout } = useAuth()

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border overflow-x-hidden">
      <SidebarHeader className="p-4">
        <Link href="/mekanik" className="flex items-center justify-center py-2">
          <img src="/Logo1.png" alt="AutoService Logo" className="h-10 w-auto object-contain group-data-[collapsible=icon]:hidden" />
          <img src="/Logo1.png" alt="AutoService Logo" className="h-8 w-auto object-contain hidden group-data-[collapsible=icon]:block" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => (
                <SidebarMenuItem key={item.href}>
                  <SidebarMenuButton
                    asChild
                    isActive={pathname === item.href || (item.href !== "/mekanik" && pathname.startsWith(item.href))}
                    tooltip={item.title}
                    className="data-[active=true]:bg-[#FFC107] data-[active=true]:text-slate-900 data-[active=true]:font-bold transition-colors my-0.5 hover:bg-white/5 py-3.5 px-3 rounded-lg"
                  >
                    <Link href={item.href} className="flex items-center gap-3">
                      <item.icon className="size-[20px]" />
                      <span className="font-semibold text-[14px] tracking-wide">{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 pt-2 flex flex-col gap-2">


        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton 
              onClick={() => logout()}
              className="hover:bg-red-500/10 transition-colors text-sidebar-foreground py-3.5 px-3 rounded-lg group"
            >
              <div className="flex items-center gap-3 w-full">
                <LogOut className="size-[20px] group-hover:text-red-500 transition-colors" />
                <span className="font-semibold text-[14px] tracking-wide group-hover:text-red-500 transition-colors">Keluar</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
