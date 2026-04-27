"use client"

import { forwardRef } from "react"
import { Separator } from "@/components/ui/separator"
import {
  getCustomerById,
  getSPKById,
  getVehicleById,
  formatCurrency,
  formatDate,
} from "@/lib/mock-data"
import type { Invoice } from "@/types"

interface InvoicePrintTemplateProps {
  invoice: Invoice
}

export const InvoicePrintTemplate = forwardRef<HTMLDivElement, InvoicePrintTemplateProps>(
  function InvoicePrintTemplate({ invoice }, ref) {
    const spk = getSPKById(invoice.spk_id)
    // The invoice object from the backend/Prisma usually follows the schema in types/index.ts
    const customer = invoice.spk?.customer || getCustomerById(invoice.spk?.customer_id || 0)
    const vehicle = invoice.spk?.vehicle || (invoice.spk?.vehicle_id ? getVehicleById(invoice.spk.vehicle_id) : null)

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
              <span className="text-gray-600">No. Invoice:</span> {invoice.nomor_invoice}
            </p>
            <p className="text-sm">
              <span className="text-gray-600">No. SPK:</span> {invoice.spk?.nomor_spk || "-"}
            </p>
            <p className="text-sm">
              <span className="text-gray-600">Tanggal:</span> {formatDate(invoice.created_at)}
            </p>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium mb-1">Kepada:</p>
            <p className="font-bold">{customer?.nama || 'Pelanggan'}</p>
            <p className="text-sm text-gray-600">{customer?.telepon || '-'}</p>
            <p className="text-sm text-gray-600 max-w-[200px]">{customer?.alamat || '-'}</p>
          </div>
        </div>

        {/* Vehicle Info */}
        {vehicle && (
          <div className="mb-6 p-3 bg-gray-50 rounded">
            <p className="text-sm font-medium mb-1">Kendaraan:</p>
            <p className="font-mono">{vehicle.nomor_polisi}</p>
            <p className="text-sm text-gray-600">
              {vehicle.merk} {vehicle.model} ({vehicle.tahun}) - {vehicle.warna}
            </p>
          </div>
        )}

        {/* Services Table */}
        {invoice.spk?.items && invoice.spk.items.filter(i => i.tipe === 'jasa').length > 0 && (
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
                {invoice.spk.items.filter(i => i.tipe === 'jasa').map((item: any) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-2">{item.nama_item}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-right">{formatCurrency(item.harga_satuan)}</td>
                    <td className="py-2 text-right">
                      {formatCurrency(item.subtotal)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Parts Table */}
        {invoice.spk?.items && invoice.spk.items.filter(i => i.tipe === 'sparepart').length > 0 && (
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
                {invoice.spk.items.filter(i => i.tipe === 'sparepart').map((item: any) => (
                  <tr key={item.id} className="border-b border-gray-200">
                    <td className="py-2">{item.nama_item}</td>
                    <td className="py-2 text-center">{item.quantity}</td>
                    <td className="py-2 text-right">{formatCurrency(item.harga_satuan)}</td>
                    <td className="py-2 text-right">
                      {formatCurrency(item.subtotal)}
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
              <span>{formatCurrency(invoice.total_jasa)}</span>
            </div>
            <div className="flex justify-between py-1 text-sm">
              <span>Subtotal Sparepart</span>
              <span>{formatCurrency(invoice.total_sparepart)}</span>
            </div>
            {invoice.diskon > 0 && (
              <div className="flex justify-between py-1 text-sm text-red-600">
                <span>Diskon</span>
                <span>-{formatCurrency(invoice.diskon)}</span>
              </div>
            )}
            <div className="flex justify-between py-1 text-sm">
              <span>PPN (11%)</span>
              <span>{formatCurrency(invoice.ppn)}</span>
            </div>
            <Separator className="my-2" />
            <div className="flex justify-between py-1 font-bold text-lg">
              <span>Total</span>
              <span>{formatCurrency(invoice.grand_total)}</span>
            </div>
            {invoice.jumlah_dibayar > 0 && (
              <>
                <div className="flex justify-between py-1 text-sm text-green-600">
                  <span>Dibayar</span>
                  <span>-{formatCurrency(invoice.jumlah_dibayar)}</span>
                </div>
                <div className="flex justify-between py-1 font-bold">
                  <span>Sisa</span>
                  <span>{formatCurrency(invoice.sisa_bayar)}</span>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Payment Info */}
        {invoice.status === "paid" && (
          <div className="mb-6 p-4 border-2 border-green-500 rounded text-center">
            <p className="text-green-600 font-bold text-lg">LUNAS</p>
          </div>
        )}

        {/* Notes */}
        {invoice.catatan && (
          <div className="mb-6">
            <p className="text-sm font-medium mb-1">Catatan:</p>
            <p className="text-sm text-gray-600">{invoice.catatan}</p>
          </div>
        )}

        {/* Footer */}
        <div className="mt-auto pt-8 border-t border-gray-200">
          <div className="flex justify-between">
            <div className="text-center">
              <p className="text-sm text-gray-600 mb-16">Pelanggan</p>
              <Separator className="w-32 mx-auto" />
              <p className="text-sm mt-1">({customer?.nama || 'Pelanggan'})</p>
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
