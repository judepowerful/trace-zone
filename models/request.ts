export interface JoinRequest {
  _id: string
  fromUserId: string
  toUserId: string
  fromInviteCode: string
  toInviteCode: string
  fromUserName: string
  message: string
  spaceName: string
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled'
  createdAt?: string
  updatedAt?: string
}


