"use client"

import { useState, use } from "react"
import { 
  ChevronLeft, ChevronRight, CheckCircle2, Camera, X, 
  MessageSquare, AlertTriangle, HelpCircle, Save, 
  Wrench, ShieldAlert, BarChart3, Clock, DollarSign, ImagePlus, Loader2
} from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { toast } from "sonner"
import { useRouter } from "next/navigation"
import useSWR from "swr"
import { fetcher, apiClient } from "@/lib/api-client"

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

const defaultCategories: ChecklistCategory[] = [
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
  { id: 2, name: "Inspeksi", icon: Wrench },
  { id: 3, name: "Diagnosis", icon: ShieldAlert },
]

const statusButtons = [
  { status: "ok" as const, icon: CheckCircle2, label: "OK", className: "border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-500 bg-emerald-50 dark:bg-emerald-500/5 hover:bg-emerald-100 dark:hover:bg-emerald-500/10" },
  { status: "needs_repair" as const, icon: AlertTriangle, label: "INFO", className: "border-amber-200 dark:border-amber-500/20 text-amber-600 dark:text-amber-500 bg-amber-50 dark:bg-amber-500/5 hover:bg-amber-100 dark:hover:bg-amber-500/10" },
  { status: "critical" as const, icon: X, label: "FAIL", className: "border-red-200 dark:border-red-500/20 text-red-600 dark:text-red-500 bg-red-50 dark:bg-red-500/5 hover:bg-red-100 dark:hover:bg-red-500/10" },
]

