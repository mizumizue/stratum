# モックするタイミング

**システム境界**でのみモックする:

- 外部 API（決済、メールなど）
- データベース（場合による — テスト DB を優先）
- 時刻 / 乱数
- ファイルシステム（場合による）

モックしない:

- 自分のクラス / モジュール
- 内部コラボレータ
- 自分が制御するもの

## モックしやすさの設計

システム境界では、モックしやすいインターフェースを設計する:

**1. 依存性注入を使う**

外部依存を内部で作らず、渡す:

```typescript
// モックしやすい
function processPayment(order, paymentClient) {
  return paymentClient.charge(order.total);
}

// モックしにくい
function processPayment(order) {
  const client = new StripeClient(process.env.STRIPE_KEY);
  return client.charge(order.total);
}
```

**2. 汎用フェッチャーより SDK スタイルのインターフェースを優先**

条件分岐のある1つの汎用関数ではなく、各外部操作ごとに専用関数を作る:

```typescript
// 良い: 各関数が独立してモック可能
const api = {
  getUser: (id) => fetch(`/users/${id}`),
  getOrders: (userId) => fetch(`/users/${userId}/orders`),
  createOrder: (data) => fetch('/orders', { method: 'POST', body: data }),
};

// 悪い: モックにモック内の条件分岐が必要
const api = {
  fetch: (endpoint, options) => fetch(endpoint, options),
};
```

SDK アプローチの利点:
- 各モックは1つの特定の形を返す
- テストセットアップに条件分岐がない
- テストがどのエンドポイントを叩くか見やすい
- エンドポイントごとの型安全性
