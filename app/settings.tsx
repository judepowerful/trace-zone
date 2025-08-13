import { View, Text, SafeAreaView, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useDeleteSpace } from '../features/space/hooks/useDeleteSpace';

export default function Settings() {
  const router = useRouter();
  const { deleting, handleDelete } = useDeleteSpace();

  const handleDeleteSpace = () => {
    Alert.alert(
      '删除小屋',
      '确定要删除并退出当前小屋吗？此操作不可恢复',
      [
        { text: '取消', style: 'cancel' },
        {
          text: '删除',
          style: 'destructive',
          onPress: async () => {
            await handleDelete();
            router.replace('/');
          },
        },
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: '#FFF0E0' }]}>
      {/* 头部 */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => router.back()}
          hitSlop={{ top: 20, bottom: 20, left: 20, right: 20 }}
        >
          <Ionicons 
            name="arrow-back" 
            size={24} 
            color="#A0643D" 
          />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: '#A0643D' }]}>
          设置
        </Text>
        <View style={styles.placeholder} />
      </View>

      {/* 设置列表 */}
      <View style={styles.settingsList}>

        {/* 通知设置 */}
        <View style={[styles.settingItem, { backgroundColor: '#FEF9F3' }]}>
          <View style={styles.settingLeft}>
            <Ionicons 
              name="notifications" 
              size={24} 
              color="#A0643D" 
            />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: '#A0643D' }]}>
                通知设置
              </Text>
              <Text style={[styles.settingSubtitle, { color: '#C78B60' }]}>
                管理推送通知
              </Text>
            </View>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color="#C78B60" 
          />
        </View>

        {/* 隐私设置 */}
        <View style={[styles.settingItem, { backgroundColor: '#FEF9F3' }]}>
          <View style={styles.settingLeft}>
            <Ionicons 
              name="shield-checkmark" 
              size={24} 
              color="#A0643D" 
            />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: '#A0643D' }]}>
                隐私设置
              </Text>
              <Text style={[styles.settingSubtitle, { color: '#C78B60' }]}>
                管理位置分享和隐私
              </Text>
            </View>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color="#C78B60" 
          />
        </View>

        {/* 关于 */}
        <View style={[styles.settingItem, { backgroundColor: '#FEF9F3' }]}>
          <View style={styles.settingLeft}>
            <Ionicons 
              name="information-circle" 
              size={24} 
              color="#A0643D" 
            />
            <View style={styles.settingText}>
              <Text style={[styles.settingTitle, { color: '#A0643D' }]}>
                关于
              </Text>
              <Text style={[styles.settingSubtitle, { color: '#C78B60' }]}>
                版本信息和帮助
              </Text>
            </View>
          </View>
          <Ionicons 
            name="chevron-forward" 
            size={20} 
            color="#C78B60" 
          />
        </View>
      </View>

      {/* 危险操作区域 */}
      <View style={styles.dangerZone}>
        <Text style={[styles.dangerZoneTitle, { color: '#d32f2f' }]}>
          危险操作
        </Text>
        
        {/* 删除小屋 */}
        <TouchableOpacity
          style={[styles.dangerButton, { backgroundColor: '#ffebee' }]}
          onPress={handleDeleteSpace}
          disabled={deleting}
        >
          <View style={styles.dangerButtonContent}>
            <Ionicons 
              name="trash" 
              size={20} 
              color="#d32f2f" 
            />
            <Text style={[styles.dangerButtonText, { color: '#d32f2f' }]}>
              {deleting ? '删除中...' : '删除并退出小屋'}
            </Text>
          </View>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(160, 100, 61, 0.1)',
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  placeholder: {
    width: 40,
  },
  settingsList: {
    padding: 20,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  settingText: {
    marginLeft: 12,
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  settingSubtitle: {
    fontSize: 14,
  },
  dangerZone: {
    padding: 20,
    marginTop: 20,
  },
  dangerZoneTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 12,
  },
  dangerButton: {
    borderRadius: 12,
    padding: 16,
    shadowColor: '#F3D1B0',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  dangerButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  dangerButtonText: {
    fontSize: 16,
    fontWeight: '600',
    marginLeft: 8,
  },
}); 