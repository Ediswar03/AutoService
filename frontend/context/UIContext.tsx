"use client"

import React, { createContext, useContext, useState, ReactNode } from "react"

interface UIContextType {
  isChatOpen: boolean
  openChat: () => void
  closeChat: () => void
  toggleChat: () => void
  selectedDate: Date
  setSelectedDate: (date: Date) => void
}

const UIContext = createContext<UIContextType | undefined>(undefined)

export function UIProvider({ children }: { children: ReactNode }) {
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [selectedDate, setSelectedDate] = useState(new Date())

  const openChat = () => setIsChatOpen(true)
  const closeChat = () => setIsChatOpen(false)
  const toggleChat = () => setIsChatOpen((prev) => !prev)

  return (
    <UIContext.Provider value={{ 
      isChatOpen, 
      openChat, 
      closeChat, 
      toggleChat, 
      selectedDate, 
      setSelectedDate 
    }}>
      {children}
    </UIContext.Provider>
  )
}

export function useUI() {
  const context = useContext(UIContext)
  if (context === undefined) {
    throw new Error("useUI must be used within a UIProvider")
  }
  return context
}
