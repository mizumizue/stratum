# 良いテストと悪いテスト

## 良いテスト

**統合スタイル**: 内部パーツのモックではなく、実インターフェースを通してテストする。

```typescript
// 良い: 観測可能な振る舞いをテスト
test("user can checkout with valid cart", async () => {
  const cart = createCart();
  cart.add(product);
  const result = await checkout(cart, paymentMethod);
  expect(result.status).toBe("confirmed");
});
```

特徴:

- ユーザー / 呼び出し側が気にする振る舞いをテスト
- 公開 API のみを使用
- 内部リファクタに耐える
- HOW ではなく WHAT を記述
- テストあたり1つの論理アサーション

## 悪いテスト

**実装詳細テスト**: 内部構造に結合している。

```typescript
// 悪い: 実装詳細をテスト
test("checkout calls paymentService.process", async () => {
  const mockPayment = jest.mock(paymentService);
  await checkout(cart, payment);
  expect(mockPayment.process).toHaveBeenCalledWith(cart.total);
});
```

危険信号:

- 内部コラボレータのモック
- プライベートメソッドのテスト
- 呼び出し回数 / 順序のアサーション
- 振る舞いが変わっていないのにリファクタで壊れる
- テスト名が WHAT ではなく HOW を記述
- インターフェースの代わりに外部手段で検証

```typescript
// 悪い: インターフェースを迂回して検証
test("createUser saves to database", async () => {
  await createUser({ name: "Alice" });
  const row = await db.query("SELECT * FROM users WHERE name = ?", ["Alice"]);
  expect(row).toBeDefined();
});

// 良い: インターフェースを通して検証
test("createUser makes user retrievable", async () => {
  const user = await createUser({ name: "Alice" });
  const retrieved = await getUser(user.id);
  expect(retrieved.name).toBe("Alice");
});
```

**同語反復的テスト**: 期待値が実装を言い換えるため、構築上パスする。

```typescript
// 悪い: 期待値がコードと同じ方法で再計算される
test("calculateTotal sums line items", () => {
  const items = [{ price: 10 }, { price: 5 }];
  const expected = items.reduce((sum, i) => sum + i.price, 0);
  expect(calculateTotal(items)).toBe(expected);
});

// 良い: 期待値は独立した既知のリテラル
test("calculateTotal sums line items", () => {
  expect(calculateTotal([{ price: 10 }, { price: 5 }])).toBe(15);
});
```
