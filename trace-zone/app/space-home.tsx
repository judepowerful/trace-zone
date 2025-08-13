import { View, Text, SafeAreaView, ScrollView, StyleSheet, TouchableOpacity, Alert, ActivityIndicator, Image, RefreshControl, FlatList } from 'react-native';
import { useCallback, useEffect, useState } from 'react';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import LottieView from 'lottie-react-native';
import PhotoPostcardAnimatedModal from '../components/modals/PhotoPostcardAnimatedModal';

import { useWeather } from '../hooks/useWeather';
import { useDeleteSpace } from '../hooks/useDeleteSpace';
import useSpaceSocket from '../hooks/useSpaceSocket';
import { usePresenceStore } from '../stores/usePresenceStore';
import { useSpaceStore } from '../stores/useSpaceStore';
import { useAuthStore } from '../stores/useAuthStore';
import { reportLocation } from '../utils/spaceApi';
import { useMyLocationAndReport } from '../hooks/useMyLocationAndReport';
import useFeedCat from '../hooks/useFeedCat';
import { formatLocationTime } from '../utils/spaceApi';

import CatSprite from '../components/CatSprite'

// 伪数据
const mockTasks = [
  {
    id: '1',
    title: '帮我打印东西',
    avatar: require('../assets/images/avatar_2.png'),
    time: '08:38',
    status: '处理中',
  },
  {
    id: '2',
    title: '申请服务',
    avatar: require('../assets/images/avatar_2.png'),
    time: '09:33',
    status: '已完成',
  },
  {
    id: '3',
    title: '反馈问题',
    avatar: require('../assets/images/avatar_3.png'),
    time: '10:12',
    status: '待评价',
  },
];

// 新增照片分享伪数据
const mockPhotoShares = [
  {
    id: 'p1',
    imageUrl: require('../assets/images/demo_dish.jpg'),
    text: '🍊 雨天来一杯橙C美式！',
    createdAt: '2024-06-01T10:23:00Z',
    location: '上海·徐汇区',
    userId: 'u1',
    userName: '小明',
    avatar: require('../assets/images/avatar_2.png'),
  },
  {
    id: 'p2',
    imageUrl: require('../assets/images/avatar_1.png'),
    text: '今日份猫猫',
    createdAt: '2024-05-31T18:00:00Z',
    location: '上海·浦东新区',
    userId: 'u2',
    userName: '小红',
    avatar: require('../assets/images/avatar_3.png'),
  },
];

