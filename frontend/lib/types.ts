// AutoServis System Types

export type CustomerType = "pribadi" | "korporat"

export interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  type: CustomerType
  createdAt: Date
  updatedAt: Date
}

export interface Vehicle {
  id: string
  customerId: string
  plateNumber: string
  brand: string
  model: string
  year: number
  chassisNumber: string
  engineNumber: string
  color?: string
  createdAt: Date
  updatedAt: Date
}

export type SPKStatus = "PENDING" | "IN_PROGRESS" | "WAITING_PARTS" | "QUALITY_CHECK" | "COMPLETED" | "INVOICED" | "CANCELLED"
export type PaymentStatus = "unpaid" | "partial" | "paid"

export interface ServiceItem {
  id: string
  name: string
  description?: string
  price: number
  quantity: number
}

export interface SPK {
  id: string
  spkNumber: string
  customerId: string
  vehicleId: string
  mechanicId?: string
  status: SPKStatus
  services: ServiceItem[]
  parts: ServiceItem[]
  notes?: string
  estimatedCost: number
  actualCost?: number
  startDate: Date
  estimatedEndDate?: Date
  completedDate?: Date
  createdAt: Date
  updatedAt: Date
}

export interface Invoice {
  id: string
  invoiceNumber: string
  spkId: string
  customerId: string
  subtotal: number
  discount: number
  tax: number
  total: number
  paymentStatus: PaymentStatus
  paidAmount: number
  paymentMethod?: string
  paymentDate?: Date
  notes?: string
  createdAt: Date
  updatedAt: Date
}

export interface Mechanic {
  id: string
  name: string
  phone: string
  specialization?: string
  status: "available" | "busy" | "off"
}

export interface User {
  id: string
  name: string
  email: string
  role: string
  photoUrl?: string
  rating?: number
  address?: string
  createdAt?: string
  isActive?: boolean
}

// API Response types
export interface ApiResponse<T> {
  success: boolean
  data?: T
  error?: string
  message?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

// Form input types
export interface CustomerFormData {
  name: string
  email: string
  phone: string
  address: string
  type: CustomerType
}

export interface VehicleFormData {
  customerId: string
  plateNumber: string
  brand: string
  model: string
  year: number
  chassisNumber: string
  engineNumber: string
  color?: string
}

export interface SPKFormData {
  customerId: string
  vehicleId: string
  mechanicId?: string
  services: ServiceItem[]
  parts: ServiceItem[]
  notes?: string
  estimatedEndDate?: Date
}

export interface PaymentFormData {
  amount: number
  method: string
  discount?: number
  notes?: string
}
