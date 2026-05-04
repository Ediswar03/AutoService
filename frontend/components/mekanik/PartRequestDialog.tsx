'use client'

import { useState } from 'react'
import { Plus, Trash2, Loader2, Search, Package, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { cn } from "@/lib/utils"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'
import { apiClient } from '@/lib/api-client'
import { toast } from 'sonner'
import useSWR from 'swr'
import { fetcher } from '@/lib/api-client'

interface PartRequestDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  workOrderId?: string
  onSuccess?: () => void
}

export function PartRequestDialog({ open, onOpenChange, workOrderId, onSuccess }: PartRequestDialogProps) {
  const [items, setItems] = useState<{ sparepartId: string; name: string; quantity: number; notes: string; code: string }[]>([])
  const [notes, setNotes] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)

  const { data: sparepartsData } = useSWR('/inventory/spareparts?limit=100', fetcher)
  const spareparts = (sparepartsData as any)?.data || []

  const addItem = (part: any) => {
    const existing = items.find(i => i.sparepartId === part.id)
    if (existing) {
      setItems(items.map(i => i.sparepartId === part.id ? { ...i, quantity: i.quantity + 1 } : i))
    } else {
      setItems([...items, { sparepartId: part.id, name: part.name, code: part.code, quantity: 1, notes: '' }])
    }
    setSearchOpen(false)
  }

  const removeItem = (id: string) => {
    setItems(items.filter(i => i.sparepartId !== id))
  }

  const updateItem = (id: string, field: string, value: any) => {
    setItems(items.map(i => i.sparepartId === id ? { ...i, [field]: value } : i))
  }

  const handleSubmit = async () => {
    if (items.length === 0) {
      toast.error('Pilih minimal satu sparepart')
      return
    }

    setIsSubmitting(true)
    try {
      await apiClient.post('/gudang/part-requests', {
        workOrderId,
        items: items.map(i => ({
          sparepartId: i.sparepartId,
          quantity: i.quantity,
          notes: i.notes,
        })),
        notes,
      })
      toast.success('Permintaan part berhasil dikirim')
      onOpenChange(false)
      setItems([])
      setNotes('')
      if (onSuccess) onSuccess()
    } catch (error) {
      toast.error('Gagal mengirim permintaan')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white dark:bg-zinc-950 border-slate-200 dark:border-white/10 text-slate-900 dark:text-white rounded-3xl p-6 shadow-2xl">
        <DialogHeader className="mb-2">
          <DialogTitle className="text-xl font-black italic uppercase tracking-tight flex items-center gap-2">
             <Package className="h-5 w-5 text-primary" /> Request Spareparts
          </DialogTitle>
          <DialogDescription className="text-slate-500 dark:text-zinc-500 text-xs font-medium">
            Cari dan pilih suku cadang yang dibutuhkan untuk pengerjaan unit ini.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 ml-1">Pilih Sparepart</label>
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-white/5 h-12 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all shadow-inner dark:shadow-none text-slate-600 dark:text-zinc-400 font-medium">
                  <span className="flex items-center gap-2">
                    <Search className="size-4 text-primary" />
                    Ketik untuk mencari parts...
                  </span>
                  <Plus className="size-4 text-slate-400" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0 bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 rounded-xl shadow-xl" align="start">
                <Command className="bg-transparent text-slate-900 dark:text-white">
                  <CommandInput placeholder="Cari nama atau kode part..." className="border-none focus:ring-0 text-sm h-12" />
                  <CommandList className="max-h-[250px] overflow-y-auto custom-scrollbar">
                    <CommandEmpty className="py-6 text-center text-slate-500 dark:text-zinc-500 text-xs font-medium">Tidak ada sparepart yang cocok</CommandEmpty>
                    <CommandGroup className="p-2">
                      {spareparts.map((part: any) => {
                         const isSelected = items.some(i => i.sparepartId === part.id)
                         return (
                           <CommandItem
                             key={part.id}
                             onSelect={() => !isSelected && addItem(part)}
                             className={cn(
                               "rounded-lg cursor-pointer p-3 mb-1 transition-all",
                               isSelected ? "opacity-50 pointer-events-none bg-slate-50 dark:bg-zinc-900" : "hover:bg-slate-100 dark:hover:bg-white/5"
                             )}
                           >
                             <div className="flex justify-between items-center w-full">
                               <div>
                                 <p className="font-bold text-sm text-slate-800 dark:text-zinc-200">{part.name}</p>
                                 <p className="text-[10px] font-mono text-slate-500 dark:text-zinc-500 mt-0.5">{part.code} • Stok: {part.stockQuantity}</p>
                               </div>
                               {isSelected ? (
                                 <Check className="h-4 w-4 text-emerald-500" />
                               ) : (
                                 <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 text-[9px] uppercase font-black px-2 py-0.5">
                                   PILIH
                                 </Badge>
                               )}
                             </div>
                           </CommandItem>
                         )
                      })}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-3 max-h-[280px] overflow-y-auto pr-2 custom-scrollbar">
            {items.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-slate-200 dark:border-white/5 rounded-2xl bg-slate-50 dark:bg-white/[0.02]">
                <Package className="h-8 w-8 text-slate-300 dark:text-zinc-700 mx-auto mb-2" />
                <p className="text-[10px] font-black text-slate-400 dark:text-zinc-600 uppercase tracking-widest">Belum ada item dipilih</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.sparepartId} className="bg-slate-50 dark:bg-zinc-900/50 border border-slate-200 dark:border-white/5 rounded-2xl p-4 space-y-3 shadow-sm dark:shadow-none group">
                  <div className="flex justify-between items-start">
                    <div className="space-y-0.5">
                      <p className="font-black text-sm uppercase text-slate-800 dark:text-zinc-200">{item.name}</p>
                      <p className="font-mono text-[10px] text-slate-500 dark:text-zinc-500">{item.code}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-slate-400 dark:text-zinc-600 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all rounded-lg"
                      onClick={() => removeItem(item.sparepartId)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <div className="flex gap-2">
                    <div className="w-24">
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateItem(item.sparepartId, 'quantity', parseInt(e.target.value) || 1)}
                        className="bg-white dark:bg-black/40 border-slate-200 dark:border-white/5 h-10 rounded-xl font-mono text-center shadow-inner dark:shadow-none font-bold"
                      />
                    </div>
                    <Input
                      placeholder="Catatan (misal: Ori / KW)"
                      value={item.notes}
                      onChange={(e) => updateItem(item.sparepartId, 'notes', e.target.value)}
                      className="flex-1 bg-white dark:bg-black/40 border-slate-200 dark:border-white/5 h-10 rounded-xl text-xs shadow-inner dark:shadow-none"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-1.5 pt-2">
            <label className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 ml-1">Catatan Tambahan (Opsional)</label>
            <Textarea
              placeholder="Catatan umum untuk orang gudang..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-slate-50 dark:bg-zinc-900 border-slate-200 dark:border-white/5 rounded-xl text-xs min-h-[80px] shadow-inner dark:shadow-none resize-none"
            />
          </div>
        </div>

        <DialogFooter className="gap-2 sm:gap-0 mt-4">
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-slate-500 dark:text-zinc-500 font-bold hover:text-slate-900 dark:hover:text-white rounded-xl"
          >
            BATAL
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || items.length === 0}
            className="bg-primary text-white dark:text-black font-black uppercase tracking-wider rounded-xl px-8 shadow-[0_4px_20px_rgba(var(--primary),0.3)] border-b-4 border-black/10 dark:border-black/20 active:border-b-0 active:translate-y-1 transition-all h-11"
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            Kirim Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
