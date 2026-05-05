"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { ChatBot } from "@/components/admin/chatbot"
import { useUI } from "@/context/UIContext"
import { usePathname } from "next/navigation"

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { isChatOpen, closeChat } = useUI()
  const pathname = usePathname()
  
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="flex flex-col relative w-full overflow-x-hidden">
        <main 
          key={pathname}
          className="flex-1 animate-page-entry"
        >
          {children}
        </main>
        <ChatBot isOpen={isChatOpen} onClose={closeChat} />
      </SidebarInset>
    </SidebarProvider>
  )
}
