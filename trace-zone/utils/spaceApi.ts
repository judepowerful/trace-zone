// utils/spaceApi.ts
import apiClient from '../utils/apiClient';
import { mapRawSpaceToModel } from '../utils/spaceMapper';
import type { Space } from '../models/space';

// 获取当前用户的小屋信息
export const fetchMySpace = async (): Promise<Space | null> => {
  try {
    const res = await apiClient.get('/api/spaces/my-space');
    if (!res.data) return null;
    return mapRawSpaceToModel(res.data);
  } catch (err: any) {
    if (err.response?.status === 404) {
      console.log('ℹ️ 用户未加入任何空间');
      return null; // 正常：用户未加入任何空间
    }
    console.error('❌ 获取空间信息失败:', err.response?.data?.error || err.message);
    return null;
  }
};

// 删除当前用户的小屋
export const deleteMySpace = async (): Promise<void> => {
  try {
    await apiClient.delete('/api/spaces/my-space');
    console.log('✅ 小屋删除成功');
  } catch (err: any) {
    console.error('❌ 删除小屋失败:', err.response?.data?.error || err.message);
    throw err; // 交给外层 hook 或 UI 处理
  }
};

// 上报经纬度和地名到后端
export const reportLocation = async (
  latitude: number,
  longitude: number,
  city?: string,
  country?: string,
  district?: string
): Promise<void> => {
  try {
    console.log("📍 上报位置:", { latitude, longitude, city, country, district });
    await apiClient.post('/api/spaces/report-location', { 
      latitude, 
      longitude, 
      city, 
      country, 
      district 
    });
    console.log("✅ 位置上报成功");
  } catch (err: any) {
    // 如果是404错误，说明空间不存在，这是预期的错误
    if (err.response?.status === 404) {
      console.warn('⚠️ 空间不存在，位置上报被忽略');
      return; // 不抛出错误，静默处理
    }
    console.error('❌ 上报位置失败:', err.response?.data?.error || err.message);
    throw err; // 其他错误仍然抛出
  }
};

// 格式化位置时间显示
export const formatLocationTime = (locationUpdatedAt?: string): string => {
  if (!locationUpdatedAt) {
    return '未上报';
  }
  
  try {
    const now = new Date();
    const locationTime = new Date(locationUpdatedAt);
    
    // 检查日期是否有效
    if (isNaN(locationTime.getTime())) {
      return '时间无效';
    }
    
    const diffInMinutes = Math.floor((now.getTime() - locationTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 0) {
      return '时间异常'; // 未来时间
    } else if (diffInMinutes < 1) {
      return '刚刚在';
    } else if (diffInMinutes < 60) {
      return `${diffInMinutes}分钟前在`;
    } else if (diffInMinutes < 1440) { // 24小时
      const hours = Math.floor(diffInMinutes / 60);
      return `${hours}小时前在`;
    } else if (diffInMinutes < 43200) { // 30天
      const days = Math.floor(diffInMinutes / 1440);
      return `${days}天前在`;
    } else {
      const months = Math.floor(diffInMinutes / 43200);
      return `${months}个月前在`;
    }
  } catch (err) {
    console.error('❌ 格式化时间失败:', err);
    return '时间错误';
  }
};
