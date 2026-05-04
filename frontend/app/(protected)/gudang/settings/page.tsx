"use client"

import * as React from "react"
import {
  Settings,
  Bell,
  Save,
  RotateCcw,
  Package,
  Moon,
  Sun,
} from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GudangHeader } from "@/components/gudang/gudang-header"

export default function GudangSettingsPage() {
  const { theme, setTheme } = useTheme()
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
            <TabsTrigger value="appearance" className="gap-2"><Moon className="size-4" /><span className="hidden sm:inline">Tampilan</span></TabsTrigger>
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
          <TabsContent value="appearance" className="space-y-6">
            <Card>
              <CardHeader><CardTitle>Tampilan Gudang</CardTitle><CardDescription>Atur preferensi tema untuk dashboard Gudang</CardDescription></CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Mode Gelap</Label>
                    <p className="text-sm text-muted-foreground">Ubah tampilan dashboard gudang menjadi gelap</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Sun className="h-4 w-4 text-muted-foreground" />
                    <Switch
                      checked={theme === "dark"}
                      onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                    />
                    <Moon className="h-4 w-4 text-muted-foreground" />
                  </div>
                </div>
                <Separator />
                <div className="rounded-lg border p-4 bg-muted/30 flex items-start gap-3">
                  <div className="h-8 w-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                    <Sun className="h-4 w-4 text-primary" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-sm font-medium leading-none">Sinkronisasi Lokal</p>
                    <p className="text-xs text-muted-foreground">
                      Pengaturan tema ini disimpan secara lokal dan hanya berlaku untuk dashboard Gudang.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </>
  )
}
