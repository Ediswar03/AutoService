"use client"

import { useState, use } from "react"
import Link from "next/link"
import { 
  ChevronLeft, ChevronRight, Check, Camera, Plus, X, 
  MessageSquare, AlertTriangle, CheckCircle2, HelpCircle,
  Save, Wrench, ShieldAlert, BarChart3, Clock, DollarSign
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Progress } from "@/components/ui/progress"
import { cn } from "@/lib/utils"

type CheckStatus = "unchecked" | "ok" | "needs_repair" | "critical"

interface ChecklistItem {
  id: string
  name: string
  status: CheckStatus
  notes: string
  photos: string[]
}

interface ChecklistCategory {
  id: string
  name: string
  items: ChecklistItem[]
}

const initialCategories: ChecklistCategory[] = [
  {
    id: "engine",
    name: "Area Mesin",
    items: [
      { id: "oil_level", name: "Level Oli Mesin", status: "unchecked", notes: "", photos: [] },
      { id: "coolant", name: "Air Radiator", status: "unchecked", notes: "", photos: [] },
      { id: "belt", name: "Kondisi Belt", status: "unchecked", notes: "", photos: [] },
      { id: "air_filter", name: "Filter Udara", status: "unchecked", notes: "", photos: [] },
    ],
  },
  {
    id: "brakes",
    name: "Sistem Pengereman",
    items: [
      { id: "brake_pad_front", name: "Kampas Rem Depan", status: "unchecked", notes: "", photos: [] },
      { id: "brake_pad_rear", name: "Kampas Rem Belakang", status: "unchecked", notes: "", photos: [] },
      { id: "brake_fluid", name: "Minyak Rem", status: "unchecked", notes: "", photos: [] },
    ],
  },
]

const steps = [
  { id: 1, name: "Keluhan", icon: MessageSquare },
  { id: 2, name: "Cek Visual", icon: Wrench },
  { id: 3, name: "Diagnosis", icon: ShieldAlert },
  { id: 4, name: "Estimasi", icon: DollarSign },
]

const statusButtons = [
  { status: "ok" as const, icon: CheckCircle2, label: "OK", className: "border-emerald-500/20 text-emerald-500 bg-emerald-500/5 hover:bg-emerald-500/10 active:bg-emerald-500/20" },
  { status: "needs_repair" as const, icon: AlertTriangle, label: "INFO", className: "border-amber-500/20 text-amber-500 bg-amber-500/5 hover:bg-amber-500/10 active:bg-amber-500/20" },
  { status: "critical" as const, icon: X, label: "FAIL", className: "border-red-500/20 text-red-500 bg-red-500/5 hover:bg-red-500/10 active:bg-red-500/20" },
]

