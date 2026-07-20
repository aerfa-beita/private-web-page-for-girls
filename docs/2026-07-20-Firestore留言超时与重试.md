# 2026-07-20 Firestore 留言超时与重试

## 目标

避免匿名登录或 Firestore 首次实时回调异常时，留言区永久停留在“加载留言中”。

## 实现

- 匿名登录和首次 `onSnapshot` 回调均限制为 12 秒。
- 超时、SDK 未加载和读取失败时显示“重新连接”按钮。
- 重试前清理旧的实时订阅和计时器，防止重复监听。
- 发送按钮改为单一 `onclick` 绑定，重试后不会重复发送。
- Service Worker 缓存版本更新为 `our-universe-v24-message-retry`。

## 验证

- `node --test tests/site-features.test.js`：16 项通过。
- 尚未完成真实浏览器的匿名登录、发送留言和跨设备实时显示验收。

## 后续

仍需在 Firebase 控制台发布与实际字段匹配的 `messages` 规则，并在 `love.xiahuaaitalk.top` 完成真实读写验收。
