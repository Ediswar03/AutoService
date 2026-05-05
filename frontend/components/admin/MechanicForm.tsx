"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Loader2, Save, X } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { api } from "@/lib/api-client"

const mechanicSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  email: z.string().email("Email tidak valid"),
  phone: z.string().min(10, "Nomor telepon minimal 10 digit"),
  address: z.string().optional().or(z.literal("")),
  password: z.string().min(6, "Password minimal 6 karakter").optional().or(z.literal("")),
  role: z.literal("MEKANIK"),
  isActive: z.boolean().default(true),
})

type MechanicFormValues = z.infer<typeof mechanicSchema>

interface MechanicFormProps {
  initialData?: any
  isEditing?: boolean
  onClose?: () => void
}

export function MechanicForm({ initialData, isEditing = false, onClose }: MechanicFormProps) {
  const router = useRouter()

  const form = useForm<MechanicFormValues>({
    resolver: zodResolver(mechanicSchema),
    defaultValues: initialData || {
      name: "",
      email: "",
      phone: "",
      address: "",
      password: "",
      role: "MEKANIK",
      isActive: true,
    },
  })

  const isLoading = form.formState.isSubmitting

  async function onSubmit(values: MechanicFormValues) {
    try {
      if (isEditing) {
        const payload = { ...values }
        if (!payload.password) delete payload.password
        
        await api.put(`/users/${initialData.id}`, payload)
        toast.success("Mekanik berhasil diperbarui")
      } else {
        await api.post("/users", values)
        toast.success("Mekanik berhasil ditambahkan")
      }
      
      if (onClose) {
        onClose()
      } else {
        router.push("/admin/mechanics")
        router.refresh()
      }
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Terjadi kesalahan")
    }
  }

  const handleCancel = () => {
    if (onClose) {
      onClose()
    } else {
      router.back()
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">Nama Lengkap</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Contoh: Andi Susanto" 
                  className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 rounded-xl h-11"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">Email</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="andi@example.com" 
                    className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 rounded-xl h-11"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">Nomor Telepon</FormLabel>
                <FormControl>
                  <Input 
                    placeholder="081234567890" 
                    className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 rounded-xl h-11"
                    {...field} 
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="address"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">Alamat</FormLabel>
              <FormControl>
                <Input 
                  placeholder="Jl. Contoh No. 123, Kota" 
                  className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 rounded-xl h-11"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-xs font-black uppercase tracking-widest text-slate-500 dark:text-zinc-400">
                {isEditing ? "Password (Kosongkan jika tidak diubah)" : "Password"}
              </FormLabel>
              <FormControl>
                <Input 
                  type="password" 
                  placeholder="••••••" 
                  className="bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/10 rounded-xl h-11"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="isActive"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-2xl border border-slate-200 dark:border-white/10 p-4 bg-white dark:bg-zinc-900">
              <div className="space-y-0.5">
                <FormLabel className="text-sm font-bold text-slate-700 dark:text-zinc-200">Status Aktif</FormLabel>
                <FormDescription className="text-xs text-slate-500 dark:text-zinc-500">
                  Mekanik tidak aktif tidak dapat menerima tugas SPK baru.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
            className="rounded-xl border-slate-200 dark:border-white/10"
          >
            <X className="mr-2 h-4 w-4" /> Batal
          </Button>
          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white rounded-xl shadow-sm"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Save className="mr-2 h-4 w-4" />
            )}
            {isEditing ? "Simpan Perubahan" : "Tambah Mekanik"}
          </Button>
        </div>
      </form>
    </Form>
  )
}
