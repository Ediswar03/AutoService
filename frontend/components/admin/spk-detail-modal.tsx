"use client"

import { User, Car, Wrench, Calendar, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Separator } from "@/components/ui/separator"
import useSWR from "swr"
import { fetcher } from "@/lib/api-client"
import { Loader2 } from "lucide-react"
import type { SPK, SPKStatus } from "@/types"

interface SPKDetailModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  spk: SPK | null
  onUpdateStatus?: (spkId: string, status: SPKStatus) => void
}

const statusConfig: Record<SPKStatus, { label: string; variant: "default" | "secondary" | "destructive" | "outline" }> = {
  DRAFT: { label: "Draft", variant: "outline" },
  PENDING: { label: "Pending", variant: "secondary" },
  IN_PROGRESS: { label: "Dikerjakan", variant: "default" },
  WAITING_PARTS: { label: "Tunggu Parts", variant: "outline" },
  QUALITY_CHECK: { label: "Cek Kualitas", variant: "secondary" },
  COMPLETED: { label: "Selesai", variant: "outline" },
  INVOICED: { label: "Ditagihkan", variant: "outline" },
  CANCELLED: { label: "Dibatalkan", variant: "destructive" },
}

export function SPKDetailModal({
  open,
  onOpenChange,
  spk,
  onUpdateStatus,
}: SPKDetailModalProps) {
  const { data: detailData, isLoading } = useSWR(open && spk ? `/work-orders/${spk.id}` : null, fetcher)
  const fullSpk = detailData?.data || spk
  
  if (!fullSpk) return null

  const customer = fullSpk.customer || {}
  const vehicle = fullSpk.vehicle || {}
  const mechanic = fullSpk.assignedMechanic || {}
  const status = statusConfig[fullSpk.status as SPKStatus] || { label: fullSpk.status, variant: "outline" }

  const services = fullSpk.services || fullSpk.servicesList || []
  const parts = fullSpk.spareparts || fullSpk.parts || []

  const servicesTotal = services.reduce((sum: number, s: any) => sum + (s.totalPrice || (s.price * s.quantity)) || 0, 0)
  const partsTotal = parts.reduce((sum: number, p: any) => sum + (p.totalPrice || (p.price * p.quantity)) || 0, 0)
  const total = fullSpk.grandTotal || (servicesTotal + partsTotal)


  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-xl">{fullSpk.orderNumber || fullSpk.spkNumber}</DialogTitle>
              <DialogDescription>
                Dibuat: {fullSpk.createdAt ? new Date(fullSpk.createdAt).toLocaleString('id-ID') : '-'}
              </DialogDescription>
            </div>
            <Badge variant={status.variant} className="text-sm">
              {status.label}
            </Badge>
          </div>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Customer & Vehicle Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <User className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Pelanggan</span>
              </div>
              {(customer.name || customer.id) && (
                <>
                  <p className="font-medium">{customer.name}</p>
                  <p className="text-sm text-muted-foreground">{customer.phone}</p>
                  <p className="text-sm text-muted-foreground">{customer.email}</p>
                </>
              )}
            </div>

            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Car className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Kendaraan</span>
              </div>
              {(vehicle.licensePlate || vehicle.plateNumber) && (
                <>
                  <p className="font-medium font-mono">{vehicle.licensePlate || vehicle.plateNumber}</p>
                  <p className="text-sm text-muted-foreground">
                    {vehicle.brand} {vehicle.model} {vehicle.year ? `(${vehicle.year})` : ''}
                  </p>
                  <p className="text-sm text-muted-foreground">{vehicle.color}</p>
                </>
              )}
            </div>
          </div>

          {/* Mechanic & Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Wrench className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Mekanik</span>
              </div>
              {mechanic.name ? (
                <>
                  <p className="font-medium">{mechanic.name}</p>
                  <p className="text-sm text-muted-foreground">{mechanic.specialization || "Mekanik"}</p>
                </>
              ) : (
                <p className="text-muted-foreground">Belum ditugaskan</p>
              )}
            </div>

            <div className="p-4 rounded-lg border bg-muted/30">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="size-4 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">Tanggal</span>
              </div>
              <p className="text-sm">
                <span className="text-muted-foreground">Mulai:</span> {fullSpk.createdAt ? new Date(fullSpk.createdAt).toLocaleDateString('id-ID') : '-'}
              </p>
              {fullSpk.estimatedCompletion && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Est. Selesai:</span>{" "}
                  {new Date(fullSpk.estimatedCompletion).toLocaleDateString('id-ID')}
                </p>
              )}
              {fullSpk.actualCompletion && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Selesai:</span>{" "}
                  {new Date(fullSpk.actualCompletion).toLocaleDateString('id-ID')}
                </p>
              )}
            </div>
          </div>

          <Separator />

          {/* Services */}
          <div>
            <h4 className="font-medium mb-3">Layanan Servis</h4>
            {isLoading ? <p className="text-sm text-muted-foreground"><Loader2 className="animate-spin w-4 h-4 inline mr-2" /> Memuat data...</p> : services.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tidak ada layanan</p>
            ) : (
              <div className="space-y-2">
                {services.map((service: any, idx: number) => (
                  <div
                    key={service.id || idx}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{service.service?.name || service.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Rp {(service.unitPrice || service.price || 0).toLocaleString('id-ID')} x {service.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      Rp {(service.totalPrice || ((service.unitPrice || service.price || 0) * service.quantity)).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Subtotal Layanan</span>
                  <span className="font-medium">Rp {servicesTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Parts */}
          <div>
            <h4 className="font-medium mb-3">Spare Parts</h4>
            {isLoading ? <p className="text-sm text-muted-foreground"><Loader2 className="animate-spin w-4 h-4 inline mr-2" /> Memuat data...</p> : parts.length === 0 ? (
              <p className="text-sm text-muted-foreground">Tidak ada spare parts</p>
            ) : (
              <div className="space-y-2">
                {parts.map((part: any, idx: number) => (
                  <div
                    key={part.id || idx}
                    className="flex items-center justify-between p-3 rounded-lg border"
                  >
                    <div>
                      <p className="font-medium">{part.sparepart?.name || part.name}</p>
                      <p className="text-sm text-muted-foreground">
                        Rp {(part.unitPrice || part.price || 0).toLocaleString('id-ID')} x {part.quantity}
                      </p>
                    </div>
                    <p className="font-medium">
                      Rp {(part.totalPrice || ((part.unitPrice || part.price || 0) * part.quantity)).toLocaleString('id-ID')}
                    </p>
                  </div>
                ))}
                <div className="flex justify-between p-3 bg-muted/30 rounded-lg">
                  <span className="text-muted-foreground">Subtotal Parts</span>
                  <span className="font-medium">Rp {partsTotal.toLocaleString('id-ID')}</span>
                </div>
              </div>
            )}
          </div>

          {/* Notes */}
          {fullSpk.customerComplaints && (
            <>
              <Separator />
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <FileText className="size-4 text-muted-foreground" />
                  <span className="font-medium">Keluhan Pelanggan / Catatan</span>
                </div>
                <p className="text-sm text-muted-foreground p-3 rounded-lg bg-muted/30">
                  {fullSpk.customerComplaints || fullSpk.notes}
                </p>
              </div>
            </>
          )}

          <Separator />

          {/* Total */}
          <div className="flex items-center justify-between p-4 rounded-lg bg-primary/10 border border-primary/20">
            <span className="font-medium text-lg">Total</span>
            <span className="text-2xl font-bold text-primary">
              Rp {total.toLocaleString('id-ID')}
            </span>
          </div>
        </div>

        <DialogFooter className="flex-wrap gap-2">
          {fullSpk.status === "PENDING" && onUpdateStatus && (
            <Button
              onClick={() => onUpdateStatus(fullSpk.id, "IN_PROGRESS")}
              variant="default"
            >
              Mulai Kerjakan
            </Button>
          )}
          {(fullSpk.status === "IN_PROGRESS" || fullSpk.status === "QUALITY_CHECK") && onUpdateStatus && (
            <Button
              onClick={() => onUpdateStatus(fullSpk.id, "COMPLETED")}
              variant="default"
            >
              Tandai Selesai
            </Button>
          )}
          {fullSpk.status === "COMPLETED" && (
            <Button variant="default" asChild>
              <a href={`/admin/invoices?spk=${fullSpk.id}`}>Buat Invoice</a>
            </Button>
          )}
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Tutup
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
