"use client"

import * as React from "react"
import { AdminHeader } from "@/components/admin/admin-header"
import { PimpinanHeader } from "@/components/pimpinan/pimpinan-header"
import { MekanikHeader } from "@/components/mekanik/mekanik-header"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { usePathname } from "next/navigation"

export default function PromoPage() {
  const pathname = usePathname()
  
  // Conditionally render header if we decide to share this component
  // but since it's mounted in /admin/promo, we just rely on the admin layout basically.
  
  return (
    <>
      <AdminHeader title="Spesial Promo" description="Detail promo dan diskon berjalan" />
      <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-[#FFC107]">DISKON SERVIS 20%</h1>
          <p className="text-muted-foreground mt-2">Dapatkan diskon untuk semua servis kendaraan. Berlaku hingga 31 Mei 2024.</p>
        </div>
        
        <Card>
          <CardHeader>
            <CardTitle>Syarat & Ketentuan</CardTitle>
            <CardDescription>Beri tahu pelanggan mengenai syarat diskon</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <ul className="list-disc list-inside space-y-2 text-slate-700">
              <li>Promo diskon 20% berlaku bagi seluruh pelanggan yang terdaftar.</li>
              <li>Hanya berlaku untuk biaya Jasa Servis, tidak termasuk penggantian Spareparts.</li>
              <li>Pelanggan wajib menunjukkan kode pada admin ketika mendaftar servis.</li>
              <li>Promo tidak dapat digabungkan dengan promo menarik lainnya.</li>
            </ul>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
