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
│   ├── <script src="scripts/services/runtime-config.js?v=1"> — 运行配置有效性与服务降级状态
│   ├── <script src="lion_background.js?v=5"> — 原生 Three.js 狮子座场景；首星事件后启动，月亮位于右上留白区
│   ├── <script src="scripts/opening/cinematic-opening.js?v=7"> — 艺术字幕镜面碎裂、第一颗星、首次点击与主页收拢
│   ├── <script src="scripts/opening/opening-flow.js?v=2"> — 密码层桥接与返回星光
│   ├── <script src="image_carousel.js" defer>   — 回忆放映机
│   ├── <script src="memory_timeline.js" defer>  — 时间星河
│   ├── <script src="love_letter.js" defer>      — 隐藏情书
│   ├── <script src="star_tree.js" defer>        — 留言星星树
│   └── <script src="ai_service.js" defer>       — 同源 AI 代理客户端
│
└── <body>
    ├── 星空背景层（#starfield，主页背景）
    ├── Three.js 宇宙层（#lion-background：首星点击后创建的原生狮子座模块，内部逻辑不改动）
    ├── 电影开场层（#cinematic-opening：黑幕、艺术字幕、第一颗星；点击后退出）
    ├── 密码锁遮罩层（#lock-screen，银河稳定后显示星点密码）
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
    │   │   ├── 匿名登录 → 文字留言输入 + 留言列表（Firestore，12 秒超时与重试）
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
        ├── 运行配置读取 + Firebase SDK CDN 加载
        ├── 星空背景生成器（CSS 星星，作为 Three.js 回落）
        ├── 密码锁逻辑（星点显示、密码校验、银河收拢后进入主页）
        ├── 模块切换（switchModule，供导航栏和首页卡片共用）
        ├── 模块一逻辑（照片轮播/音乐/生日检测/花瓣/在线状态）
        ├── 模块二逻辑（留言 CRUD/星星树/AI 入口/天气 API）
        ├── 启动入口（bootstrap：线上注册 SW → 初始化电影开场；Firebase 并行加载）
        └── Service Worker 注册（127.0.0.1 / localhost 预览时注销并跳过）
```

## 外部脚本

| 文件 | 职责 | 加载方式 |
|------|------|----------|
| `scripts/services/runtime-config.js` | Firebase/天气配置有效性与服务降级状态 | 同步加载，位于配置文件之后 |
| `lion_background.js` | 原生 Three.js 星野、银河和透明主视觉狮子座；月亮右上留白构图 | 同步加载，首星事件后初始化 |
| `scripts/opening/cinematic-opening.js` | 艺术字幕镜面碎裂、第一颗星、光波、点击事件与主页收拢 | 同步加载，先于流程桥接 |
| `scripts/opening/opening-flow.js` | 密码层桥接、返回星光、密码正确后的收拢 | 同步加载，位于电影开场之后 |
| `image_carousel.js` | 89 张图片轮播（unseen-first） | `<script defer>`，首次打开模块时初始化 |
| `memory_timeline.js` | 按日期排列照片回忆 | `<script defer>` |
| `love_letter.js` | 监听月亮事件并控制隐藏情书 | `<script defer>` |
| `star_tree.js` | Firestore 留言展示为星星 | `<script defer>` |
| `ai_service.js` | 调用同源 AI 服务端代理 | `<script defer>` |

## 通信协议

```
cinematic-opening.js  用户点击第一颗星
         │
         ├── window.dispatchEvent(new Event("cinematicFirstLight"))
         │
         └── window.dispatchEvent(new Event("openingRitualFirstLight"))
                     │
                     ▼
          bootstrap() 调用原生 initLionBackground()
                     │
         ▼
电影开场退出；原生流星、星野、镰刀星与透明狮子座从零播放；音乐渐入
         │
         │  window.dispatchEvent(new Event("cinematicPasswordRequested"))
         ▼
opening-flow.js  显示星点密码层（#lock-screen）
```

```text
密码页点击“回到星光里”
         │
         ▼
opening-flow.js  调用 cinematic-opening.returnToPassword()
         │
         ▼
再次点击中心恒星 → 重新显示密码锁
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
bootstrap() → registerSW() → openingFlow.init() → 电影黑幕与前置文字；Firebase SDK 并行加载
             （本地预览跳过 SW）
    │                                                         │
    │                                              黑幕字幕后显示第一颗星
    │                                                         │
    │                                  点击第一颗星 → initLionBackground() → 原生狮子座时间轴
    │                                                         │
    ▼                                                         ▼
注册 SW + Firebase                                  显示星点密码（#lock-screen）
                                                 │
                                            用户输入密码
                                                 │
                                        SECRET_CODE 比对
                                            │         │
                                          正确       错误
                                            │         │
                                            ▼         ▼
                                    银河收拢为主页
                                            │
                                      自动进入首页（触摸/键盘可跳过）
                                            │
                              firebaseReadyPromise → 在线心跳 + 秘密基地初始化
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
                                       天气 API / 留言超时重试
```

## 依赖关系

```
UI 层（DOM 操作、事件监听、CSS 动画）
    │
    ├── lion_background.js（原生 Three.js 狮子座数据、显影与渲染；开场模块只覆盖）
    ├── scripts/opening/cinematic-opening.js（只管理电影开场视觉、文字与首星点击时机）
    ├── scripts/opening/opening-flow.js（只管理密码层桥接与返回入口）
    ├── image_carousel.js（首次切换到放映机时注入 CSS + DOM）
    ├── memory_timeline.js（读取照片配置，渲染时间线）
    ├── love_letter.js（监听隐藏情书事件）
    ├── star_tree.js（留言数据到星星展示）
    └── ai_service.js（仅调用同源后端）
    │
    ▼
业务逻辑层（轮播、星图静观页、生日检测、留言管理、天气、相遇天数）
    │
    ▼
服务/数据层（runtime-config、photos[]、Firebase SDK、fetch API、Three.js CDN）
```
