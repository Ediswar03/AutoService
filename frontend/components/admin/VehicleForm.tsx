'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { FieldGroup, Field, FieldLabel, FieldError } from '@/components/ui/field'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
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
import useSWR from 'swr'
import { fetcher } from '@/lib/api-client'

// ─── Schema matches backend createVehicleSchema ─────────────────────────────
const vehicleSchema = z.object({
  customerId:   z.string().min(1, 'Pelanggan wajib dipilih'),
  licensePlate: z.string().min(1, 'Nomor polisi wajib diisi').max(15),
  brand:        z.string().min(1, 'Merk wajib diisi').max(50),
  model:        z.string().min(1, 'Model wajib diisi').max(50),
  vehicleType:  z.enum(['MOBIL', 'MOTOR', 'TRUCK', 'BUS', 'LAINNYA']).default('MOBIL'),
  year:         z.number().int().min(1900).max(2100).nullable().optional(),
  color:        z.string().optional().nullable(),
  transmission: z.string().optional().nullable(),
  fuelType:     z.string().optional().nullable(),
  vin:          z.string().optional().nullable(),
  engineNumber: z.string().optional().nullable(),
  lastOdometer: z.number().int().min(0).optional().nullable(),
  notes:        z.string().optional().nullable(),
})

type VehicleFormValues = z.infer<typeof vehicleSchema>

interface VehicleFormProps {
  initialData?: Partial<VehicleFormValues> & { id?: string }
  onSubmit: (data: VehicleFormValues) => Promise<void>
  isSubmitting?: boolean
}

const carBrands = [
  'Toyota', 'Honda', 'Suzuki', 'Daihatsu', 'Mitsubishi', 'Nissan',
  'Mazda', 'Hyundai', 'KIA', 'Wuling', 'BMW', 'Mercedes-Benz',
  'Audi', 'Volkswagen', 'Ford', 'Chevrolet', 'Isuzu', 'Hino', 'Lainnya',
]

