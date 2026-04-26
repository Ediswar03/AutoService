// Mock data for Gudang/Warehouse Management System

export type StockStatus = 'ok' | 'minimum' | 'critical'

export interface InventoryItem {
  id: string
  partCode: string
  name: string
  description: string
  category: string
  currentStock: number
  minStock: number
  maxStock: number
  unitPrice: number
  sellPrice: number
  supplier: {
    id: string
    name: string
    contact: string
    leadTime: number
  }
  location: {
    rack: string
    row: string
    column: string
  }
  lastUpdated: string
  status: StockStatus
}

export interface StockMovement {
  id: string
  partCode: string
  partName: string
  type: 'in' | 'out'
  quantity: number
  date: string
  reference: string
  performedBy: string
  notes: string
}

export interface ApprovalNote {
  id: string
  noteNumber: string
  type: 'pengeluaran' | 'penerimaan' | 'transfer'
  requestedBy: string
  requestDate: string
  items: {
    partCode: string
    partName: string
    quantity: number
  }[]
  status: 'pending' | 'approved' | 'rejected'
  totalItems: number
  priority: 'normal' | 'urgent'
}

export interface Supplier {
  id: string
  name: string
  contact: string
  email: string
  phone: string
  address: string
  leadTime: number
  totalProducts: number
  status: 'active' | 'inactive'
}

// Mock Inventory Data
export const inventoryItems: InventoryItem[] = []

// Mock Stock Movements
export const stockMovements: StockMovement[] = []

// Mock Approval Notes
export const approvalNotes: ApprovalNote[] = []

// Mock Suppliers
export const suppliers: Supplier[] = []

// Dashboard stats
export const dashboardStats = {
  totalParts: 1247,
  criticalStock: 3,
  minimumStock: 5,
  pendingApprovals: 3,
  todayInbound: 35,
  todayOutbound: 12,
  upcomingPO: 8
}

// Categories for filtering
export const categories = [
  'Brake System',
  'Fluids',
  'Filters',
  'Ignition',
  'Electrical',
  'Suspension',
  'Engine',
  'Accessories'
]

// Format currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(amount)
}

// Format date
export function formatDate(dateString: string): string {
  return new Intl.DateTimeFormat('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(dateString))
}

// Get status color class
export function getStockStatusColor(status: StockStatus): string {
  switch (status) {
    case 'ok':
      return 'bg-success text-success-foreground'
    case 'minimum':
      return 'bg-warning text-warning-foreground'
    case 'critical':
      return 'bg-critical text-critical-foreground'
    default:
      return 'bg-muted text-muted-foreground'
  }
}

export function getStockStatusLabel(status: StockStatus): string {
  switch (status) {
    case 'ok':
      return 'OK'
    case 'minimum':
      return 'Minimum'
    case 'critical':
      return 'Kritis'
    default:
      return status
  }
}
