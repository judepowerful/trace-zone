export interface SpaceMember {
  uid: string;
  name: string;
  latitude?: number;
  longitude?: number;
  city?: string;
  country?: string;
  district?: string;
  locationUpdatedAt?: string; // 新增：位置更新时间（ISO 字符串格式）
}

export interface TodayFeeding {
  date: string;         // 格式：'2025-07-03'
  fedUsers: string[];   // 已喂食的用户ID
}


export interface Space {
  id: string;
  name: string; // 由发起人命名
  members: SpaceMember[]; // 两个成员
  createdAt: number;
  todayFeeding?: TodayFeeding;
  coFeedingDays: number;        // ✅ 新增
  lastCoFeedingDate: string;    // ✅ 新增
}