export default function SpaceHome() {
  const router = useRouter();
  
  const { deleting, handleDelete } = useDeleteSpace();
  const { spaceInfo, loading: loadingSpace, refetch, fetchSpaceInfo } = useSpaceStore();
  const { userId } = useAuthStore();
  const [refreshing, setRefreshing] = useState(false);
  const [showPostcardModal, setShowPostcardModal] = useState(false);

  // 获取自己和搭子的成员对象
  const self = spaceInfo?.members.find(m => m.uid === userId);
  const other = spaceInfo?.members.find(m => m.uid !== userId);

  // 获取自己和搭子的天气和位置
  const myLoc = useMyLocationAndReport(self, reportLocation);
  const { weather: myWeather } = useWeather(myLoc?.latitude, myLoc?.longitude);
  const { weather: partnerWeather } = useWeather(other?.latitude, other?.longitude);

  // 计算今天是否喂过猫
  const today = new Date().toISOString().slice(0, 10);
  const isTodayFeeding = spaceInfo?.todayFeeding?.date === today;
  const fedUsers = isTodayFeeding ? (spaceInfo.todayFeeding?.fedUsers ?? []) : [];
  const selfFed = fedUsers.includes(userId);
  const partnerFed = other ? fedUsers.includes(other.uid) : false;
  const bothFed = selfFed && partnerFed;

  // 在线状态
  const partnerOnline = usePresenceStore(state => state.partnerOnline);

  // 使用小屋 socket 连接
  useSpaceSocket(spaceInfo?.id || '');

  // 喂猫socket hook
  const { feedCat, feeding } = useFeedCat(spaceInfo?.id || '', refetch);

  // 进入小屋加载空间信息，每次进入都显示 loading
  useFocusEffect(
    useCallback(() => {
      fetchSpaceInfo();
    }, [fetchSpaceInfo])
  );

  // 刷新操作
  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (loadingSpace) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>🚪 正在打扫你的小屋…</Text>
        <ActivityIndicator size="large" color="#f48fb1" style={{ marginTop: 16 }} />
      </View>
    );
  }
  
  // 如果没有小屋信息或成员信息，显示错误提示
  if (!spaceInfo || !self || !other) {
    return <Text style={{ padding: 20 }}>❌ 成员信息加载失败，请重新进入小屋</Text>;
  }

  // 喂食按钮点击
  const handleFeed = async () => {
    const ok = await feedCat();
    if (!ok) {
      Alert.alert('喂食失败', '请稍后再试');
    }
  };

  const latestPhotoShare = mockPhotoShares[0]; // 取最新一条

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 80, opacity: deleting ? 0.5 : 1 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#f48fb1']} />
        }
      >
        <View style={styles.houseCard}>
          <TouchableOpacity
            style={styles.backIcon}
            onPress={() => router.back()}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
          >
            <Ionicons name="arrow-back" size={24} color="#A0643D" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.settingIcon}
            disabled={deleting}
            hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
            onPress={() => router.push('/settings')}
          >
            <Ionicons name="settings-outline" size={28} color="#A0643D" />
          </TouchableOpacity>

          <Text style={styles.houseTitle}>{spaceInfo.name}</Text>
          <Text style={styles.houseSubtitle}>与对方共建的小屋</Text>
          <View style={styles.membersRow}>
            {[{ person: self, weather: myWeather, loc: myLoc, idx: 0 },
              { person: other, weather: partnerWeather, loc: other, idx: 1 }]
              .map(({ person, weather, loc, idx }) => (
              <View key={idx} style={styles.personCard}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                  {/* 左侧：昵称+在线状态+头像 */}
                  <View style={{ flex: 1, minWidth: 0 }}>
                    <View style={{ marginLeft: 18, marginTop: 18 }}>
                      <Text style={styles.personName}>{person.name}</Text>
                      <View style={styles.statusRow}>
                        <View style={[
                          styles.statusDot,
                          { backgroundColor: idx === 0 ? '#43a047' : (partnerOnline ? '#43a047' : '#aaa') }
                        ]} />
                        <Text style={{
                          fontSize: 13,
                          color: idx === 0 ? '#43a047' : (partnerOnline ? '#43a047' : '#aaa')
                        }}>
                          {idx === 0 || partnerOnline ? '小屋中' : '不在噢'}
                        </Text>
                      </View>
                    </View>
                    <Image
                      source={idx === 0 
                        ? require('../assets/images/avatar_3.png')
                        : require('../assets/images/avatar_2.png')}
                      style={styles.avatarImage}
                      />
                  </View>
                  {/* 右侧：天气动画+城市+温度 */}
                  <View style={{ alignItems: 'center', minWidth: 70 }}>
                    <LottieView
                      source={weather ? weather.animationSource : require('../assets/lottie/cloudy.json')}
                      autoPlay
                      loop
                      style={{ width: 80, height: 80 }}
                    />
                    <Text style={styles.locationTime}>{formatLocationTime(loc.locationUpdatedAt)}</Text>
                    <Text style={styles.weatherCity}>{loc.city || '未上报'}</Text>
                    <Text style={styles.weatherCity}>{loc.district || ''}</Text>
                    <Text style={styles.weatherTemp}>{weather ? `${weather.temp}` : '--°C'}</Text>
                  </View>
                </View>
              </View>
            ))}
          </View>
        </View>

        <View style={{ flexDirection: 'row', justifyContent: 'space-around', marginHorizontal: 10 }}>
          {/* 小猫卡 */}
          <View style={[styles.catCard]}>
            <View style={{ paddingHorizontal: 16 }}>
              <View style={styles.coFeedingBadge}>
                <Text style={styles.coFeedingBadgeText}>
                  喂养 {spaceInfo.coFeedingDays ?? 0} 天
                </Text>
              </View>
              <CatSprite action='sad' size={64}/>
              {bothFed ? (
                <TouchableOpacity style={[styles.feedButton, { backgroundColor: '#ccc' }]} disabled>
                  <Text style={{ color: '#fff', fontSize: 14 }}>🍖 它吃饱了</Text>
                </TouchableOpacity>
              ) : selfFed ? (
                <TouchableOpacity style={[styles.feedButton, { backgroundColor: '#ccc' }]} disabled>
                  <Text style={{ color: '#fff', fontSize: 14 }}>🕒 等待对方喂</Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity style={styles.feedButton} onPress={handleFeed}>
                  <Text style={{ color: '#fff', fontSize: 14 }}>🍖 喂食</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* 照片分享 */}
          <View style={[styles.photoCard]}>
            {latestPhotoShare ? (
              <>
                <TouchableOpacity
                  onPress={() => setShowPostcardModal(true)}
                >
                  <Image
                    source={latestPhotoShare.imageUrl}
                    style={{ width: '100%', height: '100%' }}
                    resizeMode="cover"
                  />
                </TouchableOpacity>
                <View style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  right: 0,
                  backgroundColor: 'rgba(255, 248, 239, 0.8)',
                  paddingVertical: 8,
                  paddingHorizontal: 12
                }}>
                  <Text style={{ color: '#8A5A3D', fontSize: 14, fontWeight: '600', paddingVertical: 8 }}>
                    {latestPhotoShare.text}
                  </Text>
                </View>
              </>
            ) : (
              <Text style={{ color: '#A0643D', padding: 20 }}>还没有人分享照片哦~</Text>
            )}
          </View>

        </View>
        <Text style={styles.section}>📋 今天的小屋动态</Text>
        {/* 事务缩略图横向列表 */}
        <FlatList
          data={mockTasks}
          keyExtractor={item => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={{ paddingLeft: 20, marginBottom: 10 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.taskCard}
              onPress={() => router.push({ pathname: '/task-detail/[id]', params: { id: item.id } })}
            >
              <Image source={item.avatar} style={styles.taskAvatar} />
              <Text style={styles.taskTitle} numberOfLines={1}>{item.title}</Text>
              <Text style={styles.taskTime}>{item.time}</Text>
              <View style={[styles.taskStatus, { backgroundColor: item.status === '已完成' ? '#B2DFDB' : (item.status === '处理中' ? '#FFE082' : '#FFCCBC') }]}> 
                <Text style={{ fontSize: 11, color: '#8A5A3D' }}>{item.status}</Text>
              </View>
            </TouchableOpacity>
          )}
        />
        <View style={styles.placeholderTask}>
          <Text style={{ color: '#A0643D' }}>暂无事务，快去发布吧！</Text>
        </View>
      </ScrollView>

      <TouchableOpacity
        style={styles.floatingButton}
        disabled={deleting}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>

      {/* 明信片浮窗 */}
      <PhotoPostcardAnimatedModal
        visible={showPostcardModal}
        imageSource={latestPhotoShare.imageUrl}
        text={latestPhotoShare.text}
        onClose={() => setShowPostcardModal(false)}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#FFF0E0' },
  houseCard: {
    borderRadius: 24,
    margin: 16,
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.5,
    shadowRadius: 10,
    position: 'relative',
  },
  backIcon: {
    position: 'absolute',
    left: 14,
    elevation: 3,
    zIndex: 10,
  },
  settingIcon: {
    position: 'absolute',
    right: 14,
    elevation: 3,
    zIndex: 10,
  },
  houseTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#A0643D', // 深棕
    textAlign: 'center',
  },
  houseSubtitle: {
    fontSize: 13,
    color: '#C78B60',
    textAlign: 'center',
    marginTop: 4,
    marginBottom: 18,
  },
  membersRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  personCard: {
    flex: 1,
    backgroundColor: '#FEF9F3',
    borderRadius: 28,
    marginHorizontal: 10,
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
    minWidth: 0,
  },
  personName: {
    fontSize: 17,
    fontWeight: '600',
    color: '#A0643D',
  },
  avatarImage: {
    width: 90,
    height: 90,
    marginTop: 12,
    marginLeft: 10,
  },
  statusRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6
  },
  statusDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6
  },
  weatherCity: {
    fontSize: 13,
    color: '#A0643D',
    marginTop: 2,
  },
  weatherTemp: {
    fontSize: 18,
    fontWeight: '600',
    color: '#A0643D',
    marginTop: 2,
  },
  locationTime: {
    fontSize: 11,
    color: '#C78B60',
    marginTop: 2,
    fontStyle: 'italic',
  },
  catCard: {
    flex: 1,
    marginHorizontal: 10,
    backgroundColor: '#FEF9F3',
    borderRadius: 28,
    height: 190,
    justifyContent: 'center',
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  feedButton: {
    marginTop: 5,
    backgroundColor: '#E39880',
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#E0A487',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 3,
  },
  photoCard: {
    flex: 1,
    marginHorizontal: 10,
    borderRadius: 24,
    overflow: 'hidden',
    height: 190,
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.2,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 3,
  },
  section: {
    fontSize: 18,
    fontWeight: '600',
    marginHorizontal: 20,
    marginTop: 10,
    marginBottom: 14,
    color: '#A0643D',
  },
  placeholderTask: {
    backgroundColor: '#FDF6EC',
    marginHorizontal: 20,
    borderRadius: 14,
    padding: 20,
    alignItems: 'center',
  },
  coFeedingBadge: {
    borderRadius: 14,
    paddingVertical: 6,
    paddingHorizontal: 12,
    alignSelf: 'flex-start',
    marginBottom: 5,
    borderColor: '#F3D1B0',
    borderWidth: 1,
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.2,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  coFeedingBadgeText: {
    fontSize: 14,
    color: '#A0643D',
    fontWeight: '500'
  },
  floatingButton: {
    position: 'absolute',
    bottom: 28,
    right: 28,
    backgroundColor: '#E39880',
    width: 60,
    height: 60,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: '#E0A487',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
  },
  loadingContainer: {
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center', 
    backgroundColor: '#FDF6EC',
  },
  loadingText: {
    fontSize: 18, color: '#A0643D', fontWeight: '500',
  },
  taskCard: {
    width: 120,
    backgroundColor: '#fff',
    borderRadius: 16,
    marginRight: 14,
    padding: 12,
    alignItems: 'center',
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 2,
  },
  taskAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginBottom: 8,
  },
  taskTitle: {
    fontWeight: '600',
    fontSize: 14,
    color: '#A0643D',
    marginBottom: 4,
    textAlign: 'center',
  },
  taskTime: {
    fontSize: 12,
    color: '#C78B60',
    marginBottom: 4,
  },
  taskStatus: {
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginTop: 2,
  },
});