export default function InspectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(1)
  const [categories, setCategories] = useState(defaultCategories)
  const [diagnosis, setDiagnosis] = useState("")
  const [recommendations, setRecommendations] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Fetch actual work order data
  const { data: job, isLoading } = useSWR(`/work-orders/${id}`, fetcher)

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

  const handleSimulatePhotoUpload = (categoryId: string, itemId: string) => {
    toast.success("Kamera terbuka (Simulasi)")
    // In a real app, this would open device camera, upload to storage, and append photo URL
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

  const handleSubmit = async () => {
    setIsSubmitting(true)
    try {
      // In a real app, you would send `categories`, `diagnosis`, `recommendations`
      await apiClient.patch(`/work-orders/${id}`, {
        internalNotes: diagnosis ? `Diagnosis: ${diagnosis} | Rekomendasi: ${recommendations}` : undefined,
        status: 'QUALITY_CHECK' // Move to QC after inspection if requested
      })
      toast.success("Laporan Inspeksi Berhasil Disimpan", {
        description: "Data telah dikirim ke Service Advisor"
      })
      setTimeout(() => {
        router.push(`/mekanik/jobs/${id}`)
      }, 1000)
    } catch (err: any) {
      toast.error(err.response?.data?.message || "Gagal menyimpan inspeksi")
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <Loader2 className="size-8 animate-spin text-primary" />
        <p className="text-slate-500 dark:text-zinc-500 font-bold uppercase tracking-widest text-xs">Loading...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6 pb-40">
      {/* Dynamic Header */}
      <div className="sticky top-0 -mx-4 px-4 py-4 bg-slate-50/90 dark:bg-black/80 backdrop-blur-md z-30 border-b border-slate-200 dark:border-white/5 transition-colors">
        <div className="flex items-center justify-between mb-4">
          <div className="space-y-0.5">
             <span className="text-[9px] font-black uppercase tracking-[0.2em] text-primary/80">Vehicle Inspection</span>
             <h2 className="text-xl font-black italic uppercase tracking-tighter text-slate-900 dark:text-white transition-colors">
               Step {currentStep}: {steps[currentStep-1].name}
             </h2>
          </div>
          <div className="flex flex-col items-end">
             <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-500">{Math.round(progress)}% COMPLETE</span>
             <div className="h-1 w-24 bg-slate-200 dark:bg-zinc-900 rounded-full mt-1.5 overflow-hidden border border-slate-300 dark:border-white/5">
                <div className="h-full bg-primary transition-all duration-500" style={{ width: `${progress}%` }} />
             </div>
          </div>
        </div>

        {/* Step Indicator */}
        <div className="flex justify-between relative px-2">
           <div className="absolute top-1/2 left-2 right-2 h-px bg-slate-200 dark:bg-zinc-900 -translate-y-1/2 z-0" />
           {steps.map((step) => {
             const Icon = step.icon
             const isActive = currentStep >= step.id
             return (
               <div key={step.id} className="relative z-10">
                  <div className={cn(
                    "h-8 w-8 rounded-lg flex items-center justify-center border transition-all duration-500 shadow-sm dark:shadow-none",
                    isActive ? "bg-primary border-primary text-white dark:text-black shadow-[0_0_15px_rgba(var(--primary),0.4)]" : "bg-white dark:bg-zinc-950 border-slate-200 dark:border-white/10 text-slate-400 dark:text-zinc-600"
                  )}>
                    <Icon className="h-4 w-4" />
                  </div>
               </div>
             )
           })}
        </div>
      </div>

      {/* Content */}
      <div className="space-y-6 pt-2">
        {currentStep === 1 && (
          <div className="space-y-6">
             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-600 flex items-center gap-2 px-1">
                <MessageSquare className="h-3 w-3 text-primary" /> Detail Keluhan
             </h4>
             <Card className="bg-white/80 dark:bg-zinc-900/50 border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                <CardContent className="p-6 space-y-4">
                   <div className="bg-slate-50 dark:bg-black/40 rounded-2xl p-5 border border-slate-200 dark:border-white/5 border-dashed relative">
                      <div className="absolute top-0 left-6 -translate-y-1/2 bg-slate-50 dark:bg-zinc-900 px-2 text-[8px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-500 transition-colors">Customer Statement</div>
                      <p className="text-sm text-slate-700 dark:text-zinc-300 italic font-medium leading-relaxed">
                        &ldquo;{job?.customerComplaints || 'Tidak ada keluhan tertulis'}&rdquo;
                      </p>
                   </div>
                   {job?.internalNotes && (
                     <div className="bg-amber-50 dark:bg-amber-500/5 border border-amber-200 dark:border-amber-500/10 p-5 rounded-2xl">
                        <p className="text-[10px] font-black uppercase tracking-widest text-amber-600 dark:text-amber-500/60 mb-2">Service Advisor Notes</p>
                        <p className="text-sm text-amber-700 dark:text-amber-200/60 font-medium italic">
                          {job.internalNotes}
                        </p>
                     </div>
                   )}
                </CardContent>
             </Card>
          </div>
        )}

        {currentStep === 2 && (
          <div className="space-y-6">
             <div className="flex items-center justify-between px-1">
                <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-600 flex items-center gap-2">
                   <Wrench className="h-3 w-3 text-primary" /> Visual Checklist
                </h4>
                <span className="text-[10px] font-mono text-slate-500 dark:text-zinc-500">{getTotalChecked()}/{getTotalItems()} CHECKED</span>
             </div>

             {categories.map((cat) => (
               <div key={cat.id} className="space-y-3">
                  <div className="bg-slate-100 dark:bg-zinc-900/40 rounded-xl px-4 py-2 border border-slate-200 dark:border-white/5">
                     <span className="text-[10px] font-black uppercase italic tracking-widest text-slate-600 dark:text-zinc-400">{cat.name}</span>
                  </div>
                  <div className="space-y-3 pl-1">
                     {cat.items.map((item) => (
                       <div key={item.id} className="bg-white dark:bg-zinc-900/60 rounded-2xl border border-slate-200 dark:border-white/5 p-4 space-y-4 shadow-sm dark:shadow-none">
                          <div className="flex items-center justify-between">
                             <span className="text-sm font-black text-slate-800 dark:text-zinc-100 uppercase tracking-tight italic">{item.name}</span>
                             {item.status !== "unchecked" && (
                               <Badge className="bg-primary/10 text-primary border-primary/20 text-[9px] font-black uppercase h-5 shadow-sm dark:shadow-none">DONE</Badge>
                             )}
                          </div>
                          <div className="grid grid-cols-4 gap-2">
                             <div className="col-span-3 grid grid-cols-3 gap-2">
                               {statusButtons.map((btn) => (
                                 <button
                                   key={btn.status}
                                   onClick={() => updateItemStatus(cat.id, item.id, btn.status)}
                                   className={cn(
                                     "flex flex-col items-center gap-2 p-2 rounded-xl border transition-all duration-300",
                                     btn.className,
                                     item.status === btn.status ? "scale-95 border-current shadow-[0_0_15px_rgba(var(--primary),0.1)] ring-1 ring-current" : "opacity-40 grayscale"
                                   )}
                                 >
                                   <btn.icon className="h-4 w-4" />
                                   <span className="text-[8px] font-black tracking-widest">{btn.label}</span>
                                 </button>
                               ))}
                             </div>
                             <button 
                               onClick={() => handleSimulatePhotoUpload(cat.id, item.id)}
                               className="flex flex-col items-center justify-center gap-2 p-2 rounded-xl border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-zinc-950 hover:bg-slate-100 dark:hover:bg-white/5 transition-all text-slate-500 dark:text-zinc-400 active:scale-95"
                             >
                                <Camera className="h-5 w-5" />
                                <span className="text-[8px] font-black tracking-widest">FOTO</span>
                             </button>
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
             <h4 className="text-[10px] font-black uppercase tracking-widest text-slate-500 dark:text-zinc-600 flex items-center gap-2 px-1">
                <ShieldAlert className="h-3 w-3 text-primary" /> Final Diagnosis
             </h4>
             <Card className="bg-white/80 dark:bg-zinc-900/50 border-slate-200 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm dark:shadow-none">
                <CardContent className="p-6 space-y-6">
                   <div className="space-y-2">
                      <span className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Temuan Teknis</span>
                      <Textarea
                        placeholder="Deskripsikan masalah yang ditemukan secara mendalam..."
                        className="bg-slate-50 dark:bg-black/40 border-slate-200 dark:border-white/5 rounded-2xl min-h-[120px] focus:border-primary/50 text-sm italic shadow-inner dark:shadow-none"
                        value={diagnosis}
                        onChange={(e) => setDiagnosis(e.target.value)}
                      />
                   </div>
                   <div className="space-y-2">
                      <span className="text-[10px] font-black text-slate-500 dark:text-zinc-500 uppercase tracking-widest pl-1">Rekomendasi Perbaikan</span>
                      <Textarea
                        placeholder="Langkah perbaikan yang disarankan..."
                        className="bg-slate-50 dark:bg-black/40 border-slate-200 dark:border-white/5 rounded-2xl min-h-[120px] focus:border-primary/50 text-sm italic shadow-inner dark:shadow-none"
                        value={recommendations}
                        onChange={(e) => setRecommendations(e.target.value)}
                      />
                   </div>
                </CardContent>
             </Card>

             <Card className="bg-primary/5 border-primary/20 rounded-3xl overflow-hidden shadow-sm dark:shadow-none">
               <CardContent className="p-5 flex items-start gap-4">
                 <div className="h-10 w-10 shrink-0 rounded-full bg-primary/20 flex items-center justify-center">
                   <AlertTriangle className="h-5 w-5 text-primary" />
                 </div>
                 <div>
                   <h5 className="text-xs font-black uppercase tracking-widest text-primary mb-1">Catatan Penting</h5>
                   <p className="text-[10px] text-slate-600 dark:text-zinc-400 font-medium leading-relaxed">
                     Laporan ini akan dikirim ke Service Advisor untuk diverifikasi dan digunakan sebagai dasar perhitungan estimasi biaya kepada pelanggan.
                   </p>
                 </div>
               </CardContent>
             </Card>
          </div>
        )}
      </div>

      {/* Internal Navigation Buttons */}
      <div className="fixed bottom-0 left-0 right-0 px-4 flex items-center gap-3 z-40 bg-gradient-to-t from-slate-100 via-slate-100/90 dark:from-black dark:via-black/90 to-transparent pt-12 pb-6 pointer-events-none transition-colors">
         <div className="flex w-full max-w-md mx-auto gap-3 pointer-events-auto">
            {currentStep > 1 && (
              <Button
                variant="outline"
                onClick={() => setCurrentStep((prev) => prev - 1)}
                className="h-14 w-20 shrink-0 bg-white dark:bg-zinc-900 border-slate-200 dark:border-white/5 text-slate-600 dark:text-zinc-400 font-black rounded-2xl active:scale-95 transition-all shadow-sm dark:shadow-none"
              >
                <ChevronLeft className="h-6 w-6" />
              </Button>
            )}
            {currentStep < steps.length ? (
              <Button
                onClick={() => setCurrentStep((prev) => prev + 1)}
                className="h-14 flex-1 bg-primary text-white dark:text-black font-black uppercase tracking-[0.2em] rounded-2xl active:scale-95 shadow-[0_8px_30px_rgba(var(--primary),0.3)] transition-all border-b-4 border-black/10 dark:border-black/20"
              >
                SELANJUTNYA <ChevronRight className="h-5 w-5 ml-2" />
              </Button>
            ) : (
              <Button 
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="h-14 flex-1 bg-emerald-500 hover:bg-emerald-600 text-white font-black uppercase tracking-[0.1em] rounded-2xl active:scale-95 shadow-[0_8px_30px_rgba(16,185,129,0.3)] border-b-4 border-black/20 transition-all"
              >
                {isSubmitting ? <Loader2 className="h-5 w-5 animate-spin mx-auto" /> : (
                  <>
                    <Save className="h-5 w-5 mr-2" /> SUBMIT LAPORAN
                  </>
                )}
              </Button>
            )}
         </div>
      </div>
    </div>
  )
}
