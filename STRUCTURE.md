# 🏗 架构说明（V2 更新）

## 2026-07-22 公开页面数据流

```text
密码解锁 ──> earth-atlas.js 地球主页面 ──> 左侧地图标签（地球 / 回忆 / 此刻 / 档案）
                         └── 选中中国或地点后才显示动态旅行路线

回忆页 6 张纵向拍立得

档案模块 ──首次进入──> image_carousel.js ──> Vercel 静态 assets/Photograph/IMG_20260228/（93 张）
                                  └─Firebase 仅保留给未来新增或朋友投稿；不可用不影响既有档案
                                  │
朋友图片 ──浏览器压缩──> Firebase Storage 待审核路径
                                  │
                         Firestore carouselSubmissions（pending）
                                  │
人工审核后写入 carouselPhotos ──> 全部访客可见

CSS 多层星云与云层漂移 ──> 首次打开直接显示星空
Realtime Database status ──> presence-heart.js ──> 光点传至左侧半心/完整星尘心形
解锁后的指针/手指移动 ──> stardust-trail.js ──> 单粒低密度金银星尘轨迹（3.2 至 5 秒淡出）
earth-atlas.js 横向流动星河 ──> GALAXY_PLANETS + assets/planets/ ──> 渐隐暗面的真实天体 / 星辰手记 / CSS 光晕、点击轨道、粒子爆发与私密情话
天气 API ──> 右侧上海、成都纵向天气画面（独立超时降级）
Firestore messages ──> 档案模块留言墙（12 条分页；异常时静默隐藏）
```

公开访客在进入档案模块后加载留言界面，但不会收到功能失败提示。`messages` 的既有数据保留用于内部测试；删除数据不属于页面部署流程，必须由项目所有者另行确认。

放映机投稿区在上传服务尚未就绪时保持完整的标题、按钮文字与色彩，仅以不可点击状态阻止提交；不使用整体透明度作为不可用状态，以免干扰页面视觉层次。

## 当前执行边界（2026-07-23）

Firebase 的规则发布和真实读写验收优先于新的视觉开发。朋友展示阶段的照片、音乐继续从 Vercel 读取；`archive/` 迁移仅保留为后续方案，当前不迁移、不删除原媒体。地球、旅行地点共建和心跳的后续视觉必须先出设计图，经小花先生确认后才进入 UI 实现。详见 `docs/2026-07-23-未完成事项交接清单.md`。

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
├── api/config.js       # Vercel 异步提供天气 Key 与可选月亮信件，不含密码
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
│   ├── <script src="scripts/ui/earth-atlas.js?v=13" defer> — 全视口流动星河、渐隐暗面的真实天体、第一束光写给钰涵大人的私语
│   ├── <script src="scripts/ui/stardust-trail.js?v=3" defer> — 全局单粒低负载金银星尘轨迹
│   ├── <script src="image_carousel.js?v=4" defer> — 回忆放映机（93 张 Vercel 静态照片）
│   ├── <script src="memory_timeline.js" defer>  — 时间星河
│   ├── <script src="love_letter.js" defer>      — 隐藏情书
│   ├── <script src="star_tree.js" defer>        — 留言星星树
│
└── <body>
    ├── 星空背景层（#starfield，直接使用 celestial-atlas-cloud-drift.png 的 CSS 默认背景）
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
    │   │   └── 天气卡片 × 2（独立于 Firebase SDK）
    │   ├── 模块三：回忆放映机（#module-image-carousel）
    │   │   └── 93 张 Vercel 静态照片轮播（JS 动态创建）
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
| `scripts/ui/earth-atlas.js` | 全视口流动星河、透明真实天体资产、CSS 光晕/轨道、粒子爆发、左侧地图抽屉 | `<script defer>`，解锁后作为默认模块显示 |
| `scripts/ui/stardust-trail.js` | 低密度金银指针/手指星尘轨迹 | `<script defer>`，主体验解锁后生效 |
| `image_carousel.js` | 93 张 Vercel 静态完整档案轮播与朋友投稿扩展（unseen-first） | `<script defer>`，首次打开模块时初始化 |
| `scripts/media/migrate-archive-to-firebase.js` | 将本地完整档案上传为 `archive/` 并写入 `archivePhotos` | 仅由项目所有者在仓库外服务账号凭据下手动运行 |
| `memory_timeline.js` | 按日期排列照片回忆 | `<script defer>` |
| `love_letter.js` | 监听月亮事件并控制隐藏情书 | `<script defer>` |
| `star_tree.js` | Firestore 留言展示为星星 | `<script defer>` |

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
love_letter.js  打开 #love-letter-modal，显示每日一句
         │
         │  点击“收下这句话”
         ▼
components/cosmic-envelope/envelope.js  showEnvelope() 展示信封
         │
         │  点击封蜡按钮
         ▼
信封上盖翻转 → 信纸升起 → 逐字显示
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
                              秘密基地先加载天气；firebaseReadyPromise → 在线心跳与留言初始化
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

## 静态媒体发布

- 主目录 `assets/Music/` 的 MP3 是开场与首页的播放来源；FLAC 保持本地，不参与部署。
- 主目录 `assets/Photograph/IMG_20260228/` 的 JPG/JPEG/PNG 是照片墙与放映机来源；DNG、视频不参与部署。
- 媒体文件和代码在主分支一起推送后，由 Vercel 以相对路径提供给页面。

```
UI 层（DOM 操作、事件监听、CSS 动画）
    │
    ├── lion_background.js（原生 Three.js 狮子座数据、显影与渲染；开场模块只覆盖）
    ├── scripts/opening/cinematic-opening.js（只管理电影开场视觉、文字与首星点击时机）
    ├── scripts/opening/opening-flow.js（只管理密码层桥接与返回入口）
    ├── scripts/ui/earth-atlas.js（流动星河、可探索行星与私密彩蛋）
    ├── scripts/ui/stardust-trail.js（全局金银星尘轨迹）
    ├── image_carousel.js（首次切换到放映机时注入 CSS + DOM）
    ├── memory_timeline.js（读取照片配置，渲染时间线）
    ├── love_letter.js（监听月亮长按事件；先显示每日一句，仅“收下”再展示信封）
    ├── components/cosmic-envelope/（封蜡按钮、信封翻转、信纸升起与计时器清理）
    ├── star_tree.js（留言数据到星星展示）
    │
    ▼
业务逻辑层（轮播、星图静观页、生日检测、留言管理、天气、相遇天数）
    │
    ▼
服务/数据层（runtime-config、photos[]、Firebase SDK、fetch API、Three.js CDN）
```
