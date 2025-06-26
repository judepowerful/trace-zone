import { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getOrCreateUserId } from '../utils/userApi';
import type { Space } from '../models/space';
import type { Affair } from '../models/affair';
import { mapRawSpaceToModel } from '../utils/spaceMapper';
import apiClient from '../utils/apiClient';

export default function SpaceHome() {
  const [spaceInfo, setSpaceInfo] = useState<Space | null>(null);
  const [tasks, setTasks] = useState<Affair[]>([]);
  const [userId, setUserId] = useState('');
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      const uid = await getOrCreateUserId();
      setUserId(uid);
      console.log('[📦] 当前用户 uid:', uid);

      try {
        const spaceRes = await apiClient.get('/api/spaces/my-space');
        console.log('[🏡] 空间获取成功:', spaceRes.data);
        const space = mapRawSpaceToModel(spaceRes.data);

        // 👉 如果 space 是 null 或 members 不满足条件
        if (!space || !Array.isArray(space.members) || space.members.length !== 2) {
          alert('❌ 小屋不存在或已解散，请重新创建');
          router.replace('/'); // 回到首页
          return;
        }

        setSpaceInfo(space);
        await AsyncStorage.setItem('currentSpaceId', space.id);

        //const taskRes = await axios.get(`${BACKEND_URL}/api/spaces/${space.id}/tasks`);
        //console.log('[✅] 任务列表获取成功:', taskRes.data);

        //setTasks(taskRes.data ?? []);
      } catch (err) {
          console.error('[❌] 加载失败:', err);
          alert('⚠️ 无法进入小屋，可能已被删除');
          await AsyncStorage.removeItem('currentSpaceId');
          router.replace('/');
      }
    };

    fetchData();
  }, []);


  if (!spaceInfo) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>🚪 正在进入你的小屋…</Text>
        <ActivityIndicator size="large" color="#ff69b4" style={{ marginTop: 16 }} />
      </View>
    );
  }


  const self = spaceInfo.members.find(m => m.uid === userId);
  const other = spaceInfo.members.find(m => m.uid !== userId);

  if (!self || !other) {
    return <Text style={{ padding: 20 }}>❌ 成员信息加载失败，请重新进入小屋</Text>;
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" />
      <View style={styles.container}>
        <Text style={styles.title}>🏠 {spaceInfo.name}</Text>

        <View style={styles.rolesContainer}>
          <View style={styles.roleCard}>
            <Text style={styles.roleLabel}>你是</Text>
            <Text style={styles.roleName}>😉 {self.name}</Text>
          </View>
          <View style={styles.roleCard}>
            <Text style={styles.roleLabel}>搭子</Text>
            <Text style={styles.roleName}>😗 {other.name}</Text>
          </View>
        </View>

        <Text style={styles.section}>📋 事务列表</Text>
        <FlatList<Affair>
          data={tasks}
          keyExtractor={(item) => item.id}
          contentContainerStyle={{ paddingBottom: 100 }}
          renderItem={({ item }) => (
            <View style={styles.taskCard}>
              <Text style={styles.taskFrom}>🧾 {item.from} 发起 → {item.to}</Text>
              <Text style={styles.taskContent}>{item.title}</Text>
              <Text style={styles.taskStatus}>状态：{item.status === 'done' ? '✅ 已完成' : '🕓 待处理'}</Text>
            </View>
          )}
        />

        <TouchableOpacity
          style={styles.createButton}
          //onPress={() => router.push('/create-task')}
        >
          <Text style={styles.createButtonText}>➕ 发布事务</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#fff0f5',
  },
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: '#444',
  },
  rolesContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  roleCard: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    marginHorizontal: 6,
    alignItems: 'center',
    borderColor: '#ffb6c1',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  roleLabel: {
    fontSize: 14,
    color: '#999',
  },
  roleName: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e75480',
    marginTop: 4,
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginVertical: 12,
    color: '#333',
  },
  taskCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  taskFrom: {
    fontWeight: '600',
    color: '#444',
    marginBottom: 4,
  },
  taskContent: {
    fontSize: 16,
    color: '#555',
    marginBottom: 6,
  },
  taskStatus: {
    fontSize: 14,
    color: '#888',
  },
  createButton: {
    position: 'absolute',
    bottom: 30,
    alignSelf: 'center',
    backgroundColor: '#ff7fa0',
    paddingHorizontal: 30,
    paddingVertical: 14,
    borderRadius: 30,
    elevation: 4,
  },
  createButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff0f5',
  },
  loadingText: {
    fontSize: 18,
    color: '#e75480',
    fontWeight: '500',
  },

});
