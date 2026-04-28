'use client'

import { useState } from 'react'
import { useForm, useFieldArray } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { Loader2, Plus, Trash2, Search, CalendarIcon } from 'lucide-react'
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
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import { Separator } from '@/components/ui/separator'
import { useApiPaginated } from '@/hooks/useApi'
import { cn } from '@/lib/utils'
import type { SPK, SPKFormData, Customer, Vehicle, Service, Sparepart, User } from '@/types'

const spkItemSchema = z.object({
  tipe: z.enum(['jasa', 'sparepart']),
  item_id: z.string().min(1, 'Item wajib dipilih'),
  quantity: z.number().min(1, 'Quantity minimal 1'),
  harga_satuan: z.number().min(0, 'Harga tidak valid'),
  diskon: z.number().min(0).max(100, 'Diskon maksimal 100%'),
  catatan: z.string().optional(),
})

const spkSchema = z.object({
  customerId: z.string().uuid('Pelanggan wajib dipilih'),
  vehicleId: z.string().uuid('Kendaraan wajib dipilih'),
  assignedMechanicId: z.string().uuid().optional().nullable(),
  customerComplaints: z.string().min(1, 'Keluhan wajib diisi'),
  internalNotes: z.string().optional().nullable(),
  priority: z.enum(['LOW', 'NORMAL', 'HIGH', 'URGENT']).default('NORMAL'),
  odometerIn: z.number().int().min(0).optional().nullable(),
  fuelLevel: z.string().optional().nullable(),
  estimatedCompletion: z.string().optional().nullable(),
  items: z.array(spkItemSchema).min(1, 'Minimal 1 item harus ditambahkan'),
})

interface SPKFormProps {
  initialData?: SPK
  onSubmit: (data: SPKFormData) => Promise<void>
  isSubmitting?: boolean
}

