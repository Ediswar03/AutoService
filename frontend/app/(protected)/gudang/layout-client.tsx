"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { GudangSidebar } from "@/components/gudang/gudang-sidebar"
import { ChatBot } from "@/components/admin/chatbot"
import { useUI } from "@/context/UIContext"

export function GudangLayoutClient({ children }: { children: React.ReactNode }) {
  const { isChatOpen, closeChat } = useUI()
  
  return (
    <SidebarProvider>
      <GudangSidebar />
      <SidebarInset className="flex flex-col relative w-full">
        {children}
        <ChatBot isOpen={isChatOpen} onClose={closeChat} />
      </SidebarInset>
    </SidebarProvider>
  )
}
