import apiClient from '../utils/apiClient';

// 获取当前用户发出的 pending 请求
export const fetchSentRequest = async () => {
  try {
    const res = await apiClient.get('/api/requests/sent');
    return res.data?.request || null;
  } catch (e) {
    console.warn('❌ 获取发出的请求失败', e);
    return null;
  }
};

// 获取某一条 request（by request ID）
export const fetchRequestById = async (requestId: string) => {
  try {
    const res = await apiClient.get(`/api/requests/${requestId}`);
    return res.data?.request || null;
  } catch (err) {
    console.warn('❌ 获取请求详情失败:', err);
    return null;
  }
};

// 获取当前用户收到的所有 pending 请求
export const getPendingRequestsForUser = async () => {
  try {
    const res = await apiClient.get('/api/requests/incoming');
    return res.data.requests || [];
  } catch (err) {
    console.warn('❌ 获取请求失败', err);
    return [];
  }
};

// 响应请求（接受或拒绝）
export const respondToRequest = async (
  id: string,
  action: 'accepted' | 'rejected',
  toUserName?: string
) => {
  try {
    const res = await apiClient.patch(`/api/requests/${id}/${action}`, {
      ...(action === 'accepted' && toUserName ? { toUserName } : {}),
    });
    return res.data;
  } catch (err) {
    console.error('响应请求失败:', err);
    throw err;
  }
};

// 取消请求（发起人删除请求）
export const cancelRequest = async (requestId: string) => {
  try {
    await apiClient.delete(`/api/requests/${requestId}`);
  } catch (err) {
    console.warn('取消请求失败', err);
  }
};
