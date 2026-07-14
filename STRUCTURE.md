# 🏗 架构说明（V2 更新）

## 代码分层

```
index.html
│
├── <head> — 元数据 + PWA 注册 + 外部脚本引用
│   ├── meta viewport（移动端适配）
│   ├── link manifest.json
│   ├── <style> — 全部 CSS
│   │   ├── CSS 变量（V2 配色：--bg-deep #080817, --accent #ff9ebb, --accent2 #a8d8ff, --gold #ffd166）
│   │   ├── 星空背景样式
│   │   ├── 密码锁样式
│   │   ├── V2 宇宙首页 Hero（.universe-home / .planet-area / .space-menu）
│   │   ├── 模块一：时间星河（照片墙/音乐/情话/心跳）
│   │   ├── 模块二：成长星球（留言/CSS树/天气）
│   │   ├── 底部导航栏
│   │   └── 动画（呼吸、心跳、淡入淡出、花瓣飘落）
│   ├── <script src="lion_background.js" defer>  — V2 宇宙动画
│   └── <script src="image_carousel.js" defer>   — 回忆放映机
│
└── <body>
    ├── 星空背景层（#starfield，Three.js 激活时隐藏）
    ├── 密码锁遮罩层（#lock-screen，初始隐藏，spaceReady 后显示）
    ├── 主应用容器（#app-main）
    │   ├── 生日祝福弹窗（#birthday-modal） + Canvas 花瓣
    │   ├── 模块一：宇宙首页（#module-time-machine）
    │   │   ├── V2 Hero（标题 + 星球 + 相遇天数 + 三个入口卡片）
    │   │   ├── 照片回忆墙（3 张一组、洗牌翻页）
    │   │   ├── 背景音乐 <audio>
    │   │   ├── 每日情话
    │   │   └── 在线心跳
    │   ├── 模块二：成长星球（#module-secret-base）
    │   │   ├── 留言输入 + 留言列表（Firestore）
    │   │   ├── CSS 树 + 叶子
    │   │   └── 天气卡片 × 2
    │   ├── 模块三：回忆放映机（#module-image-carousel）
    │   │   └── 89 张图片轮播（JS 动态创建）
    │   └── 底部导航栏（时间星河 / 成长星球 / 回忆放映机）
    │
    └── <script> — 全部 JS
        ├── 【配置区】— 所有需替换的变量
        ├── 相遇天数系统（updateLoveDays）
        ├── Firebase SDK CDN 加载
        ├── 星空背景生成器（CSS 星星，作为 Three.js 回落）
        ├── 密码锁逻辑（spaceReady 后显示）
        ├── 模块切换（switchModule，供导航栏和首页卡片共用）
        ├── 模块一逻辑（照片轮播/音乐/生日检测/花瓣/在线状态）
        ├── 模块二逻辑（留言 CRUD/CSS 树/天气 API）
        ├── 启动入口（bootstrap：注册 SW → 加载 Firebase → 启动 lion_background → 等待 spaceReady）
        └── Service Worker 注册
```

## 外部脚本

| 文件 | 职责 | 加载方式 |
|------|------|----------|
| `lion_background.js` | V2 宇宙开场动画（Three.js WebGL） | `<script defer>` |
| `image_carousel.js` | 89 张图片轮播（unseen-first） | `<script defer>` |

## 通信协议

```
lion_background.js  introAnimation() 9s 完成
         │
         │  window.dispatchEvent(new Event("spaceReady"))
         ▼
index.html  window.addEventListener("spaceReady", () => 显示密码锁)
```

## 数据流向

```
页面加载
    │
    ▼
bootstrap() → registerSW() → loadFirebaseSDK() → initLionBackground()
    │                                                    │
    │                                              开场动画播放 (9s)
    │                                                    │
    │                                          dispatchEvent("spaceReady")
    │                                                    │
    ▼                                                    ▼
注册 SW + Firebase                          显示密码锁（#lock-screen）
                                                 │
                                            用户输入密码
                                                 │
                                        SECRET_CODE 比对
                                            │         │
                                          正确       错误
                                            │         │
                                            ▼         ▼
                                    进入主应用    抖动 + 提示
                                            │
                            ┌───────────────┼───────────────┐
                            ▼               ▼               ▼
                      宇宙首页         成长星球         回忆放映机
                      (time-machine)  (secret-base)  (image-carousel)
                            │               │               │
                    ┌───────┼───────┐       │               │
                    ▼       ▼       ▼       ▼               ▼
                  Hero   照片墙  音乐   留言 CRUD        图片轮播
                 相遇天数 情话   心跳   CSS 树           (JS 动态)
                                       天气 API
```

## 依赖关系

```
UI 层（DOM 操作、事件监听、CSS 动画）
    │
    ├── lion_background.js（独立运行，通过 CustomEvent 通信）
    ├── image_carousel.js（独立运行，注入 CSS + DOM）
    │
    ▼
业务逻辑层（轮播、生日检测、留言管理、天气、相遇天数）
    │
    ▼
数据层（photos[]、Firebase SDK、fetch API、Three.js CDN）
```
