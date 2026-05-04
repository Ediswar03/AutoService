"use client"

import { SidebarProvider, SidebarInset } from "@/components/ui/sidebar"
import { PimpinanSidebar } from "@/components/pimpinan/pimpinan-sidebar"
import { ChatBot } from "@/components/admin/chatbot"
import { useUI } from "@/context/UIContext"

export function PimpinanLayoutClient({ children }: { children: React.ReactNode }) {
  const { isChatOpen, closeChat } = useUI()

  return (
    <SidebarProvider>
      <PimpinanSidebar />
      <SidebarInset className="flex flex-col relative w-full">
        {children}
        <ChatBot isOpen={isChatOpen} onClose={closeChat} />
      </SidebarInset>
    </SidebarProvider>
  )
}
