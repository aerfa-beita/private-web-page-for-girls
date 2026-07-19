# 🏗 架构说明（V2 更新）

## 代码分层

## 验收工作流

```
main（主工作区）
    │
    ├── 仅保存已验收版本
    │
    ▼
.worktrees/feature-v4-*
    │
    ├── 单项开发与测试
    ├── 本地视觉验收
    │
    ▼
小花先生确认后合并回 main
```

```
index.html
│
├── firebase-config.js  # Firebase 网页公开配置，供线上匿名登录与留言使用
│
├── <head> — 元数据 + PWA 注册 + 外部脚本引用
│   ├── meta viewport（移动端适配）
│   ├── link manifest.json
│   ├── <style> — 全部 CSS
│   │   ├── CSS 变量（V2 配色：--bg-deep #080817, --accent #ff9ebb, --accent2 #a8d8ff, --gold #ffd166）
│   │   ├── 星空背景样式
│   │   ├── 密码锁样式
│   │   ├── V3 宇宙首页 Hero（.universe-home / .planet-area / .space-menu）
│   │   ├── 模块一：时间星河（照片墙/音乐/情话/心跳）
│   │   ├── 模块二：成长星球（留言/星星树/天气/AI 入口）
│   │   ├── 底部导航栏
│   │   └── 动画（呼吸、心跳、淡入淡出、花瓣飘落）
│   ├── <script src="lion_background.js?v=21" defer>  — 宇宙动画、完整降级开场、电影式显影与退场卸载
│   ├── <script src="image_carousel.js" defer>   — 回忆放映机
│   ├── <script src="memory_timeline.js" defer>  — 时间星河
│   ├── <script src="love_letter.js" defer>      — 隐藏情书
│   ├── <script src="star_tree.js" defer>        — 留言星星树
│   └── <script src="ai_service.js" defer>       — 同源 AI 代理客户端
│
└── <body>
    ├── 星空背景层（#starfield，Three.js 激活时隐藏）
    ├── 完整备用开场（#opening-fallback，Three.js 不可用时显示）
    ├── 点击提示层（#unlock-prompt，spaceReady 后显示，首次点击打开密码锁）
    ├── 密码锁遮罩层（#lock-screen，初始隐藏，首次点击后显示）
    ├── 狮子座静观页（#constellation-observatory，密码正确后短暂显示后自动上划，CSS 星云背景 + 透明金线星图拖拽旋转）
    ├── 主应用容器（#app-main）
    │   ├── 生日祝福弹窗（#birthday-modal） + Canvas 花瓣
    │   ├── 模块一：宇宙首页（#module-time-machine）
    │   │   ├── V2 Hero（标题 + 星球 + 相遇天数 + 三个入口卡片）
    │   │   ├── 照片回忆墙（3 张一组、洗牌翻页）+ 时间星河
    │   │   ├── 背景音乐 <audio>
    │   │   ├── 每日情话
    │   │   └── 在线心跳
    │   ├── 模块二：成长星球（#module-secret-base）
    │   │   ├── 匿名登录 → 文字留言输入 + 留言列表（Firestore）
    │   │   ├── 留言星星树（Firestore 留言只读映射）
    │   │   ├── AI 互动入口（同源代理）
    │   │   └── 天气卡片 × 2
    │   ├── 模块三：回忆放映机（#module-image-carousel）
    │   │   └── 89 张图片轮播（JS 动态创建）
    │   └── 底部导航栏（时间星河 / 成长星球 / 回忆放映机）
    │
    └── <script> — 全部 JS
        ├── 【配置区】— 所有需替换的变量
        ├── 相遇天数系统（updateLoveDays）
        ├── Firebase 网页配置 + SDK CDN 加载
        ├── 星空背景生成器（CSS 星星，作为 Three.js 回落）
        ├── 密码锁逻辑（spaceReady 后等待首次点击显示）
        ├── 模块切换（switchModule，供导航栏和首页卡片共用）
        ├── 模块一逻辑（照片轮播/音乐/生日检测/花瓣/在线状态）
        ├── 模块二逻辑（留言 CRUD/星星树/AI 入口/天气 API）
        ├── 启动入口（bootstrap：注册 SW → 加载 Firebase → 启动 lion_background → 等待 spaceReady）
        └── Service Worker 注册
```

## 外部脚本

| 文件 | 职责 | 加载方式 |
|------|------|----------|
| `lion_background.js` | 宇宙开场动画（开场流星 + 连续镰刀星轨 + 电影式显影 + 月亮情书） | `<script src="lion_background.js?v=20" defer>` |
| `image_carousel.js` | 89 张图片轮播（unseen-first） | `<script defer>` |
| `memory_timeline.js` | 按日期排列照片回忆 | `<script defer>` |
| `love_letter.js` | 监听月亮事件并控制隐藏情书 | `<script defer>` |
| `star_tree.js` | Firestore 留言展示为星星 | `<script defer>` |
| `ai_service.js` | 调用同源 AI 服务端代理 | `<script defer>` |

## 通信协议

```
lion_background.js  introAnimation() 9.4s 完成
         │
         │  window.dispatchEvent(new Event("spaceReady"))
         ▼
index.html  window.addEventListener("spaceReady", () => 显示点击提示)
         │
         │  用户首次 pointerdown
         ▼
显示密码锁（#lock-screen）
```

```
lion_background.js  月亮长按 1.2 秒
         │
         │  dispatchEvent("loveLetterRequested")
         ▼
love_letter.js  打开 #love-letter-modal
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
                                    狮子座静观页  短暂停留 + 自动上划
                                            │
                                      自动进入首页（触摸/键盘可跳过）
                                            │
                                            ▼
                         mainExperienceEntered → 卸载开场画布与狮子背景
                                            │
                            ┌───────────────┼───────────────┐
                            ▼               ▼               ▼
                      宇宙首页         成长星球         回忆放映机
                      (time-machine)  (secret-base)  (image-carousel)
                            │               │               │
                    ┌───────┼───────┐       │               │
                    ▼       ▼       ▼       ▼               ▼
                  Hero   照片墙  音乐   留言 CRUD        图片轮播
                 相遇天数 情话   心跳   星星树           (JS 动态)
                                       天气 API
```

## 依赖关系

```
UI 层（DOM 操作、事件监听、CSS 动画）
    │
    ├── lion_background.js（独立运行，通过 CustomEvent 通信）
    ├── image_carousel.js（独立运行，注入 CSS + DOM）
    ├── memory_timeline.js（读取照片配置，渲染时间线）
    ├── love_letter.js（监听隐藏情书事件）
    ├── star_tree.js（留言数据到星星展示）
    └── ai_service.js（仅调用同源后端）
    │
    ▼
业务逻辑层（轮播、星图静观页、生日检测、留言管理、天气、相遇天数）
    │
    ▼
数据层（photos[]、Firebase SDK、fetch API、Three.js CDN）
```
