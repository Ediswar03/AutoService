'use client'

import { useState } from 'react'
import Link from 'next/link'
import { AlertTriangle, X, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import useSWR from 'swr'
import { fetcher } from '@/lib/api-client'
import { cn } from '@/lib/utils'

export function CriticalStockAlert() {
  const [isVisible, setIsVisible] = useState(true)
  const { data: sparepartsRaw } = useSWR('/inventory/spareparts?limit=500', fetcher)
  
  const allItems: any[] = Array.isArray(sparepartsRaw?.data) ? sparepartsRaw.data : []
  const criticalItems = allItems.filter((i: any) => i.stockQuantity !== undefined && i.stockQuantity <= 0)
  
  if (!isVisible || criticalItems.length === 0) {
    return null
  }

  return (
    <div className="sticky top-[73px] z-20 px-6 py-1 pointer-events-none">
      <div className="mx-auto max-w-7xl">
        <div className="bg-[#0A0A0B] border border-rose-500/30 rounded-2xl shadow-[0_10px_30px_rgba(244,63,94,0.2)] overflow-hidden pointer-events-auto">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center gap-4 min-w-0">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-rose-500/10 border border-rose-500/20">
                <AlertTriangle className="size-5 text-rose-500 animate-pulse" />
              </div>
              
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-rose-500">Urgent: Out of Stock</h3>
                  <span className="rounded-lg bg-rose-500 text-white px-2 py-0.5 text-[10px] font-black uppercase tracking-widest leading-none">
                    {criticalItems.length} ITEMS
                  </span>
                </div>
                
                <div className="flex flex-wrap gap-2 text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest truncate">
                  {criticalItems.slice(0, 3).map((item, index) => (
                    <span key={item.id} className="flex items-center gap-1">
                      <span className="text-white italic">{item.name}</span>
                      <span className="opacity-50">[{item.code}]</span>
                      {index < Math.min(criticalItems.length, 3) - 1 && <span className="opacity-30 mx-1">•</span>}
                    </span>
                  ))}
                  {criticalItems.length > 3 && (
                    <span className="opacity-50 ml-1">+{criticalItems.length - 3} OTHERS</span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0 ml-4">
              <Button
                variant="ghost"
                size="sm"
                className="h-10 rounded-xl px-5 text-[10px] font-black uppercase tracking-[0.2em] bg-rose-500 text-white hover:bg-rose-600 border-none shadow-[0_0_15px_rgba(244,63,94,0.3)] transition-all hover:scale-105"
                asChild
              >
                <Link href="/gudang/inventory?status=critical">
                  Restock Now
                  <ArrowRight className="size-4 ml-2" />
                </Link>
              </Button>
              
              <Button
                variant="ghost"
                size="icon"
                className="size-8 text-slate-500 hover:text-white transition-colors"
                onClick={() => setIsVisible(false)}
              >
                <X className="size-4" />
                <span className="sr-only">Dismiss</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