export function VehicleForm({ initialData, onSubmit, isSubmitting }: VehicleFormProps) {
  const [customerOpen, setCustomerOpen] = useState(false)
  const [customerSearch, setCustomerSearch] = useState('')

  // Fetch customers — backend returns { data: [...], pagination: ... }
  const { data: customersData } = useSWR('/customers?limit=200&sortBy=name&sortOrder=asc', fetcher)
  const customers: any[] = Array.isArray(customersData?.data)
    ? customersData.data
    : Array.isArray(customersData)
    ? customersData
    : []

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<VehicleFormValues>({
    resolver: zodResolver(vehicleSchema),
    defaultValues: {
      customerId:   initialData?.customerId   ?? '',
      licensePlate: initialData?.licensePlate ?? '',
      brand:        initialData?.brand        ?? '',
      model:        initialData?.model        ?? '',
      vehicleType:  initialData?.vehicleType  ?? 'MOBIL',
      year:         initialData?.year         ?? new Date().getFullYear(),
      color:        initialData?.color        ?? '',
      transmission: initialData?.transmission ?? 'Manual',
      fuelType:     initialData?.fuelType     ?? 'Bensin',
      vin:          initialData?.vin          ?? '',
      engineNumber: initialData?.engineNumber ?? '',
      lastOdometer: initialData?.lastOdometer ?? 0,
      notes:        initialData?.notes        ?? '',
    },
  })

  const selectedCustomerId = watch('customerId')
  const selectedCustomer = customers.find((c) => c.id === selectedCustomerId)

  const filteredCustomers = customers.filter((c) => {
    const name = (c.name ?? '').toLowerCase()
    const phone = c.phone ?? ''
    return (
      name.includes(customerSearch.toLowerCase()) ||
      phone.includes(customerSearch)
    )
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Pemilik */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Pemilik Kendaraan</CardTitle>
            <CardDescription>Pilih pelanggan pemilik kendaraan</CardDescription>
          </CardHeader>
          <CardContent>
            <Field>
              <FieldLabel>Pelanggan *</FieldLabel>
              <Popover open={customerOpen} onOpenChange={setCustomerOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    role="combobox"
                    className="w-full justify-between font-normal"
                  >
                    {selectedCustomer ? (
                      <span>{selectedCustomer.name} <span className="text-muted-foreground text-xs">— {selectedCustomer.phone}</span></span>
                    ) : (
                      <span className="text-muted-foreground">Pilih pelanggan...</span>
                    )}
                    <Search className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-full p-0" align="start">
                  <Command>
                    <CommandInput
                      placeholder="Cari nama atau telepon..."
                      value={customerSearch}
                      onValueChange={setCustomerSearch}
                    />
                    <CommandList>
                      <CommandEmpty>Pelanggan tidak ditemukan</CommandEmpty>
                      <CommandGroup>
                        {filteredCustomers.map((customer) => (
                          <CommandItem
                            key={customer.id}
                            value={customer.id}
                            onSelect={() => {
                              setValue('customerId', customer.id)
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
              {errors.customerId && <FieldError>{errors.customerId.message}</FieldError>}
            </Field>
          </CardContent>
        </Card>

        {/* Informasi Kendaraan */}
        <Card>
          <CardHeader>
            <CardTitle>Informasi Kendaraan</CardTitle>
            <CardDescription>Data identitas kendaraan</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel htmlFor="licensePlate">Nomor Polisi *</FieldLabel>
                <Input
                  id="licensePlate"
                  placeholder="B 1234 ABC"
                  className="uppercase"
                  {...register('licensePlate')}
                />
                {errors.licensePlate && <FieldError>{errors.licensePlate.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel>Tipe Kendaraan *</FieldLabel>
                <Select
                  value={watch('vehicleType')}
                  onValueChange={(v) => setValue('vehicleType', v as any)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="MOBIL">Mobil</SelectItem>
                    <SelectItem value="MOTOR">Motor</SelectItem>
                    <SelectItem value="TRUCK">Truk</SelectItem>
                    <SelectItem value="BUS">Bus</SelectItem>
                    <SelectItem value="LAINNYA">Lainnya</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Merk *</FieldLabel>
                <Select
                  value={watch('brand')}
                  onValueChange={(v) => setValue('brand', v)}
                >
                  <SelectTrigger><SelectValue placeholder="Pilih merk kendaraan" /></SelectTrigger>
                  <SelectContent>
                    {carBrands.map((b) => <SelectItem key={b} value={b}>{b}</SelectItem>)}
                  </SelectContent>
                </Select>
                {errors.brand && <FieldError>{errors.brand.message}</FieldError>}
              </Field>

              <Field>
                <FieldLabel htmlFor="model">Model *</FieldLabel>
                <Input id="model" placeholder="Avanza, Jazz, Xenia..." {...register('model')} />
                {errors.model && <FieldError>{errors.model.message}</FieldError>}
              </Field>

              <div className="grid grid-cols-2 gap-4">
                <Field>
                  <FieldLabel htmlFor="year">Tahun</FieldLabel>
                  <Input
                    id="year"
                    type="number"
                    min={1900}
                    max={new Date().getFullYear() + 1}
                    {...register('year', { valueAsNumber: true })}
                  />
                  {errors.year && <FieldError>{errors.year.message}</FieldError>}
                </Field>

                <Field>
                  <FieldLabel htmlFor="color">Warna</FieldLabel>
                  <Input id="color" placeholder="Putih, Hitam..." {...register('color')} />
                </Field>
              </div>
            </FieldGroup>
          </CardContent>
        </Card>

        {/* Spesifikasi */}
        <Card>
          <CardHeader>
            <CardTitle>Spesifikasi Teknis</CardTitle>
            <CardDescription>Detail teknis kendaraan</CardDescription>
          </CardHeader>
          <CardContent>
            <FieldGroup>
              <Field>
                <FieldLabel>Transmisi</FieldLabel>
                <Select
                  value={watch('transmission') ?? 'Manual'}
                  onValueChange={(v) => setValue('transmission', v)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Manual">Manual</SelectItem>
                    <SelectItem value="Automatic">Automatic</SelectItem>
                    <SelectItem value="CVT">CVT</SelectItem>
                    <SelectItem value="AMT">AMT</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel>Bahan Bakar</FieldLabel>
                <Select
                  value={watch('fuelType') ?? 'Bensin'}
                  onValueChange={(v) => setValue('fuelType', v)}
                >
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Bensin">Bensin</SelectItem>
                    <SelectItem value="Diesel">Diesel / Solar</SelectItem>
                    <SelectItem value="Listrik">Listrik (EV)</SelectItem>
                    <SelectItem value="Hybrid">Hybrid</SelectItem>
                    <SelectItem value="Gas">Gas (LPG/CNG)</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <Field>
                <FieldLabel htmlFor="vin">Nomor Rangka (VIN)</FieldLabel>
                <Input id="vin" placeholder="Nomor rangka kendaraan" {...register('vin')} />
              </Field>

              <Field>
                <FieldLabel htmlFor="engineNumber">Nomor Mesin</FieldLabel>
                <Input id="engineNumber" placeholder="Nomor mesin kendaraan" {...register('engineNumber')} />
              </Field>

              <Field>
                <FieldLabel htmlFor="lastOdometer">Odometer Terakhir (km)</FieldLabel>
                <Input
                  id="lastOdometer"
                  type="number"
                  min={0}
                  placeholder="0"
                  {...register('lastOdometer', { valueAsNumber: true })}
                />
              </Field>

              <Field>
                <FieldLabel htmlFor="notes">Catatan</FieldLabel>
                <Input id="notes" placeholder="Catatan tambahan..." {...register('notes')} />
              </Field>
            </FieldGroup>
          </CardContent>
        </Card>
      </div>

      <div className="mt-6 flex justify-end gap-3">
        <Button type="button" variant="outline" onClick={() => window.history.back()}>
          Batal
        </Button>
        <Button type="submit" disabled={isSubmitting} className="bg-orange-500 hover:bg-orange-600 text-white border-none shadow-sm font-bold px-8">
          {isSubmitting ? (
            <><Loader2 className="mr-2 h-4 w-4 animate-spin" />Menyimpan...</>
          ) : 'Simpan Kendaraan'}
        </Button>
      </div>
    </form>
  )
}
