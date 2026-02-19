# syuu-frontend

瞬間英作文トレーニングアプリのフロントエンド

## 技術スタック

- Next.js (App Router)
- TypeScript
- Tailwind CSS
- shadcn/ui

## セットアップ

```bash
# 依存関係インストール
npm install

# 環境変数設定
cp .env.local.example .env.local
# .env.localを編集

# 開発サーバー起動
npm run dev
```

## 環境変数

```
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 機能

- **学習設定**: シチュエーション・文の長さを選択
- **練習画面**: 日本語→英語の瞬間英作文
- **結果表示**: スコアと推奨アクション

## ビルド

```bash
npm run build
```

## デプロイ

Vercelでのデプロイを推奨
"# syuu-frontend" 
