# MEKANIK Module Documentation
## AutoServis System - Mobile-First Mechanic Interface

---

## Table of Contents

1. [Overview](#overview)
2. [Folder Structure](#folder-structure)
3. [Layout Architecture](#layout-architecture)
4. [Page Specifications](#page-specifications)
5. [Component Library](#component-library)
6. [Data Types & Interfaces](#data-types--interfaces)
7. [API Endpoints](#api-endpoints)
8. [State Management](#state-management)
9. [UI/UX Guidelines](#uiux-guidelines)

---

## Overview

Modul MEKANIK adalah interface khusus untuk teknisi/mekanik dalam AutoServis System. Dirancang dengan pendekatan **mobile-first** untuk memudahkan mekanik mengakses dan mengelola pekerjaan mereka langsung dari bengkel menggunakan smartphone atau tablet.

### Fitur Utama:
- Dashboard real-time dengan status pekerjaan
- Manajemen SPK (Surat Perintah Kerja)
- Form pemeriksaan kendaraan digital
- Pengajuan suku cadang
- Riwayat pekerjaan
- Profil dan performa mekanik

---

## Folder Structure

```
/app/mekanik/
├── layout.tsx                    # Main layout dengan bottom navigation
├── page.tsx                      # Redirect ke dashboard
│
├── /dashboard/
│   └── page.tsx                  # Dashboard mekanik
│
├── /jobs/
│   ├── page.tsx                  # Daftar semua SPK/tugas
│   └── /[id]/
│       ├── page.tsx              # Redirect ke detail
│       ├── /detail/
│       │   └── page.tsx          # Detail SPK lengkap
│       ├── /inspection/
│       │   └── page.tsx          # Form pemeriksaan kendaraan
│       └── /quotation/
│           └── page.tsx          # Hasil quotation/estimasi
│
├── /parts-request/
│   ├── page.tsx                  # Daftar permintaan suku cadang
│   └── /new/
│       └── page.tsx              # Form pengajuan baru
│
├── /history/
│   └── page.tsx                  # Riwayat pekerjaan
│
└── /profile/
    └── page.tsx                  # Profil mekanik

/components/mekanik/
├── layout/
│   ├── mekanik-header.tsx        # Header component
│   ├── bottom-nav.tsx            # Bottom navigation bar
│   └── pull-refresh.tsx          # Pull-to-refresh wrapper
│
├── dashboard/
│   ├── greeting-card.tsx         # Kartu sapaan
│   ├── status-summary.tsx        # Ringkasan status SPK
│   ├── quick-actions.tsx         # Tombol aksi cepat
│   ├── today-jobs-widget.tsx     # Widget SPK hari ini
│   └── rating-widget.tsx         # Widget rating mekanik
│
├── jobs/
│   ├── job-card.tsx              # Card untuk setiap job
│   ├── job-filter.tsx            # Filter & sorting
│   ├── job-status-badge.tsx      # Badge status
│   └── job-timer.tsx             # Timer estimasi
│
├── inspection/
│   ├── customer-complaint.tsx    # Section keluhan pelanggan
│   ├── visual-checklist.tsx      # Checklist pemeriksaan
│   ├── checklist-item.tsx        # Item checklist individual
│   ├── photo-upload.tsx          # Upload foto masalah
│   ├── diagnosis-form.tsx        # Form diagnosis
│   └── cost-estimation.tsx       # Estimasi biaya
│
├── quotation/
│   ├── quotation-view.tsx        # Tampilan quotation
│   ├── approval-status.tsx       # Status approval
│   └── quotation-actions.tsx     # Aksi quotation
│
├── parts/
│   ├── parts-request-card.tsx    # Card permintaan parts
│   ├── parts-request-form.tsx    # Form pengajuan
│   └── parts-status-badge.tsx    # Status badge parts
│
├── history/
│   ├── history-card.tsx          # Card riwayat
│   ├── history-filter.tsx        # Filter riwayat
│   └── history-stats.tsx         # Statistik performa
│
└── shared/
    ├── vehicle-info.tsx          # Info kendaraan
    ├── customer-info.tsx         # Info pelanggan
    ├── spk-header.tsx            # Header SPK
    └── confirmation-modal.tsx    # Modal konfirmasi
```

---

## Layout Architecture

### Main Layout (`/app/mekanik/layout.tsx`)

```tsx
// Layout Structure
interface MekanikLayoutProps {
  children: React.ReactNode
}

export default function MekanikLayout({ children }: MekanikLayoutProps) {
  return (
    <div className="min-h-screen bg-background">
      {/* Header - Fixed top */}
      <MekanikHeader />
      
      {/* Main Content - Scrollable */}
      <main className="pb-20 pt-14">
        <PullToRefresh>
          {children}
        </PullToRefresh>
      </main>
      
      {/* Bottom Navigation - Fixed bottom */}
      <BottomNav />
    </div>
  )
}
```

### Header Component

```tsx
// components/mekanik/layout/mekanik-header.tsx

interface MekanikHeaderProps {
  title?: string
  showBack?: boolean
  rightAction?: React.ReactNode
}

/**
 * Header minimal dengan:
 * - Logo/Title di kiri
 * - User avatar + dropdown (profile, logout) di kanan
 * - Optional back button untuk sub-pages
 */
```

**Spesifikasi:**
| Property | Type | Default | Description |
|----------|------|---------|-------------|
| title | string | "AutoServis" | Judul halaman |
| showBack | boolean | false | Tampilkan tombol back |
| rightAction | ReactNode | null | Custom action di kanan |

### Bottom Navigation

```tsx
// components/mekanik/layout/bottom-nav.tsx

const navItems = [
  { icon: Home, label: "Dashboard", href: "/mekanik/dashboard" },
  { icon: ClipboardList, label: "Jobs", href: "/mekanik/jobs" },
  { icon: Package, label: "Parts", href: "/mekanik/parts-request" },
  { icon: History, label: "History", href: "/mekanik/history" },
  { icon: User, label: "Profile", href: "/mekanik/profile" },
]
```

**Design Specs:**
- Height: 64px (h-16)
- Background: bg-background with border-t
- Icons: 24px dengan label 12px
- Active state: Primary color dengan filled icon
- Safe area padding untuk notch devices

### Responsive Breakpoints

```css
/* Mobile First Approach */
/* Base: Mobile (< 640px) */
.container { @apply px-4; }

/* Tablet (>= 640px) */
@screen sm {
  .container { @apply px-6 max-w-xl mx-auto; }
}

/* Desktop (>= 1024px) */
@screen lg {
  /* Convert to sidebar layout */
  .bottom-nav { @apply hidden; }
  .sidebar { @apply block w-64; }
}
```

---

## Page Specifications

### A. Dashboard Mekanik

**Route:** `/mekanik/dashboard`

**Layout:**
```
┌─────────────────────────────────┐
│ [Header: AutoServis]    [Avatar]│
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Selamat Pagi, Budi! 👋      │ │
│ │ Semangat kerja hari ini     │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────┐ ┌─────────┐ ┌─────┐ │
│ │ Pending │ │ Active  │ │Done │ │
│ │    5    │ │    2    │ │  8  │ │
│ └─────────┘ └─────────┘ └─────┘ │
│                                 │
│ ┌─────────────┐ ┌─────────────┐ │
│ │ 🔍 New      │ │ 🔧 Request  │ │
│ │ Inspection  │ │ Parts       │ │
│ └─────────────┘ └─────────────┘ │
│                                 │
│ SPK Hari Ini                    │
│ ┌─────────────────────────────┐ │
│ │ SPK-001 | Toyota Avanza     │ │
│ │ Service Berkala | ⏰ 2 jam  │ │
│ │ [In Progress]               │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ SPK-002 | Honda Jazz        │ │
│ │ Ganti Oli | ⏰ 30 menit     │ │
│ │ [Pending]                   │ │
│ └─────────────────────────────┘ │
│                                 │
│ ⭐ Rating Anda: 4.8 (120 review)│
│                                 │
├─────────────────────────────────┤
│ [🏠] [📋] [📦] [📜] [👤]       │
└─────────────────────────────────┘
```

**Components:**

#### 1. Greeting Card
```tsx
interface GreetingCardProps {
  mechanicName: string
  greeting: "pagi" | "siang" | "sore" | "malam"
}

// Features:
// - Dynamic greeting berdasarkan waktu
// - Motivational message random
// - Gradient background
```

#### 2. Status Summary
```tsx
interface StatusSummaryProps {
  pending: number
  inProgress: number
  completed: number
}

// Features:
// - 3 card horizontal scroll atau grid
// - Tap untuk filter jobs
// - Animated count
```

#### 3. Quick Actions
```tsx
interface QuickAction {
  icon: LucideIcon
  label: string
  href: string
  variant: "primary" | "secondary"
}

// Actions:
// - New Inspection → /mekanik/jobs (filtered: new)
// - Request Parts → /mekanik/parts-request/new
```

#### 4. Today Jobs Widget
```tsx
interface TodayJobsWidgetProps {
  jobs: JobSummary[]
  maxDisplay?: number // default: 3
}

// Features:
// - Card-based layout
// - Swipeable cards
// - "View All" link
```

#### 5. Rating Widget
```tsx
interface RatingWidgetProps {
  averageRating: number
  totalReviews: number
  recentTrend: "up" | "down" | "stable"
}
```

---

### B. Daftar SPK/Tugas (Jobs List)

**Route:** `/mekanik/jobs`

**Layout:**
```
┌─────────────────────────────────┐
│ [←] Daftar SPK          [Filter]│
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ [All] [Pending] [Active] [Done] │
│ └─────────────────────────────┘ │
│                                 │
│ Sort by: [Priority ▼]          │
│                                 │
│ ↓ Pull to refresh              │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ SPK-2024-001                │ │
│ │ ─────────────────────────── │ │
│ │ 👤 Ahmad Sudirman           │ │
│ │ 🚗 Toyota Avanza 2020       │ │
│ │    B 1234 ABC               │ │
│ │ ─────────────────────────── │ │
│ │ 🔧 Service Berkala 10.000km │ │
│ │ ⏰ Est: 2 jam               │ │
│ │ ─────────────────────────── │ │
│ │ [🟡 Pending]                │ │
│ │                             │ │
│ │ [Lihat Detail] [Mulai Kerja]│ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ SPK-2024-002                │ │
│ │ ... (card serupa)           │ │
│ └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ [🏠] [📋] [📦] [📜] [👤]       │
└─────────────────────────────────┘
```

**Job Card Component:**

```tsx
interface JobCardProps {
  job: {
    id: string
    spkNumber: string
    customer: {
      name: string
      phone: string
    }
    vehicle: {
      brand: string
      model: string
      year: number
      plateNumber: string
    }
    serviceType: string
    description: string
    status: JobStatus
    priority: "low" | "normal" | "high" | "urgent"
    estimatedDuration: number // in minutes
    assignedAt: Date
    startedAt?: Date
    completedAt?: Date
  }
  onViewDetail: () => void
  onStartWork: () => void
  onMarkDone: () => void
}

type JobStatus = "pending" | "in_progress" | "waiting_parts" | "waiting_approval" | "completed"
```

**Status Badge Colors:**
| Status | Color | Label |
|--------|-------|-------|
| pending | yellow/warning | Pending |
| in_progress | blue/info | Dikerjakan |
| waiting_parts | orange | Tunggu Parts |
| waiting_approval | purple | Tunggu Approval |
| completed | green/success | Selesai |

**Filter Component:**
```tsx
interface JobFilterProps {
  activeStatus: JobStatus | "all"
  sortBy: "priority" | "date" | "duration"
  sortOrder: "asc" | "desc"
  onFilterChange: (status: JobStatus | "all") => void
  onSortChange: (sort: SortConfig) => void
}
```

---

### C. Detail SPK

**Route:** `/mekanik/jobs/[id]/detail`

**Layout:**
```
┌─────────────────────────────────┐
│ [←] Detail SPK          [More ⋮]│
├─────────────────────────────────┤
│                                 │
│ SPK-2024-001                    │
│ [🟡 Pending]                    │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📋 Informasi SPK            │ │
│ ├─────────────────────────────┤ │
│ │ Tanggal    : 15 Jan 2024    │ │
│ │ Jam Masuk  : 09:30 WIB      │ │
│ │ Estimasi   : 2 jam          │ │
│ │ Priority   : 🔴 High        │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 👤 Data Pelanggan           │ │
│ ├─────────────────────────────┤ │
│ │ Nama  : Ahmad Sudirman      │ │
│ │ Telp  : 0812-3456-7890 [📞] │ │
│ │ Email : ahmad@email.com     │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🚗 Data Kendaraan           │ │
│ ├─────────────────────────────┤ │
│ │ Merk/Model : Toyota Avanza  │ │
│ │ Tahun      : 2020           │ │
│ │ Plat       : B 1234 ABC     │ │
│ │ Kilometer  : 45.000 km      │ │
│ │ Warna      : Silver         │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 🔧 Jenis Layanan            │ │
│ ├─────────────────────────────┤ │
│ │ Service Berkala 10.000 km   │ │
│ │                             │ │
│ │ Keluhan:                    │ │
│ │ "AC kurang dingin, suara    │ │
│ │ mesin agak kasar saat idle" │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📎 Dokumen Terlampir        │ │
│ ├─────────────────────────────┤ │
│ │ [📄 STNK] [📄 Booking Form] │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ [🔍 Mulai Pemeriksaan]      │ │
│ │ [▶️ Mulai Pengerjaan]       │ │
│ └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ [🏠] [📋] [📦] [📜] [👤]       │
└─────────────────────────────────┘
```

**Action Buttons Logic:**
| Current Status | Available Actions |
|----------------|-------------------|
| pending | Mulai Pemeriksaan, Mulai Pengerjaan |
| in_progress | Lihat Pemeriksaan, Ajukan Parts, Mark Done |
| waiting_parts | Lihat Status Parts |
| waiting_approval | Lihat Quotation |
| completed | Lihat Hasil, Print |

---

### D. Form Pemeriksaan Kendaraan (Inspection Form)

**Route:** `/mekanik/jobs/[id]/inspection`

**Layout - Multi-Step Form:**

```
┌─────────────────────────────────┐
│ [×] Pemeriksaan Kendaraan       │
├─────────────────────────────────┤
│ Progress: ████████░░░░ 65%      │
│ Step 2 of 4: Pemeriksaan Visual │
├─────────────────────────────────┤
│                                 │
│ [Content area - varies by step] │
│                                 │
├─────────────────────────────────┤
│ [← Sebelumnya]    [Selanjutnya →]│
└─────────────────────────────────┘
```

#### Step 1: Keluhan Pelanggan (Read-Only)

```tsx
interface CustomerComplaintProps {
  complaint: string
  additionalNotes?: string
  attachments?: Attachment[]
}
```

**Display:**
```
┌─────────────────────────────────┐
│ 📝 Keluhan Pelanggan            │
├─────────────────────────────────┤
│                                 │
│ "AC kurang dingin, suara mesin  │
│ agak kasar saat idle, dan rem   │
│ terasa kurang pakem"            │
│                                 │
│ Catatan SA:                     │
│ "Pelanggan minta prioritas AC   │
│ karena sering bepergian jauh"   │
│                                 │
│ 📎 Foto dari Pelanggan:         │
│ [🖼️] [🖼️] [🖼️]                │
│                                 │
└─────────────────────────────────┘
```

#### Step 2: Pemeriksaan Visual (Checklist)

```tsx
interface ChecklistCategory {
  id: string
  name: string
  items: ChecklistItem[]
}

interface ChecklistItem {
  id: string
  name: string
  description?: string
  status: "unchecked" | "ok" | "needs_repair" | "critical"
  notes?: string
  photos?: string[]
}

const inspectionCategories: ChecklistCategory[] = [
  {
    id: "engine",
    name: "Mesin",
    items: [
      { id: "oil_level", name: "Level Oli Mesin", ... },
      { id: "coolant", name: "Air Radiator", ... },
      { id: "belt", name: "Kondisi Belt", ... },
      { id: "air_filter", name: "Filter Udara", ... },
      { id: "spark_plugs", name: "Busi", ... },
    ]
  },
  {
    id: "transmission",
    name: "Transmisi",
    items: [
      { id: "trans_oil", name: "Oli Transmisi", ... },
      { id: "clutch", name: "Kopling (MT)", ... },
      { id: "gear_shift", name: "Perpindahan Gigi", ... },
    ]
  },
  {
    id: "suspension",
    name: "Suspensi & Kemudi",
    items: [
      { id: "shock_front", name: "Shock Depan", ... },
      { id: "shock_rear", name: "Shock Belakang", ... },
      { id: "tie_rod", name: "Tie Rod", ... },
      { id: "ball_joint", name: "Ball Joint", ... },
      { id: "steering", name: "Steering Rack", ... },
    ]
  },
  {
    id: "brakes",
    name: "Sistem Rem",
    items: [
      { id: "brake_pad_front", name: "Kampas Rem Depan", ... },
      { id: "brake_pad_rear", name: "Kampas Rem Belakang", ... },
      { id: "brake_disc", name: "Disc Brake", ... },
      { id: "brake_fluid", name: "Minyak Rem", ... },
      { id: "handbrake", name: "Rem Tangan", ... },
    ]
  },
  {
    id: "electrical",
    name: "Kelistrikan",
    items: [
      { id: "battery", name: "Aki/Baterai", ... },
      { id: "alternator", name: "Alternator", ... },
      { id: "lights", name: "Lampu-lampu", ... },
      { id: "ac_system", name: "Sistem AC", ... },
    ]
  },
  {
    id: "tires",
    name: "Ban & Velg",
    items: [
      { id: "tire_fl", name: "Ban Depan Kiri", ... },
      { id: "tire_fr", name: "Ban Depan Kanan", ... },
      { id: "tire_rl", name: "Ban Belakang Kiri", ... },
      { id: "tire_rr", name: "Ban Belakang Kanan", ... },
      { id: "spare_tire", name: "Ban Serep", ... },
    ]
  },
  {
    id: "body",
    name: "Body & Eksterior",
    items: [
      { id: "paint", name: "Cat Body", ... },
      { id: "windshield", name: "Kaca Depan", ... },
      { id: "wipers", name: "Wiper", ... },
      { id: "mirrors", name: "Spion", ... },
    ]
  },
  {
    id: "interior",
    name: "Interior",
    items: [
      { id: "seats", name: "Jok", ... },
      { id: "dashboard", name: "Dashboard", ... },
      { id: "carpet", name: "Karpet", ... },
      { id: "seatbelt", name: "Sabuk Pengaman", ... },
    ]
  },
]
```

**Checklist Item UI:**
```
┌─────────────────────────────────┐
│ ⚙️ Mesin                        │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ Level Oli Mesin             │ │
│ │ ┌────┐ ┌────┐ ┌────┐ ┌────┐ │ │
│ │ │ ❓ │ │ ✅ │ │ ⚠️ │ │ 🔴 │ │ │
│ │ │Skip│ │ OK │ │Fix │ │Crit│ │ │
│ │ └────┘ └────┘ └────┘ └────┘ │ │
│ │                             │ │
│ │ [+ Tambah Catatan]          │ │
│ │ [📷 Ambil Foto]             │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Air Radiator                │ │
│ │ [✅ OK] ✓                   │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Kondisi Belt                │ │
│ │ [⚠️ Perlu Perbaikan] ✓      │ │
│ │                             │ │
│ │ 📝 "Belt sudah retak,       │ │
│ │    disarankan ganti"        │ │
│ │                             │ │
│ │ 📷 [🖼️ foto1] [🖼️ foto2]   │ │
│ └─────────────────────────────┘ │
└─────────────────────────────────┘
```

**Photo Upload Component:**
```tsx
interface PhotoUploadProps {
  itemId: string
  photos: string[]
  maxPhotos?: number // default: 5
  onUpload: (file: File) => Promise<string>
  onRemove: (photoUrl: string) => void
}

// Features:
// - Camera capture langsung
// - Gallery picker
// - Image preview
// - Compress before upload
// - Progress indicator
```

#### Step 3: Diagnosis & Rekomendasi

```tsx
interface DiagnosisFormProps {
  initialDiagnosis?: string
  recommendations?: string
  onSave: (data: DiagnosisData) => void
}
```

**Layout:**
```
┌─────────────────────────────────┐
│ 🔍 Diagnosis & Rekomendasi      │
├─────────────────────────────────┤
│                                 │
│ Hasil Diagnosis:                │
│ ┌─────────────────────────────┐ │
│ │ (textarea)                  │ │
│ │ Masalah yang ditemukan:     │ │
│ │ 1. Belt kipas retak         │ │
│ │ 2. Freon AC kurang          │ │
│ │ 3. Kampas rem depan tipis   │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ Rekomendasi Perbaikan:          │
│ ┌─────────────────────────────┐ │
│ │ (textarea)                  │ │
│ │ 1. Ganti belt kipas         │ │
│ │ 2. Isi ulang freon + cek    │ │
│ │    kebocoran                │ │
│ │ 3. Ganti kampas rem depan   │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ Template cepat:                 │
│ [Service Berkala] [Turun Mesin] │
│ [Overhaul AC] [Tune Up]         │
│                                 │
└─────────────────────────────────┘
```

#### Step 4: Estimasi Biaya

```tsx
interface CostItem {
  id: string
  type: "service" | "part" | "material"
  name: string
  quantity: number
  unit: string
  unitPrice: number
  discount?: number
  notes?: string
}

interface CostEstimationProps {
  items: CostItem[]
  onAddItem: (item: Omit<CostItem, "id">) => void
  onUpdateItem: (id: string, item: Partial<CostItem>) => void
  onRemoveItem: (id: string) => void
}
```

**Layout:**
```
┌─────────────────────────────────┐
│ 💰 Estimasi Biaya               │
├─────────────────────────────────┤
│                                 │
│ [+ Tambah Item]                 │
│                                 │
│ 🔧 Jasa Perbaikan:              │
│ ┌─────────────────────────────┐ │
│ │ Ganti Belt Kipas            │ │
│ │ 1 × Rp 150.000              │ │
│ │         Subtotal: Rp 150.000│ │
│ │                      [🗑️ ×] │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Isi Freon + Cek Kebocoran   │ │
│ │ 1 × Rp 350.000              │ │
│ │         Subtotal: Rp 350.000│ │
│ │                      [🗑️ ×] │ │
│ └─────────────────────────────┘ │
│                                 │
│ 🔩 Suku Cadang:                 │
│ ┌─────────────────────────────┐ │
│ │ Belt Kipas Fan AC           │ │
│ │ 1 pcs × Rp 85.000           │ │
│ │         Subtotal: Rp 85.000 │ │
│ └─────────────────────────────┘ │
│ ┌─────────────────────────────┐ │
│ │ Kampas Rem Depan            │ │
│ │ 1 set × Rp 450.000          │ │
│ │         Subtotal: Rp 450.000│ │
│ └─────────────────────────────┘ │
│                                 │
│ ─────────────────────────────── │
│ Subtotal Jasa    : Rp   500.000 │
│ Subtotal Parts   : Rp   535.000 │
│ ─────────────────────────────── │
│ TOTAL ESTIMASI   : Rp 1.035.000 │
│ ─────────────────────────────── │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ [💾 Simpan Draft]           │ │
│ │ [✅ Submit Quotation]       │ │
│ └─────────────────────────────┘ │
│                                 │
└─────────────────────────────────┘
```

**Add Item Modal:**
```
┌─────────────────────────────────┐
│ Tambah Item               [×]   │
├─────────────────────────────────┤
│                                 │
│ Tipe:                           │
│ [⚙️ Jasa] [🔩 Parts] [🧴 Material]│
│                                 │
│ Nama Item:                      │
│ [________________________]      │
│                                 │
│ Atau pilih dari katalog:        │
│ [🔍 Cari di katalog...]         │
│                                 │
│ Qty:        Satuan:             │
│ [1    ]     [pcs      ▼]        │
│                                 │
│ Harga Satuan:                   │
│ Rp [_______________]            │
│                                 │
│ Catatan (opsional):             │
│ [________________________]      │
│                                 │
│ [Batal]              [+ Tambah] │
│                                 │
└─────────────────────────────────┘
```

**Submit Confirmation Modal:**
```
┌─────────────────────────────────┐
│ ⚠️ Konfirmasi Submit            │
├─────────────────────────────────┤
│                                 │
│ Anda akan mengirim quotation    │
│ ini ke Service Advisor untuk    │
│ approval pelanggan.             │
│                                 │
│ Total: Rp 1.035.000             │
│                                 │
│ Setelah submit, Anda tidak      │
│ dapat mengubah quotation ini.   │
│                                 │
│ [Batal]        [Ya, Submit]     │
│                                 │
└─────────────────────────────────┘
```

---

### E. Halaman Quotation (Hasil Pemeriksaan)

**Route:** `/mekanik/jobs/[id]/quotation`

**Layout:**
```
┌─────────────────────────────────┐
│ [←] Quotation           [Share]│
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │ QUOTATION / ESTIMASI BIAYA  │ │
│ │ ─────────────────────────── │ │
│ │ No: QUO-2024-00123          │ │
│ │ Tanggal: 15 Jan 2024        │ │
│ │ SPK: SPK-2024-001           │ │
│ └─────────────────────────────┘ │
│                                 │
│ Status Approval:                │
│ ┌─────────────────────────────┐ │
│ │ [🟡 Menunggu Approval]      │ │
│ │ Dikirim: 15 Jan, 10:30      │ │
│ └─────────────────────────────┘ │
│                                 │
│ ─── Data Kendaraan ───          │
│ Toyota Avanza 2020              │
│ B 1234 ABC | 45.000 km          │
│                                 │
│ ─── Hasil Pemeriksaan ───       │
│ ┌─────────────────────────────┐ │
│ │ ⚠️ Perlu Perbaikan:         │ │
│ │ • Belt kipas retak          │ │
│ │ • Freon AC kurang           │ │
│ │ • Kampas rem depan tipis    │ │
│ │                             │ │
│ │ [📷 Lihat Foto Pemeriksaan] │ │
│ └─────────────────────────────┘ │
│                                 │
│ ─── Rincian Biaya ───           │
│                                 │
│ Jasa Perbaikan:                 │
│ • Ganti Belt         Rp 150.000 │
│ • Isi Freon          Rp 350.000 │
│                                 │
│ Suku Cadang:                    │
│ • Belt Kipas (1)     Rp  85.000 │
│ • Kampas Rem (1 set) Rp 450.000 │
│                                 │
│ ─────────────────────────────── │
│ Subtotal Jasa      Rp   500.000 │
│ Subtotal Parts     Rp   535.000 │
│ ─────────────────────────────── │
│ TOTAL              Rp 1.035.000 │
│ ─────────────────────────────── │
│                                 │
│ Estimasi Waktu: 3-4 jam         │
│                                 │
│ ─── Catatan ───                 │
│ Harga dapat berubah jika        │
│ ditemukan kerusakan lain saat   │
│ pengerjaan.                     │
│                                 │
├─────────────────────────────────┤
│ [🏠] [📋] [📦] [📜] [👤]       │
└─────────────────────────────────┘
```

**Approval Status States:**

```tsx
type QuotationStatus = 
  | "draft"           // Belum submit
  | "pending"         // Menunggu approval
  | "approved"        // Disetujui pelanggan
  | "rejected"        // Ditolak
  | "revised"         // Perlu revisi
  | "partial"         // Approved sebagian

interface ApprovalStatusProps {
  status: QuotationStatus
  submittedAt?: Date
  approvedAt?: Date
  rejectedAt?: Date
  rejectionReason?: string
  approvedItems?: string[] // untuk partial approval
}
```

**Status Display:**
| Status | Badge | Action Available |
|--------|-------|------------------|
| draft | Gray "Draft" | Edit, Submit |
| pending | Yellow "Menunggu Approval" | - |
| approved | Green "Disetujui" | Mulai Kerja |
| rejected | Red "Ditolak" | Lihat Alasan, Revisi |
| revised | Orange "Perlu Revisi" | Edit, Submit Ulang |
| partial | Blue "Disetujui Sebagian" | Lihat Detail, Mulai Kerja |

---

### F. Pengajuan Suku Cadang (Parts Request)

**Route:** `/mekanik/parts-request`

**List Layout:**
```
┌─────────────────────────────────┐
│ [←] Pengajuan Parts   [+ Baru] │
├─────────────────────────────────┤
│ ┌─────────────────────────────┐ │
│ │ [Semua] [Pending] [Approved]│ │
│ │ [Ready] [Installed]         │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ REQ-2024-001                │ │
│ │ SPK: SPK-2024-001           │ │
│ │ ─────────────────────────── │ │
│ │ • Belt Kipas Fan AC (1)     │ │
│ │ • Kampas Rem Depan (1 set)  │ │
│ │ ─────────────────────────── │ │
│ │ Diajukan: 15 Jan, 10:45     │ │
│ │ [🟢 Ready for Pickup]       │ │
│ │                             │ │
│ │ [Ambil Parts]               │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ REQ-2024-002                │ │
│ │ SPK: SPK-2024-003           │ │
│ │ ─────────────────────────── │ │
│ │ • Oli Mesin 10W-40 (4L)     │ │
│ │ • Filter Oli (1)            │ │
│ │ ─────────────────────────── │ │
│ │ Diajukan: 15 Jan, 14:20     │ │
│ │ [🟡 Pending Approval]       │ │
│ └─────────────────────────────┘ │
│                                 │
├─────────────────────────────────┤
│ [🏠] [📋] [📦] [📜] [👤]       │
└─────────────────────────────────┘
```

**New Request Form (`/mekanik/parts-request/new`):**
```
┌─────────────────────────────────┐
│ [×] Pengajuan Suku Cadang       │
├─────────────────────────────────┤
│                                 │
│ Untuk SPK:                      │
│ [SPK-2024-001 - Toyota Ava... ▼]│
│                                 │
│ Urgency:                        │
│ [Normal ▼]                      │
│                                 │
│ ─── Daftar Parts ───            │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ Belt Kipas Fan AC           │ │
│ │ SKU: BLT-AC-001             │ │
│ │ Qty: [1  ] [pcs]            │ │
│ │                      [🗑️ ×] │ │
│ └─────────────────────────────┘ │
│                                 │
│ [+ Tambah Part]                 │
│                                 │
│ Catatan untuk Gudang:           │
│ ┌─────────────────────────────┐ │
│ │ Kalau tidak ada merk ori,   │ │
│ │ aftermarket juga boleh      │ │
│ │                             │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Ajukan Permintaan]             │
│                                 │
├─────────────────────────────────┤
│ [🏠] [📋] [📦] [📜] [👤]       │
└─────────────────────────────────┘
```

**Parts Request Status:**
| Status | Description |
|--------|-------------|
| pending | Menunggu approval Parts Manager |
| approved | Disetujui, sedang disiapkan |
| ready | Parts siap diambil di gudang |
| picked_up | Sudah diambil mekanik |
| installed | Sudah dipasang |
| rejected | Ditolak (stok kosong, dll) |
| partial | Sebagian tersedia |

---

### G. Riwayat Pekerjaan (History)

**Route:** `/mekanik/history`

**Layout:**
```
┌─────────────────────────────────┐
│ [←] Riwayat Pekerjaan           │
├─────────────────────────────────┤
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 📊 Statistik Bulan Ini      │ │
│ ├─────────────────────────────┤ │
│ │ Total SPK    : 45           │ │
│ │ Selesai      : 42           │ │
│ │ Avg Rating   : ⭐ 4.8       │ │
│ │ On-Time Rate : 92%          │ │
│ └─────────────────────────────┘ │
│                                 │
│ Filter:                         │
│ [Januari 2024 ▼] [Semua Tipe ▼] │
│                                 │
│ ─── Januari 2024 ───            │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 15 Jan 2024                 │ │
│ │ SPK-2024-001                │ │
│ │ Toyota Avanza | Service     │ │
│ │ ⏱️ 2.5 jam | ⭐ 5.0         │ │
│ │ [✅ Selesai]                │ │
│ └─────────────────────────────┘ │
│                                 │
│ ┌─────────────────────────────┐ │
│ │ 14 Jan 2024                 │ │
│ │ SPK-2024-098                │ │
│ │ Honda Jazz | Tune Up        │ │
│ │ ⏱️ 1.5 jam | ⭐ 4.5         │ │
│ │ [✅ Selesai]                │ │
│ └─────────────────────────────┘ │
│                                 │
│ [Load More...]                  │
│                                 │
├─────────────────────────────────┤
│ [🏠] [📋] [📦] [📜] [👤]       │
└─────────────────────────────────┘
```

**History Card Component:**
```tsx
interface HistoryCardProps {
  job: {
    id: string
    spkNumber: string
    completedAt: Date
    vehicle: {
      brand: string
      model: string
    }
    serviceType: string
    actualDuration: number // minutes
    rating?: number
    review?: string
  }
  onViewDetail: () => void
}
```

**Statistics Widget:**
```tsx
interface HistoryStatsProps {
  period: "week" | "month" | "year"
  stats: {
    totalJobs: number
    completedJobs: number
    averageRating: number
    onTimeRate: number
    averageDuration: number
  }
}
```

---

### H. Profil Mekanik

**Route:** `/mekanik/profile`

**Layout:**
```
┌─────────────────────────────────┐
│ [←] Profil Saya        [⚙️ Edit]│
├─────────────────────────────────┤
│                                 │
│        ┌─────────┐              │
│        │  👤     │              │
│        │ [Foto]  │              │
│        └─────────┘              │
│                                 │
│      Budi Santoso               │
│      Senior Mechanic            │
│      ID: MK-2024-001            │
│                                 │
│ ─────────────────────────────── │
│                                 │
│ ⭐ Rating: 4.8 / 5.0            │
│ 📊 Total Jobs: 1,234            │
│ 🏆 On-Time: 95%                 │
│                                 │
│ ─── Informasi Kontak ───        │
│ 📱 0812-3456-7890               │
│ 📧 budi@autoservis.com          │
│                                 │
│ ─── Spesialisasi ───            │
│ [Mesin] [AC] [Kelistrikan]      │
│ [Transmisi Matic]               │
│                                 │
│ ─── Sertifikasi ───             │
│ • Toyota Certified Technician   │
│ • AC Specialist Certificate     │
│ • Defensive Driving             │
│                                 │
│ ─────────────────────────────── │
│                                 │
│ [🔔 Pengaturan Notifikasi]      │
│ [🔐 Ubah Password]              │
│ [📋 Panduan Aplikasi]           │
│ [🚪 Logout]                     │
│                                 │
├─────────────────────────────────┤
│ [🏠] [📋] [📦] [📜] [👤]       │
└─────────────────────────────────┘
```

---

## Data Types & Interfaces

### Core Types

```typescript
// === USER & AUTH ===
interface Mechanic {
  id: string
  name: string
  email: string
  phone: string
  employeeId: string
  role: "junior" | "senior" | "lead"
  avatar?: string
  specializations: string[]
  certifications: Certification[]
  rating: {
    average: number
    totalReviews: number
  }
  performance: {
    totalJobs: number
    completedJobs: number
    onTimeRate: number
  }
  createdAt: Date
  updatedAt: Date
}

interface Certification {
  name: string
  issuer: string
  issuedAt: Date
  expiresAt?: Date
  documentUrl?: string
}

// === SPK / JOB ===
interface SPK {
  id: string
  spkNumber: string
  customer: Customer
  vehicle: Vehicle
  serviceType: ServiceType
  complaint: string
  additionalNotes?: string
  attachments: Attachment[]
  status: SPKStatus
  priority: Priority
  assignedMechanic: string // mechanic id
  estimatedDuration: number // minutes
  actualDuration?: number
  
  // Timestamps
  createdAt: Date
  assignedAt: Date
  startedAt?: Date
  completedAt?: Date
  
  // Related data
  inspection?: Inspection
  quotation?: Quotation
  partsRequests: PartsRequest[]
}

type SPKStatus = 
  | "pending"           // Belum dikerjakan
  | "in_progress"       // Sedang dikerjakan
  | "inspection_done"   // Pemeriksaan selesai
  | "waiting_approval"  // Menunggu approval quotation
  | "waiting_parts"     // Menunggu parts
  | "working"           // Pengerjaan berlangsung
  | "completed"         // Selesai
  | "cancelled"         // Dibatalkan

type Priority = "low" | "normal" | "high" | "urgent"

// === CUSTOMER ===
interface Customer {
  id: string
  name: string
  phone: string
  email?: string
  address?: string
}

// === VEHICLE ===
interface Vehicle {
  id: string
  brand: string
  model: string
  year: number
  plateNumber: string
  color: string
  vin?: string
  engineNumber?: string
  currentMileage: number
  fuelType: "petrol" | "diesel" | "electric" | "hybrid"
  transmission: "manual" | "automatic" | "cvt"
}

// === SERVICE TYPE ===
interface ServiceType {
  id: string
  name: string
  category: "maintenance" | "repair" | "bodywork" | "electrical" | "other"
  estimatedDuration: number
  basePrice: number
}

// === INSPECTION ===
interface Inspection {
  id: string
  spkId: string
  mechanicId: string
  status: "draft" | "submitted" | "approved"
  customerComplaint: string
  checklistResults: ChecklistResult[]
  diagnosis: string
  recommendations: string
  photos: InspectionPhoto[]
  createdAt: Date
  submittedAt?: Date
}

interface ChecklistResult {
  categoryId: string
  categoryName: string
  items: ChecklistItemResult[]
}

interface ChecklistItemResult {
  itemId: string
  itemName: string
  status: "unchecked" | "ok" | "needs_repair" | "critical"
  notes?: string
  photos?: string[]
}

interface InspectionPhoto {
  id: string
  url: string
  caption?: string
  relatedItemId?: string
  uploadedAt: Date
}

// === QUOTATION ===
interface Quotation {
  id: string
  quotationNumber: string
  spkId: string
  inspectionId: string
  mechanicId: string
  status: QuotationStatus
  items: QuotationItem[]
  subtotalService: number
  subtotalParts: number
  subtotalMaterial: number
  discount?: number
  total: number
  estimatedDuration: number // minutes
  notes?: string
  
  // Approval
  approvalStatus: ApprovalStatus
  approvedItems?: string[] // for partial approval
  rejectionReason?: string
  
  // Timestamps
  createdAt: Date
  submittedAt?: Date
  approvedAt?: Date
  rejectedAt?: Date
}

type QuotationStatus = "draft" | "submitted" | "approved" | "rejected" | "revised"

interface QuotationItem {
  id: string
  type: "service" | "part" | "material"
  name: string
  sku?: string
  quantity: number
  unit: string
  unitPrice: number
  discount?: number
  subtotal: number
  notes?: string
  isApproved?: boolean // for partial approval
}

interface ApprovalStatus {
  status: "pending" | "approved" | "rejected" | "partial"
  approvedBy?: string
  approvedAt?: Date
  notes?: string
}

// === PARTS REQUEST ===
interface PartsRequest {
  id: string
  requestNumber: string
  spkId: string
  mechanicId: string
  status: PartsRequestStatus
  urgency: "normal" | "urgent"
  items: PartsRequestItem[]
  notes?: string
  
  // Timestamps
  createdAt: Date
  approvedAt?: Date
  readyAt?: Date
  pickedUpAt?: Date
}

type PartsRequestStatus = 
  | "pending"
  | "approved"
  | "rejected"
  | "preparing"
  | "ready"
  | "picked_up"
  | "installed"
  | "partial"

interface PartsRequestItem {
  id: string
  partId?: string
  partName: string
  sku?: string
  quantity: number
  unit: string
  status: "pending" | "available" | "not_available" | "ordered"
  alternativePartId?: string
  notes?: string
}

// === HISTORY ===
interface JobHistory {
  id: string
  spkId: string
  spkNumber: string
  customer: {
    name: string
  }
  vehicle: {
    brand: string
    model: string
    plateNumber: string
  }
  serviceType: string
  completedAt: Date
  actualDuration: number
  rating?: number
  review?: string
  totalAmount: number
}

// === ATTACHMENT ===
interface Attachment {
  id: string
  type: "image" | "document" | "video"
  url: string
  filename: string
  uploadedAt: Date
}
```

---

## API Endpoints

### Authentication

```
POST   /api/mekanik/auth/login
POST   /api/mekanik/auth/logout
POST   /api/mekanik/auth/refresh-token
GET    /api/mekanik/auth/me
```

### Dashboard

```
GET    /api/mekanik/dashboard
       Response: {
         mechanic: Mechanic
         todayStats: { pending, inProgress, completed }
         todayJobs: SPK[]
         rating: { average, totalReviews, recentTrend }
       }
```

### Jobs / SPK

```
GET    /api/mekanik/jobs
       Query: status, priority, sort, page, limit
       Response: { jobs: SPK[], pagination }

GET    /api/mekanik/jobs/:id
       Response: SPK (with full details)

PATCH  /api/mekanik/jobs/:id/status
       Body: { status: SPKStatus }
       Response: SPK

POST   /api/mekanik/jobs/:id/start
       Response: SPK

POST   /api/mekanik/jobs/:id/complete
       Response: SPK
```

### Inspection

```
GET    /api/mekanik/jobs/:id/inspection
       Response: Inspection | null

POST   /api/mekanik/jobs/:id/inspection
       Body: Omit<Inspection, 'id' | 'createdAt'>
       Response: Inspection

PATCH  /api/mekanik/jobs/:id/inspection
       Body: Partial<Inspection>
       Response: Inspection

POST   /api/mekanik/jobs/:id/inspection/submit
       Response: Inspection

POST   /api/mekanik/jobs/:id/inspection/photos
       Body: FormData (file)
       Response: { url: string }
```

### Quotation

```
GET    /api/mekanik/jobs/:id/quotation
       Response: Quotation | null

POST   /api/mekanik/jobs/:id/quotation
       Body: Omit<Quotation, 'id' | 'createdAt'>
       Response: Quotation

PATCH  /api/mekanik/jobs/:id/quotation
       Body: Partial<Quotation>
       Response: Quotation

POST   /api/mekanik/jobs/:id/quotation/submit
       Response: Quotation

GET    /api/mekanik/jobs/:id/quotation/approval-status
       Response: ApprovalStatus
```

### Parts Request

```
GET    /api/mekanik/parts-requests
       Query: status, page, limit
       Response: { requests: PartsRequest[], pagination }

GET    /api/mekanik/parts-requests/:id
       Response: PartsRequest

POST   /api/mekanik/parts-requests
       Body: {
         spkId: string
         urgency: string
         items: PartsRequestItem[]
         notes?: string
       }
       Response: PartsRequest

POST   /api/mekanik/parts-requests/:id/pickup
       Response: PartsRequest

POST   /api/mekanik/parts-requests/:id/confirm-install
       Response: PartsRequest

GET    /api/mekanik/parts/search
       Query: q, category
       Response: Part[]
```

### History

```
GET    /api/mekanik/history
       Query: month, year, serviceType, page, limit
       Response: { jobs: JobHistory[], pagination, stats }

GET    /api/mekanik/history/stats
       Query: period (week | month | year)
       Response: HistoryStats
```

### Profile

```
GET    /api/mekanik/profile
       Response: Mechanic

PATCH  /api/mekanik/profile
       Body: Partial<Mechanic>
       Response: Mechanic

POST   /api/mekanik/profile/avatar
       Body: FormData (file)
       Response: { url: string }

POST   /api/mekanik/profile/change-password
       Body: { currentPassword, newPassword }
       Response: { success: boolean }
```

### Notifications

```
GET    /api/mekanik/notifications
       Query: unreadOnly, page, limit
       Response: { notifications: Notification[], unreadCount }

PATCH  /api/mekanik/notifications/:id/read
       Response: Notification

POST   /api/mekanik/notifications/read-all
       Response: { success: boolean }
```

---

## State Management

### Recommended: SWR + Context

```tsx
// === SWR Hooks ===

// Dashboard
function useDashboard() {
  return useSWR('/api/mekanik/dashboard', fetcher)
}

// Jobs List
function useJobs(filters: JobFilters) {
  return useSWR(
    ['/api/mekanik/jobs', filters],
    ([url, filters]) => fetcher(url, { params: filters })
  )
}

// Single Job
function useJob(id: string) {
  return useSWR(`/api/mekanik/jobs/${id}`, fetcher)
}

// Inspection
function useInspection(jobId: string) {
  return useSWR(`/api/mekanik/jobs/${jobId}/inspection`, fetcher)
}

// Parts Requests
function usePartsRequests(filters: PartsFilters) {
  return useSWR(
    ['/api/mekanik/parts-requests', filters],
    ([url, filters]) => fetcher(url, { params: filters })
  )
}

// History
function useHistory(filters: HistoryFilters) {
  return useSWR(
    ['/api/mekanik/history', filters],
    ([url, filters]) => fetcher(url, { params: filters })
  )
}

// Profile
function useProfile() {
  return useSWR('/api/mekanik/profile', fetcher)
}

// === Context for Auth ===
interface MekanikAuthContext {
  mechanic: Mechanic | null
  isLoading: boolean
  login: (credentials: LoginCredentials) => Promise<void>
  logout: () => Promise<void>
}

// === Context for Inspection Form ===
interface InspectionFormContext {
  currentStep: number
  formData: Partial<Inspection>
  setStep: (step: number) => void
  updateFormData: (data: Partial<Inspection>) => void
  saveDraft: () => Promise<void>
  submit: () => Promise<void>
  isSubmitting: boolean
}
```

### Local State (Zustand Alternative)

```tsx
// For complex inspection form state
interface InspectionStore {
  // State
  checklistResults: Map<string, ChecklistItemResult>
  photos: InspectionPhoto[]
  diagnosis: string
  recommendations: string
  costItems: QuotationItem[]
  
  // Actions
  updateChecklistItem: (itemId: string, result: Partial<ChecklistItemResult>) => void
  addPhoto: (photo: InspectionPhoto) => void
  removePhoto: (photoId: string) => void
  setDiagnosis: (text: string) => void
  setRecommendations: (text: string) => void
  addCostItem: (item: QuotationItem) => void
  updateCostItem: (itemId: string, data: Partial<QuotationItem>) => void
  removeCostItem: (itemId: string) => void
  
  // Computed
  getTotalCost: () => number
  getIssueCount: () => { needsRepair: number; critical: number }
  
  // Persistence
  saveDraft: () => Promise<void>
  loadDraft: (spkId: string) => Promise<void>
  clearDraft: () => void
}
```

---

## UI/UX Guidelines

### Mobile-First Design Principles

1. **Touch-Friendly**
   - Minimum touch target: 44x44px
   - Adequate spacing between interactive elements
   - Swipe gestures untuk common actions

2. **Progressive Disclosure**
   - Show essential information first
   - Use expandable sections for details
   - Bottom sheets for additional options

3. **Offline Consideration**
   - Cache critical data locally
   - Queue actions when offline
   - Clear sync status indicators

### Component Sizing

```css
/* Touch Targets */
.touch-target {
  min-height: 44px;
  min-width: 44px;
}

/* Spacing */
.card-padding { @apply p-4; }
.section-gap { @apply space-y-4; }
.list-gap { @apply space-y-3; }

/* Typography - Mobile */
.heading-1 { @apply text-2xl font-bold; }
.heading-2 { @apply text-xl font-semibold; }
.heading-3 { @apply text-lg font-medium; }
.body { @apply text-base; }
.caption { @apply text-sm text-muted-foreground; }
```

### Color Usage

```css
/* Status Colors */
--status-pending: theme('colors.yellow.500');
--status-in-progress: theme('colors.blue.500');
--status-waiting: theme('colors.orange.500');
--status-completed: theme('colors.green.500');
--status-rejected: theme('colors.red.500');

/* Priority Colors */
--priority-low: theme('colors.slate.500');
--priority-normal: theme('colors.blue.500');
--priority-high: theme('colors.orange.500');
--priority-urgent: theme('colors.red.500');

/* Inspection Status */
--check-ok: theme('colors.green.500');
--check-needs-repair: theme('colors.yellow.500');
--check-critical: theme('colors.red.500');
```

### Animation Guidelines

```tsx
// Page transitions
const pageTransition = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -20 },
  transition: { duration: 0.2 }
}

// Card interactions
const cardHover = {
  scale: 1.02,
  transition: { duration: 0.15 }
}

// Pull to refresh
const pullRefresh = {
  pulling: { rotate: 0 },
  ready: { rotate: 180 },
  refreshing: { rotate: [0, 360], transition: { repeat: Infinity, duration: 1 } }
}
```

### Accessibility Checklist

- [ ] All interactive elements have focus states
- [ ] Color is not the only indicator of status
- [ ] Images have alt text
- [ ] Forms have proper labels
- [ ] Error messages are descriptive
- [ ] Loading states are announced
- [ ] Sufficient color contrast (WCAG AA)
- [ ] Touch targets are adequately sized

---

## File Templates

### Page Template

```tsx
// app/mekanik/[page]/page.tsx
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Page Title | AutoServis Mekanik',
  description: 'Page description',
}

export default async function PageName() {
  return (
    <div className="px-4 py-6 space-y-6">
      {/* Page content */}
    </div>
  )
}
```

### Component Template

```tsx
// components/mekanik/[feature]/component-name.tsx
'use client'

import { ComponentProps } from 'react'

interface ComponentNameProps {
  // Props definition
}

export function ComponentName({ ...props }: ComponentNameProps) {
  return (
    <div>
      {/* Component content */}
    </div>
  )
}
```

### API Route Template

```tsx
// app/api/mekanik/[endpoint]/route.ts
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    // Handler logic
    return NextResponse.json({ data })
  } catch (error) {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
```

---

## Implementation Checklist

### Phase 1: Foundation
- [ ] Setup routing structure
- [ ] Implement main layout with header & bottom nav
- [ ] Setup authentication context
- [ ] Create base components (cards, badges, etc.)

### Phase 2: Core Features
- [ ] Dashboard page
- [ ] Jobs list with filtering
- [ ] Job detail page
- [ ] Inspection form (multi-step)
- [ ] Quotation view

### Phase 3: Supporting Features
- [ ] Parts request list & form
- [ ] History page
- [ ] Profile page
- [ ] Notifications

### Phase 4: Polish
- [ ] Pull-to-refresh
- [ ] Offline support
- [ ] Performance optimization
- [ ] Accessibility audit
- [ ] Testing

---

*Document Version: 1.0*
*Last Updated: 2024*
*AutoServis System - Mekanik Module*
