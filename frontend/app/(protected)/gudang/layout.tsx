import type { Metadata } from "next"
import { GudangLayoutClient } from "./layout-client"

export const metadata: Metadata = {
  title: "AutoServis - Gudang Dashboard",
  description: "Sistem manajemen gudang otomotif",
}

export default function GudangLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <GudangLayoutClient>{children}</GudangLayoutClient>
}
