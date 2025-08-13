export const REQUEST_EVENTS = {
  NEW: 'request:new',
  CANCELLED: 'request:cancelled',
  CONSUMED: 'request:consumed',
  ACCEPTED: 'request:accepted',
  REJECTED: 'request:rejected',
} as const

export type RequestEventName = typeof REQUEST_EVENTS[keyof typeof REQUEST_EVENTS]

export interface RequestNewPayload<TRequest = any> {
  request: TRequest
}

export interface RequestIdPayload {
  id: string
}


