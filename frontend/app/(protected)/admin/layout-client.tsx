"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { AdminSidebar } from "@/components/admin/AdminSidebar"
import { ChatBot } from "@/components/admin/chatbot"
import { useUI } from "@/context/UIContext"

export function AdminLayoutClient({ children }: { children: React.ReactNode }) {
  const { isChatOpen, closeChat } = useUI()
  
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset className="flex flex-col relative w-full">
        {children}
        <ChatBot isOpen={isChatOpen} onClose={closeChat} />
      </SidebarInset>
    </SidebarProvider>
  )
}
