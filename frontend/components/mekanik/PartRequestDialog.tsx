'use client'

import { useState } from 'react'
import { Plus, Trash2, Loader2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
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
  const [items, setItems] = useState<{ sparepartId: string; name: string; quantity: number; notes: string }[]>([])
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
      setItems([...items, { sparepartId: part.id, name: part.name, quantity: 1, notes: '' }])
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
      <DialogContent className="sm:max-w-lg bg-zinc-950 border-white/10 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-black italic uppercase tracking-tight">Request Spareparts</DialogTitle>
          <DialogDescription className="text-zinc-500">
            Pilih suku cadang yang dibutuhkan untuk pengerjaan unit.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Pilih Sparepart</label>
            <Popover open={searchOpen} onOpenChange={setSearchOpen}>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-full justify-between bg-zinc-900 border-white/5 h-12 rounded-xl hover:bg-zinc-800 transition-all">
                  <span className="flex items-center gap-2">
                    <Search className="size-4 text-zinc-500" />
                    Cari part...
                  </span>
                  <Plus className="size-4 text-primary" />
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-[460px] p-0 bg-zinc-900 border-white/10" align="start">
                <Command className="bg-transparent text-white">
                  <CommandInput placeholder="Cari nama atau kode part..." className="border-none focus:ring-0" />
                  <CommandList>
                    <CommandEmpty className="py-6 text-center text-zinc-500 text-sm">Tidak ditemukan</CommandEmpty>
                    <CommandGroup className="p-2">
                      {spareparts.map((part: any) => (
                        <CommandItem
                          key={part.id}
                          onSelect={() => addItem(part)}
                          className="rounded-lg hover:bg-white/5 cursor-pointer p-3"
                        >
                          <div className="flex justify-between items-center w-full">
                            <div>
                              <p className="font-bold text-sm">{part.name}</p>
                              <p className="text-[10px] font-mono text-zinc-500">{part.code} • Stok: {part.stockQuantity}</p>
                            </div>
                            <Badge variant="outline" className="border-primary/20 text-primary bg-primary/5 text-[10px]">
                              Add
                            </Badge>
                          </div>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
            {items.length === 0 ? (
              <div className="py-12 text-center border-2 border-dashed border-white/5 rounded-2xl bg-white/[0.02]">
                <p className="text-xs font-bold text-zinc-600 uppercase tracking-widest">Belum ada item dipilih</p>
              </div>
            ) : (
              items.map((item) => (
                <div key={item.sparepartId} className="bg-white/[0.03] border border-white/5 rounded-2xl p-4 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="font-black text-sm uppercase italic">{item.name}</p>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="size-8 text-zinc-600 hover:text-red-500 hover:bg-red-500/10 transition-all"
                      onClick={() => removeItem(item.sparepartId)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-24">
                      <Input
                        type="number"
                        min={1}
                        value={item.quantity}
                        onChange={(e) => updateItem(item.sparepartId, 'quantity', parseInt(e.target.value) || 1)}
                        className="bg-black/40 border-white/5 h-10 rounded-xl font-mono text-center"
                      />
                    </div>
                    <Input
                      placeholder="Catatan (misal: Ori / KW)"
                      value={item.notes}
                      onChange={(e) => updateItem(item.sparepartId, 'notes', e.target.value)}
                      className="flex-1 bg-black/40 border-white/5 h-10 rounded-xl text-xs"
                    />
                  </div>
                </div>
              ))
            )}
          </div>

          <div className="space-y-2">
            <label className="text-xs font-black uppercase tracking-widest text-zinc-500">Catatan Tambahan</label>
            <Textarea
              placeholder="Catatan umum untuk permintaan ini..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-zinc-900 border-white/5 rounded-xl text-xs min-h-[80px]"
            />
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="ghost"
            onClick={() => onOpenChange(false)}
            className="text-zinc-500 font-bold hover:text-white"
          >
            BATAL
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || items.length === 0}
            className="bg-primary text-black font-black uppercase italic tracking-wider rounded-xl px-8 shadow-[0_4px_20px_rgba(var(--primary),0.3)]"
          >
            {isSubmitting ? <Loader2 className="size-4 animate-spin mr-2" /> : null}
            Kirim Request
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
