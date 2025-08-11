# trace-zone 前端项目

本项目是基于 Expo + React Native 开发的移动端应用，主要功能为“痕迹小屋”——支持用户邀请、空间管理、消息收发等。

## 主要技术栈
- React Native (Expo)
- TypeScript
- Expo Router 路由
- Axios 网络请求
- 自定义 Hooks、组件化开发

## 目录结构说明
- `app/`：页面与路由文件夹，包含首页、邀请、消息、小屋等主要页面
- `components/`：可复用的 UI 组件（如弹窗、输入框等）
- `constants/`：全局常量（如颜色）
- `hooks/`：自定义 React Hooks
- `models/`：数据模型定义
- `utils/`：工具函数（如 API 封装）
- `assets/`：静态资源（图片、字体等）

## 常用命令
- 安装依赖：`npm install`
- 启动开发：`npx expo start`
- Android 预览：`npx expo start --android`
- iOS 预览：`npx expo start --ios`
- Web 预览：`npx expo start --web`

## 说明
- 项目已清理官方模板和 sample 代码，所有页面和组件均为自定义开发。
- 推荐使用 VS Code 编辑器，配合 TypeScript 进行类型检查和自动补全。

## 贡献与维护
如需协作开发，请遵循统一的代码风格（已配置 ESLint），并优先复用已有组件和 hooks。

---

如有问题或建议，欢迎随时联系项目维护者。
