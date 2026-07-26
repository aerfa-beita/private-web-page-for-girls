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
├── scripts/services/runtime-config.js # 外部配置有效性与服务可用状态
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
- `FIREBASE_CONFIG` — Firebase 公开网页配置（`firebase-config.js`）
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
- [2026-07-15 开场融合设计](docs/2026-07-15-开场融合设计.md)
- [2026-07-16 开场融合实施计划](docs/2026-07-16-开场融合实施计划.md)
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
- [2026-07-19 重复进入密码入口](docs/2026-07-19-重复进入密码入口.md)
- [2026-07-20 项目未完成项与修订清单](docs/2026-07-20-项目未完成项与修订清单.md)
- [2026-07-20 Firestore 留言超时与重试](docs/2026-07-20-Firestore留言超时与重试.md)
- [2026-07-20 可靠开场与设备全屏策略](docs/2026-07-20-可靠开场与设备全屏策略.md)
- [2026-07-20 开场模块化与交互待办](docs/2026-07-20-开场模块化与交互待办.md)
- [2026-07-20 本地预览缓存与编码修复](docs/2026-07-20-本地预览缓存与编码修复.md)
- [2026-07-20 运行配置降级与页面生命周期](docs/2026-07-20-运行配置降级与页面生命周期.md)
- [2026-07-20 电影式仪式开场 V2](docs/2026-07-20-电影式仪式开场V2.md)
- [2026-07-20 狮子座回归与点击清场](docs/2026-07-20-狮子座回归与点击清场.md)
- [2026-07-21 星点狮子座与发现式开场](docs/2026-07-21-星点狮子座与发现式开场.md)
- [2026-07-21 复用既有狮子座实现](docs/2026-07-21-复用既有狮子座实现.md)
- [2026-07-21 首星启动原生狮子座](docs/2026-07-21-首星启动原生狮子座.md)
- [2026-07-21 文字聚星与首星对齐](docs/2026-07-21-文字聚星与首星对齐.md)
- [2026-07-21 主目录媒体部署清单](docs/2026-07-21-主目录媒体部署清单.md)
- [2026-07-21 P0 修复与部署准备](docs/2026-07-21-P0修复与部署准备.md)
- [2026-07-22 Firebase 心跳与弱网降级修复](docs/2026-07-22-Firebase心跳与弱网降级修复.md)
- [2026-07-22 记忆档案与此刻页面重构](docs/2026-07-22-记忆档案与此刻页面重构.md)
- [2026-07-22 放映机投稿可读性调整](docs/2026-07-22-放映机投稿可读性调整.md)
- [2026-07-22 完整回忆档案 Firebase 迁移](docs/2026-07-22-完整回忆档案Firebase迁移.md)
- [2026-07-22 地球主页面与回忆留痕重构](docs/2026-07-22-地球主页面与回忆留痕重构.md)
- [2026-07-22 开场稳定与档案模块修复](docs/2026-07-22-开场稳定与档案模块修复.md)
- [2026-07-23 未完成事项交接清单](docs/2026-07-23-未完成事项交接清单.md)
- [2026-07-23 同片天空心跳与天气重构](docs/2026-07-23-同片天空心跳与天气重构.md)
- [2026-07-23 星尘轨迹与流动星河](docs/2026-07-23-星尘轨迹与流动星河.md)
- [2026-07-25 真实天体视觉资产接入](docs/2026-07-25-真实天体视觉资产接入.md)
- [2026-07-25 天体暗面融合与低负载星尘](docs/2026-07-25-天体暗面融合与低负载星尘.md)
- [2026-07-25 宇宙信封 v4 高级质感](docs/2026-07-25-宇宙信封v4高级质感.md)
- [2026-07-26 月亮长按情书流程修复](docs/2026-07-26-月亮长按情书流程修复.md)

