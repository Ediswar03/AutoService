import { Settings, Wrench } from 'lucide-react'
import { cn } from '@/lib/utils'

interface LogoProps {
  className?: string
  iconSize?: number
  textSize?: string
  subtitle?: string
  variant?: 'default' | 'white' | 'dark'
}

export function Logo({ 
  className, 
  iconSize = 24, 
  textSize = "text-xl", 
  subtitle,
  variant = 'default'
}: LogoProps) {
  const isWhite = variant === 'white'
  
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <div className="relative flex items-center justify-center shrink-0">
        <Settings 
          size={iconSize} 
          className={cn(isWhite ? "text-white/80" : "text-yellow-400", "animate-spin-slow")} 
        />
        <Wrench 
          size={iconSize * 0.55} 
          className={cn(
            "absolute -rotate-45", 
            isWhite ? "text-white" : "text-white"
          )} 
        />
      </div>
      <div className="flex flex-col group-data-[collapsible=icon]:hidden overflow-hidden">
        <span className={cn(
          "font-black tracking-tighter leading-none whitespace-nowrap", 
          textSize,
          isWhite ? "text-white" : "text-white"
        )}>
          <span className={isWhite ? "text-white" : "text-white"}>AUTO</span>{" "}
          <span className={isWhite ? "text-white" : "text-yellow-400"}>SERVICE</span>
        </span>
        {subtitle && (
          <span className={cn(
            "text-[10px] font-bold tracking-[0.2em] uppercase leading-none mt-1 whitespace-nowrap",
            isWhite ? "text-white/60" : "text-white/70"
          )}>
            {subtitle}
          </span>
        )}
      </div>
    </div>
  )
}