export function SPKForm({ initialData, onSubmit, isSubmitting }: SPKFormProps) {
  const [customerOpen, setCustomerOpen] = useState(false)
  const [vehicleOpen, setVehicleOpen] = useState(false)
  const [serviceOpen, setServiceOpen] = useState(false)
  const [sparepartOpen, setSparepartOpen] = useState(false)
  const [dateOpen, setDateOpen] = useState(false)

  const { data: customers } = useApiPaginated<Customer>('/customers', 1, 100)
  const { data: services } = useApiPaginated<Service>('/services', 1, 100)
  const { data: spareparts } = useApiPaginated<Sparepart>('/inventory/spareparts', 1, 100)
  const { data: mekaniks } = useApiPaginated<User>('/users', 1, 100, { role: 'MEKANIK' })

  const {
    register,
    control,
    handleSubmit: hookFormSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<any>({
    resolver: zodResolver(spkSchema),
    defaultValues: {
      customerId: initialData?.customerId || '',
      vehicleId: initialData?.vehicleId || '',
      assignedMechanicId: initialData?.assignedMechanicId || undefined,
      customerComplaints: initialData?.customerComplaints || '',
      internalNotes: initialData?.internalNotes || '',
      priority: initialData?.priority || 'NORMAL',
      odometerIn: initialData?.odometerIn || undefined,
      fuelLevel: initialData?.fuelLevel || '',
      estimatedCompletion: initialData?.estimatedCompletion || '',
      items: initialData?.items?.map(item => ({
        tipe: item.tipe,
        item_id: item.serviceId || item.sparepartId,
        quantity: item.quantity,
        harga_satuan: item.unitPrice,
        diskon: item.discountPercent,
        catatan: item.notes,
      })) || [],
    },
  })

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'items',
  })

  const selectedCustomerId = watch('customerId')
  const selectedVehicleId = watch('vehicleId')
  const items = watch('items')
  const estimatedCompletion = watch('estimatedCompletion')

  const selectedCustomer = (customers as any)?.data?.find((c: any) => c.id === selectedCustomerId)
  const customerVehicles = selectedCustomer?.vehicles || []

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const calculateSubtotal = (item: any) => {
    const subtotal = item.quantity * item.harga_satuan
    const discount = (subtotal * item.diskon) / 100
    return subtotal - discount
  }

  const totalJasa = items
    .filter((item: any) => item.tipe === 'jasa')
    .reduce((sum: number, item: any) => sum + calculateSubtotal(item), 0)

  const totalSparepart = items
    .filter((item: any) => item.tipe === 'sparepart')
    .reduce((sum: number, item: any) => sum + calculateSubtotal(item), 0)

  const grandTotal = totalJasa + totalSparepart

  const addService = (service: any) => {
    append({
      tipe: 'jasa',
      item_id: service.id,
      quantity: 1,
      harga_satuan: Number(service.basePrice ?? 0),
      diskon: 0,
      catatan: '',
    })
    setServiceOpen(false)
  }

  const addSparepart = (part: any) => {
    append({
      tipe: 'sparepart',
      item_id: part.id,
      quantity: 1,
      harga_satuan: Number(part.sellPrice ?? 0),
      diskon: 0,
      catatan: '',
    })
    setSparepartOpen(false)
  }

  const getItemName = (item: any) => {
    if (item.tipe === 'jasa') {
      const svc = (services as any)?.data?.find((s: any) => s.id === item.item_id)
      return svc?.name ?? '-'
    }
    const part = (spareparts as any)?.data?.find((s: any) => s.id === item.item_id)
    return part?.name ?? '-'
  }

  const handleFormSubmit = (data: any) => {
    // Map items to backend format
    const payload: SPKFormData = {
      customerId: data.customerId,
      vehicleId: data.vehicleId,
      assignedMechanicId: data.assignedMechanicId || undefined,
      customerComplaints: data.customerComplaints,
      internalNotes: data.internalNotes,
      priority: data.priority,
      odometerIn: data.odometerIn,
      fuelLevel: data.fuelLevel,
      estimatedCompletion: data.estimatedCompletion ? new Date(data.estimatedCompletion).toISOString() : undefined,
      services: data.items
        .filter((item: any) => item.tipe === 'jasa')
        .map((item: any) => ({
          serviceId: item.item_id,
          quantity: item.quantity,
          discountPercent: item.diskon,
        })),
      spareparts: data.items
        .filter((item: any) => item.tipe === 'sparepart')
        .map((item: any) => ({
          sparepartId: item.item_id,
          quantity: item.quantity,
          discountPercent: item.diskon,
        })),
    }
    onSubmit(payload)
  }

  return (
    <form onSubmit={hookFormSubmit(handleFormSubmit)}>
      <div className="space-y-6">
        {/* Customer & Vehicle Selection */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Pelanggan & Kendaraan</CardTitle>
            <CardDescription>Pilih pelanggan dan kendaraan yang akan diservis</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Pelanggan</FieldLabel>
                <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="w-full justify-between">
                      {selectedCustomer?.name ?? 'Pilih pelanggan...'}
                      <Search className="ml-2 h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-full p-0" align="start">
                    <Command>
                      <CommandInput placeholder="Cari pelanggan..." />
                      <CommandList>
                        <CommandEmpty>Tidak ditemukan</CommandEmpty>
                        <CommandGroup>
                          {(customers as any)?.data?.map((customer: any) => (
                            <CommandItem
                              key={customer.id}
                              onSelect={() => {
                                setValue('customerId', customer.id)
                                setValue('vehicleId', '')
                                setCustomerOpen(false)
                              }}
                            >
                              <div>
                                <div className="font-medium">{customer.name}</div>
                                <div className="text-xs text-muted-foreground">{customer.phone}</div>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </PopoverContent>
                </Popover>
                {errors.customerId && <FieldError>{errors.customerId.message as string}</FieldError>}
              </Field>

              <Field>
                <FieldLabel>Kendaraan</FieldLabel>
                <Select
                  value={selectedVehicleId || ''}
                  onValueChange={(value) => setValue('vehicleId', value)}
                  disabled={!selectedCustomerId}
                >
                  <SelectTrigger>
                    <SelectValue placeholder={selectedCustomerId ? 'Pilih kendaraan' : 'Pilih pelanggan dulu'} />
                  </SelectTrigger>
                  <SelectContent>
                    {customerVehicles.map((vehicle: any) => (
                      <SelectItem key={vehicle.id} value={vehicle.id}>
                        {vehicle.licensePlate} - {vehicle.brand} {vehicle.model}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.vehicleId && <FieldError>{errors.vehicleId.message as string}</FieldError>}
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* SPK Details */}
        <Card>
          <CardHeader>
            <CardTitle>Detail SPK</CardTitle>
            <CardDescription>Informasi keluhan dan estimasi pengerjaan</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-2">
              <Field>
                <FieldLabel>Estimasi Selesai</FieldLabel>
                <Popover open={dateOpen} onOpenChange={setDateOpen}>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className={cn("w-full justify-start text-left font-normal")}>
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {estimatedCompletion ? format(new Date(estimatedCompletion), 'dd MMMM yyyy') : 'Pilih tanggal'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={estimatedCompletion ? new Date(estimatedCompletion) : undefined}
                      onSelect={(date) => {
                        if (date) {
                          setValue('estimatedCompletion', date.toISOString())
                          setDateOpen(false)
                        }
                      }}
                    />
                  </PopoverContent>
                </Popover>
              </Field>

              <Field>
                <FieldLabel>Mekanik</FieldLabel>
                <Select
                  value={watch('assignedMechanicId') || ''}
                  onValueChange={(value) => setValue('assignedMechanicId', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Pilih mekanik (opsional)" />
                  </SelectTrigger>
                  <SelectContent>
                    {(mekaniks as any)?.data?.map((mekanik: any) => (
                      <SelectItem key={mekanik.id} value={mekanik.id}>
                        {mekanik.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Odometer Masuk</FieldLabel>
                <Input type="number" {...register('odometerIn', { valueAsNumber: true })} placeholder="KM" />
              </Field>

              <Field>
                <FieldLabel>Level Bahan Bakar</FieldLabel>
                <Select onValueChange={(v) => setValue('fuelLevel', v)} defaultValue={watch('fuelLevel')}>
                  <SelectTrigger><SelectValue placeholder="Pilih level..." /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="E">Empty</SelectItem>
                    <SelectItem value="1/4">1/4</SelectItem>
                    <SelectItem value="1/2">1/2</SelectItem>
                    <SelectItem value="3/4">3/4</SelectItem>
                    <SelectItem value="F">Full</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel>Keluhan Pelanggan</FieldLabel>
                <Textarea
                  placeholder="Deskripsikan keluhan pelanggan..."
                  rows={3}
                  {...register('customerComplaints')}
                />
                {errors.customerComplaints && <FieldError>{errors.customerComplaints.message as string}</FieldError>}
              </Field>

              <Field className="md:col-span-2">
                <FieldLabel>Catatan Internal (opsional)</FieldLabel>
                <Textarea
                  placeholder="Instruksi tambahan untuk mekanik..."
                  rows={2}
                  {...register('internalNotes')}
                />
              </Field>
            </div>
          </CardContent>
        </Card>

        {/* Items */}
        <Card>
          <CardHeader>
            <CardTitle>Item Pekerjaan</CardTitle>
            <CardDescription>Tambahkan jasa servis dan sparepart</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="mb-4 flex gap-2">
              <Popover open={serviceOpen} onOpenChange={setServiceOpen}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Jasa
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput placeholder="Cari jasa..." />
                    <CommandList>
                      <CommandEmpty>Tidak ditemukan</CommandEmpty>
                      <CommandGroup>
                        {(services as any)?.data?.map((service: any) => (
                          <CommandItem key={service.id} onSelect={() => addService(service)}>
                            <div className="flex-1">
                              <div>{service.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatCurrency(Number(service.basePrice ?? 0))}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>

              <Popover open={sparepartOpen} onOpenChange={setSparepartOpen}>
                <PopoverTrigger asChild>
                  <Button type="button" variant="outline">
                    <Plus className="mr-2 h-4 w-4" />
                    Tambah Sparepart
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0">
                  <Command>
                    <CommandInput placeholder="Cari sparepart..." />
                    <CommandList>
                      <CommandEmpty>Tidak ditemukan</CommandEmpty>
                      <CommandGroup>
                        {(spareparts as any)?.data?.map((part: any) => (
                          <CommandItem key={part.id} onSelect={() => addSparepart(part)}>
                            <div className="flex-1">
                              <div>{part.name}</div>
                              <div className="text-xs text-muted-foreground">
                                {formatCurrency(Number(part.sellPrice ?? 0))} - Stok: {part.stockQuantity}
                              </div>
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>

            {errors.items && <p className="mb-2 text-sm text-destructive">{errors.items.message as string}</p>}

            <div className="rounded-md border">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Tipe</TableHead>
                    <TableHead>Item</TableHead>
                    <TableHead className="w-24">Qty</TableHead>
                    <TableHead className="text-right">Harga</TableHead>
                    <TableHead className="w-20">Diskon %</TableHead>
                    <TableHead className="text-right">Subtotal</TableHead>
                    <TableHead className="w-10"></TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {fields.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="text-center text-muted-foreground py-8">
                        Belum ada item ditambahkan
                      </TableCell>
                    </TableRow>
                  ) : (
                    fields.map((field, index) => (
                      <TableRow key={field.id}>
                        <TableCell>
                          <span className={cn(
                            "px-2 py-1 rounded text-xs font-medium",
                            items[index].tipe === 'jasa' 
                              ? "bg-blue-100 text-blue-700" 
                              : "bg-green-100 text-green-700"
                          )}>
                            {items[index].tipe === 'jasa' ? 'Jasa' : 'Part'}
                          </span>
                        </TableCell>
                        <TableCell>{getItemName(items[index])}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={1}
                            className="w-20"
                            {...register(`items.${index}.quantity`, { valueAsNumber: true })}
                          />
                        </TableCell>
                        <TableCell className="text-right">
                          {formatCurrency(items[index].harga_satuan)}
                        </TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            max={100}
                            className="w-16"
                            {...register(`items.${index}.diskon`, { valueAsNumber: true })}
                          />
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          {formatCurrency(calculateSubtotal(items[index]))}
                        </TableCell>
                        <TableCell>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => remove(index)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
                {fields.length > 0 && (
                  <TableFooter>
                    <TableRow>
                      <TableCell colSpan={5} className="text-right">Total Jasa</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(totalJasa)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} className="text-right">Total Sparepart</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(totalSparepart)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell colSpan={5} className="text-right font-bold">Grand Total</TableCell>
                      <TableCell className="text-right font-bold text-lg">{formatCurrency(grandTotal)}</TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableFooter>
                )}
              </Table>
            </div>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="flex justify-end gap-3">
          <Button type="button" variant="outline" onClick={() => window.history.back()}>
            Batal
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Menyimpan...
              </>
            ) : (
              'Simpan SPK'
            )}
          </Button>
        </div>
      </div>
    </form>
  )
}
