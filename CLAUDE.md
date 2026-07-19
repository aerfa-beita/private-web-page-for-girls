# 我们的宇宙 — 项目 CLAUDE.md

## 项目信息
- **路径**：`D:\MY_Project\web-page\`
- **类型**：情侣浪漫网页（单文件 HTML + 外部 JS）
- **技术栈**：HTML5 + CSS3 + Vanilla JS + Three.js r128 + Firebase + PWA

## 文件结构
```
D:\MY_Project\web-page\
├── index.html              # 【核心】主应用（内联 CSS + JS）
├── lion_background.js      # V2 宇宙开场动画系统（Three.js）
├── image_carousel.js       # 回忆放映机（图片轮播）
├── manifest.json           # PWA 应用清单
├── sw.js                   # Service Worker（离线缓存）
├── README.md               # 项目概述 + 快速开始
├── INDEX.md                # 文件索引
├── STRUCTURE.md            # 架构说明 + 数据流
├── CLAUDE.md               # 本文件 — AI 助手指令
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
- `MOON_LETTERS[]` — 月亮长按时优先展示的专属情书（在 `config.js` 中配置）
- `MUSIC_PLAYLIST[]` — 音乐列表
- `FIREBASE_CONFIG` — Firebase 配置
- `WEATHER_API_KEY` — OpenWeatherMap API Key

## 📄最新文档
- [2026-07-13 我们的宇宙项目初始化](docs/2026-07-13-我们的宇宙项目初始化.md)
- [2026-07-13 V2 升级改造](docs/2026-07-13-V2升级改造.md)
- [2026-07-14 V2 路线功能实现](docs/2026-07-14-V2路线功能实现.md)
- [2026-07-14 V3 首页视觉叙事](docs/2026-07-14-V3首页视觉叙事.md)
- [2026-07-14 V3 狮子座静观页](docs/2026-07-14-V3狮子座静观页.md)
- [2026-07-14 V3 星图交互排版](docs/2026-07-14-V3星图交互排版.md)
- [2026-07-14 V3 点击解锁与铭文排版](docs/2026-07-14-V3点击解锁与铭文排版.md)
- [2026-07-14 V4 验收基线合并](docs/2026-07-14-V4验收基线合并.md)
- [2026-07-19 狮子座原图主视觉](docs/2026-07-19-狮子座原图主视觉.md)
- [2026-07-19 开场视觉退场](docs/2026-07-19-开场视觉退场.md)
- [2026-07-19 引导流星与月亮情书](docs/2026-07-19-引导流星与月亮情书.md)
- [2026-07-19 电影式狮子显影](docs/2026-07-19-电影式狮子显影.md)
- [2026-07-19 开场与首页收尾](docs/2026-07-19-开场与首页收尾.md)
- [2026-07-19 仓库清理](docs/2026-07-19-仓库清理.md)
- [2026-07-19 Firestore 匿名留言接入](docs/2026-07-19-Firestore匿名留言接入.md)
- [2026-07-19 Firebase 公开配置部署](docs/2026-07-19-Firebase公开配置部署.md)
- [2026-07-19 Storage 占位文案清理](docs/2026-07-19-Storage占位文案清理.md)
- [2026-07-19 开场降级完整视觉](docs/2026-07-19-开场降级完整视觉.md)

## 🧠会话交接
- 当前状态：V3 已合并为主验收基线；V4 逐项改造在独立工作树进行
- 最近完成：密码正确后星图短暂停留并自动上划退场；开场节奏收束为流星、连续主星、狮子显形；月亮信件优先读取 `MOON_LETTERS`，首页与移动端排版同步收尾。
- 仓库清理：旧开场实验、临时分析文件与未使用狮子源图已删除；私人媒体、私密配置与 Git 工作树保留在本地且不提交。
- Firestore 留言：已改为匿名登录后再读写，并补充空列表与错误状态；Firebase 控制台仍需发布文档中的 `messages` 规则。
- Vercel 配置：Firebase 网页公开配置已从私有 `config.js` 拆分为可发布的 `firebase-config.js`；天气 Key、AI 地址与私人内容继续保持本地。
- Storage 界面：已移除秘密基地内过期的“待开通 Storage”提示；图片上传仍待独立实现。
- 开场降级：Three.js 不可用时会显示完整的标题、月亮与静态狮子座，避免只剩空星空。
- ✅ 已完成：
  - V2 lion_background.js 完整宇宙开场动画
  - 首页 Hero（星球 + 相遇天数 + 三个入口卡片）
  - CSS 配色方案升级 / spaceReady / 密码锁
  - 照片回忆墙（6 张 = 2 组 × 3）/ 背景音乐 / 生日花瓣
  - 留言板（Firestore）/ CSS 树 / 天气 / 在线心跳
  - 图片轮播（89 张）/ PWA
  - Bug：animate() 黑屏 / 文字 11s / LOVE_START_DATE=2025-01-29 / 照片 5→6
  - 时间星河 / 拍立得 / 隐藏情书
  - 留言星星树 / AI 前端安全边界
  - V3 首页视觉叙事（深空暖金配色、克制 Hero、狮子座时间轴）
  - V3 狮子座静观页（解锁后静观、三颗记忆主星、现有照片碎片）
  - V3 星图交互排版（星云背景、文案分区、拖拽旋转）
  - V3 点击解锁与铭文排版（开场后点击显示密码、纵向记忆铭文）
  - 透明狮子座融合（六颗镰刀星、无背景精细金线稿、开场与静观页一致）
- 📋 V4 待逐项验收：
  - 狮子座电影式开场与暖金固定星图
  - 点击密码入口的暖金玻璃视觉
  - 记忆星球、星门和主要 emoji 清理
  - 后台暂停、移动端与动画生命周期优化
- 🔁 工作流：主工作区只保留已验收版本；V4 草稿在 `.worktrees/` 独立开发，未验收不合并
- 🔒 阻塞：
  - Firebase Storage 需绑定 VISA，图片上传继续禁用
  - AI 需要小花先生部署同源代理并配置 `AI_ENDPOINT`
  - Vercel 与 xiahuaaitalk.top 需要账户和 DNS 授权
- 说明：全局偏好在 `C:\Users\yjhdetianxuan\.claude.md`；本文件只维护本项目交接

## 开发注意事项
- 单文件架构，CSS 和 JS 均在 index.html 内联
- lion_background.js 和 image_carousel.js 为外部脚本（`defer` 加载）
- Three.js 通过 CDN 动态加载（r128），失败自动回落
- 移动端自动检测 (`window.innerWidth < 600`) 降级粒子数
- 修改颜色方案：改 `:root` CSS 变量即可全局生效
