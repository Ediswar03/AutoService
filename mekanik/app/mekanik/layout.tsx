"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname } from "next/navigation"
import { Home, ClipboardList, Package, History, User, Wrench, Bell, ChevronLeft } from "lucide-react"
import { cn } from "@/lib/utils"

const navItems = [
  { icon: Home, label: "Home", href: "/mekanik" },
  { icon: ClipboardList, label: "Jobs", href: "/mekanik/jobs" },
  { icon: Package, label: "Parts", href: "/mekanik/parts-request" },
  { icon: History, label: "History", href: "/mekanik/history" },
  { icon: User, label: "Profile", href: "/mekanik/profile" },
]

function MekanikHeader() {
  const pathname = usePathname()
  const isSubPage = pathname.split("/").filter(Boolean).length > 2

  const getTitle = () => {
    if (pathname === "/mekanik") return "Dashboard"
    if (pathname.includes("/inspection")) return "Pemeriksaan"
    if (pathname.match(/\/jobs\/[^/]+$/)) return "Detail SPK"
    if (pathname.includes("/jobs")) return "Daftar SPK"
    if (pathname.includes("/parts-request")) return "Permintaan Parts"
    if (pathname.includes("/history")) return "Riwayat"
    if (pathname.includes("/settings")) return "Pengaturan"
    if (pathname.includes("/certifications")) return "Sertifikasi"
    if (pathname.includes("/profile")) return "Profil"
    return "AutoServis"
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 flex justify-center pointer-events-none">
      <div className="w-full max-w-md bg-black/80 backdrop-blur-2xl border-b border-white/5 h-14 flex items-center justify-between px-5 pointer-events-auto shadow-xl">
        <div className="flex items-center gap-4">
          {isSubPage ? (
            <Link href="/mekanik" className="p-2 -ml-2 hover:bg-white/5 rounded-xl transition-all duration-300 active:scale-95 group">
              <ChevronLeft className="h-5 w-5 text-primary group-hover:-translate-x-0.5 transition-transform" />
            </Link>
          ) : (
            <div className="flex items-center gap-3">
              <div className="h-8 w-8 relative drop-shadow-[0_0_10px_rgba(var(--primary),0.4)]">
                <Image src="/Logo.png" alt="Logo" fill className="object-contain" priority />
              </div>
              <div className="h-5 w-[1px] bg-white/10 hidden sm:block" />
            </div>
          )}
          <h1 className="font-extrabold text-[15px] tracking-[0.05em] uppercase italic text-zinc-100 flex items-center gap-1.5">
            {getTitle()}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="p-2 hover:bg-white/5 rounded-xl relative group transition-all duration-300 active:scale-95">
            <Bell className="h-5 w-5 text-zinc-400 group-hover:text-primary transition-colors" />
            <span className="absolute top-2 right-2 h-2 w-2 bg-primary rounded-full ring-2 ring-black shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
          </button>
          <Link href="/mekanik/profile" className="h-9 w-9 rounded-xl bg-zinc-900 border border-white/5 flex items-center justify-center hover:border-primary/50 hover:bg-white/5 transition-all duration-300 active:scale-95 overflow-hidden group shadow-inner">
            <User className="h-4 w-4 text-zinc-400 group-hover:text-primary transition-colors" />
          </Link>
        </div>
      </div>
    </header>
  )
}

function BottomNav() {
  const pathname = usePathname()

  const isActive = (href: string) => {
    if (href === "/mekanik") return pathname === "/mekanik"
    return pathname.startsWith(href)
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 flex justify-center pointer-events-none pb-safe">
      <div className="w-full max-w-md bg-black/90 backdrop-blur-3xl border-t border-white/5 h-16 pointer-events-auto px-4 relative">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/10 to-transparent"></div>
        <div className="flex items-center justify-between h-full max-w-md mx-auto">
          {navItems.map((item) => {
            const Icon = item.icon
            const active = isActive(item.href)
            return (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all duration-300 relative group outline-none active:scale-90",
                  active ? "text-primary" : "text-zinc-500 hover:text-zinc-300"
                )}
              >
                {active && (
                  <>
                    <div className="absolute top-0 w-12 h-0.5 bg-primary rounded-b-full shadow-[0_0_15px_rgba(var(--primary),0.8)]" />
                    <div className="absolute inset-0 bg-gradient-to-b from-primary/10 to-transparent opacity-50" />
                  </>
                )}
                <div className="relative">
                  <Icon className={cn(
                    "h-5 w-5 transition-all duration-500", 
                    active ? "scale-110 drop-shadow-[0_0_8px_rgba(var(--primary),0.6)]" : "group-hover:scale-110 group-active:scale-95"
                  )} strokeWidth={active ? 2.5 : 2} />
                </div>
                <span className={cn(
                  "text-[9px] font-bold uppercase tracking-[0.05em] transition-all duration-300",
                  active ? "opacity-100" : "opacity-70 group-hover:opacity-100"
                )}>
                  {item.label}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
  )
}

export default function MekanikLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-black relative selection:bg-primary/30 selection:text-primary pb-safe overflow-x-hidden">
      {/* Precision Ambient Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 flex justify-center">
        <div className="absolute top-[-20%] right-[-10%] w-[60%] h-[40%] bg-primary/10 rounded-[100%] blur-[120px] opacity-60 mix-blend-screen" />
        <div className="absolute inset-0 bg-[url('/noise.png')] opacity-[0.02] mix-blend-overlay" />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen max-w-md mx-auto border-x border-white/5 bg-zinc-950/40 shadow-2xl">
        <MekanikHeader />
        <main className="flex-1 pt-16 pb-24 px-4">
          {children}
        </main>
        <BottomNav />
      </div>
    </div>
  )
}

