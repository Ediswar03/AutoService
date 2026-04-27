"use client"

import { useState, useRef } from "react"
import { useSearchParams } from "next/navigation"
import { Plus, Search, Download, FileText } from "lucide-react"
import { useReactToPrint } from "react-to-print"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { InvoiceTable } from "@/components/admin/InvoiceTable"
import { PaymentForm } from "@/components/admin/PaymentForm"
import { InvoicePrintTemplate } from "@/components/admin/invoice-print-template"
import { SPKDetailModal } from "@/components/admin/spk-detail-modal"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import {
  mockInvoices,
  mockSPKs,
  getCustomerById,
  getSPKById,
  getVehicleById,
  formatCurrency,
  formatDate,
  generateInvoiceNumber,
} from "@/lib/mock-data"
import type { Invoice, InvoiceStatus, PaymentFormData, SPK } from "@/types"

const paymentStatusConfig: Record<
  InvoiceStatus,
  { label: string; variant: "default" | "secondary" | "destructive" | "outline" }
> = {
  DRAFT: { label: "Draft", variant: "outline" },
  SENT: { label: "Dikirim", variant: "secondary" },
  PAID: { label: "Lunas", variant: "default" },
  PARTIAL: { label: "Sebagian", variant: "secondary" },
  OVERDUE: { label: "Terlambat", variant: "destructive" },
  CANCELLED: { label: "Dibatalkan", variant: "destructive" },
  REFUNDED: { label: "Dikembalikan", variant: "outline" },
}

