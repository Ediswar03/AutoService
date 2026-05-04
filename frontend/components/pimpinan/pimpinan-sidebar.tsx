"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import {
  LayoutDashboard,
  BarChart3,
  CheckSquare,
  Settings,
  LogOut,
  TrendingUp,
  ChevronDown
} from "lucide-react"
import { cn } from "@/lib/utils"
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import { Logo } from "@/components/ui/logo"

const navItems = [
  { title: "Dashboard", href: "/pimpinan", icon: LayoutDashboard },
  { title: "Approval", href: "/pimpinan/approvals", icon: CheckSquare },
  { 
    title: "Laporan", 
    href: "/pimpinan/reports", 
    icon: BarChart3,
    items: [
      { title: "Laporan Inventory", href: "/pimpinan/reports/inventory" },
      { title: "Laporan Mekanik", href: "/pimpinan/reports/mekanik" },
      { title: "Laporan Pendapatan", href: "/pimpinan/reports/pendapatan" },
    ]
  },
  { title: "Pengaturan", href: "/pimpinan/settings", icon: Settings },
]

export function PimpinanSidebar() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/pimpinan") return pathname === "/pimpinan"
    return pathname.startsWith(href)
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border overflow-x-hidden">
      <SidebarHeader className="p-4">
        <Link href="/pimpinan">
          <Logo subtitle="Pimpinan" variant="white" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden pt-4">
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {navItems.map((item) => {
                if (!item.items) {
                  return (
                    <SidebarMenuItem key={item.href}>
                      <SidebarMenuButton
                        asChild
                        isActive={isActive(item.href)}
                        tooltip={item.title}
                        className={cn(
                          "relative transition-all duration-200 group/btn px-4 h-10 rounded-lg my-1",
                          isActive(item.href)
                            ? "bg-primary/10 text-primary font-bold" 
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Link href={item.href} className="flex items-center gap-3">
                          <item.icon className={cn(
                            "h-4.5 w-4.5 transition-all", 
                            isActive(item.href) ? "text-primary scale-110" : "group-hover/btn:text-white"
                          )} />
                          <span className="font-medium">{item.title}</span>
                          {isActive(item.href) && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-r-full shadow-[0_0_10px_rgba(var(--primary),0.6)]" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }

                const hasActiveChild = item.items.some(sub => pathname === sub.href)

                return (
                  <Collapsible
                    key={item.href}
                    asChild
                    defaultOpen={hasActiveChild}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton 
                          tooltip={item.title}
                          isActive={hasActiveChild}
                          className={cn(
                            "group/btn transition-all duration-200 px-4 h-10 rounded-lg my-1",
                            hasActiveChild
                              ? "bg-primary/10 text-primary font-bold" 
                              : "text-slate-400 hover:bg-white/5 hover:text-white"
                          )}
                        >
                          <item.icon className={cn(
                            "h-4.5 w-4.5 transition-all", 
                            hasActiveChild ? "text-primary" : "group-hover/btn:text-white"
                          )} />
                          <span className="font-medium">{item.title}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="border-l border-white/5 ml-6 pl-2 space-y-1 mt-1">
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.href}>
                              <SidebarMenuSubButton 
                                asChild 
                                isActive={pathname === subItem.href}
                                className={cn(
                                  "transition-all h-9 rounded-md px-3",
                                  pathname === subItem.href 
                                    ? "text-primary bg-primary/5 font-bold" 
                                    : "text-slate-500 hover:text-white hover:bg-white/5"
                                )}
                              >
                                <Link href={subItem.href}>
                                  <span className="text-sm">{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </SidebarMenuItem>
                  </Collapsible>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 pt-2 flex flex-col gap-2">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="hover:bg-white/5 transition-colors text-sidebar-foreground py-3.5 px-3 rounded-lg group/btn">
              <Link href="/login" className="flex items-center gap-3">
                <LogOut className="h-4.5 w-4.5 text-slate-400 group-hover/btn:text-white transition-colors" />
                <span className="font-semibold text-[14px] tracking-wide text-slate-400 group-hover/btn:text-white">Keluar</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
