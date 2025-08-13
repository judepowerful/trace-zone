import apiClient from '../../../shared/api/client'

export const fetchSentRequest = async () => {
  try {
    const res = await apiClient.get('/api/requests/sent')
    return res.data?.request || null
  } catch (e) {
    console.warn('❌ 获取发出的请求失败', e)
    return null
  }
}

export const fetchRequestById = async (requestId: string) => {
  try {
    const res = await apiClient.get(`/api/requests/${requestId}`)
    return res.data?.request || null
  } catch (err) {
    console.warn('❌ 获取请求详情失败:', err)
    return null
  }
}

export const getPendingRequestsForUser = async () => {
  try {
    const res = await apiClient.get('/api/requests/incoming')
    return res.data.requests || []
  } catch (err) {
    console.warn('❌ 获取请求失败', err)
    return []
  }
}

export const respondToRequest = async (
  id: string,
  action: 'accepted' | 'rejected',
  toUserName?: string
) => {
  try {
    const res = await apiClient.patch(`/api/requests/${id}/${action}`, {
      ...(action === 'accepted' && toUserName ? { toUserName } : {}),
    })
    return res.data
  } catch (err) {
    console.error('响应请求失败:', err)
    throw err
  }
}

export const cancelRequest = async (requestId: string) => {
  try {
    await apiClient.delete(`/api/requests/${requestId}`)
  } catch (err) {
    console.warn('取消请求失败', err)
  }
}



