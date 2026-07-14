# 📇 文件索引

```
D:\MY_Project\web-page\
├── index.html          # 【核心】主应用（内联 CSS + JS）
├── lion_background.js  # 【V2】宇宙开场动画系统（Three.js）
├── image_carousel.js   # 【V2】回忆放映机（图片轮播）
├── manifest.json       # PWA 应用清单
├── sw.js               # Service Worker（离线缓存）
├── README.md           # 项目概述 + 快速开始
├── INDEX.md            # 本文件 — 文件索引
├── STRUCTURE.md        # 架构说明 + 数据流
├── CLAUDE.md           # AI 助手指令文件
├── docs/
│   ├── 2026-07-13-我们的宇宙项目初始化.md   # V1 技术文档
│   └── 2026-07-13-V2升级改造.md            # V2 升级文档
└── assets/             # 静态资源
    ├── Music/          # 背景音乐（.flac）
    ├── Photograph/     # 照片资源（89 张）
    ├── blessing.mp3    # 生日祝福语音
    ├── icon-192.png    # PWA 图标小
    └── icon-512.png    # PWA 图标大
```

## 各文件用途速查

| 文件 | 改什么 |
|------|--------|
| `index.html` | 改配置变量（搜索 `【配置区】`）、改照片数组、改 CSS 变量 |
| `lion_background.js` | 改粒子数量、动画时间轴、开场文字 |
| `image_carousel.js` | 改图片路径 `ALL_IMAGES` 数组 |
| `manifest.json` | 改 `name`、`short_name`、图标路径 |
| `sw.js` | 改缓存策略、改缓存文件列表 `CACHE_FILES` |
| `docs/*.md` | 技术文档，改完后记得更新 |
