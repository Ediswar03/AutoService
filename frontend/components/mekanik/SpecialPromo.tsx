import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Gift, ArrowRight, Sparkles } from 'lucide-react';

const SpecialPromo = () => {
  return (
    <Card className="relative overflow-hidden border-0 rounded-3xl cursor-pointer group active:scale-[0.98] transition-transform duration-300 shadow-lg dark:shadow-none bg-slate-900 dark:bg-black">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/30 via-primary/5 to-transparent opacity-80" />
      <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-32 h-32 bg-amber-500/20 rounded-full blur-2xl translate-y-1/2 -translate-x-1/2" />
      
      {/* Glossy overlay */}
      <div className="absolute inset-0 bg-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 mix-blend-overlay" />
      
      <CardContent className="relative z-10 p-5 sm:p-6 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2">
            <span className="flex items-center justify-center h-5 px-2 rounded-full bg-primary/20 border border-primary/30 text-[9px] font-black uppercase tracking-widest text-primary shadow-[0_0_10px_rgba(var(--primary),0.3)]">
              <Sparkles className="h-3 w-3 mr-1" /> Promo
            </span>
          </div>
          <h3 className="text-xl sm:text-2xl font-black italic text-white uppercase tracking-tight leading-tight mb-1">
            Diskon 15% <br />
            <span className="text-primary">Servis AC</span>
          </h3>
          <p className="text-[10px] sm:text-xs text-white/60 font-medium uppercase tracking-wider">
            Tawarkan ke pelanggan hari ini!
          </p>
        </div>
        
        <div className="shrink-0 flex flex-col items-center gap-3">
          <div className="h-12 w-12 sm:h-14 sm:w-14 rounded-2xl bg-gradient-to-br from-primary to-orange-500 flex items-center justify-center shadow-[0_0_20px_rgba(var(--primary),0.5)] group-hover:scale-110 transition-transform duration-500">
            <Gift className="h-6 w-6 sm:h-7 sm:w-7 text-white" />
          </div>
          <div className="flex items-center gap-1 text-[9px] font-black uppercase tracking-widest text-primary group-hover:text-white transition-colors duration-300">
            Klaim <ArrowRight className="h-3 w-3 group-hover:translate-x-1 transition-transform" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SpecialPromo;
