'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  Users,
  Car,
  FileText,
  Receipt,
  Package,
  Settings,
  LogOut,
  Wrench,
  ChevronDown,
  Gift,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
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
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from '@/components/ui/sidebar'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Logo } from '@/components/ui/logo'

const mainMenuItems = [
  {
    title: 'Dashboard',
    url: '/admin',
    icon: LayoutDashboard,
  },
  {
    title: 'Pelanggan',
    url: '/admin/customers',
    icon: Users,
  },
  {
    title: 'Kendaraan',
    url: '/admin/vehicles',
    icon: Car,
  },
  {
    title: 'Promo',
    url: '/admin/promo',
    icon: Gift,
  },
]

const transactionMenuItems = [
  {
    title: 'SPK',
    url: '/admin/spk',
    icon: FileText,
  },
  {
    title: 'Invoice & Pembayaran',
    icon: Receipt,
    items: [
      { title: 'Daftar Invoice', url: '/admin/invoices' },
      { title: 'Riwayat Pembayaran', url: '/admin/payments' },
    ],
  },
]

const inventoryMenuItems = [
  {
    title: 'Sparepart',
    url: '/admin/spareparts',
    icon: Package,
  },
  {
    title: 'Jasa Servis',
    url: '/admin/services',
    icon: Wrench,
  },
]

export function AdminSidebar() {
  const pathname = usePathname()
  const { user, logout } = useAuth()

  const isActive = (url: string) => {
    if (url === '/admin') {
      return pathname === '/admin'
    }
    return pathname.startsWith(url)
  }

  const getInitials = (name?: string) => {
    if (!name) return 'U'
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <Sidebar collapsible="icon" className="border-r border-sidebar-border overflow-x-hidden">
      <SidebarHeader className="p-4">
        <Link href="/admin">
          <Logo subtitle="System" variant="white" />
        </Link>
      </SidebarHeader>

      <SidebarContent className="overflow-x-hidden pt-2">
        {/* Main Menu */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Menu Utama</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {mainMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className={cn(
                      "relative transition-all duration-200 group/btn px-4 h-10 rounded-lg",
                      isActive(item.url) 
                        ? "bg-primary/10 text-primary font-bold" 
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className={cn(
                        "h-4.5 w-4.5 transition-all", 
                        isActive(item.url) ? "text-primary scale-110" : "group-hover/btn:text-white"
                      )} />
                      <span className="font-medium">{item.title}</span>
                      {isActive(item.url) && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.6)]" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Transactions */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Transaksi</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {transactionMenuItems.map((item) => {
                if (!item.items) {
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive(item.url!)}
                        tooltip={item.title}
                        className={cn(
                          "relative transition-all duration-200 group/btn px-4 h-10 rounded-lg",
                          isActive(item.url!) 
                            ? "bg-primary/10 text-primary font-bold" 
                            : "text-slate-400 hover:bg-white/5 hover:text-white"
                        )}
                      >
                        <Link href={item.url!} className="flex items-center gap-3">
                          <item.icon className={cn(
                            "h-4.5 w-4.5 transition-all", 
                            isActive(item.url!) ? "text-primary scale-110" : "group-hover/btn:text-white"
                          )} />
                          <span className="font-medium">{item.title}</span>
                          {isActive(item.url!) && (
                            <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.6)]" />
                          )}
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                }

                const hasActiveChild = item.items.some(sub => isActive(sub.url))

                return (
                  <Collapsible
                    key={item.title}
                    asChild
                    defaultOpen={hasActiveChild}
                    className="group/collapsible"
                  >
                    <SidebarMenuItem>
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton tooltip={item.title} className="group/btn text-slate-400 hover:bg-white/5 hover:text-white transition-all duration-200 px-4 h-10 rounded-lg">
                          <item.icon className="h-4.5 w-4.5 transition-colors group-hover/btn:text-white" />
                          <span className="font-medium">{item.title}</span>
                          <ChevronDown className="ml-auto h-4 w-4 transition-transform duration-200 group-data-[state=open]/collapsible:rotate-180" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub className="border-l border-white/5 ml-6 pl-2 space-y-1 mt-1">
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton 
                                asChild 
                                isActive={isActive(subItem.url)}
                                className={cn(
                                  "transition-all h-9 rounded-md px-3",
                                  isActive(subItem.url) 
                                    ? "text-primary bg-primary/5 font-bold" 
                                    : "text-slate-500 hover:text-white hover:bg-white/5"
                                )}
                              >
                                <Link href={subItem.url}>
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

        {/* Inventory */}
        <SidebarGroup>
          <SidebarGroupLabel className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">Inventori & Jasa</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {inventoryMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild 
                    isActive={isActive(item.url)}
                    tooltip={item.title}
                    className={cn(
                      "relative transition-all duration-200 group/btn px-4 h-10 rounded-lg",
                      isActive(item.url) 
                        ? "bg-primary/10 text-primary font-bold" 
                        : "text-slate-400 hover:bg-white/5 hover:text-white"
                    )}
                  >
                    <Link href={item.url} className="flex items-center gap-3">
                      <item.icon className={cn(
                        "h-4.5 w-4.5 transition-all", 
                        isActive(item.url) ? "text-primary scale-110" : "group-hover/btn:text-white"
                      )} />
                      <span className="font-medium">{item.title}</span>
                      {isActive(item.url) && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 h-5 w-1 bg-primary rounded-r-full shadow-[0_0_10px_rgba(249,115,22,0.6)]" />
                      )}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-white/5 bg-black/20">
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-white/5 data-[state=open]:text-white rounded-xl transition-all"
                >
                  <Avatar className="h-9 w-9 rounded-lg border border-white/10">
                    <AvatarFallback className="rounded-lg bg-slate-800 text-primary font-bold">
                      {getInitials(user?.name)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="grid flex-1 text-left text-sm leading-tight group-data-[collapsible=icon]:hidden ml-2">
                    <span className="truncate font-bold text-white">{user?.name || 'User'}</span>
                    <span className="truncate text-[10px] text-slate-500 uppercase tracking-widest font-black">{user?.role || 'Admin'}</span>
                  </div>
                  <ChevronDown className="ml-auto size-4 text-slate-500 group-data-[collapsible=icon]:hidden" />
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-xl bg-slate-900 border-white/10 text-white"
                side="top"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem asChild className="focus:bg-white/10 focus:text-white rounded-lg py-2.5">
                  <Link href="/admin/settings" className="flex items-center gap-2">
                    <Settings className="size-4" />
                    Pengaturan
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-white/5" />
                <DropdownMenuItem
                  className="text-red-400 focus:bg-red-500/10 focus:text-red-500 rounded-lg py-2.5"
                  onClick={() => logout()}
                >
                  <LogOut className="mr-2 size-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
