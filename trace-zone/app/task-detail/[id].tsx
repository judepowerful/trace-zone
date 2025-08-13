import { View, Text, StyleSheet, Image, ScrollView, SafeAreaView, TouchableOpacity } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// 伪数据
const mockTaskDetail = {
  id: '1',
  title: '帮我打印东西',
  avatar: require('../../assets/images/avatar_1.png'),
  name: '罗小林',
  tag: '铁豆',
  time: '2025-06-18 08:38',
  content: '麻烦书记帮我打印东西',
  stages: [
    {
      id: 's1',
      title: '干部办',
      content: '你的服务将由 龙林 办理',
      time: '2025-06-18 08:38',
      avatar: require('../../assets/images/avatar_2.png'),
      name: '龙林',
      tag: '钉豆',
      result: '已办理！',
      resultTime: '2025-06-18 09:33:20',
    },
    {
      id: 's2',
      title: '居民评',
      avatar: require('../../assets/images/avatar_1.png'),
      name: '杨中玉',
      tag: '钉豆',
      result: '满意度：⭐⭐⭐⭐⭐',
      resultTime: '2025-06-18 10:00:00',
    },
  ],
};

export default function TaskDetail() {
  const params = useLocalSearchParams();
  const router = useRouter();
  // 实际开发中可根据 params.id 拉取后端数据
  const detail = mockTaskDetail;

  return (
    <SafeAreaView style={styles.safe}>
      <ScrollView style={{ flex: 1 }}>
        {/* 返回按钮 */}
        <TouchableOpacity
          style={styles.backIcon}
          onPress={() => router.back()}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Ionicons name="arrow-back" size={24} color="#A0643D" />
        </TouchableOpacity>
        {/* 顶部大卡片 */}
        <View style={styles.headerCard}>
          <Text style={styles.title}>{detail.title}</Text>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 8 }}>
            <Image source={detail.avatar} style={styles.avatar} />
            <Text style={styles.name}>{detail.name}</Text>
            <View style={styles.tag}><Text style={{ color: '#388E3C', fontSize: 12 }}>{detail.tag}</Text></View>
          </View>
          <Text style={styles.time}>{detail.time}</Text>
          <Text style={styles.content}>{detail.content}</Text>
        </View>

        {/* 时间线阶段 */}
        <View style={styles.timelineContainer}>
          {detail.stages.map((stage, idx) => (
            <View key={stage.id} style={styles.timelineItem}>
              <View style={styles.timelineDot}><Text style={{ color: '#fff', fontSize: 13 }}>{idx + 1}</Text></View>
              <View style={styles.timelineContent}>
                <Text style={styles.stageTitle}>{stage.title}</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 6 }}>
                  <Image source={stage.avatar} style={styles.stageAvatar} />
                  <Text style={styles.stageName}>{stage.name}</Text>
                  <View style={styles.stageTag}><Text style={{ color: '#1976D2', fontSize: 12 }}>{stage.tag}</Text></View>
                </View>
                {stage.content && <Text style={styles.stageContent}>{stage.content}</Text>}
                {stage.result && <Text style={styles.stageResult}>{stage.result}</Text>}
                <Text style={styles.stageTime}>{stage.time || stage.resultTime}</Text>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#FFF0E0', // 与space-home一致
  },
  backIcon: {
    alignSelf: 'flex-start',
    marginTop: 10,
    marginLeft: 14,
    backgroundColor: '#FFF8EF',
    borderRadius: 28,
    elevation: 3,
    zIndex: 10,
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  headerCard: {
    backgroundColor: '#FDF6EC', // 柔和米色
    borderRadius: 20,
    margin: 18,
    padding: 18,
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#A0643D',
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 8,
  },
  name: {
    fontSize: 15,
    color: '#A0643D',
    fontWeight: '600',
    marginRight: 6,
  },
  tag: {
    backgroundColor: '#E0F2F1',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 2,
  },
  time: {
    fontSize: 12,
    color: '#C78B60',
    marginTop: 4,
  },
  content: {
    fontSize: 15,
    color: '#8A5A3D',
    marginTop: 10,
  },
  timelineContainer: {
    marginTop: 10,
    marginHorizontal: 18,
    borderLeftWidth: 2,
    borderLeftColor: '#F3D1B0', // 柔和分割线
    paddingLeft: 18,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 24,
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#E39880', // 柔和橙
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  timelineContent: {
    backgroundColor: '#FEF9F3', // 柔和米色
    borderRadius: 14,
    padding: 12,
    flex: 1,
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  stageTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#A0643D',
  },
  stageAvatar: {
    width: 28,
    height: 28,
    borderRadius: 14,
    marginRight: 6,
  },
  stageName: {
    fontSize: 14,
    color: '#A0643D',
    fontWeight: '500',
    marginRight: 4,
  },
  stageTag: {
    backgroundColor: '#E3F2FD',
    borderRadius: 8,
    paddingHorizontal: 6,
    paddingVertical: 2,
    marginLeft: 2,
  },
  stageContent: {
    fontSize: 14,
    color: '#8A5A3D',
    marginTop: 6,
  },
  stageResult: {
    fontSize: 14,
    color: '#FF9800',
    marginTop: 6,
    fontWeight: '600',
  },
  stageTime: {
    fontSize: 12,
    color: '#C78B60',
    marginTop: 4,
  },
}); 