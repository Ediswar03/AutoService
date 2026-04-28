import type {
  Customer,
  Vehicle,
  SPK,
  Invoice,
  User as Mechanic,
} from "@/types"

// Mock data remains for backward compatibility in some views
export const mockCustomers: Customer[] = []
export const mockVehicles: Vehicle[] = []
export const mockMechanics: Mechanic[] = []

export const serviceCatalog: any[] = [
  { name: "Ganti Oli Mesin", price: 150000, description: "Termasuk oli 4 liter" },
  { name: "Tune Up", price: 350000, description: "Service lengkap mesin" },
  { name: "Servis AC", price: 250000, description: "Pembersihan dan isi freon" },
  { name: "Ganti Kampas Rem", price: 200000, description: "Per set depan/belakang" },
  { name: "Spooring & Balancing", price: 300000, description: "4 roda" },
  { name: "Ganti Aki", price: 100000, description: "Jasa pasang" },
  { name: "Ganti Filter Udara", price: 50000, description: "Jasa pasang" },
  { name: "Ganti Busi", price: 75000, description: "Per busi" },
]

export const partsCatalog: any[] = [
  { name: "Oli Mesin Shell Helix HX7 5W-40", price: 380000 },
  { name: "Oli Mesin Castrol GTX 10W-40", price: 320000 },
  { name: "Filter Oli Original", price: 85000 },
  { name: "Filter Udara Original", price: 150000 },
  { name: "Kampas Rem Depan", price: 450000 },
  { name: "Kampas Rem Belakang", price: 350000 },
  { name: "Aki GS Astra 45Ah", price: 850000 },
  { name: "Busi NGK Iridium", price: 125000 },
  { name: "Freon R134a 1kg", price: 180000 },
  { name: "V-Belt", price: 250000 },
]

export const mockSPKs: SPK[] = []
export const mockInvoices: Invoice[] = []

// Helper functions
export function getCustomerById(id: any): Customer | undefined {
  return mockCustomers.find((c) => c.id === id)
}

export function getVehicleById(id: any): Vehicle | undefined {
  return mockVehicles.find((v) => v.id === id)
}

export function getVehiclesByCustomerId(customerId: any): Vehicle[] {
  return mockVehicles.filter((v) => v.customerId === customerId)
}

export function getMechanicById(id: any): Mechanic | undefined {
  return mockMechanics.find((m) => m.id === id)
}

export function getSPKById(id: any): SPK | undefined {
  return mockSPKs.find((s) => s.id === id)
}

export function getInvoiceBySpkId(spkId: any): Invoice | undefined {
  return mockInvoices.find((i) => i.spk_id === spkId)
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount)
}

export function formatDate(date: any): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(d)
}

export function formatDateTime(date: any): string {
  if (!date) return '-'
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat("id-ID", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d)
}

export function generateSPKNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0")
  return `SPK/${year}/${month}/${random}`
}

export function generateInvoiceNumber(): string {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, "0")
  const random = String(Math.floor(Math.random() * 1000)).padStart(3, "0")
  return `INV/${year}/${month}/${random}`
}
