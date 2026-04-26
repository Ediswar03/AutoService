"use client"

import * as React from "react"
import {
  Settings,
  Bell,
  Save,
  RotateCcw,
  Package,
} from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GudangHeader } from "@/components/gudang/gudang-header"

export default function GudangSettingsPage() {
  const [hasChanges, setHasChanges] = React.useState(false)

  return (
    <>
      <GudangHeader title="Pengaturan" description="Konfigurasi preferensi inventori gudang" />
      <div className="flex-1 overflow-auto p-6 flex flex-col gap-6">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">Pengaturan Gudang</h1>
            <p className="text-muted-foreground">Konfigurasi preferensi inventori gudang</p>
          </div>
          {hasChanges && (
            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={() => setHasChanges(false)}>
                <RotateCcw className="mr-2 size-4" /> Reset
              </Button>
              <Button onClick={() => setHasChanges(false)}>
                <Save className="mr-2 size-4" /> Simpan Perubahan
              </Button>
            </div>
          )}
        </div>

        <Tabs defaultValue="notifications" className="space-y-6">
          <TabsList className="grid w-full grid-cols-1 lg:w-fit lg:grid-cols-2">
            <TabsTrigger value="notifications" className="gap-2"><Bell className="size-4" /><span className="hidden sm:inline">Notifikasi</span></TabsTrigger>
            <TabsTrigger value="inventory" className="gap-2"><Package className="size-4" /><span className="hidden sm:inline">Inventori</span></TabsTrigger>
          </TabsList>

          <TabsContent value="notifications" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Notifikasi Gudang</CardTitle><CardDescription>Atur kapan Anda menerima notifikasi terkait stok</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                {[
                  { label: "Peringatan Stok Kritis", desc: "Notifikasi saat stok barang mencapai batas kritis", defaultChecked: true },
                  { label: "Permintaan Barang Baru", desc: "Notifikasi saat ada permintaan barang dari mekanik", defaultChecked: true },
                  { label: "Laporan Harian Gudang", desc: "Ringkasan pergerakan stok harian", defaultChecked: true },
                ].map((item, index) => (
                  <React.Fragment key={item.label}>
                    {index > 0 && <Separator />}
                    <div className="flex items-center justify-between">
                      <div className="space-y-0.5"><Label>{item.label}</Label><p className="text-sm text-muted-foreground">{item.desc}</p></div>
                      <Switch defaultChecked={item.defaultChecked} onChange={() => setHasChanges(true)} />
                    </div>
                  </React.Fragment>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="inventory" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Aturan Stok</CardTitle><CardDescription>Pengaturan nilai default untuk batas stok</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5"><Label>Approval Otomatis Permintaan Mekanik</Label><p className="text-sm text-muted-foreground">Permintaan barang dengan jumlah sedikit otomatis disetujui</p></div>
                  <Switch defaultChecked={false} onChange={() => setHasChanges(true)} />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
