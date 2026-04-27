"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BarChart3,
  CheckSquare,
  Settings,
  LogOut,
  TrendingUp
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
import { Logo } from "@/components/ui/logo"

const navItems = [
  { title: "Dashboard", href: "/pimpinan", icon: LayoutDashboard },
  { title: "Dashboard Analytics", href: "/pimpinan/dashboard", icon: TrendingUp },
  { title: "Approval", href: "/pimpinan/approvals", icon: CheckSquare },
  { title: "Laporan", href: "/pimpinan/reports", icon: BarChart3 },
  { title: "Pengaturan", href: "/pimpinan/settings", icon: Settings },
]

export function PimpinanSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border overflow-x-hidden">
      <SidebarHeader className="p-4">
        <Link href="/pimpinan">
          <Logo subtitle="Pimpinan" />
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
                    isActive={pathname === item.href || (item.href !== "/pimpinan" && pathname.startsWith(item.href))}
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
            <SidebarMenuButton asChild className="hover:bg-white/5 transition-colors text-sidebar-foreground py-3.5 px-3 rounded-lg">
              <Link href="/login" className="flex items-center gap-3">
                <LogOut className="size-[20px]" />
                <span className="font-semibold text-[14px] tracking-wide">Keluar</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
