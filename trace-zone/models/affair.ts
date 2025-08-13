// models/affair.ts
export interface Affair {
  id: string
  spaceId: string
  title: string
  description?: string
  from: '小琪' | '小禹'
  to: '小琪' | '小禹'
  status: 'pending' | 'done'
  result?: string
  rating?: number
  createdAt: number
  updatedAt: number
}