## 🧠会话交接
- 2026-07-26 月亮情书流程修复：长按月亮 1.2 秒只派发 `loveLetterRequested`；`love_letter.js` 先显示每日一句，只有“收下这句话”才调用 `showEnvelope()`，遮罩与 `Esc` 只关闭。封蜡已改为原生按钮，信封关闭会清理所有延迟与打字计时器，避免下次打开串内容。资源版本为 `love_letter.js?v=2`、`components/cosmic-envelope/*?v=8`，SW 为 `our-universe-v68-moon-letter-flow`。静态测试 31/31 通过，仍需发布后的桌面与手机手动长按验收。
- 2026-07-25 信封 v4 重写：`components/cosmic-envelope/` 三个文件全部重写。上盖改用 `clip-path: polygon()` + `filter: drop-shadow()` + 3D `rotateX`，废弃旧 `border-left/border-right 310px` 大三角 hack。信封主体 (`envelope-body`) 深蓝黑底色 + 10 颗 radial-gradient 金色星尘 + 微弱星云纹理 + 顶部金线压纹。左右折页改为小 clip-path 三角（50×65px）。星徽改为火漆蜡封质感、`sealBurst` 爆亮动画后缩小。动画级联：click → `.activating`(0.6s) → `.open`(0.7s触发，上盖翻转) → `.reveal`(2.2s，信纸升 70%+打字)。信纸初始 `translateY(220px)` 完全隐藏在信封主体后。`showEnvelope()` 接口和背景/月亮/长按逻辑不变。CSS/JS 版本号 v4，SW 缓存 `our-universe-v66-cosmic-envelope`。未做视觉验收，不能合并 main。
- 当前状态：主视觉、Firebase 基础接入与自定义域名已完成；进入上线验收和内容迁移阶段
- 当前 worktree：`.worktrees/modular-opening` 基于 `9fe615c` 创建；其中的开场模块化和交互改动尚未经过视觉验收，不能直接合并回 `main`。
- 当前开场修正（覆盖下方历史交接）：不再维护自建 SVG。页面只先播放黑幕、艺术文字和首星；第一句字幕会在原位分成克制的镜面两片，短暂停顿后平滑汇聚为居中的首星；不做弹跳或大范围散开。左侧远处光点已删除，第二句固定在首星下方。首星点击派发 `openingRitualFirstLight`，由 `bootstrap()` 在模块外一次性调用原生 `initLionBackground()`，完整播放原有时间轴。前置层 1.15 秒后退出，额外情书月亮按钮在开场时隐藏；原生月亮仅调整至狮头朝向外的右上留白区并缩小。缓存为 `our-universe-v37-mirror-caption`，脚本为 `cinematic-opening.js?v=7`、`lion_background.js?v=5`。
- 当前媒体发布修正：主目录 `assets/Music/` 已有 8 首 MP3，播放列表改为精确文件名；主目录 `assets/Photograph/IMG_20260228/` 的 93 张可展示图片已与放映机清单一致。`.gitignore` 允许 MP3 与 JPG/JPEG/PNG 随主分支部署，继续排除 FLAC、DNG、视频和私密配置。合并后在主目录执行 `git add assets/Music assets/Photograph` 即可将媒体随一次最终推送部署。缓存为 `our-universe-v38-main-media-mp3`。
- 本轮开场 V2：`scripts/opening/cinematic-opening.js` 负责黑幕字幕、第一颗星、银河、透明狮子座显影与收拢动画；`scripts/opening/opening-flow.js` 只负责密码层桥接。首屏不再加载 `lion_background.js` 或 Three.js；狮子座改用本地透明线稿 `#cinematic-leo`，在银河稳定后显影。
- 最近修正：第一颗星点击会立即清空“请亲手点亮它”与“轻轻点一下”的引导文字；已在 `127.0.0.1:5174` 验证狮子座在 `is-galaxy-born` 后出现。
- 当前开场：透明狮子座整图已移除，改为 `.cinematic-constellation` 内十颗主星和三段连线按顺序显影；前段文字改为“有人，轻轻想起了你。”与“于是，宇宙亮起了第一颗星。”，16 秒后才开放第一次点击。脚本已升级为 `cinematic-opening.js?v=2`，缓存名为 `our-universe-v29-constellation-opening`。
- 密码入口：真实密码输入在视觉上呈现为 `#pin-stars`；密码长度跟随 `SECRET_CODE`，正确后等待 `cinematicHomeReady` 再进入主页。
- 本地开场验收：已在 `127.0.0.1:5174` 验证首段字幕、第一颗星、银河到密码层与返回星光路径；仍需小花先生确认实际美术节奏后才合并。
- 本地预览：不要复用 `127.0.0.1:5173`；使用 `node serve-local.js 5174`，本地会禁用并注销 Service Worker，避免旧 worktree 缓存和离线乱码页干扰。
- 运行配置：`scripts/services/runtime-config.js` 负责本地配置校验；线上 `/api/config` 异步补充天气与月亮信件，失败不阻塞开场。密码线上固定回退 `0729`。
- Firebase 时序：秘密基地会先启动天气；在线心跳等待 Firebase SDK。SDK 12 秒超时后降级，后续成功会触发 `firebaseSdkReady` 自动重试。
- 回忆放映机：只在首次切换到 `image-carousel` 模块时运行 `window.initImageCarousel()`；不要恢复页面加载时自动初始化。
- 生日弹窗：统一从 `closeBirthdayModal()` 关闭，以释放花瓣动画和窗口 `resize` 回调。
- 旧 worktree：`.worktrees/ui-desktop-polish` 基于旧快照，仅保留为试验记录，不再继续开发或合并。
- 最近完成：密码正确后星图短暂停留并自动上划退场；开场节奏收束为流星、连续主星、狮子显形；月亮信件优先读取 `MOON_LETTERS`，首页与移动端排版同步收尾。
- 仓库清理：旧开场实验、临时分析文件与未使用狮子源图已删除；私人媒体、私密配置与 Git 工作树保留在本地且不提交。
- Firestore 留言：已改为匿名登录后再读写；登录与首次订阅均有 12 秒超时和页面内重试，仍需发布 `messages` 规则并完成线上读写验收。
- Firebase 心跳：使用 `status/{browserId}/{tabId}`、服务器时间戳和 45 秒续期；客户端不再清理其他访客的记录。
- Vercel 配置：Firebase 网页公开配置在 `firebase-config.js`；天气 Key 由 `api/config.js` 异步提供（`.gitignore` 已显式包含该文件），`MOON_LETTERS` 可选且对站点访客可见。
- Storage：小花先生已升级 Blaze；图片上传仍待独立实现文件校验、压缩、Storage 规则与留言关联。
- 开场降级：Three.js 不可用时会显示完整的标题、月亮与静态狮子座，避免只剩空星空。
- 开场可靠性：开场不再等待 Firebase；Three.js 优先读取本地 `assets/vendor/three.r128.min.js`，4.5 秒无响应时稳定回退，并在进入主页后始终清理备用狮子。
- 设备策略：手机和平板不自动全屏也不锁方向，保持竖屏优先布局；仅带精确鼠标的 900px 以上桌面端自动全屏。
- 密码入口：重复进入修复 `188d5a5` 已推送 GitHub，等待 Vercel 自动部署完成后进行线上验收。
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
- 📋 当前待逐项验收：
  - 本地提交发布到 Vercel 后的重复进入密码入口
  - Firestore 规则、匿名留言真实读写、超时与重试
  - Storage 图片上传、照片/音乐线上迁移
  - Cyber-AI 同源代理、天气服务端代理、真实访问保护
  - 移动端、弱网、缓存与开场节奏的整体回归
  - 当前 worktree 的轮播延迟初始化、配置未设置降级提示与生日弹窗重复开关
