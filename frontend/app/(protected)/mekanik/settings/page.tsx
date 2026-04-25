"use client"

import { useState } from "react"
import { Bell, Moon, Sun, Globe, Lock, Shield, ChevronRight, Smartphone, Volume2, Eye, EyeOff, Save } from "lucide-react"
import { cn } from "@/lib/utils"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"

interface SettingToggleProps {
  label: string
  description: string
  checked: boolean
  onCheckedChange: (v: boolean) => void
  icon: React.ElementType
  iconColor?: string
}

function SettingToggle({ label, description, checked, onCheckedChange, icon: Icon, iconColor = "text-zinc-400" }: SettingToggleProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 border-b border-white/5 last:border-0">
      <div className="flex items-center gap-3 flex-1">
        <div className="h-9 w-9 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center shrink-0">
          <Icon className={cn("h-4 w-4", iconColor)} />
        </div>
        <div className="min-w-0">
          <p className="text-sm font-bold text-zinc-200 uppercase tracking-wide">{label}</p>
          <p className="text-[10px] text-zinc-500 font-medium leading-tight mt-0.5">{description}</p>
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
  const [notifications, setNotifications] = useState(true)
  const [sound, setSound] = useState(true)
  const [darkMode, setDarkMode] = useState(true)
  const [vibration, setVibration] = useState(false)
  const [biometric, setBiometric] = useState(false)
  const [showPhone, setShowPhone] = useState(true)

  const [language, setLanguage] = useState<"id" | "en">("id")
  const [saved, setSaved] = useState(false)

  const handleSave = () => {
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  return (
    <div className="space-y-6 pb-8">

      {/* Notifikasi */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2 px-1">
          <Bell className="h-3 w-3 text-primary" /> Notifikasi
        </h4>
        <Card className="bg-zinc-900/60 border-white/5 rounded-2xl overflow-hidden">
          <CardContent className="px-5 py-0">
            <SettingToggle
              label="Notifikasi Push"
              description="Terima pemberitahuan SPK baru dan update status"
              icon={Bell}
              iconColor="text-primary"
              checked={notifications}
              onCheckedChange={setNotifications}
            />
            <SettingToggle
              label="Suara"
              description="Putar suara saat ada notifikasi masuk"
              icon={Volume2}
              iconColor="text-blue-400"
              checked={sound}
              onCheckedChange={setSound}
            />
            <SettingToggle
              label="Getar"
              description="Aktifkan getaran untuk notifikasi"
              icon={Smartphone}
              iconColor="text-emerald-400"
              checked={vibration}
              onCheckedChange={setVibration}
            />
          </CardContent>
        </Card>
      </div>

      {/* Tampilan */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2 px-1">
          <Moon className="h-3 w-3 text-primary" /> Tampilan
        </h4>
        <Card className="bg-zinc-900/60 border-white/5 rounded-2xl overflow-hidden">
          <CardContent className="px-5 py-0">
            <SettingToggle
              label="Mode Gelap"
              description="Gunakan tema gelap pada seluruh aplikasi"
              icon={darkMode ? Moon : Sun}
              iconColor="text-amber-400"
              checked={darkMode}
              onCheckedChange={setDarkMode}
            />
          </CardContent>
        </Card>

        {/* Bahasa */}
        <Card className="bg-zinc-900/60 border-white/5 rounded-2xl overflow-hidden">
          <CardContent className="px-5 py-4">
            <div className="flex items-center gap-3 mb-3">
              <div className="h-9 w-9 rounded-xl bg-zinc-800 border border-white/5 flex items-center justify-center shrink-0">
                <Globe className="h-4 w-4 text-purple-400" />
              </div>
              <div>
                <p className="text-sm font-bold text-zinc-200 uppercase tracking-wide">Bahasa</p>
                <p className="text-[10px] text-zinc-500 font-medium">Pilih bahasa antarmuka</p>
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {[
                { code: "id", label: "🇮🇩  Indonesia" },
                { code: "en", label: "🇺🇸  English" },
              ].map(({ code, label }) => (
                <button
                  key={code}
                  onClick={() => setLanguage(code as "id" | "en")}
                  className={cn(
                    "py-2.5 px-3 rounded-xl text-[11px] font-black uppercase tracking-wider transition-all duration-300 border",
                    language === code
                      ? "bg-primary text-black border-primary shadow-[0_0_20px_rgba(var(--primary),0.3)]"
                      : "bg-zinc-800 text-zinc-400 border-white/5 hover:border-white/10"
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
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2 px-1">
          <Shield className="h-3 w-3 text-primary" /> Privasi & Keamanan
        </h4>
        <Card className="bg-zinc-900/60 border-white/5 rounded-2xl overflow-hidden">
          <CardContent className="px-5 py-0">
            <SettingToggle
              label="Biometrik"
              description="Login menggunakan sidik jari atau wajah"
              icon={Lock}
              iconColor="text-emerald-400"
              checked={biometric}
              onCheckedChange={setBiometric}
            />
            <SettingToggle
              label="Tampilkan No. Telepon"
              description="Izinkan pelanggan melihat nomor Anda"
              icon={showPhone ? Eye : EyeOff}
              iconColor="text-blue-400"
              checked={showPhone}
              onCheckedChange={setShowPhone}
            />
          </CardContent>
        </Card>
      </div>

      {/* Lainnya */}
      <div className="space-y-2">
        <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 px-1">Lainnya</h4>
        <Card className="bg-zinc-900/60 border-white/5 rounded-2xl overflow-hidden">
          <CardContent className="p-0">
            {[
              { label: "Syarat & Ketentuan", href: "#" },
              { label: "Kebijakan Privasi", href: "#" },
              { label: "Tentang Aplikasi", href: "#" },
            ].map((item) => (
              <button
                key={item.label}
                className="w-full flex items-center justify-between px-5 py-4 text-zinc-300 hover:text-white hover:bg-white/5 transition-all border-b border-white/5 last:border-0 group"
              >
                <span className="text-sm font-bold uppercase tracking-wide">{item.label}</span>
                <ChevronRight className="h-4 w-4 text-zinc-600 group-hover:text-primary group-hover:translate-x-0.5 transition-all" />
              </button>
            ))}
          </CardContent>
        </Card>
      </div>

      {/* Versi */}
      <p className="text-center text-[10px] font-mono text-zinc-700 tracking-widest uppercase">
        AutoService Mekanik • v1.0.0
      </p>

      {/* Simpan */}
      <Button
        onClick={handleSave}
        className={cn(
          "w-full h-14 rounded-2xl font-black uppercase tracking-[0.15em] text-sm transition-all duration-300",
          saved
            ? "bg-emerald-500 text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]"
            : "bg-primary text-black shadow-[0_4px_25px_rgba(var(--primary),0.3)] hover:brightness-110"
        )}
      >
        <Save className="h-4 w-4 mr-2" />
        {saved ? "Tersimpan ✓" : "Simpan Pengaturan"}
      </Button>
    </div>
  )
}
