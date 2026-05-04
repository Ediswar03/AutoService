"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Save, Building2, Wrench, Receipt, Bell, Moon, Sun, Plus, Loader2 } from "lucide-react"
import { useTheme } from "next-themes"
import { AdminHeader } from "@/components/admin/AdminHeader"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Separator } from "@/components/ui/separator"
import { FieldGroup, Field, FieldLabel } from "@/components/ui/field"
import { useApiPaginated } from "@/hooks/useApi"
import type { User, Setting } from "@/types"
import useSWR from "swr"
import { fetcher, api } from "@/lib/api-client"
import { toast } from "sonner"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const { data: mechanics } = useApiPaginated<User>('/users', 1, 100, { role: 'MEKANIK' })
  const { data: settings, mutate } = useSWR<Setting[]>('/settings', fetcher)
  const [isSaving, setIsSaving] = useState(false)

  const [businessSettings, setBusinessSettings] = useState({
    name: "AutoServis",
    tagline: "Bengkel Otomotif Terpercaya",
    address: "Jl. Raya Utama No. 123, Jakarta Selatan",
    phone: "021-5551234",
    email: "info@autoservis.id",
    taxRate: 11,
    invoicePrefix: "INV",
    spkPrefix: "SPK",
  })

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    spkReminders: true,
    paymentAlerts: true,
    dailyReports: false,
  })

  // Sync state with fetched settings
  useEffect(() => {
    if (settings) {
      const getVal = (key: string, def: string) => settings.find(s => s.key === key)?.value || def
      
      setBusinessSettings({
        name: getVal('business_name', "AutoServis"),
        tagline: getVal('business_tagline', "Bengkel Otomotif Terpercaya"),
        address: getVal('business_address', "Jl. Raya Utama No. 123, Jakarta Selatan"),
        phone: getVal('business_phone', "021-5551234"),
        email: getVal('business_email', "info@autoservis.id"),
        taxRate: parseInt(getVal('tax_rate', "11")),
        invoicePrefix: getVal('invoice_prefix', "INV"),
        spkPrefix: getVal('spk_prefix', "SPK"),
      })
    }
  }, [settings])

  const handleSaveSettings = async () => {
    setIsSaving(true)
    try {
      const settingsPayload = [
        { key: 'business_name', value: businessSettings.name, group: 'BUSINESS' },
        { key: 'business_tagline', value: businessSettings.tagline, group: 'BUSINESS' },
        { key: 'business_address', value: businessSettings.address, group: 'BUSINESS' },
        { key: 'business_phone', value: businessSettings.phone, group: 'BUSINESS' },
        { key: 'business_email', value: businessSettings.email, group: 'BUSINESS' },
        { key: 'tax_rate', value: businessSettings.taxRate.toString(), group: 'FINANCE' },
        { key: 'invoice_prefix', value: businessSettings.invoicePrefix, group: 'FINANCE' },
        { key: 'spk_prefix', value: businessSettings.spkPrefix, group: 'WORK_ORDER' },
      ]

      await api.post('/settings/bulk', { settings: settingsPayload })
      await mutate()
      toast.success("Pengaturan berhasil disimpan!")
    } catch (error) {
      console.error(error)
      toast.error("Gagal menyimpan pengaturan")
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <>
      <AdminHeader title="Pengaturan" description="Kelola pengaturan sistem AutoServis" />

      <div className="flex-1 overflow-auto p-6">
        <div className="mx-auto max-w-4xl">
          <Tabs defaultValue="business" className="space-y-6">
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="business" className="gap-2">
                <Building2 className="size-4" />
                <span className="hidden sm:inline">Bisnis</span>
              </TabsTrigger>
              <TabsTrigger value="mechanics" className="gap-2">
                <Wrench className="size-4" />
                <span className="hidden sm:inline">Mekanik</span>
              </TabsTrigger>
              <TabsTrigger value="invoices" className="gap-2">
                <Receipt className="size-4" />
                <span className="hidden sm:inline">Finance</span>
              </TabsTrigger>
              <TabsTrigger value="notifications" className="gap-2">
                <Bell className="size-4" />
                <span className="hidden sm:inline">Notifikasi</span>
              </TabsTrigger>
              <TabsTrigger value="appearance" className="gap-2">
                <Moon className="size-4" />
                <span className="hidden sm:inline">Tampilan</span>
              </TabsTrigger>
            </TabsList>

            {/* Business Settings */}
            <TabsContent value="business">
              <Card>
                <CardHeader>
                  <CardTitle>Informasi Bisnis</CardTitle>
                  <CardDescription>
                    Pengaturan dasar informasi bengkel Anda
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <Field>
                      <FieldLabel htmlFor="businessName">Nama Bengkel</FieldLabel>
                      <Input
                        id="businessName"
                        value={businessSettings.name}
                        onChange={(e) =>
                          setBusinessSettings({ ...businessSettings, name: e.target.value })
                        }
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="tagline">Tagline</FieldLabel>
                      <Input
                        id="tagline"
                        value={businessSettings.tagline}
                        onChange={(e) =>
                          setBusinessSettings({ ...businessSettings, tagline: e.target.value })
                        }
                      />
                    </Field>

                    <Field>
                      <FieldLabel htmlFor="address">Alamat</FieldLabel>
                      <Textarea
                        id="address"
                        value={businessSettings.address}
                        onChange={(e) =>
                          setBusinessSettings({ ...businessSettings, address: e.target.value })
                        }
                        rows={2}
                      />
                    </Field>

                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="phone">Telepon</FieldLabel>
                        <Input
                          id="phone"
                          value={businessSettings.phone}
                          onChange={(e) =>
                            setBusinessSettings({ ...businessSettings, phone: e.target.value })
                          }
                        />
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="email">Email</FieldLabel>
                        <Input
                          id="email"
                          type="email"
                          value={businessSettings.email}
                          onChange={(e) =>
                            setBusinessSettings({ ...businessSettings, email: e.target.value })
                          }
                        />
                      </Field>
                    </div>

                    <Button onClick={handleSaveSettings} disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                      Simpan Perubahan
                    </Button>
                  </FieldGroup>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Mechanics Management */}
            <TabsContent value="mechanics">
              <Card>
                <CardHeader>
                  <CardTitle>Daftar Mekanik</CardTitle>
                  <CardDescription>Kelola data mekanik bengkel</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(mechanics || []).map((mechanic: any) => (
                      <div
                        key={mechanic.id}
                        className="flex items-center justify-between p-4 rounded-lg border"
                      >
                        <div className="flex items-center gap-4">
                          <div className="flex size-10 items-center justify-center rounded-full bg-primary/10 text-primary font-medium">
                            {(mechanic.name ?? mechanic.nama ?? "M").charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <p className="font-medium">{mechanic.name ?? mechanic.nama}</p>
                            <p className="text-sm text-muted-foreground">
                              {mechanic.role} | {mechanic.phone ?? mechanic.telepon ?? '-'}
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-4">
                          <span
                            className={`inline-flex items-center rounded-full px-2 py-1 text-xs font-medium ${
                              (mechanic.is_active ?? mechanic.isActive)
                                ? "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400"
                                : "bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400"
                            }`}
                          >
                            {(mechanic.is_active ?? mechanic.isActive)
                              ? "Aktif"
                              : "Tidak Aktif"}
                          </span>
                          <Button asChild variant="outline" size="sm">
                            <Link href="/admin/mechanics">
                              Edit
                            </Link>
                          </Button>
                        </div>
                      </div>
                    ))}
                    <Button asChild className="w-full bg-orange-500 hover:bg-orange-600 text-white border-none shadow-sm">
                      <Link href="/admin/mechanics">
                        <Plus className="mr-2 size-4" /> Tambah Mekanik Baru
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Invoice Settings */}
            <TabsContent value="invoices">
              <Card>
                <CardHeader>
                  <CardTitle>Pengaturan Finance</CardTitle>
                  <CardDescription>
                    Konfigurasi format nomor dan pengaturan keuangan
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <FieldGroup>
                    <div className="grid grid-cols-2 gap-4">
                      <Field>
                        <FieldLabel htmlFor="invoicePrefix">Prefix Invoice</FieldLabel>
                        <Input
                          id="invoicePrefix"
                          value={businessSettings.invoicePrefix}
                          onChange={(e) =>
                            setBusinessSettings({
                              ...businessSettings,
                              invoicePrefix: e.target.value,
                            })
                          }
                          placeholder="INV"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Contoh: {businessSettings.invoicePrefix}/2024/03/001
                        </p>
                      </Field>

                      <Field>
                        <FieldLabel htmlFor="spkPrefix">Prefix SPK</FieldLabel>
                        <Input
                          id="spkPrefix"
                          value={businessSettings.spkPrefix}
                          onChange={(e) =>
                            setBusinessSettings({
                              ...businessSettings,
                              spkPrefix: e.target.value,
                            })
                          }
                          placeholder="SPK"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Contoh: {businessSettings.spkPrefix}/2024/03/001
                        </p>
                      </Field>
                    </div>

                    <Field>
                      <FieldLabel htmlFor="taxRate">Tarif Pajak (%)</FieldLabel>
                      <Input
                        id="taxRate"
                        type="number"
                        min={0}
                        max={100}
                        value={businessSettings.taxRate}
                        onChange={(e) =>
                          setBusinessSettings({
                            ...businessSettings,
                            taxRate: parseInt(e.target.value) || 0,
                          })
                        }
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Pajak akan diterapkan otomatis ke setiap invoice
                      </p>
                    </Field>

                    <Separator />

                    <div className="p-4 rounded-lg bg-muted/30">
                      <h4 className="font-medium mb-2">Template Invoice</h4>
                      <p className="text-sm text-muted-foreground mb-4">
                        Preview template invoice yang akan dicetak
                      </p>
                      <Button variant="outline" size="sm">
                        Preview Template
                      </Button>
                    </div>

                    <Button onClick={handleSaveSettings} disabled={isSaving}>
                      {isSaving ? <Loader2 className="mr-2 size-4 animate-spin" /> : <Save className="mr-2 size-4" />}
                      Simpan Perubahan
                    </Button>
                  </FieldGroup>
                </CardContent>
              </Card>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications">
              <Card>
                <CardHeader>
                  <CardTitle>Pengaturan Notifikasi</CardTitle>
                  <CardDescription>
                    Atur preferensi notifikasi sistem
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Notifikasi Email</p>
                        <p className="text-sm text-muted-foreground">
                          Terima notifikasi melalui email
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.emailNotifications}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            emailNotifications: checked,
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Pengingat SPK</p>
                        <p className="text-sm text-muted-foreground">
                          Notifikasi untuk SPK yang mendekati deadline
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.spkReminders}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            spkReminders: checked,
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Alert Pembayaran</p>
                        <p className="text-sm text-muted-foreground">
                          Notifikasi untuk invoice yang belum dibayar
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.paymentAlerts}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            paymentAlerts: checked,
                          })
                        }
                      />
                    </div>

                    <Separator />

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium">Laporan Harian</p>
                        <p className="text-sm text-muted-foreground">
                          Terima ringkasan harian via email
                        </p>
                      </div>
                      <Switch
                        checked={notificationSettings.dailyReports}
                        onCheckedChange={(checked) =>
                          setNotificationSettings({
                            ...notificationSettings,
                            dailyReports: checked,
                          })
                        }
                      />
                    </div>

                    <Button onClick={() => toast.info("Fitur notifikasi segera hadir!")}>
                      <Save className="mr-2 size-4" />
                      Simpan Perubahan
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            {/* Appearance Settings */}
            <TabsContent value="appearance">
              <Card>
                <CardHeader>
                  <CardTitle>Tampilan Sistem</CardTitle>
                  <CardDescription>
                    Atur preferensi tema untuk dashboard Admin
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <p className="font-medium">Mode Gelap</p>
                      <p className="text-sm text-muted-foreground">
                        Gunakan tema gelap untuk mengurangi kelelahan mata
                      </p>
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
                        Pengaturan tema ini disimpan secara lokal di browser Anda dan hanya berlaku untuk dashboard Admin.
                      </p>
                    </div>
                  </div>

                  <Button onClick={() => toast.success("Tema berhasil diterapkan!")}>
                    <Save className="mr-2 size-4" />
                    Simpan Preferensi
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  )
}
