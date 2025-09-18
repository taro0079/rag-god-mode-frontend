# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## AI Chat 機能

アプリには簡易的な AI チャットフォーム (`Chat` コンポーネント) を追加しています。既定では `POST /api/chat` に以下のような JSON を送信します。

```json
{
  "messages": [
    { "role": "user", "content": "こんにちは" }
  ]
}
```

レスポンスは以下いずれかの形式を想定します。

```jsonc
// シンプル
{ "reply": "こんにちは！どのようなご用件でしょうか？" }

// または
{ "content": "こんにちは！" }

// または (OpenAI風の複数配列)
{ "messages": [ { "role": "assistant", "content": "こんにちは！" } ] }
```

環境変数 `VITE_API_BASE_URL` を `.env` などで設定すると `fetch(base + endpoint)` の `base` として使われます。

### 開発 Tips

- Enterで送信 / Shift+Enter で改行。
- 送信中は「停止」ボタンが表示され AbortController で中断可能（ただしサーバ側がストリーミングでない場合はリクエスト中断のみ）。
- `src/chat/useChat.ts` で履歴送信件数 (`historyLimit`) や system プロンプト注入などを調整できます。

### 今後の拡張アイデア

- レスポンスのストリーミング (ReadableStream) 対応
- メッセージのローカル永続化 (localStorage / IndexedDB)
- 会話スレッドの複数管理
- Markdown / コードブロック表示、コピー機能
- ユーザー認証とサーバ側ログ保存


You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