- 🔁 工作流：主工作区只保留已验收版本；V4 草稿在 `.worktrees/` 独立开发，未验收不合并
- 🔒 当前阻塞：
- Vercel 自动部署与真实域名验收尚未完成
  - Cyber-AI 尚未完成调试，不能接入公开前端
  - 私人照片、音乐和专属情书内容不能直接随 Git 发布，需要安全的线上承载方案
- 说明：全局偏好在 `C:\Users\yjhdetianxuan\.claude.md`；本文件只维护本项目交接

## 2026-07-22 最新状态（覆盖较早的留言、树与轮播描述）

- 完整回忆档案的目标承载已改为 Firebase Storage `archive/`，首页只保留 6 张拍立得作为 Vercel 首屏与弱网回退；`image_carousel.js` 通过 Firestore `archivePhotos` 订阅完整档案，迁移工具在 `scripts/media/migrate-archive-to-firebase.js`，默认只预演。
- `firebase.json` 与 `.firebaserc` 已绑定 `firebase/firestore.rules`、`firebase/storage.rules` 到 `new-univese`；规则发布、真实迁移和浏览器验收仍需项目所有者在有 Firebase 凭据的环境中完成。
- 原完整档案照片没有删除，也没有取消 Git 跟踪。只有迁移、Firebase Console 核对和 Vercel 预览都通过后，且取得项目所有者再次明确授权，才可清理旧档案的 Git 索引。
- Service Worker 当前缓存版本为 `our-universe-v56-sparse-stardust`；生成的 `celestial-atlas-cloud-drift.png?v=2` 直接写入 `#starfield` 的 CSS 默认背景，预加载并以低幅度位移呈现云层漂移，不依赖 JavaScript 或刷新才出现。
- 开场脚本 v8 在 `document.visibilityState === 'visible'` 后才启动字幕时间轴，使用完整文本节点而非逐字碎裂；音乐列表已与当前 `assets/Music/` 的 8 个 MP3 文件名一致。

