"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  Users,
  Car,
  ClipboardList,
  Receipt,
  BarChart3,
  Settings,
  Wrench,
  LogOut,
  Calendar,
  Package,
  UserCircle
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

const navItems = [
  { title: "Dashboard", href: "/admin", icon: LayoutDashboard },
  { title: "Order Servis", href: "/admin/spk", icon: ClipboardList },
  { title: "Pelanggan", href: "/admin/customers", icon: Users },
  { title: "Kendaraan", href: "/admin/vehicles", icon: Car },
  { title: "Mekanik", href: "/admin/mechanics", icon: UserCircle },
  { title: "Jadwal", href: "/admin/schedule", icon: Calendar },
  { title: "Stok Barang", href: "/admin/inventory", icon: Package },
  { title: "Pembayaran", href: "/admin/invoices", icon: Receipt },
  { title: "Laporan", href: "/admin/reports", icon: BarChart3 },
  { title: "Pengaturan", href: "/admin/settings", icon: Settings },
]

export function AdminSidebar() {
  const pathname = usePathname()

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border overflow-x-hidden">
      <SidebarHeader className="p-4">
        <Link href="/admin" className="flex items-center justify-center py-2">
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
                    isActive={pathname === item.href || (item.href !== "/admin" && pathname.startsWith(item.href))}
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
