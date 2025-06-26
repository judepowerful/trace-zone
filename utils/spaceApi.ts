import apiClient from '../utils/apiClient';
import { mapRawSpaceToModel } from '../utils/spaceMapper';
import type { Space } from '../models/space';

export const fetchMySpace = async (): Promise<Space | null> => {
  try {
    const res = await apiClient.get('/api/spaces/my-space');
    if (!res.data) return null;
    return mapRawSpaceToModel(res.data);
  } catch (err: any) {
    if (err.response?.status === 404) {
      return null; // 正常：用户未加入任何空间
    }
    return null;
  }
};
