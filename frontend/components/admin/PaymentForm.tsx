'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { Loader2, CalendarIcon, CreditCard, Banknote, Smartphone, Building } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field'
import { Calendar } from '@/components/ui/calendar'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { cn } from '@/lib/utils'
import type { Invoice, PaymentFormData, PaymentMethod } from '@/types'

const paymentSchema = z.object({
  invoiceId: z.string(),
  paymentDate: z.string().min(1, 'Tanggal wajib diisi'),
  amount: z.number().min(1, 'Jumlah pembayaran wajib diisi'),
  paymentMethod: z.enum(['CASH', 'TRANSFER', 'DEBIT_CARD', 'CREDIT_CARD', 'QRIS', 'E_WALLET', 'CREDIT']),
  referenceNumber: z.string().optional(),
  notes: z.string().optional(),
})

interface PaymentFormProps {
  invoice: Invoice
  onSubmit: (data: any) => Promise<void>
  isSubmitting?: boolean
}

const paymentMethods: { value: string; label: string; icon: React.ElementType }[] = [
  { value: 'CASH', label: 'Tunai', icon: Banknote },
  { value: 'TRANSFER', label: 'Transfer Bank', icon: Building },
  { value: 'DEBIT_CARD', label: 'Kartu Debit', icon: CreditCard },
  { value: 'CREDIT_CARD', label: 'Kartu Kredit', icon: CreditCard },
  { value: 'QRIS', label: 'QRIS', icon: Smartphone },
]

export function PaymentForm({ invoice, onSubmit, isSubmitting }: PaymentFormProps) {
  const inv = invoice as any
  const invoiceId = inv.id
  const sisaBayar = Number(inv.sisa_bayar ?? inv.amountDue ?? 0)
  const nomorInvoice = inv.nomor_invoice ?? inv.invoiceNumber ?? '-'
  const grandTotal = Number(inv.grand_total ?? inv.grandTotal ?? 0)
  const jumlahDibayar = Number(inv.jumlah_dibayar ?? inv.amountPaid ?? 0)
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      invoiceId: invoiceId,
      paymentDate: format(new Date(), 'yyyy-MM-dd'),
      amount: sisaBayar,
      paymentMethod: 'CASH',
      referenceNumber: '',
      notes: '',
    },
  })

  const paymentDate = watch('paymentDate')
  const paymentMethod = watch('paymentMethod')
  const amount = watch('amount')

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Invoice Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Ringkasan Invoice</CardTitle>
            <CardDescription>Invoice #{nomorInvoice}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Total Invoice</span>
                <span className="font-medium">{formatCurrency(grandTotal)}</span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Sudah Dibayar</span>
                <span className="font-medium text-green-600">
                  {formatCurrency(jumlahDibayar)}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b">
                <span className="text-muted-foreground">Sisa Bayar</span>
                <span className="font-bold text-lg text-destructive">
                  {formatCurrency(sisaBayar)}
                </span>
              </div>
              {amount > 0 && (
                <div className="flex justify-between py-2 bg-muted rounded-md px-3">
                  <span className="text-muted-foreground">Setelah Pembayaran Ini</span>
                  <span className="font-bold text-green-600">
                    {formatCurrency(Math.max(0, sisaBayar - amount))}
                  </span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Payment Form */}
        <Card>
          <CardHeader>
            <CardTitle>Detail Pembayaran</CardTitle>
            <CardDescription>Masukkan informasi pembayaran</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel>Tanggal Pembayaran</FieldLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn("w-full justify-start text-left font-normal")}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {paymentDate ? format(new Date(paymentDate), 'dd MMMM yyyy') : 'Pilih tanggal'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={paymentDate ? new Date(paymentDate) : undefined}
                      onSelect={(date) => {
                        if (date) setValue('paymentDate', format(date, 'yyyy-MM-dd'))
                      }}
                    />
                  </PopoverContent>
                </Popover>
                {errors.paymentDate && <FieldError>{String(errors.paymentDate.message)}</FieldError>}
              </Field>

              <Field>
                <FieldLabel>Jumlah Pembayaran</FieldLabel>
                <Input
                  type="number"
                  min={1}
                  max={sisaBayar}
                  {...register('amount', { valueAsNumber: true })}
                />
                <p className="text-xs text-muted-foreground">
                  Maksimal: {formatCurrency(sisaBayar)}
                </p>
                {errors.amount && <FieldError>{String(errors.amount.message)}</FieldError>}
              </Field>

              <Field>
                <FieldLabel>Metode Pembayaran</FieldLabel>
                <Select
                  value={paymentMethod}
                  onValueChange={(value: string) => setValue('paymentMethod', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih metode pembayaran" />
                  </SelectTrigger>
                  <SelectContent>
                    {paymentMethods.map((method) => (
                      <SelectItem key={method.value} value={method.value}>
                        <div className="flex items-center gap-2">
                          <method.icon className="h-4 w-4" />
                          {method.label}
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.paymentMethod && <FieldError>{String(errors.paymentMethod.message)}</FieldError>}
              </Field>

              {paymentMethod !== 'CASH' && (
                <Field>
                  <FieldLabel>Nomor Referensi</FieldLabel>
                  <Input
                    placeholder="No. transaksi/approval code"
                    {...register('referenceNumber')}
                  />
                  {errors.referenceNumber && <FieldError>{String(errors.referenceNumber.message)}</FieldError>}
                </Field>
              )}

              <Field>
                <FieldLabel>Catatan (opsional)</FieldLabel>
                <Textarea
                  placeholder="Catatan tambahan..."
                  rows={2}
                  {...register('notes')}
                />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Memproses...
            </>
          ) : (
            'Terima Pembayaran'
          )}
        </Button>
      </div>
    </form>
  )
}
