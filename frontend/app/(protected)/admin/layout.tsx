import type { Metadata } from "next"
import { AdminLayoutClient } from "./layout-client"

export const metadata: Metadata = {
  title: "AutoServis - Admin Dashboard",
  description: "Sistem manajemen bengkel otomotif",
}

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <AdminLayoutClient>{children}</AdminLayoutClient>
}
