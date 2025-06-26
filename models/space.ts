export interface Space {
  id: string;
  name: string; // 由发起人命名
  members: { uid: string; name: string }[]; // 两个成员
  createdAt: number;
}