export default function InvoicesPage() {
  const searchParams = useSearchParams()
  const spkIdParam = searchParams.get("spk")

  const [invoices, setInvoices] = useState<Invoice[]>(mockInvoices as any)
  const [searchQuery, setSearchQuery] = useState("")
  const [statusFilter, setStatusFilter] = useState<InvoiceStatus | "all">("all")
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null)
  const [detailDialogOpen, setDetailDialogOpen] = useState(false)
  const [paymentDialogOpen, setPaymentDialogOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(spkIdParam ? true : false)
  const [selectedSpkForInvoice, setSelectedSpkForInvoice] = useState<string>(spkIdParam || "")

  const printRef = useRef<HTMLDivElement>(null)
  const handlePrint = useReactToPrint({
    contentRef: printRef,
  })

  // Get completed SPKs that don't have invoices yet
  const completedSPKsWithoutInvoice = mockSPKs.filter(
    (spk) =>
      spk.status === "COMPLETED" &&
      !invoices.find((inv) => inv.spkId === spk.id)
  )

  const filteredInvoices = invoices.filter((invoice) => {
    const customer = getCustomerById(invoice.customerId)
    const matchesSearch =
      invoice.invoiceNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      customer?.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesStatus = statusFilter === "all" || invoice.paymentStatus === statusFilter
    return matchesSearch && matchesStatus
  })

  const totalRevenue = invoices
    .filter((inv) => inv.status === "PAID")
    .reduce((sum, inv) => sum + Number(inv.grand_total), 0)
  const pendingPayments = invoices
    .filter((inv) => inv.status !== "PAID")
    .reduce((sum, inv) => sum + (Number(inv.grand_total) - Number(inv.jumlah_dibayar)), 0)

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setDetailDialogOpen(true)
  }

  const handlePaymentClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setPaymentDialogOpen(true)
  }

  const handlePrintClick = (invoice: Invoice) => {
    setSelectedInvoice(invoice)
    setTimeout(() => {
      handlePrint()
    }, 100)
  }

  const handlePaymentSubmit = async (invoiceId: string, data: PaymentFormData) => {
    setInvoices(
      invoices.map((inv) => {
        if (inv.id === invoiceId) {
          const newPaidAmount = Number(inv.jumlah_dibayar) + data.amount
          const newDiscount = Number(inv.diskon) + (data.discount || 0)
          const newTotal = Number(inv.total_jasa) + Number(inv.total_sparepart) + Number(inv.ppn) - newDiscount
          const newStatus: InvoiceStatus =
            newPaidAmount >= newTotal ? "PAID" : newPaidAmount > 0 ? "PARTIAL" : "SENT"

          return {
            ...inv,
            jumlah_dibayar: Math.min(newPaidAmount, newTotal),
            diskon: newDiscount,
            grand_total: newTotal,
            status: newStatus,
            payment_method: data.method,
            updated_at: new Date().toISOString(),
          }
        }
        return inv
      })
    )
  }

  const handleCreateInvoice = () => {
    const spk = getSPKById(selectedSpkForInvoice)
    if (!spk) return

    const servicesTotal = (spk.items || []).filter(i => i.tipe === 'jasa').reduce((sum, s) => sum + Number(s.harga_satuan) * s.quantity, 0)
    const partsTotal = (spk.items || []).filter(i => i.tipe === 'sparepart').reduce((sum, p) => sum + Number(p.harga_satuan) * p.quantity, 0)
    const subtotal = servicesTotal + partsTotal
    const tax = Math.round(subtotal * 0.11)

    const newInvoice: Invoice = {
      id: Date.now(),
      nomor_invoice: generateInvoiceNumber(),
      spk_id: spk.id as any,
      tanggal: new Date().toISOString(),
      total_jasa: servicesTotal,
      total_sparepart: partsTotal,
      diskon: 0,
      ppn: tax,
      grand_total: subtotal + tax,
      jumlah_dibayar: 0,
      sisa_bayar: subtotal + tax,
      status: "SENT",
      created_by: 1,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      spk: spk as any,
    }

    setInvoices([newInvoice, ...invoices])
    setCreateDialogOpen(false)
    setSelectedSpkForInvoice("")
  }

  return (
    <>
      <AdminHeader title="Kasir / Invoice" description="Kelola invoice dan pembayaran" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Stats Cards */}
          <div className="grid gap-4 sm:grid-cols-4">
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Invoice</p>
                <p className="text-2xl font-bold">{invoices.length}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Belum Dibayar</p>
                <p className="text-2xl font-bold">
                  {invoices.filter((i) => i.status === "SENT" || i.status === "DRAFT").length}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Pending Payment</p>
                <p className="text-2xl font-bold text-orange-600">
                  {formatCurrency(pendingPayments)}
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <p className="text-sm text-muted-foreground">Total Pendapatan</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(totalRevenue)}
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Invoice Table */}
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <CardTitle>Daftar Invoice</CardTitle>
                  <CardDescription>
                    {filteredInvoices.length} invoice ditemukan
                  </CardDescription>
                </div>
                <Button onClick={() => setCreateDialogOpen(true)}>
                  <Plus className="mr-2 size-4" />
                  Buat Invoice
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {/* Filters */}
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center mb-6">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                    placeholder="Cari no. invoice atau pelanggan..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-9"
                  />
                </div>
                <Select
                  value={statusFilter}
                  onValueChange={(value: InvoiceStatus | "all") => setStatusFilter(value)}
                >
                  <SelectTrigger className="w-full sm:w-44">
                    <SelectValue placeholder="Status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua Status</SelectItem>
                    <SelectItem value="SENT">Belum Bayar</SelectItem>
                    <SelectItem value="PARTIAL">Sebagian</SelectItem>
                    <SelectItem value="PAID">Lunas</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <InvoiceTable
                invoices={filteredInvoices}
                onView={handleViewInvoice}
                onPayment={handlePaymentClick}
                onPrint={handlePrintClick}
              />
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Invoice Detail Dialog */}
      <Dialog open={detailDialogOpen} onOpenChange={setDetailDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          {selectedInvoice && (
            <>
              <DialogHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <DialogTitle>{selectedInvoice.nomor_invoice}</DialogTitle>
                    <DialogDescription>
                      Tanggal: {formatDate(selectedInvoice.tanggal)}
                    </DialogDescription>
                  </div>
                  <Badge variant={paymentStatusConfig[selectedInvoice.status].variant}>
                    {paymentStatusConfig[selectedInvoice.status].label}
                  </Badge>
                </div>
              </DialogHeader>

              <div className="py-4 space-y-4">
                {/* Customer Info */}
                <div className="p-4 rounded-lg bg-muted/30">
                  <p className="text-sm font-medium text-muted-foreground mb-1">Pelanggan</p>
                  <p className="font-medium">
                    {selectedInvoice.spk?.customer?.nama || getCustomerById(selectedInvoice.spk?.customer_id || 0)?.nama}
                  </p>
                </div>

                {/* Payment Details */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal Jasa</span>
                    <span>{formatCurrency(selectedInvoice.total_jasa)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Subtotal Sparepart</span>
                    <span>{formatCurrency(selectedInvoice.total_sparepart)}</span>
                  </div>
                  {selectedInvoice.diskon > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Diskon</span>
                      <span>-{formatCurrency(selectedInvoice.diskon)}</span>
                    </div>
                  )}
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">PPN (11%)</span>
                    <span>{formatCurrency(selectedInvoice.ppn)}</span>
                  </div>
                  <Separator />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>{formatCurrency(selectedInvoice.grand_total)}</span>
                  </div>
                  {selectedInvoice.jumlah_dibayar > 0 && (
                    <div className="flex justify-between text-sm text-green-600">
                      <span>Dibayar</span>
                      <span>-{formatCurrency(selectedInvoice.jumlah_dibayar)}</span>
                    </div>
                  )}
                  {selectedInvoice.status !== "PAID" && (
                    <div className="flex justify-between font-medium">
                      <span>Sisa</span>
                      <span className="text-orange-600">
                        {formatCurrency(selectedInvoice.sisa_bayar)}
                      </span>
                    </div>
                  )}
                </div>

                {selectedInvoice.paymentMethod && (
                  <div className="p-4 rounded-lg bg-green-500/10 border border-green-500/20">
                    <p className="text-sm">
                      Metode: <span className="font-medium">{selectedInvoice.paymentMethod}</span>
                    </p>
                    {selectedInvoice.paymentDate && (
                      <p className="text-sm text-muted-foreground">
                        Tanggal bayar: {formatDate(selectedInvoice.paymentDate)}
                      </p>
                    )}
                  </div>
                )}
              </div>

              <DialogFooter className="gap-2">
                {selectedInvoice.status !== "PAID" && (
                  <Button onClick={() => {
                    setDetailDialogOpen(false)
                    handlePaymentClick(selectedInvoice)
                  }}>
                    Input Pembayaran
                  </Button>
                )}
                <Button variant="outline" onClick={() => handlePrintClick(selectedInvoice)}>
                  <FileText className="mr-2 size-4" />
                  Cetak
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Invoice Dialog */}
      <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Buat Invoice Baru</DialogTitle>
            <DialogDescription>
              Pilih SPK yang sudah selesai untuk dibuatkan invoice
            </DialogDescription>
          </DialogHeader>

          <div className="py-4">
            <Select value={selectedSpkForInvoice} onValueChange={setSelectedSpkForInvoice}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih SPK" />
              </SelectTrigger>
              <SelectContent>
                {completedSPKsWithoutInvoice.length === 0 ? (
                  <SelectItem value="none" disabled>
                    Tidak ada SPK yang tersedia
                  </SelectItem>
                ) : (
                  completedSPKsWithoutInvoice.map((spk) => {
                    const customer = getCustomerById(spk.customer_id)
                    return (
                      <SelectItem key={spk.id} value={String(spk.id)}>
                        {spk.nomor_spk} - {customer?.nama} ({formatCurrency(Number(spk.total_biaya))})
                      </SelectItem>
                    )
                  })
                )}
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setCreateDialogOpen(false)}>
              Batal
            </Button>
            <Button
              onClick={handleCreateInvoice}
              disabled={!selectedSpkForInvoice || selectedSpkForInvoice === "none"}
            >
              Buat Invoice
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Payment Form */}
      <PaymentForm
        open={paymentDialogOpen}
        onOpenChange={setPaymentDialogOpen}
        invoice={selectedInvoice}
        onSubmit={handlePaymentSubmit}
      />

      {/* Hidden Print Template */}
      <div className="hidden">
        {selectedInvoice && (
          <InvoicePrintTemplate ref={printRef} invoice={selectedInvoice} />
        )}
      </div>
    </>
  )
}
