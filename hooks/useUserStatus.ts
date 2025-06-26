import { useState, useCallback, useEffect } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { getOrCreateUserId, getMyInviteCode } from '../utils/userApi';
import { fetchMySpace } from '../utils/spaceApi';
import { fetchSentRequest } from '../utils/requestApi';
import type { Space } from '../models/space';

export const useUserStatus = () => {
  const [checking, setChecking] = useState(true);
  const [myCode, setMyCode] = useState('');
  const [hasSpace, setHasSpace] = useState(false);
  const [sentRequest, setSentRequest] = useState<any>(null);
  const [userId, setUserId] = useState('');

  useFocusEffect(useCallback(() => {
    const checkStatus = async () => {
      setChecking(true);
      try {
        const uid = await getOrCreateUserId();
        setUserId(uid);

        const code = await getMyInviteCode();
        setMyCode(code);

        const space: Space | null = await fetchMySpace();
        setHasSpace(space?.members?.length === 2);

        const request = await fetchSentRequest();
        setSentRequest(request);
      } catch (err) {
        console.warn('用户状态检查失败:', err);
        setMyCode('');
        setHasSpace(false);
        setSentRequest(null);
      } finally {
        setChecking(false);
      }
    };
    checkStatus();
  }, []));

  return {
    checking,
    hasSpace,
    myCode,
    userId,
    sentRequest,
    setSentRequest,
  };
};