- 密码后默认进入 `scripts/ui/earth-atlas.js?v=4` 的流动星河；该模块解除桌面宽度与内边距限制，星河和全站宇宙背景连续铺满视口。左侧“地图”抽屉提供“星河 / 回忆 / 此刻 / 档案”。`GALAXY_PLANETS` 集中配置行星彩蛋，悬停显示名称，点击或触摸触发彩色星尘爆发和私密情话弹窗。
- 公开信息架构为：回忆页只保留 6 张纵向拍立得；完整放映机和留言墙集中在独立“档案”模块，首次进入该模块才初始化放映机与 Firebase 留言。
- `scripts/ui/presence-heart.js` 保持无边框的左心形、右天气双列布局：心电线在心两侧断开；在线侧光点抵达时心短促震颤，Realtime Database 确认两位不同访客在线后才完整点亮。心跳持续续租由 `index.html` 管理。
- Firestore 留言数据和代码保留；档案模块展示 12 条一页的留言气泡，服务异常时静默隐藏。私有本地 `config.js` 的 `ENABLE_MESSAGE_TESTING: true` 只用于显示调试状态；该项绝不提交。
- 正式交付前若要清除测试留言，先取得项目所有者的明确确认，再在 Firebase 控制台清理 `messages`。禁止由页面代码或发布脚本自动删除。
- `image_carousel.js` 已实现朋友照片投稿的客户端压缩、匿名身份、每日限额、Storage 上传和 Firestore 待审核记录；`firebase/firestore.rules` 与 `firebase/storage.rules` 必须先由项目所有者发布并做线上验证，才能对外宣布该功能完成。
- 全局 `scripts/ui/stardust-trail.js?v=2` 在主体验解锁后提供低密度金银星尘轨迹：每次采样只产生 2 至 3 粒，桌面上限 170 粒、移动端上限 110 粒，3.2 至 5 秒自然消失；Canvas 不拦截点击、滚动或抽屉操作，减少动态效果设置下自动停用。
- Service Worker 当前缓存版本为 `our-universe-v56-sparse-stardust`。
- 放映机投稿区的禁用按钮保留完整可读性；留言代码与测试数据均保留，公开页面仅隐藏测试面板。

## 2026-07-23 当前未完成事项（唯一执行顺序）

详细清单见 `docs/2026-07-23-未完成事项交接清单.md`。优先顺序固定为：

1. 发布 Firestore 与 Storage 规则到 `new-univese`，随后验证匿名留言、双人心跳和朋友照片投稿；不得删除任何数据。
2. 对已完成代码做线上多设备验收：开场首句、音乐、6 张拍立得、档案留言与放映机。
3. 小花先生确认页面后，再挑选改动发布 GitHub/Vercel；当前不能直接用整个脏工作区覆盖线上版本。
4. 地球、旅行地点共建、心跳最终视觉均先出设计图；未经确认不继续写 UI。

当前照片和音乐继续由 Vercel 提供给朋友展示。Firebase 完整档案迁移、删除旧媒体和清空测试留言均已延后，任何删除必须取得小花先生单独确认。

## 开发注意事项
- CSS 保留在 `index.html`；JavaScript 正逐步按开场、服务、照片等功能域拆到外部模块。
- 开场脚本按 `lion_background.js` → `cinematic-opening.js` → `opening-flow.js` 同步加载；首星事件在 `bootstrap()` 中启动原生狮子座模块，狮子座时间轴与主视觉不得改写；仅保留用户已验收的右上月亮构图参数调整。`image_carousel.js` 仍为延迟脚本，但只在页面模块激活后初始化。
- Three.js 通过 CDN 动态加载（r128），失败自动回落
- 移动端自动检测 (`window.innerWidth < 600`) 降级粒子数
- 修改颜色方案：改 `:root` CSS 变量即可全局生效

## 2026-07-25 天体暗面融合与低负载星尘

- 最新文档：`docs/2026-07-25-天体暗面融合与低负载星尘.md`。
- 密码后首页继续使用现有真实星云背景和 Canvas 横向银河；`scripts/ui/earth-atlas.js?v=12` 隔离旧首页的 `.planet` 样式，并读取四颗渐隐暗面的真实天体资产。任何新天体组件必须在 `.earth-atlas` 内重置旧的阴影和伪元素，禁止 `01 · 29`、黑圆或旧轨道泄漏。
- 梦境之境使用独立紫月与后层不规则 CSS 雾；其他三颗天体的暗面由 Alpha 融入背景。严禁恢复成纯 CSS 渐变球、白色描边、圆形编号或卡片式游戏 UI。
- `scripts/ui/stardust-trail.js?v=3` 为单粒、低密度采样；桌面上限 82 粒、移动端上限 52 粒。Service Worker 当前缓存名为 `our-universe-v64-dissolved-night-sides`；本地预览仍使用 `node serve-local.js 5174`，由页面注销 Service Worker 并以 `no-store` 返回资源。
- 已通过本地浏览器验收：四颗天体无黑色外框和日期伪元素，点击梦境之境只展开其私密文案。仍需小花先生在常用设备上确认最终美术效果。
