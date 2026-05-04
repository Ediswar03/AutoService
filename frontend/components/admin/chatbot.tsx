"use client"

import { useState, useRef, useEffect } from "react"
import { X, Send, Bot, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { api } from "@/lib/api-client"

interface Message {
  id: string | number
  text: string
  isUser: boolean
}

interface ChatBotProps {
  isOpen: boolean
  onClose: () => void
}

export function ChatBot({ isOpen, onClose }: ChatBotProps) {
  const [messages, setMessages] = useState<Message[]>([
    { id: 1, text: "Halo! Saya AutoService AI. Ada yang bisa saya bantu terkait operasional bengkel hari ini?", isUser: false }
  ])
  const [inputVal, setInputVal] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [messages, isOpen])

  const handleSend = async () => {
    if (!inputVal.trim() || isLoading) return
    
    const userMsg: Message = { id: Date.now(), text: inputVal, isUser: true }
    setMessages(prev => [...prev, userMsg])
    const currentInput = inputVal
    setInputVal("")
    setIsLoading(true)

    try {
      const result = await api.post<{ data: { response: string } }>('/ai/chat', { message: currentInput })
      
      setMessages(prev => [
        ...prev, 
        { id: Date.now() + 1, text: result.data.response, isUser: false }
      ])
    } catch (error) {
      console.error("Chat error:", error)
      setMessages(prev => [
        ...prev, 
        { id: Date.now() + 1, text: "Maaf, saya sedang mengalami kendala teknis. Silakan coba lagi nanti.", isUser: false }
      ])
    } finally {
      setIsLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <Card className="fixed bottom-6 right-6 w-80 sm:w-96 shadow-2xl flex flex-col z-[100] overflow-hidden border-slate-200 dark:border-slate-800 animate-in slide-in-from-bottom-5 fade-in duration-300">
      <CardHeader className="bg-slate-900 text-white p-4 flex flex-row items-center justify-between shadow-sm">
        <div className="flex items-center gap-2">
          <Bot className="size-5 text-primary" />
          <CardTitle className="text-md font-semibold">AutoService AI</CardTitle>
        </div>
        <Button variant="ghost" size="icon" className="text-slate-300 hover:text-white hover:bg-slate-800 size-8 rounded-full" onClick={onClose}>
          <X className="size-4" />
        </Button>
      </CardHeader>
      <CardContent 
        ref={scrollRef}
        className="p-4 h-80 overflow-y-auto bg-slate-50 dark:bg-slate-950 flex flex-col gap-3"
      >
        {messages.map(msg => (
          <div key={msg.id} className={`flex ${msg.isUser ? "justify-end" : "justify-start"}`}>
            <div className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm shadow-sm ${msg.isUser ? "bg-primary text-white rounded-br-sm" : "bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 text-slate-700 dark:text-slate-200 rounded-bl-sm"}`}>
              {msg.text}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 rounded-2xl px-4 py-2.5 rounded-bl-sm shadow-sm">
              <Loader2 className="size-4 animate-spin text-primary" />
            </div>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-3 bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800">
        <form onSubmit={e => { e.preventDefault(); handleSend() }} className="flex w-full items-center space-x-2">
          <Input 
            value={inputVal}
            onChange={e => setInputVal(e.target.value)}
            placeholder="Tanya sesuatu mengenai servis..." 
            disabled={isLoading}
            className="flex-1 rounded-full border-slate-200 dark:border-slate-700 focus-visible:ring-primary h-10"
          />
          <Button 
            type="submit" 
            size="icon" 
            disabled={isLoading || !inputVal.trim()}
            className="rounded-full bg-slate-900 hover:bg-slate-800 dark:hover:bg-slate-700 text-primary shrink-0 size-10"
          >
            <Send className="size-4" />
          </Button>
        </form>
      </CardFooter>
    </Card>
  )
}
