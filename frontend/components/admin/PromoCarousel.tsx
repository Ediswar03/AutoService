import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { Card } from '@/components/ui/card'
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from '@/components/ui/carousel'
import Autoplay from "embla-carousel-autoplay"

export function PromoCarousel({ viewAllHref = "/admin/promo" }: { viewAllHref?: string }) {
  const plugin = React.useRef(
    Autoplay({ delay: 4000, stopOnInteraction: true })
  )
  const [current, setCurrent] = React.useState(0)
  const [count, setCount] = React.useState(0)
  const [api, setApi] = React.useState<any>()

  React.useEffect(() => {
    if (!api) {
      return
    }

    setCount(api.scrollSnapList().length)
    setCurrent(api.selectedScrollSnap() + 1)

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1)
    })
  }, [api])

  return (
    <div className="flex flex-col space-y-2.5">
      <div className="flex items-center justify-between">
        <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight">
          Promo Menarik
        </h3>
        <Link 
          href={viewAllHref} 
          className="text-sm font-medium text-blue-500 hover:text-blue-600 dark:text-blue-400 dark:hover:text-blue-300 transition-colors"
        >
          Lihat Semua
        </Link>
      </div>

      <Carousel
        setApi={setApi}
        plugins={[plugin.current]}
        className="w-full"
        opts={{
          align: "start",
          loop: true,
        }}
      >
        <CarouselContent className="-ml-4">
          
          {/* Card 1 */}
          <CarouselItem className="pl-4 basis-[90%] md:basis-[100%] lg:basis-[85%]">
            <Card className="w-full h-[155px] overflow-hidden border-0 bg-[#16181D] rounded-[24px] shadow-lg relative cursor-pointer group">
              <div className="flex items-stretch h-full">
                <div className="flex-1 p-4.5 flex flex-col justify-center z-10 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-[#16181D] via-[#16181D]/90 to-transparent z-0" />
                  <div className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                    <h4 className="text-white font-extrabold text-sm sm:text-base uppercase tracking-wider mb-0.5">
                      DISKON SERVIS
                    </h4>
                    <div className="text-[#FFC107] font-black text-4xl sm:text-5xl leading-none mb-1">
                      20<span className="text-3xl">%</span>
                    </div>
                    <p className="text-white/80 text-xs sm:text-sm mb-4">
                      sampai akhir bulan
                    </p>
                    <p className="text-white/40 text-[10px]">
                      Berlaku hingga 30 Mei 2026
                    </p>
                  </div>
                </div>
                <div className="w-[45%] relative shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-[#16181D] z-10" />
                  <Image
                    src="/images/promo-tire.png"
                    alt="Servis Ban"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </Card>
          </CarouselItem>

          {/* Card 2 */}
          <CarouselItem className="pl-4 basis-[90%] md:basis-[100%] lg:basis-[85%]">
            <Card className="w-full h-[155px] overflow-hidden border-0 bg-emerald-950 rounded-[24px] shadow-lg relative cursor-pointer group">
              <div className="flex items-stretch h-full">
                <div className="flex-1 p-4.5 flex flex-col justify-center z-10 relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-950 via-emerald-950/90 to-transparent z-0" />
                  <div className="relative z-10 group-hover:translate-x-1 transition-transform duration-300">
                    <h4 className="text-white font-extrabold text-sm sm:text-base uppercase tracking-wider mb-0.5">
                      GRATIS GANTI OLI
                    </h4>
                    <div className="text-emerald-400 font-black text-3xl sm:text-4xl leading-none mb-1">
                      Setiap Servis Besar
                    </div>
                    <p className="text-white/80 text-xs sm:text-sm mb-4">
                      Khusus pelanggan baru
                    </p>
                    <p className="text-white/40 text-[10px]">
                      Syarat dan ketentuan berlaku
                    </p>
                  </div>
                </div>
                <div className="w-[45%] relative shrink-0">
                  <div className="absolute inset-0 bg-gradient-to-l from-transparent to-emerald-950 z-10" />
                  <div className="absolute inset-0 bg-emerald-500/20 mix-blend-overlay z-0" />
                  <Image
                    src="/images/login-bg-2.png"
                    alt="Servis Mesin"
                    fill
                    className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                  />
                </div>
              </div>
            </Card>
          </CarouselItem>

        </CarouselContent>
      </Carousel>

      {/* Pagination Dots */}
      <div className="flex justify-center gap-1.5 pt-2">
        {Array.from({ length: count }).map((_, index) => (
          <div
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              index + 1 === current
                ? "w-4 bg-slate-800 dark:bg-white shadow-[0_0_5px_rgba(255,255,255,0.5)]"
                : "w-2 bg-slate-300 dark:bg-slate-700"
            }`}
            onClick={() => api?.scrollTo(index)}
          />
        ))}
      </div>
    </div>
  )
}
