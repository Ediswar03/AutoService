'use client'

import { format } from 'date-fns'
import { id } from 'date-fns/locale'
import { 
  Car, 
  User, 
  Phone, 
  MapPin, 
  Calendar,
  Wrench,
  FileText,
  CheckCircle,
  Clock,
  AlertTriangle,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableFooter,
} from '@/components/ui/table'
import type { SPK } from '@/types'

interface SPKDetailViewProps {
  spk: SPK
}

const statusConfig: Record<string, { 
  label: string
  variant: 'default' | 'secondary' | 'destructive' | 'outline'
  icon: React.ElementType
  className?: string
}> = {
  DRAFT: { label: 'Draft', variant: 'outline', icon: FileText },
  PENDING: { label: 'Pending', variant: 'secondary', icon: Clock },
  IN_PROGRESS: { label: 'Dikerjakan', variant: 'default', icon: Wrench, className: 'bg-blue-500 hover:bg-blue-600' },
  WAITING_PARTS: { label: 'Tunggu Parts', variant: 'secondary', icon: Clock, className: 'bg-orange-500 text-white hover:bg-orange-600' },
  QUALITY_CHECK: { label: 'Cek Kualitas', variant: 'secondary', icon: CheckCircle },
  COMPLETED: { label: 'Selesai', variant: 'default', icon: CheckCircle, className: 'bg-green-500 hover:bg-green-600' },
  INVOICED: { label: 'Ditagihkan', variant: 'outline', icon: FileText },
  CANCELLED: { label: 'Dibatalkan', variant: 'destructive', icon: AlertTriangle },
}

