/**
 * 应用中使用的基础颜色
 * 统一管理所有颜色，避免硬编码
 */

export const Colors = {
  // ===== 主色调 =====
  primary: '#A0643D',        // 深棕色 - 主要文字、标题
  secondary: '#C78B60',      // 中棕色 - 次要文字、副标题
  accent: '#E39880',         // 珊瑚色 - 按钮、强调色
  brand: '#C2185B',          // 品牌色 - 图标、特殊元素
  
  // ===== 背景色系 =====
  background: '#FFF0E0',     // 主背景 - 温暖的米色
  cardBackground: '#FEF9F3', // 卡片背景 - 柔和的米色
  surfaceBackground: '#FDF6EC', // 表面背景 - 更浅的米色
  inputBackground: '#fafafa',   // 输入框背景
  modalBackground: '#fff',      // 模态框背景
  
  // ===== 文字颜色 =====
  text: {
    primary: '#A0643D',      // 主要文字
    secondary: '#805B3D',    // 次要文字
    tertiary: '#C78B60',     // 第三级文字
    light: '#666',           // 浅色文字
    placeholder: '#999',     // 占位符文字
    white: '#fff',           // 白色文字
    dark: '#333',            // 深色文字
  },
  
  // ===== 状态颜色 =====
  status: {
    online: '#43a047',       // 在线状态
    offline: '#aaa',         // 离线状态
    success: '#43a047',      // 成功状态
    warning: '#ff9800',      // 警告状态
    error: '#d32f2f',        // 错误状态
    danger: '#ff6b6b',       // 危险状态
    disabled: '#ccc',        // 禁用状态
  },
  
  // ===== 任务状态颜色 =====
  task: {
    completed: '#B2DFDB',    // 已完成
    processing: '#FFE082',   // 处理中
    pending: '#FFCCBC',      // 待评价
  },
  
  // ===== 边框和阴影 =====
  border: {
    primary: '#F3D1B0',      // 主要边框
    secondary: '#ddd',       // 次要边框
    input: '#ddd',           // 输入框边框
    error: '#F44336',        // 错误边框
  },
  
  shadow: {
    primary: '#F3D1B0',      // 主要阴影
    secondary: '#E0A487',    // 次要阴影
    dark: '#000',            // 深色阴影
  },
  
  // ===== 按钮颜色 =====
  button: {
    primary: '#E39880',      // 主要按钮
    secondary: '#F3D1B0',    // 次要按钮
    danger: '#ffebee',       // 危险按钮
    success: '#C8E6C9',      // 成功按钮
    disabled: '#ccc',        // 禁用按钮
  },
  
  // ===== 特殊颜色 =====
  special: {
    weather: '#f48fb1',      // 天气相关
    photoOverlay: 'rgba(255, 248, 239, 0.8)', // 照片遮罩
    modalOverlay: 'rgba(0,0,0,0.4)', // 模态框遮罩
    invite: {
      primary: '#C2185B',    // 邀请页面主色调
      secondary: '#E39880',  // 邀请页面次要色
      accent: '#F3D1B0',     // 邀请页面强调色
    },
  },
  
  // ===== 渐变和透明度 =====
  opacity: {
    light: 0.1,
    medium: 0.3,
    heavy: 0.5,
  },
};

// ===== 便捷的颜色组合 =====
export const ColorSchemes = {
  // 卡片样式
  card: {
    background: Colors.cardBackground,
    border: Colors.border.primary,
    shadow: Colors.shadow.primary,
  },
  
  // 按钮样式
  button: {
    primary: {
      background: Colors.button.primary,
      text: Colors.text.white,
      shadow: Colors.shadow.secondary,
    },
    secondary: {
      background: Colors.button.secondary,
      text: Colors.text.primary,
      shadow: Colors.shadow.primary,
    },
  },
  
  // 输入框样式
  input: {
    background: Colors.inputBackground,
    border: Colors.border.input,
    text: Colors.text.dark,
    placeholder: Colors.text.placeholder,
  },
  
  // 状态指示器
  status: {
    online: {
      dot: Colors.status.online,
      text: Colors.status.online,
    },
    offline: {
      dot: Colors.status.offline,
      text: Colors.status.offline,
    },
  },
};

// ===== 主题相关 =====
export const Theme = {
  light: {
    ...Colors,
    // 可以在这里添加浅色主题特有的颜色
  },
  dark: {
    // 可以在这里添加深色主题的颜色
    // 暂时保持与浅色主题一致
    ...Colors,
  },
};

export default Colors;

/**
 * 使用示例：
 * 
 * // 1. 基础使用
 * import { Colors } from '../constants/Colors';
 * 
 * const styles = StyleSheet.create({
 *   container: {
 *     backgroundColor: Colors.background,
 *   },
 *   title: {
 *     color: Colors.text.primary,
 *   },
 *   button: {
 *     backgroundColor: Colors.button.primary,
 *   },
 * });
 * 
 * // 2. 使用颜色组合
 * import { Colors, ColorSchemes } from '../constants/Colors';
 * 
 * const styles = StyleSheet.create({
 *   card: {
 *     backgroundColor: ColorSchemes.card.background,
 *     borderColor: ColorSchemes.card.border,
 *     shadowColor: ColorSchemes.card.shadow,
 *   },
 * });
 * 
 * // 3. 状态相关
 * const statusColor = isOnline ? Colors.status.online : Colors.status.offline;
 * 
 * // 4. 任务状态
 * const taskStatusColor = {
 *   '已完成': Colors.task.completed,
 *   '处理中': Colors.task.processing,
 *   '待评价': Colors.task.pending,
 * }[status];
 */
