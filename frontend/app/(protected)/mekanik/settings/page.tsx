"use client"

import { useState, useEffect } from "react"
import { Bell, Moon, Sun, Globe, Lock, Shield, ChevronRight, Smartphone, Volume2, Eye, EyeOff, Save, Loader2, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Input } from "@/components/ui/input"
import { useTheme } from "next-themes"
import { toast } from "sonner"
import { useAuth } from "@/hooks/useAuth"
import { apiClient } from "@/lib/api-client"

interface SettingToggleProps {
  label: string
  description: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
  icon: React.ElementType
  iconColor?: string
}

function SettingToggle({ label, description, checked, onCheckedChange, icon: Icon, iconColor = "text-slate-400 dark:text-zinc-400" }: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-slate-100 dark:border-white/5 last:border-0">
      <div className="flex items-center gap-3 flex-1">
        <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-white/5 flex items-center justify-center shrink-0 shadow-sm dark:shadow-none">
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">{label}</p>
          <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-medium leading-tight mt-0.5">{description}</p>
        </div>
      </div>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        className="data-[state=checked]:bg-primary shrink-0"
      />
    </div>
  )
}

export default function SettingsPage() {
  const { user, refreshUser, logout } = useAuth()
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Local State for settings (some are local only, some synced)
  const [settings, setSettings] = useState({
    notifications: true,
    sound: true,
    vibration: false,
    biometric: false,
    showPhone: true,
    language: "id" as "id" | "en",
    // User profile data
    name: "",
    phone: "",
    address: ""
  })

  const [isSaving, setIsSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  // Sync with user data on mount
  useEffect(() => {
    setMounted(true)
    if (user) {
      setSettings(prev => ({
        ...prev,
        name: user.name || "",
        phone: user.phone || "",
        address: user.address || "",
      }))
    }
    
    const stored = localStorage.getItem("mekanik_local_settings")
    if (stored) {
      try {
        const localData = JSON.parse(stored)
        setSettings(prev => ({ ...prev, ...localData }))
      } catch (e) {
        console.error("Failed to parse local settings", e)
      }
    }
  }, [user])

  const handleToggle = (key: keyof typeof settings) => (value: boolean | string) => {
    setSettings(prev => ({ ...prev, [key]: value }))
  }

  const handleSave = async () => {
    setIsSaving(true)
    try {
      // 1. Save profile to backend
      await apiClient.patch('/auth/profile', {
        name: settings.name,
        phone: settings.phone,
        address: settings.address,
      })
      
      // 2. Save local-only settings to localStorage
      const localOnly = {
        notifications: settings.notifications,
        sound: settings.sound,
        vibration: settings.vibration,
        biometric: settings.biometric,
        language: settings.language,
      }
      localStorage.setItem("mekanik_local_settings", JSON.stringify(localOnly))
      
      await refreshUser()
      setSaved(true)
      toast.success("Pengaturan berhasil disimpan!")
      setTimeout(() => setSaved(false), 3000)
    } catch (error) {
      toast.error("Gagal menyimpan pengaturan")
    } finally {
      setIsSaving(false)
    }
  }

  if (!mounted) return null

  const isDark = resolvedTheme === "dark"

  return (
    <div className="space-y-6 pb-12 pt-2">
      {/* Profil Saya */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-600 flex items-center gap-2 px-1">
          <Shield className="h-3 w-3 text-primary" /> Profil Saya
        </h4>
        <Card className="bg-white/80 dark:bg-zinc-900/60 border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
          <CardContent className="px-5 py-5 space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">Nama Lengkap</label>
              <Input 
                value={settings.name}
                onChange={(e) => setSettings(prev => ({ ...prev, name: e.target.value }))}
                className="bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-white/5 rounded-xl text-sm h-11"
                placeholder="Nama Anda"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">Nomor Telepon</label>
              <Input 
                value={settings.phone}
                onChange={(e) => setSettings(prev => ({ ...prev, phone: e.target.value }))}
                className="bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-white/5 rounded-xl text-sm h-11"
                placeholder="0812..."
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 dark:text-zinc-500 ml-1">Alamat</label>
              <Input 
                value={settings.address}
                onChange={(e) => setSettings(prev => ({ ...prev, address: e.target.value }))}
                className="bg-slate-50 dark:bg-zinc-950 border-slate-200 dark:border-white/5 rounded-xl text-sm h-11"
                placeholder="Alamat Lengkap"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Notifikasi */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-600 flex items-center gap-2 px-1">
          <Bell className="h-3 w-3 text-primary" /> Notifikasi
        </h4>
        <Card className="bg-white/80 dark:bg-zinc-900/60 border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
          <CardContent className="px-5 py-0">
            <SettingToggle
              label="Notifikasi Push"
              description="Terima pemberitahuan SPK baru dan update status"
              icon={Bell}
              iconColor="text-primary"
              checked={settings.notifications}
              onCheckedChange={handleToggle("notifications")}
            />
            <SettingToggle
              label="Suara"
              description="Putar suara saat ada notifikasi masuk"
              icon={Volume2}
              iconColor="text-blue-500 dark:text-blue-400"
              checked={settings.sound}
              onCheckedChange={handleToggle("sound")}
            />
            <SettingToggle
              label="Getar"
              description="Aktifkan getaran untuk notifikasi"
              icon={Smartphone}
              iconColor="text-emerald-500 dark:text-emerald-400"
              checked={settings.vibration}
              onCheckedChange={handleToggle("vibration")}
            />
          </CardContent>
        </Card>
      </div>

      {/* Tampilan */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-600 flex items-center gap-2 px-1">
          <Moon className="h-3 w-3 text-primary" /> Tampilan
        </h4>
        <Card className="bg-white/80 dark:bg-zinc-900/60 border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
          <CardContent className="px-5 py-0">
            <div className="flex items-center justify-between gap-4 py-4">
              <div className="flex items-center gap-3 flex-1">
                <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-white/5 flex items-center justify-center shrink-0 shadow-sm dark:shadow-none">
                  {isDark ? <Moon className="h-4 w-4 text-amber-500" /> : <Sun className="h-4 w-4 text-amber-500" />}
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">Mode Gelap</p>
                  <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-medium leading-tight mt-0.5">Ubah tampilan aplikasi menjadi gelap</p>
                </div>
              </div>
              <Switch
                checked={isDark}
                onCheckedChange={(val) => setTheme(val ? "dark" : "light")}
                className="data-[state=checked]:bg-primary shrink-0"
              />
            </div>
          </CardContent>
        </Card>

        {/* Bahasa */}
        <Card className="bg-white/80 dark:bg-zinc-900/60 border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
          <CardContent className="px-5 py-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-white/5 flex items-center justify-center shrink-0 shadow-sm dark:shadow-none">
                <Globe className="h-4 w-4 text-purple-500 dark:text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-800 dark:text-zinc-200 uppercase tracking-wide">Bahasa</p>
                <p className="text-[10px] text-slate-500 dark:text-zinc-500 font-medium">Pilih bahasa antarmuka</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { code: "id", label: "🇮🇩  Indonesia" },
                { code: "en", label: "🇺🇸  English" },
              ].map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => handleToggle("language")(code)}
                  className={cn(
                    "py-2 px-3 rounded-xl text-[10px] font-black uppercase tracking-wider transition-all duration-300 border",
                    settings.language === code
                      ? "bg-primary text-primary-foreground border-primary shadow-[0_0_20px_rgba(var(--primary),0.2)]"
                      : "bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 border-slate-200 dark:border-white/5 hover:border-primary/30 dark:hover:border-white/10"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Privasi & Keamanan */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-600 flex items-center gap-2 px-1">
          <Shield className="h-3 w-3 text-primary" /> Privasi & Keamanan
        </h4>
        <Card className="bg-white/80 dark:bg-zinc-900/60 border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
          <CardContent className="px-5 py-0">
            <SettingToggle
              label="Biometrik"
              description="Login menggunakan sidik jari atau wajah"
              icon={Lock}
              iconColor="text-emerald-500 dark:text-emerald-400"
              checked={settings.biometric}
              onCheckedChange={handleToggle("biometric")}
            />
            <SettingToggle
              label="Tampilkan No. Telepon"
              description="Izinkan pelanggan melihat nomor Anda"
              icon={settings.showPhone ? Eye : EyeOff}
              iconColor="text-blue-500 dark:text-blue-400"
              checked={settings.showPhone}
              onCheckedChange={handleToggle("showPhone")}
            />
          </CardContent>
        </Card>
      </div>

      {/* Lainnya */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-600 px-1">Lainnya</h4>
        <Card className="bg-white/80 dark:bg-zinc-900/60 border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
          <CardContent className="p-0">
            {[
              { label: "Bantuan & Dukungan", onClick: () => toast.info("Fitur bantuan segera hadir") },
              { label: "Syarat & Ketentuan", onClick: () => toast.info("Syarat & Ketentuan") },
              { label: "Kebijakan Privasi", onClick: () => toast.info("Kebijakan Privasi") },
            ].map((item) => (
              <button
                key={item.label}
                onClick={item.onClick}
                className="w-full flex items-center justify-between px-5 py-4 text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-white/5 transition-all border-b border-slate-100 dark:border-white/5 last:border-0 group"
              >
                <span className="text-sm font-bold uppercase tracking-wide">{item.label}</span>
                <ChevronRight className="h-4 w-4 text-slate-400 dark:text-zinc-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
            
            {/* Logout Button */}
            <button
              onClick={() => logout()}
              className="w-full flex items-center justify-between px-5 py-4 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 transition-all group"
            >
              <div className="flex items-center gap-2">
                <span className="text-sm font-black uppercase tracking-widest">KELUAR AKUN</span>
              </div>
              <ChevronRight className="h-4 w-4 opacity-50 group-hover:translate-x-0.5 transition-all" />
            </button>
          </CardContent>
        </Card>
      </div>

      {/* Simpan Pengaturan (In-flow button) */}
      <div className="pt-4 flex justify-center">
        <Button
          onClick={handleSave}
          disabled={isSaving}
          className={cn(
            "h-11 px-10 rounded-full font-black uppercase tracking-[0.15em] text-[10px] transition-all duration-500 shadow-lg relative overflow-hidden group",
            saved
              ? "bg-emerald-500 text-white shadow-emerald-500/20 hover:bg-emerald-500"
              : "bg-primary text-primary-foreground hover:brightness-105 active:scale-95 border-b-2 border-black/10 dark:border-black/20"
          )}
        >
          <div className="absolute inset-0 bg-white/10 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          
          <span className="relative z-10 flex items-center justify-center gap-2">
            {isSaving ? (
              <>
                <Loader2 className="h-3 w-3 animate-spin" />
                MENYIMPAN...
              </>
            ) : saved ? (
              <>
                <CheckCircle2 className="h-3.5 w-3.5" />
                BERHASIL DISIMPAN
              </>
            ) : (
              <>
                <Save className="h-3.5 w-3.5" />
                SIMPAN PENGATURAN
              </>
            )}
          </span>
        </Button>
      </div>

      {/* Versi */}
      <p className="text-center text-[10px] font-mono text-slate-400 dark:text-zinc-700 tracking-widest uppercase transition-colors py-4">
        AutoService Mekanik • v1.0.0
      </p>
    </div>
  )
}
