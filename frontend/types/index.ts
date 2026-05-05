// ==========================================
// BASE TYPES
// ==========================================

export interface ApiResponse<T> {
  success: boolean
  data: T
  message?: string
  errors?: Record<string, string[]>
}

export interface PaginatedResponse<T> {
  data: T[]
  meta?: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface SelectOption {
  value: string | number
  label: string
}

// ==========================================
// USER & AUTH TYPES
// ==========================================

export type UserRole = 'ADMIN' | 'MEKANIK' | 'GUDANG' | 'PIMPINAN' | 'admin' | 'kasir' | 'mekanik' | 'gudang' | 'pimpinan'

export interface User {
  id: string | number
  username?: string
  name: string
  nama?: string
  email: string
  phone?: string
  role: UserRole
  rating?: number | string
  is_active?: boolean
  isActive?: boolean
  address?: string
  created_at?: string
  updated_at?: string
  photoUrl?: string | null
  theme?: string
}

export interface AuthTokens {
  access_token: string
  refresh_token: string
  token_type: string
  expires_in: number
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  user: User
  accessToken: string
  refreshToken: string
}

// ==========================================
// CUSTOMER TYPES
// ==========================================

export interface Customer {
  id: string
  name: string
  nama?: string
  address: string
  alamat?: string
  phone: string
  telepon?: string
  email?: string
  nik?: string
  type: 'individu' | 'perusahaan'
  tipe?: 'individu' | 'perusahaan'
  companyName?: string
  nama_perusahaan?: string
  taxId?: string
  npwp?: string
  isActive: boolean
  createdAt: string
  created_at?: string
  updatedAt: string
  vehicles?: Vehicle[]
}

export interface CustomerFormData {
  nama: string
  alamat: string
  telepon: string
  email?: string
  nik?: string
  tipe: 'individu' | 'perusahaan'
  nama_perusahaan?: string
  npwp?: string
}

// ==========================================
// VEHICLE TYPES
// ==========================================

export type VehicleType = 'MOBIL' | 'MOTOR' | 'TRUCK' | 'BUS' | 'LAINNYA'

export interface Vehicle {
  id: string
  customerId: string
  customer_id?: string
  licensePlate: string
  nomor_polisi?: string
  brand: string
  merk?: string
  model: string
  vehicleType: VehicleType
  year: number
  tahun?: number
  color: string
  warna?: string
  vin?: string
  engineNumber?: string
  transmission: 'manual' | 'automatic'
  transmisi?: string
  fuelType: 'BENSIN' | 'DIESEL' | 'LISTRIK' | 'HYBRID' | 'bensin' | 'diesel' | 'listrik' | 'hybrid'
  bahan_bakar?: string
  createdAt: string
  created_at?: string
  updatedAt: string
  customer?: Customer
}

export interface VehicleFormData {
  customerId: string
  licensePlate: string
  brand: string
  model: string
  year: number
  color: string
  vin?: string
  engineNumber?: string
  transmission: 'manual' | 'automatic'
  fuelType: 'bensin' | 'diesel' | 'listrik' | 'hybrid'
}

export type SparepartCategory = 
  | 'OLI_PELUMAS' 
  | 'FILTER' 
  | 'BRAKE' 
  | 'SUSPENSION' 
  | 'ENGINE' 
  | 'TRANSMISSION' 
  | 'ELECTRICAL' 
  | 'BODY' 
  | 'AC' 
  | 'TIRE_WHEEL' 
  | 'ACCESSORIES' 
  | 'CONSUMABLE' 
  | 'LAINNYA'

export interface Sparepart {
  id: string
  code: string
  kode?: string // alias
  name: string
  nama?: string // alias
  description?: string
  deskripsi?: string // alias
  category: SparepartCategory
  brand?: string
  unit: string
  satuan?: string // alias
  buyPrice: number
  harga_beli?: number // alias
  sellPrice: number
  harga_jual?: number // alias
  stockQuantity: number
  stok?: number // alias
  minStock: number
  stok_minimum?: number // alias
  maxStock?: number
  location?: string
  lokasi_rak?: string // alias
  supplierId?: string
  supplier_id?: string // alias
  photoUrl?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  supplier?: Supplier
}

export interface SparepartFormData {
  code: string
  name: string
  description?: string
  category: SparepartCategory
  brand?: string
  unit: string
  buyPrice: number
  sellPrice: number
  stockQuantity: number
  minStock: number
  maxStock?: number
  location?: string
  supplierId?: string | null
}

export interface Supplier {
  id: string
  code: string
  name: string
  contactPerson?: string
  contact_person?: string // alias
  phone?: string
  email?: string
  address?: string
  city?: string
  npwp?: string // alias
  taxId?: string
  paymentTerms: number
  notes?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  _count?: {
    spareparts: number
  }
}

export interface SupplierFormData {
  code: string
  name: string
  contactPerson?: string
  phone?: string
  email?: string
  address?: string
  city?: string
  paymentTerms: number
  notes?: string
}

// ==========================================
// SERVICE/JASA TYPES
// ==========================================

export type ServiceCategory = 
  | 'SERVIS_BERKALA'
  | 'PERBAIKAN_MESIN'
  | 'PERBAIKAN_TRANSMISI'
  | 'KELISTRIKAN'
  | 'AC_COOLING'
  | 'BODY_REPAIR'
  | 'KAKI_KAKI'
  | 'DETAILING'
  | 'LAINNYA'

export interface Service {
  id: number
  kode: string
  nama: string
  category: ServiceCategory
  harga: number
  estimasi_waktu: number // dalam menit
  deskripsi?: string
  created_at: string
  updated_at: string
}

export interface ServiceFormData {
  kode: string
  nama: string
  category: ServiceCategory
  harga: number
  estimasi_waktu: number
  deskripsi?: string
}

// ==========================================
// SPK TYPES
// ==========================================

export type SPKStatus = 
  | 'DRAFT'
  | 'PENDING'
  | 'IN_PROGRESS'
  | 'WAITING_PARTS'
  | 'QUALITY_CHECK'
  | 'COMPLETED'
  | 'INVOICED'
  | 'CANCELLED'

export type SPKPriority = 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'

export interface SPKItem {
  id: string
  workOrderId: string
  tipe: 'jasa' | 'sparepart'
  serviceId?: string
  sparepartId?: string
  quantity: number
  unitPrice: number
  discountPercent: number
  totalPrice: number
  notes?: string
  service?: Service
  sparepart?: Sparepart
}

export interface SPK {
  id: string
  orderNumber: string
  nomor_spk?: string
  customerId: string
  vehicleId: string
  assignedMechanicId?: string
  customerComplaints: string
  keluhan?: string
  internalNotes?: string
  catatan?: string
  status: SPKStatus
  priority: SPKPriority
  odometerIn?: number
  fuelLevel?: string
  estimatedCompletion?: string
  actualCompletion?: string
  totalServiceCost: number
  totalPartsCost: number
  discountPercent: number
  discountAmount: number
  taxPercent: number
  taxAmount: number
  grandTotal: number
  createdAt: string
  created_at?: string
  updatedAt: string
  customer?: Customer
  vehicle?: Vehicle
  assignedMechanic?: User
  items?: SPKItem[]
}

export interface SPKFormData {
  customerId: string
  vehicleId: string
  assignedMechanicId?: string
  customerComplaints: string
  internalNotes?: string
  priority?: SPKPriority
  odometerIn?: number
  fuelLevel?: string
  estimatedCompletion?: string
  services?: {
    serviceId: string
    quantity: number
    discountPercent: number
  }[]
  spareparts?: {
    sparepartId: string
    quantity: number
    discountPercent: number
  }[]
}

export interface SPKItemFormData {
  tipe: 'jasa' | 'sparepart'
  item_id: number
  quantity: number
  harga_satuan: number
  diskon: number
  catatan?: string
}

// ==========================================
// INVOICE TYPES
// ==========================================

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'PARTIAL' | 'OVERDUE' | 'CANCELLED' | 'REFUNDED'
export type PaymentMethod = 'cash' | 'transfer' | 'debit' | 'credit' | 'qris'

export interface Invoice {
  id: string
  invoiceNumber: string
  nomor_invoice?: string
  workOrderId: string
  spk_id?: string
  customerId?: string
  invoiceDate?: string
  tanggal?: string
  dueDate?: string
  jatuh_tempo?: string
  totalServiceCost?: number
  total_jasa?: number
  totalPartsCost?: number
  total_sparepart?: number
  discountAmount?: number
  diskon?: number
  taxAmount?: number
  ppn?: number
  grandTotal: number
  grand_total?: number
  amountPaid: number
  jumlah_dibayar?: number
  amountDue: number
  sisa_bayar?: number
  status: InvoiceStatus
  notes?: string
  catatan?: string
  createdById?: string
  created_by?: string
  createdAt: string
  created_at?: string
  updatedAt?: string
  updated_at?: string
  workOrder?: SPK
  spk?: SPK
  customer?: Customer
  payments?: Payment[]
}

export interface Payment {
  id: string
  invoiceId: string
  invoice_id?: string
  amount: number
  jumlah?: number
  paymentMethod: PaymentMethod | string
  metode?: string
  referenceNumber?: string
  referensi?: string
  paymentDate?: string
  tanggal?: string
  notes?: string
  catatan?: string
  receivedById?: string
  created_by?: string
  createdAt: string
  created_at?: string
}

export interface PaymentFormData {
  invoiceId: string
  invoice_id?: string
  amount: number
  jumlah?: number
  paymentMethod: PaymentMethod | string
  metode?: string
  referenceNumber?: string
  referensi?: string
  paymentDate?: string
  tanggal?: string
  notes?: string
  catatan?: string
}

// ==========================================
// STOCK MOVEMENT TYPES
// ==========================================

export type StockMovementType = 'masuk' | 'keluar' | 'adjustment' | 'retur'

export interface StockMovement {
  id: number
  sparepart_id: number
  tipe: StockMovementType
  quantity: number
  stok_sebelum: number
  stok_sesudah: number
  referensi_tipe?: string
  referensi_id?: number
  harga_satuan?: number
  catatan?: string
  created_by: number
  created_at: string
  sparepart?: Sparepart
  user?: User
}

export interface StockMovementFormData {
  sparepart_id: number
  tipe: StockMovementType
  quantity: number
  harga_satuan?: number
  catatan?: string
}

// ==========================================
// PURCHASE ORDER TYPES
// ==========================================

export type POStatus = 'draft' | 'pending' | 'approved' | 'received' | 'cancelled'

// Supplier is now consolidated above

export interface PurchaseOrderItem {
  id: number
  po_id: number
  sparepart_id: number
  quantity_order: number
  quantity_received: number
  harga_satuan: number
  subtotal: number
  sparepart?: Sparepart
}

export interface PurchaseOrder {
  id: number
  nomor_po: string
  supplier_id: number
  tanggal: string
  status: POStatus
  total: number
  catatan?: string
  created_by: number
  approved_by?: number
  approved_at?: string
  created_at: string
  updated_at: string
  supplier?: Supplier
  items?: PurchaseOrderItem[]
}

// ==========================================
// REPORT TYPES
// ==========================================

export interface DashboardStats {
  total_spk_aktif: number
  total_spk_selesai_hari_ini: number
  total_pendapatan_hari_ini: number
  total_pendapatan_bulan_ini: number
  spk_menunggu_part: number
  stok_kritis: number
}

export interface RevenueReport {
  periode: string
  total_jasa: number
  total_sparepart: number
  total_pendapatan: number
  jumlah_transaksi: number
}

export interface MekanikPerformance {
  mekanik_id: number
  nama_mekanik: string
  total_spk: number
  spk_selesai: number
  rata_rata_waktu: number // dalam menit
  total_pendapatan_jasa: number
}

// ==========================================
// ACTIVITY LOG TYPES
// ==========================================

export interface ActivityLog {
  id: number
  user_id: number
  action: string
  model_type: string
  model_id?: number
  old_values?: Record<string, unknown>
  new_values?: Record<string, unknown>
  ip_address?: string
  user_agent?: string
  created_at: string
  user?: User
}

// ==========================================
// PART REQUEST TYPES
// ==========================================

export type PartRequestStatus = 'pending' | 'approved' | 'rejected' | 'fulfilled'

export interface PartRequestItem {
  id: string
  sparepart_id: string
  sparepart_name: string
  sparepart_code: string
  quantity: number
  available_stock?: number
  notes?: string
}

export interface PartRequest {
  id: string
  orderNumber?: string
  spk_number?: string
  vehicle_plate?: string
  vehicle_info?: string
  mekanik_name?: string
  status: PartRequestStatus
  notes?: string
  rejectReason?: string
  created_at: string
  items: PartRequestItem[]
}

export interface PartRequestFormData {
  workOrderId?: string
  notes?: string
  items: {
    sparepartId: string
    quantity: number
    notes?: string
  }[]
}
// ==========================================
// SYSTEM SETTINGS TYPES
// ==========================================

export interface Setting {
  id: string
  key: string
  value: string
  group: string
  description?: string
  updatedAt: string
}
