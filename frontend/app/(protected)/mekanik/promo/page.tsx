"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Sparkles, Gift, ShieldCheck, Clock } from "lucide-react"

export default function MekanikPromoPage() {
  return (
    <div className="space-y-6">
      <div className="space-y-1">
        <h2 className="text-3xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white leading-none">
          Promo <span className="text-primary">Terbaru</span>
        </h2>
        <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Detail penawaran untuk pelanggan</p>
      </div>

      <div className="grid gap-4">
        {/* Promo 1 */}
        <Card className="overflow-hidden border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 rounded-3xl shadow-sm">
          <div className="bg-primary/10 px-5 py-3 border-b border-primary/10 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[10px] font-black text-primary uppercase tracking-widest">
              <Sparkles className="h-3 w-3" /> Flash Deal
            </span>
            <span className="flex items-center gap-1 text-[9px] font-bold text-slate-500 uppercase">
              <Clock className="h-3 w-3" /> Berakhir 31 Mei
            </span>
          </div>
          <CardContent className="p-5 space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Diskon Servis 20%</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Berlaku untuk seluruh jasa servis berkala di bengkel kami.</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-black/30 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Syarat & Ketentuan:</p>
              <ul className="space-y-2">
                {[
                  "Berlaku untuk Jasa Servis saja",
                  "Minimal transaksi Rp 500.000",
                  "Tunjukkan kode promo saat pendaftaran",
                  "Tidak dapat digabung promo lain"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] font-medium text-slate-700 dark:text-zinc-300">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>

        {/* Promo 2 */}
        <Card className="overflow-hidden border-slate-200 dark:border-white/5 bg-white dark:bg-zinc-900/50 rounded-3xl shadow-sm">
          <div className="bg-emerald-500/10 px-5 py-3 border-b border-emerald-500/10 flex items-center justify-between">
            <span className="flex items-center gap-1.5 text-[10px] font-black text-emerald-600 dark:text-emerald-500 uppercase tracking-widest">
              <Gift className="h-3 w-3" /> Paket Bundling
            </span>
          </div>
          <CardContent className="p-5 space-y-4">
            <div>
              <h3 className="text-xl font-black text-slate-900 dark:text-white uppercase italic tracking-tight">Gratis Ganti Oli</h3>
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">Setiap pengambilan Paket Servis Besar (Tune Up + Gurah Mesin).</p>
            </div>
            
            <div className="bg-slate-50 dark:bg-black/30 rounded-2xl p-4 border border-slate-100 dark:border-white/5">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Benefit:</p>
              <ul className="space-y-2">
                {[
                  "Oli Mesin Standar (4 Liter)",
                  "Filter Oli Gratis",
                  "Pengecekan 21 Titik Kendaraan",
                  "Cuci Mesin Ringan"
                ].map((item, i) => (
                  <li key={i} className="flex items-start gap-2 text-[11px] font-medium text-slate-700 dark:text-zinc-300">
                    <ShieldCheck className="h-3.5 w-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