export default function InspectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [currentStep, setCurrentStep] = useState(1)
  const [categories, setCategories] = useState(initialCategories)
  const [diagnosis, setDiagnosis] = useState("")
  const [recommendations, setRecommendations] = useState("")

  const progress = (currentStep / steps.length) * 100

  const updateItemStatus = (categoryId: string, itemId: string, status: CheckStatus) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              items: cat.items.map((item) =>
                item.id === itemId ? { ...item, status } : item
              ),
            }
          : cat
      )
    )
  }

  const getTotalChecked = () => {
    return categories.reduce(
      (acc, cat) => acc + cat.items.filter((item) => item.status !== "unchecked").length,
      0
    )
  }

  const getTotalItems = () => {
    return categories.reduce((acc, cat) => acc + cat.items.length, 0)
  }

  return (
    <div className="space-y-6 pb-40">
      {/* Dynamic Header */}
      <div className="sticky top-14 -mx-4 px-4 py-4 bg-black/80 backdrop-blur-md z-30 border-b border-white/5">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-0.5">
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/80">Vehicle Inspection</span>
             <h2 className="text-xl font-black italic uppercase tracking-tighter text-white">Step {currentStep}: {steps[currentStep-1].name}</h2>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-mono text-zinc-500">{Math.round(progress)}% COMPLETE</span>
             <div className="h-1 w-24 bg-zinc-900 rounded-full mt-1.5 overflow-hidden border border-white/5">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
             </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between relative px-2">
           <div className="absolute top-1/2 left-2 right-2 h-px bg-zinc-900 -translate-y-1/2 z-0" />
           {steps.map((step) => {
             const Icon = step.icon
             const isActive = currentStep >= step.id
             return (
               <div key={step.id} className="relative z-10">
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center border transition-all duration-500",
                    isActive ? "bg-primary border-primary text-black shadow-[0_0_15px_rgba(var(--primary),0.4)]" : "bg-zinc-950 border-white/10 text-zinc-600"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
               </div>
             )
           })}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-6">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2 px-1">
                <MessageSquare className="h-3 w-3 text-primary" /> Detail Keluhan
             </h4>
             <Card className="bg-zinc-900/50 border-white/5 rounded-2xl overflow-hidden">
                <CardContent className="p-6 space-y-4">
                   <div className="bg-black/40 rounded-2xl p-5 border border-white/5 border-dashed relative">
                      <div className="absolute top-0 left-6 -translate-y-1/2 bg-zinc-900 px-2 text-[8px] font-black uppercase tracking-widest text-zinc-500">Customer Statement</div>
                      <p className="text-sm text-zinc-300 italic font-medium leading-relaxed">
                        &ldquo;AC kurang dingin, suara mesin agak kasar saat idle, dan rem terasa kurang pakem saat pengereman mendadak&rdquo;
                      </p>
                   </div>
                   <div className="bg-amber-500/5 border border-amber-500/10 p-5 rounded-2xl">
                      <p className="text-[10px] font-black uppercase tracking-widest text-amber-500/60 mb-2">Service Advisor Notes</p>
                      <p className="text-sm text-amber-200/60 font-medium italic">
                        Pelanggan minta prioritas AC karena sering bepergian jauh. Mobil akan dipakai weekend ini.
                      </p>
                   </div>
                </CardContent>
             </Card>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
             <div className="flex items-center justify-between px-1">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2">
                   <Wrench className="h-3 w-3 text-primary" /> Visual Checklist
                </h4>
                <span className="text-[10px] font-mono text-zinc-500">{getTotalChecked()}/{getTotalItems()} CHECKED</span>
             </div>

             {categories.map((cat) => (
               <div key={cat.id} className="space-y-3">
                  <div className="bg-zinc-900/40 rounded-xl px-4 py-2 border border-white/5">
                     <span className="text-[10px] font-black uppercase italic tracking-widest text-zinc-400">{cat.name}</span>
                  </div>
                  <div className="space-y-3 pl-1">
                     {cat.items.map((item) => (
                       <div key={item.id} className="bg-zinc-900/60 rounded-2xl border border-white/5 p-4 space-y-4">
                          <div className="flex items-center justify-between">
                             <span className="text-sm font-black text-zinc-100 uppercase tracking-tight italic">{item.name}</span>
                             {item.status !== "unchecked" && (
                               <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase h-5">DONE</Badge>
                             )}
                          </div>
                          <div className="grid grid-cols-3 gap-2">
                             {statusButtons.map((btn) => (
                               <button
                                 key={btn.status}
                                 onClick={() => updateItemStatus(cat.id, item.id, btn.status)}
                                 className={cn(
                                   "flex flex-col items-center gap-2 p-3 rounded-xl border transition-all duration-300",
                                   btn.className,
                                   item.status === btn.status ? "brightness-125 scale-95 border-current shadow-[0_0_15px_rgba(var(--primary),0.1)]" : "opacity-40 grayscale"
                                 )}
                               >
                                 <btn.icon className="h-4 w-4" />
                                 <span className="text-[9px] font-black tracking-widest">{btn.label}</span>
                               </button>
                             ))}
                          </div>
                       </div>
                     ))}
                  </div>
               </div>
             ))}
          </div>
        )}

        {currentStep === 3 && (
          <div className="space-y-6">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2 px-1">
                <ShieldAlert className="h-3 w-3 text-primary" /> Final Diagnosis
             </h4>
             <Card className="bg-zinc-900/50 border-white/5 rounded-2xl overflow-hidden">
                <CardContent className="p-6 space-y-6">
                   <div className="space-y-2">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Temuan Teknis</span>
                      <Textarea
                        placeholder="Deskripsikan masalah yang ditemukan secara mendalam..."
                        className="bg-black/40 border-white/5 rounded-2xl min-h-[120px] focus:border-primary/50 text-sm italic"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                      />
                   </div>
                   <div className="space-y-2">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest pl-1">Rekomendasi Perbaikan</span>
                      <Textarea
                        placeholder="Langkah perbaikan yang disarankan..."
                        className="bg-black/40 border-white/5 rounded-2xl min-h-[120px] focus:border-primary/50 text-sm italic"
                        value={recommendations}
                        onChange={(e) => setRecommendations(e.target.value)}
                      />
                   </div>
                </CardContent>
             </Card>
          </div>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-zinc-600 flex items-center gap-2 px-1">
                <DollarSign className="h-3 w-3 text-primary" /> Estimasi Biaya & Parts
             </h4>
             <Card className="bg-primary/5 border-primary/20 rounded-[32px] overflow-hidden">
                <CardContent className="p-8 text-center space-y-6">
                   <div className="h-20 w-20 rounded-3xl bg-primary/10 border border-primary/20 flex items-center justify-center mx-auto shadow-2xl">
                      <BarChart3 className="h-10 w-10 text-primary" />
                   </div>
                   <div className="space-y-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60">Total Estimated Cost</p>
                      <p className="text-4xl font-black italic text-white uppercase tracking-tighter">Rp 1.100.000</p>
                   </div>
                   <div className="grid grid-cols-2 gap-3 pt-4">
                      <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                         <p className="text-[9px] font-black uppercase text-zinc-500 mb-1">Labour Cost</p>
                         <p className="text-sm font-black text-zinc-200">Rp 250K</p>
                      </div>
                      <div className="bg-black/40 rounded-2xl p-4 border border-white/5">
                         <p className="text-[9px] font-black uppercase text-zinc-500 mb-1">Parts Cost</p>
                         <p className="text-sm font-black text-zinc-200">Rp 850K</p>
                      </div>
                   </div>
                   <p className="text-[10px] italic text-zinc-500 font-medium">* Estimasi harga dapat berubah sesuai ketersediaan stok</p>
                </CardContent>
             </Card>
          </div>
        )}
      </div>

      {/* Internal Navigation Buttons */}
      <div className="fixed bottom-24 left-0 right-0 px-6 flex items-center gap-4 z-40 bg-gradient-to-t from-black via-black/80 to-transparent pt-10 pb-4 pointer-events-none">
         <div className="flex w-full max-w-md mx-auto gap-4 pointer-events-auto">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="h-14 flex-1 bg-zinc-900 border-white/5 text-zinc-400 font-black uppercase tracking-widest rounded-2xl active:scale-95 transition-all"
              >
                <ChevronLeft className="h-5 w-5 mr-1" /> BACK
              </Button>
            )}
            {currentStep < steps.length ? (
              <Button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="h-14 flex-1 bg-primary text-black font-black uppercase tracking-widest rounded-2xl active:scale-95 shadow-[0_8px_30px_rgba(var(--primary),0.3)] transition-all"
              >
                NEXT <ChevronRight className="h-5 w-5 ml-1" />
              </Button>
            ) : (
              <Button className="h-14 flex-1 bg-emerald-500 text-white font-black uppercase tracking-widest rounded-2xl active:scale-95 shadow-[0_8px_30px_rgba(16,185,129,0.3)] border-b-4 border-black/20 transition-all">
                <Save className="h-5 w-5 mr-2" /> SUBMIT TO SA
              </Button>
            )}
         </div>
      </div>
    </div>
  )
}
