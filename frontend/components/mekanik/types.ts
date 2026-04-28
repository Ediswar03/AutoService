import type { SPK, SPKPriority } from '@/types'

export interface MekanikTask extends Omit<SPK, 'priority'> {
  work_status: 'pending' | 'in_progress' | 'completed'
  priority?: SPKPriority | 'low' | 'normal' | 'high'
  started_at?: string
  completed_at?: string
}
