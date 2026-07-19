# 📇 文件索引

```
D:\MY_Project\web-page\
├── index.html          # 【核心】主应用（内联 CSS + JS）
├── firebase-config.js  # Firebase 网页公开连接配置（可随 Vercel 发布）
├── lion_background.js  # 宇宙开场动画 + 透明狮子座融合
├── image_carousel.js   # 【V2】回忆放映机（图片轮播）
├── memory_timeline.js  # 【V2】时间星河（按日期渲染回忆）
├── love_letter.js      # 【V2】隐藏情书弹窗控制器
├── star_tree.js        # 【V2】留言到展示星星的映射
├── ai_service.js       # 【V2】同源 AI 代理调用边界
├── manifest.json       # PWA 应用清单
├── sw.js               # Service Worker（离线缓存）
├── README.md           # 项目概述 + 快速开始
├── INDEX.md            # 本文件 — 文件索引
├── STRUCTURE.md        # 架构说明 + 数据流
├── CLAUDE.md           # AI 助手指令文件
├── docs/
│   ├── 2026-07-13-我们的宇宙项目初始化.md   # V1 技术文档
│   ├── 2026-07-13-V2升级改造.md            # V2 升级文档
│   ├── 2026-07-14-V2路线功能实现.md        # V2 路线实现与外部配置
│   ├── 2026-07-14-V3首页视觉叙事.md        # V3 首屏视觉改造
│   ├── 2026-07-14-V3狮子座静观页.md        # V3 狮子座静观页
│   ├── 2026-07-14-V3星图交互排版.md        # V3 星图交互与排版
│   ├── 2026-07-14-V3点击解锁与铭文排版.md  # V3 点击解锁与铭文排版
│   ├── 2026-07-14-V4验收基线合并.md        # V4 主验收基线与工作树规则
│   ├── 2026-07-19-狮子座原图主视觉.md      # 透明狮子座融合与缓存策略
│   └── 2026-07-19-开场视觉退场.md          # 进入首页后卸载开场视觉
│   └── 2026-07-19-引导流星与月亮情书.md    # 连续星轨、引导流星与月亮反馈
│   ├── 2026-07-19-电影式狮子显影.md        # 开场流星与无跳变显影时序
│   ├── 2026-07-19-开场与首页收尾.md        # 自动过渡、月亮信件与移动端收尾
│   ├── 2026-07-19-仓库清理.md               # 删除临时文件与未使用设计源图
│   ├── 2026-07-19-Firestore匿名留言接入.md  # 匿名登录、错误反馈与安全规则
│   ├── 2026-07-19-Firebase公开配置部署.md   # Vercel 的 Firebase 公开配置
│   ├── 2026-07-19-Storage占位文案清理.md    # 移除过期的 Storage 提示
│   ├── 2026-07-19-开场降级完整视觉.md       # Three.js 失败时的完整开场
│   └── 2026-07-19-重复进入密码入口.md       # 返回后重绑轻触入口
├── tests/
│   └── site-features.test.js                # 静态功能与安全边界检查
└── assets/             # 静态资源
    ├── Music/          # 背景音乐（.flac）
    ├── Photograph/     # 照片资源（89 张）
    ├── Leo/            # 狮子座设计参考图与当前透明金线主视觉
    ├── blessing.mp3    # 生日祝福语音
    ├── icon-192.png    # PWA 图标小
    └── icon-512.png    # PWA 图标大
```

## 各文件用途速查

| 文件 | 改什么 |
|------|--------|
| `index.html` | 改配置变量（搜索 `【配置区】`）、改照片数组、改 CSS 变量 |
| `lion_background.js` | 改粒子数量、动画时间轴、镰刀星与透明狮子座线稿 |
| `image_carousel.js` | 改图片路径 `ALL_IMAGES` 数组 |
| `memory_timeline.js` | 改时间星河的照片排序和卡片渲染 |
| `love_letter.js` | 改隐藏情书的打开与关闭逻辑 |
| `star_tree.js` | 改 Firestore 留言到星星的展示映射 |
| `ai_service.js` | 改同源 AI 代理请求和失败提示 |
| `manifest.json` | 改 `name`、`short_name`、图标路径 |
| `sw.js` | 改缓存策略、改缓存文件列表 `CACHE_FILES` |
| `docs/*.md` | 技术文档，改完后记得更新 |
