# Firestore 匿名留言接入

## 背景

Cloud Firestore 以生产模式创建后，默认拒绝所有客户端请求。旧版留言板直接订阅 `messages`，没有加载 Firebase Auth，也没有处理 `onSnapshot` 的异步错误，因此界面会一直停在“加载留言中”。

## 本次修改

- Firebase SDK 加入 `firebase-auth-compat.js`，并使用顺序加载，避免 compat SDK 的依赖加载竞争。
- 留言板初始化时先执行匿名登录，再创建 Firestore 监听。
- 写入留言附带 `authorId`，用于规则校验。
- 空集合显示“还没有留言，写下第一句吧。”；权限或网络失败显示可理解的失败提示，并允许刷新后重新初始化。

## Firebase 控制台规则

Authentication 的“匿名”提供方必须保持启用。然后在 Firebase Console → Firestore Database → 规则中，替换为以下规则并发布：

```text
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /messages/{messageId} {
      allow read: if request.auth != null;
      allow create: if request.auth != null
        && request.resource.data.keys().hasOnly(['text', 'createdAt', 'authorId'])
        && request.resource.data.text is string
        && request.resource.data.text.size() > 0
        && request.resource.data.text.size() <= 500
        && request.resource.data.authorId == request.auth.uid;
      allow update, delete: if false;
    }
  }
}
```

规则让匿名访问者只能读取、创建格式正确的留言，不能修改或删除任何留言。匿名身份不是强隐私认证；网页密码仍应视为互动入口，不应用作真正的访问控制。

## 验证

```powershell
node --test tests/site-features.test.js
git diff --check
```
