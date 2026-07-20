# 我们的宇宙 — 项目 AGENTS.md

## 项目信息
- **路径**：`D:\MY_Project\web-page\`
- **类型**：情侣浪漫网页（单文件 HTML + 外部 JS）
- **技术栈**：HTML5 + CSS3 + Vanilla JS + Three.js r128 + Firebase + PWA

## 文件结构
```
D:\MY_Project\web-page\
├── index.html              # 【核心】主应用（内联 CSS + JS）
├── lion_background.js      # 宇宙开场动画系统（Three.js + 狮子座）
├── image_carousel.js       # 回忆放映机（图片轮播）
├── manifest.json           # PWA 应用清单
├── sw.js                   # Service Worker（离线缓存）
├── README.md               # 项目概述 + 快速开始
├── INDEX.md                # 文件索引
├── STRUCTURE.md            # 架构说明 + 数据流
├── AGENTS.md               # 本文件 — AI 助手指令
├── docs/
│   ├── 2026-07-13-我们的宇宙项目初始化.md   # V1 技术文档
│   └── 2026-07-13-V2升级改造.md            # V2 升级文档
└── assets/
    ├── Music/              # 背景音乐（7 首 .flac）
    ├── Photograph/         # 照片资源
    ├── blessing.mp3        # 生日祝福语音
    ├── icon-192.png        # PWA 图标
    └── icon-512.png        # PWA 图标
```

## 配置区
在 `index.html` 中搜索 `【配置区】` 找到所有可修改的变量：
- `SECRET_CODE` — 密码（默认 "0729"）
- `BIRTHDAY` — 生日 "MM-DD"
- `LOVE_START_DATE` — 相遇日期 "2025-01-29"
- `photos[]` — 照片数组
- `LOVE_QUOTES[]` — 情话语录
- `MUSIC_PLAYLIST[]` — 音乐列表
- `FIREBASE_CONFIG` — Firebase 公开网页配置（`firebase-config.js`）
  - `WEATHER_API_KEY` — OpenWeatherMap API Key（仅本地私有配置）

## 📄最新文档
- [2026-07-13 我们的宇宙项目初始化](docs/2026-07-13-我们的宇宙项目初始化.md)
- [2026-07-13 V2 升级改造](docs/2026-07-13-V2升级改造.md)
- [2026-07-20 项目未完成项与修订清单](docs/2026-07-20-项目未完成项与修订清单.md)

## 🧠会话交接
- 当前状态：主视觉与 Firebase 基础接入已完成，进入线上验收、内容迁移与安全收尾阶段
- ✅ 已完成：
  - V2 lion_background.js 完整宇宙开场动画
  - 首页 Hero（星球 + 相遇天数 + 三个入口卡片）
  - CSS 配色方案升级 / spaceReady / 密码锁
  - 照片回忆墙（6 张 = 2 组 × 3）/ 背景音乐 / 生日花瓣
  - 留言板（Firestore）/ CSS 树 / 天气 / 在线心跳
  - 图片轮播（89 张）/ PWA
  - Bug：animate() 黑屏 / 文字 11s / LOVE_START_DATE=2025-01-29 / 照片 5→6
- 🐛 待验收：本地的重复进入密码入口修复尚未成功上线；发布后需做连续回归。
- 📋 待实现：图片留言上传、真实照片/音乐迁移、Cyber-AI 同源代理、天气代理和服务端访问保护。
- 🔒 当前限制：私人媒体、私密配置与 AI/天气密钥不能提交到仓库；Storage 已配置但上传前端尚未实现。
- ✅ 已部署：Vercel 与 `love.xiahuaaitalk.top`；根域名继续保留给 Cyber-AI 项目。
- 说明：全局偏好在 `C:\Users\yjhdetianxuan\.AGENTS.md`；本文件只维护本项目交接

## 开发注意事项
- 单文件架构，CSS 和 JS 均在 index.html 内联
- lion_background.js 和 image_carousel.js 为外部脚本（`defer` 加载）
- Three.js 通过 CDN 动态加载（r128），失败自动回落
- 移动端自动检测 (`window.innerWidth < 600`) 降级粒子数
- 修改颜色方案：改 `:root` CSS 变量即可全局生效
