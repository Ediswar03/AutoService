"use client"

import { forwardRef } from "react"
import { Separator } from "@/components/ui/separator"
import { formatCurrency } from "@/lib/api-client"
import { format } from "date-fns"
import { id } from "date-fns/locale"

const formatDate = (dateStr: string) => {
  if (!dateStr) return '-'
  return format(new Date(dateStr), 'dd MMMM yyyy', { locale: id })
}
import type { Invoice } from "@/types"

interface InvoicePrintTemplateProps {
  invoice: Invoice
}

export const InvoicePrintTemplate = forwardRef<HTMLDivElement, InvoicePrintTemplateProps>(
  function InvoicePrintTemplate({ invoice }, ref) {
    const inv = invoice as any
    const spk = inv.spk
    const customer = spk?.customer
    const vehicle = spk?.vehicle

    return (
      <div ref={ref} className="p-8 bg-white text-black min-h-[297mm] w-[210mm] mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold">AutoService</h1>
          <p className="text-sm text-gray-600">Bengkel Otomotif Terpercaya</p>
          <p className="text-sm text-gray-600">
            Jl. Raya Utama No. 123, Jakarta Selatan
          </p>
          <p className="text-sm text-gray-600">
            Telp: 021-5551234 | Email: info@autoservice.id
          </p>
        </div>

        <Separator className="mb-6" />

        {/* Invoice Info */}
        <div className="flex justify-between mb-6">
          <div>
            <h2 className="text-lg font-bold mb-2">INVOICE</h2>
            <p className="text-sm">
              <span className="text-gray-600">No. Invoice:</span> {inv.nomor_invoice ?? inv.invoiceNumber ?? "-"}
            </p>
            <p className="text-sm">
              <span className="text-gray-600">No. SPK:</span> {spk?.nomor_spk ?? spk?.spkNumber ?? "-"}
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Tanggal:</span> {formatDate(inv.tanggal ?? inv.createdAt)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium mb-1">Kepada:</p>
            <p className="font-bold">{customer?.nama ?? customer?.name ?? 'Pelanggan'}</p>
            <p className="text-sm text-gray-600">{customer?.telepon ?? customer?.phone ?? '-'}</p>
            <p className="text-sm text-gray-600 max-w-[200px]">{customer?.alamat ?? customer?.address ?? '-'}</p>
          </div>
        </div>

        {/* Vehicle Info */}
        {vehicle && (
          <div className="mb-6 p-3 bg-gray-50 rounded">
            <p className="text-sm font-medium mb-1">Kendaraan:</p>
            <p className="font-mono">{vehicle.nomor_polisi ?? vehicle.licensePlate}</p>
            <p className="text-sm text-gray-600">
              {vehicle.merk ?? vehicle.brand} {vehicle.model} ({vehicle.tahun ?? vehicle.year}) - {vehicle.warna ?? vehicle.color}
            </p>
          </div>
        )}

        {/* Services Table */}
        {spk?.items && spk.items.filter((i: any) => i.tipe === 'jasa').length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold mb-2">Layanan Servis</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2">Deskripsi</th>
                  <th className="text-center py-2 w-20">Qty</th>
                  <th className="text-right py-2 w-32">Harga</th>
                  <th className="text-right py-2 w-32">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {spk.items.filter((i: any) => i.tipe === 'jasa').map((item: any, idx: number) => (
                  <tr key={item.id ?? idx} className="border-b border-gray-200">
                    <td className="py-2">{item.nama_item ?? item.itemName ?? '-'}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-right">{formatCurrency(Number(item.harga_satuan ?? item.price ?? 0))}</td>
                    <td className="py-2 text-right">
                      {formatCurrency(Number(item.subtotal ?? (item.quantity * (item.harga_satuan ?? item.price ?? 0))))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Parts Table */}
        {spk?.items && spk.items.filter((i: any) => i.tipe === 'sparepart').length > 0 && (
          <div className="mb-6">
            <h3 className="font-bold mb-2">Spare Parts</h3>
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-300">
                  <th className="text-left py-2">Deskripsi</th>
                  <th className="text-center py-2 w-20">Qty</th>
                  <th className="text-right py-2 w-32">Harga</th>
                  <th className="text-right py-2 w-32">Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {spk.items.filter((i: any) => i.tipe === 'sparepart').map((item: any, idx: number) => (
                  <tr key={item.id ?? idx} className="border-b border-gray-200">
                    <td className="py-2">{item.nama_item ?? item.itemName ?? '-'}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-right">{formatCurrency(Number(item.harga_satuan ?? item.price ?? 0))}</td>
                    <td className="py-2 text-right">
                      {formatCurrency(Number(item.subtotal ?? (item.quantity * (item.harga_satuan ?? item.price ?? 0))))}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between py-1 text-sm">
              <span>Subtotal Jasa</span>
              <span>{formatCurrency(Number(inv.total_jasa ?? inv.totalServiceCost ?? 0))}</span>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span>Subtotal Sparepart</span>
              <span>{formatCurrency(Number(inv.total_sparepart ?? inv.totalPartsCost ?? 0))}</span>
            </div>
            {Number(inv.diskon ?? inv.discountAmount ?? 0) > 0 && (
              <div className="flex justify-between py-1 text-sm text-red-600">
                <span>Diskon</span>
                <span>-{formatCurrency(Number(inv.diskon ?? inv.discountAmount ?? 0))}</span>
              </div>
            )}
            <div className="flex justify-between py-1 text-sm">
              <span>PPN (11%)</span>
              <span>{formatCurrency(Number(inv.ppn ?? inv.taxAmount ?? 0))}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between py-1 font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(Number(inv.grand_total ?? inv.grandTotal ?? 0))}</span>
            </div>
            {Number(inv.jumlah_dibayar ?? inv.amountPaid ?? 0) > 0 && (
              <>
                <div className="flex justify-between py-1 text-sm text-green-600">
                  <span>Dibayar</span>
                  <span>-{formatCurrency(Number(inv.jumlah_dibayar ?? inv.amountPaid ?? 0))}</span>
                </div>
                <div className="flex justify-between py-1 font-bold">
                  <span>Sisa</span>
                  <span>{formatCurrency(Number(inv.sisa_bayar ?? inv.amountDue ?? 0))}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment Info */}
        {inv.status === "PAID" && (
          <div className="mb-6 p-4 border-2 border-green-500 rounded text-center">
            <p className="text-green-600 font-bold text-lg">LUNAS</p>
          </div>
        )}

        {/* Notes */}
        {inv.catatan && (
          <div className="mb-6">
            <p className="text-sm font-medium mb-1">Catatan:</p>
            <p className="text-sm text-gray-600">{inv.catatan}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-8 border-t border-gray-200">
          <div className="flex justify-between">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-16">Pelanggan</p>
              <Separator className="w-32 mx-auto" />
              <p className="text-sm mt-1">({customer?.nama ?? customer?.name ?? 'Pelanggan'})</p>
            </div>
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-16">Kasir</p>
              <Separator className="w-32 mx-auto" />
              <p className="text-sm mt-1">(Admin)</p>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-xs text-gray-500">
          <p>Terima kasih atas kepercayaan Anda</p>
          <p>Dokumen ini dicetak secara otomatis oleh sistem AutoService</p>
        </div>
      </div>
    )
  }
)
