'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Eye, EyeOff, Loader2, Lock, Mail, ArrowRight, ShieldCheck, Globe, Cpu, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useAuth } from '@/context/AuthContext'
import { getErrorMessage } from '@/lib/api-client'
import { Logo } from '@/components/ui/logo'
import Link from 'next/link'
import { cn } from '@/lib/utils'

const loginSchema = z.object({
  email: z.string().email('Format email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
})

type LoginFormData = z.infer<typeof loginSchema>

function LoginForm() {
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { login, isLoading } = useAuth()
  const router = useRouter()
  const searchParams = useSearchParams()
  const redirect = searchParams.get('redirect')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  const onSubmit = async (data: LoginFormData) => {
    setError(null)
    try {
      await login(data)
      if (redirect) {
        router.push(redirect)
      }
    } catch (err) {
      setError(getErrorMessage(err))
    }
  }

  return (
    <div className="w-full max-w-[360px] bg-slate-950/60 backdrop-blur-3xl p-6 md:p-7 rounded-[1.5rem] border border-white/10 shadow-[0_0_80px_rgba(0,0,0,0.6)] animate-in fade-in zoom-in duration-700 relative overflow-hidden">
      {/* Decorative Glow */}
      <div className="absolute -top-24 -right-24 size-48 bg-primary/20 rounded-full blur-[60px]" />
      
      <div className="relative z-10">
        {/* Branding */}
        <div className="flex flex-col items-center space-y-5 mb-8">
          <div className="p-3 bg-white/5 rounded-3xl border border-white/10 shadow-2xl relative">
            <div className="absolute inset-0 bg-primary/20 blur-xl rounded-3xl" />
            <div className="relative z-10">
              <Logo iconSize={36} textSize="text-xl" subtitle="Enterprise Access" variant="white" />
            </div>
          </div>
          <p className="text-slate-400 font-medium text-[11px] text-center max-w-[200px]">Masuk ke terminal manajemen bengkel terpadu.</p>
        </div>

        {/* Form Section */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {error && (
            <div className="rounded-2xl bg-red-500/10 border border-red-500/20 p-4 text-sm text-red-500 font-bold flex items-center gap-3 animate-shake">
              <ShieldCheck className="size-5 shrink-0" />
              {error}
            </div>
          )}

          <div className="space-y-5">
            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 ml-1">Identity Access</label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                <Input
                  type="email"
                  placeholder="admin@perusahaan.com"
                  className="h-14 pl-11 bg-white/5 border-white/10 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-white text-sm placeholder:text-slate-600"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-[11px] text-red-500 font-bold ml-1 uppercase tracking-wider">{errors.email.message}</p>
              )}
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between ml-1">
                <label className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500">Authorization</label>
                <button type="button" className="text-[10px] font-bold text-primary hover:text-primary/80 transition-colors uppercase tracking-widest">Help Desk</button>
              </div>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 size-4 text-slate-500 group-focus-within:text-primary transition-colors" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="h-14 pl-11 pr-12 bg-white/5 border-white/10 rounded-2xl focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all font-semibold text-white text-sm placeholder:text-slate-600"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
                >
                  {showPassword ? <EyeOff className="size-5" /> : <Eye className="size-5" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-[11px] text-red-500 font-bold ml-1 uppercase tracking-wider">{errors.password.message}</p>
              )}
            </div>
          </div>

          <Button 
            type="submit" 
            className="w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-xs shadow-[0_8px_30px_rgba(var(--primary),0.3)] transition-all duration-300 active:scale-[0.98] group relative overflow-hidden mt-1 border-b-2 border-black/20" 
            disabled={isLoading}
          >
            {/* Glossy overlay effect */}
            <span className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
            
            <span className="relative z-10 flex items-center justify-center gap-3">
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <>
                  LOGIN SISTEM 
                  <ArrowRight className="size-4 group-hover:translate-x-1.5 transition-transform" />
                </>
              )}
            </span>
          </Button>
        </form>

        {/* Footer Info */}
        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col items-center gap-6 text-center">
          <div className="flex items-center gap-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
            <Link href="#" className="hover:text-white transition-colors">Privacy</Link>
            <div className="size-1 rounded-full bg-slate-800" />
            <Link href="#" className="hover:text-white transition-colors">Terms</Link>
            <div className="size-1 rounded-full bg-slate-800" />
            <div className="flex items-center gap-1 hover:text-white cursor-pointer transition-colors">
              <Globe className="size-3" /> ID
            </div>
          </div>
          <p className="text-[10px] font-black text-slate-600 uppercase tracking-widest leading-relaxed">
            &copy; 2026 AutoServis Systems Corp. <br />
            Enterprise Resource Planning v2.0
          </p>
        </div>
      </div>
    </div>
  )
}

function LoginLoading() {
  return (
    <div className="flex flex-col items-center justify-center p-12">
      <div className="size-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin mb-6" />
      <p className="text-[11px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Menghubungkan ke Server...</p>
    </div>
  )
}

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-black">
      {/* Background Image Layer */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-950 via-slate-950/80 to-transparent z-10" />
        <img 
          src="/images/login-bg-2.png" 
          alt="Background" 
          className="absolute inset-0 w-full h-full object-cover opacity-40 scale-105 animate-pulse duration-[20s]" 
        />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 z-1 opacity-[0.05] pointer-events-none" 
           style={{ backgroundImage: 'radial-gradient(circle at 1px 1px, white 1px, transparent 0)', backgroundSize: '40px 40px' }} 
      />

      {/* Floating Elements */}
      <div className="absolute top-10 left-10 z-20 flex items-center gap-3 bg-white/5 backdrop-blur-md border border-white/10 px-4 py-2 rounded-2xl">
        <div className="size-2 rounded-full bg-primary animate-pulse shadow-[0_0_10px_rgba(var(--primary),0.8)]" />
        <span className="text-[10px] font-black text-white uppercase tracking-[0.2em]">Sistem Online</span>
      </div>

      <div className="absolute bottom-10 right-10 z-20 hidden md:flex items-center gap-3 text-white/20">
        <p className="text-[40px] font-black tracking-tighter leading-none select-none">AUTOSERVIS</p>
      </div>

      {/* Main Content */}
      <div className="relative z-10 w-full px-4 flex justify-center dark">
        <Suspense fallback={<LoginLoading />}>
          <LoginForm />
        </Suspense>
      </div>
    </div>
  )
}