export function SPKDetailView({ spk }: SPKDetailViewProps) {
  const status = statusConfig[spk.status] || { label: spk.status, variant: 'outline', icon: FileText }
  const StatusIcon = status.icon

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '-'
    try {
      return format(new Date(dateStr), 'dd MMMM yyyy, HH:mm', { locale: id })
    } catch (e) {
      return dateStr
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <div className="flex items-center gap-3">
            <h2 className="text-2xl font-bold">{spk.orderNumber || '-'}</h2>
            <Badge variant={status.variant} className={status.className}>
              <StatusIcon className="mr-1 h-3 w-3" />
              {status.label}
            </Badge>
          </div>
          <p className="text-muted-foreground">
            Dibuat pada {formatDate(spk.createdAt)}
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Pelanggan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {spk.customer && (
              <>
                <div className="flex items-start gap-3">
                  <User className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div className="font-medium">{spk.customer.name}</div>
                    <div className="text-sm text-muted-foreground capitalize">
                      {spk.customer.type}
                    </div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Phone className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div>
                    <div>{spk.customer.phone}</div>
                    {spk.customer.email && (
                      <div className="text-sm text-muted-foreground">{spk.customer.email}</div>
                    )}
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 text-muted-foreground mt-0.5" />
                  <div className="text-sm">{spk.customer.address || '-'}</div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* Vehicle Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informasi Kendaraan</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {spk.vehicle && (
              <>
                <div className="flex items-center gap-3">
                  <Car className="h-5 w-5 text-muted-foreground" />
                  <div>
                    <div className="font-mono font-bold text-lg">{spk.vehicle.licensePlate}</div>
                  </div>
                </div>
                <Separator />
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="text-muted-foreground">Merk</div>
                  <div className="font-medium">{spk.vehicle.brand}</div>
                  <div className="text-muted-foreground">Model</div>
                  <div className="font-medium">{spk.vehicle.model}</div>
                  <div className="text-muted-foreground">Tahun</div>
                  <div className="font-medium">{spk.vehicle.year}</div>
                  <div className="text-muted-foreground">Warna</div>
                  <div className="font-medium">{spk.vehicle.color}</div>
                  <div className="text-muted-foreground">Transmisi</div>
                  <div className="font-medium capitalize">{spk.vehicle.transmission}</div>
                </div>
              </>
            )}
          </CardContent>
        </Card>

        {/* SPK Info */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Detail SPK</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Prioritas</div>
                <div className="font-medium">{spk.priority}</div>
              </div>
            </div>
            {spk.estimatedCompletion && (
              <div className="flex items-center gap-3">
                <Clock className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Estimasi Selesai</div>
                  <div className="font-medium">
                    {formatDate(spk.estimatedCompletion)}
                  </div>
                </div>
              </div>
            )}
            {spk.assignedMechanic && (
              <div className="flex items-center gap-3">
                <Wrench className="h-5 w-5 text-muted-foreground" />
                <div>
                  <div className="text-sm text-muted-foreground">Mekanik</div>
                  <div className="font-medium">{spk.assignedMechanic.name}</div>
                </div>
              </div>
            )}
            <div className="flex items-center gap-3">
              <Clock className="h-5 w-5 text-muted-foreground" />
              <div>
                <div className="text-sm text-muted-foreground">Odometer In</div>
                <div className="font-medium">{spk.odometerIn ? `${spk.odometerIn} KM` : '-'}</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Keluhan & Diagnosa */}
      <Card>
        <CardHeader>
          <CardTitle>Keluhan & Catatan</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h4 className="text-sm font-medium text-muted-foreground mb-1">Keluhan Pelanggan</h4>
            <p className="text-sm bg-muted p-3 rounded-md">{spk.customerComplaints || '-'}</p>
          </div>
          {spk.internalNotes && (
            <div>
              <h4 className="text-sm font-medium text-muted-foreground mb-1">Catatan Internal</h4>
              <p className="text-sm bg-muted p-3 rounded-md">{spk.internalNotes || '-'}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Items */}
      <Card>
        <CardHeader>
          <CardTitle>Rincian Pekerjaan</CardTitle>
          <CardDescription>Daftar jasa dan sparepart</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">No</TableHead>
                  <TableHead className="w-24">Tipe</TableHead>
                  <TableHead>Item</TableHead>
                  <TableHead className="text-center w-20">Qty</TableHead>
                  <TableHead className="text-right w-32">Harga</TableHead>
                  <TableHead className="text-center w-20">Diskon</TableHead>
                  <TableHead className="text-right w-32">Subtotal</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {spk.items?.map((item: any, index: number) => {
                  const unitPrice = Number(item.unitPrice || 0)
                  const discountPercent = Number(item.discountPercent || 0)
                  const finalSubtotal = Number(item.totalPrice || 0)

                  return (
                    <TableRow key={item.id}>
                      <TableCell>{index + 1}</TableCell>
                      <TableCell>
                        <Badge variant={item.serviceId ? 'default' : 'secondary'}>
                          {item.serviceId ? 'Jasa' : 'Sparepart'}
                        </Badge>
                      </TableCell>
                      <TableCell className="font-medium">
                        {item.service?.name || item.sparepart?.name || '-'}
                      </TableCell>
                      <TableCell className="text-center">{item.quantity}</TableCell>
                      <TableCell className="text-right">{formatCurrency(unitPrice)}</TableCell>
                      <TableCell className="text-center">{discountPercent}%</TableCell>
                      <TableCell className="text-right font-medium">{formatCurrency(finalSubtotal)}</TableCell>
                    </TableRow>
                  )
                })}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={6} className="text-right">Total Jasa</TableCell>
                  <TableCell className="text-right">{formatCurrency(Number(spk.totalServiceCost || 0))}</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell colSpan={6} className="text-right">Total Sparepart</TableCell>
                  <TableCell className="text-right">{formatCurrency(Number(spk.totalPartsCost || 0))}</TableCell>
                </TableRow>
                {Number(spk.discountAmount || 0) > 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-right">Diskon ({spk.discountPercent}%)</TableCell>
                    <TableCell className="text-right text-destructive">-{formatCurrency(Number(spk.discountAmount || 0))}</TableCell>
                  </TableRow>
                )}
                {Number(spk.taxAmount || 0) > 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="text-right">PPN ({spk.taxPercent}%)</TableCell>
                    <TableCell className="text-right">{formatCurrency(Number(spk.taxAmount || 0))}</TableCell>
                  </TableRow>
                )}
                <TableRow className="bg-muted/50">
                  <TableCell colSpan={6} className="text-right font-bold text-lg">Grand Total</TableCell>
                  <TableCell className="text-right font-bold text-lg">{formatCurrency(Number(spk.grandTotal || 0))}</TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
