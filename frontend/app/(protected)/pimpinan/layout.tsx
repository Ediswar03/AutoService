import type { Metadata } from "next"
import { PimpinanLayoutClient } from "./layout-client"

export const metadata: Metadata = {
  title: "AutoServis - Pimpinan Dashboard",
  description: "Dashboard pimpinan bengkel otomotif",
}

export default function PimpinanLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <PimpinanLayoutClient>{children}</PimpinanLayoutClient>
}
