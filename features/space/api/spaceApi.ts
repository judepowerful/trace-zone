import apiClient from '../../../shared/api/client'
import { mapRawSpaceToModel } from './spaceMapper'
import type { Space } from '../../../models/space'

export const fetchMySpace = async (): Promise<Space | null> => {
  try {
    const res = await apiClient.get('/api/spaces/my-space')
    if (!res.data) return null
    return mapRawSpaceToModel(res.data)
  } catch (err: any) {
    if (err.response?.status === 404) {
      console.log('ℹ️ 用户未加入任何空间')
      return null
    }
    console.error('❌ 获取空间信息失败:', err.response?.data?.error || err.message)
    return null
  }
}

export const deleteMySpace = async (): Promise<void> => {
  try {
    await apiClient.delete('/api/spaces/my-space')
    console.log('✅ 小屋删除成功')
  } catch (err: any) {
    console.error('❌ 删除小屋失败:', err.response?.data?.error || err.message)
    throw err
  }
}

export const reportLocation = async (
  latitude: number,
  longitude: number,
  city?: string,
  country?: string,
  district?: string
): Promise<void> => {
  try {
    console.log('📍 上报位置:', { latitude, longitude, city, country, district })
    await apiClient.post('/api/spaces/report-location', { latitude, longitude, city, country, district })
    console.log('✅ 位置上报成功')
  } catch (err: any) {
    if (err.response?.status === 404) {
      console.warn('⚠️ 空间不存在，位置上报被忽略')
      return
    }
    console.error('❌ 上报位置失败:', err.response?.data?.error || err.message)
    throw err
  }
}

export const formatLocationTime = (locationUpdatedAt?: string): string => {
  if (!locationUpdatedAt) return '未上报'
  try {
    const now = new Date()
    const locationTime = new Date(locationUpdatedAt)
    if (isNaN(locationTime.getTime())) return '时间无效'
    const diffInMinutes = Math.floor((now.getTime() - locationTime.getTime()) / (1000 * 60))
    if (diffInMinutes < 0) return '时间异常'
    if (diffInMinutes < 1) return '刚刚在'
    if (diffInMinutes < 60) return `${diffInMinutes}分钟前在`
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}小时前在`
    if (diffInMinutes < 43200) return `${Math.floor(diffInMinutes / 1440)}天前在`
    return `${Math.floor(diffInMinutes / 43200)}个月前在`
  } catch {
    return '时间错误'
  }
}


