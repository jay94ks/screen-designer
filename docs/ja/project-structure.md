# プロジェクト保存構造仕様書 (Project Structure Specification)

**Screen Designer** は、手動での書き出し操作を行うことなく、作業中の全ページ、デザインシステム、アセットをリアルタイムにファイルシステムへ自動保存・管理します。

標準では対象プロジェクトのルート直下 `docs/ui-boards/` ディレクトリ配下に規格化された構成で保存され、設定(`Settings`)ダイアログからいつでも保存パスを自由に変更できます。

---

## 1. 基本保存ディレクトリ構成

```
docs/ui-boards/
├── project.json          # プロジェクトメタデータ、ページ順序、アセット一覧
├── design-system.json   # デザインシステム設定 (コンポーネント別標準スタイル＆トークン)
├── pages/                # ページ別構造化JSONデータ
│   ├── 1.json           # 1番ページ (アートボードおよびVDOMノードツリー)
│   ├── 2.json           # 2番ページ
│   └── {number}.json    # N番ページ...
└── assets/               # プリセットSVGベクター、ユーザーアップロード画像等
    ├── preset-gradient.svg
    ├── preset-tech.svg
    ├── preset-nature.svg
    └── {uploaded_files}.png
```

---

## 2. ファイル別詳細仕様

### 2.1 `project.json`
プロジェクト全体の概要、ページ構成リスト、および使用中アセット一覧を管理します。

```json
{
  "name": "Fintech Service UI Storyboard",
  "version": "1.0.0",
  "description": "フィンテックモバイルアプリ＆仮想資産管理絵コンテ",
  "updatedAt": "2026-10-25T06:28:42.000Z",
  "pages": [
    {
      "id": "page-fintech-vdom",
      "name": "Page 1 (フィンテック仮想DOM)",
      "number": 1,
      "fileName": "pages/1.json",
      "artboardsCount": 3
    }
  ],
  "assets": [
    "assets/preset-gradient.svg",
    "assets/preset-tech.svg",
    "assets/preset-nature.svg"
  ]
}
```

### 2.2 `design-system.json`
デザインシステムスタジオで編集された主要コンポーネント（`frame`, `card`, `button`, `input`, `text` など）のデフォルトスタイルを永続化します。

```json
{
  "colors": {
    "primary": "#4f46e5",
    "secondary": "#06b6d4",
    "background": "#0f172a",
    "surface": "#1e293b",
    "text": "#ffffff",
    "textMuted": "#94a3b8",
    "border": "#334155"
  },
  "typography": {
    "fontFamily": "Inter, sans-serif",
    "headingFont": "Inter, sans-serif"
  },
  "defaultStyles": {
    "frame": {
      "backgroundColor": "#0f172a",
      "padding": 24,
      "color": "#ffffff"
    },
    "card": {
      "backgroundColor": "#1e293b",
      "borderRadius": 16,
      "padding": 16,
      "borderColor": "#334155",
      "borderWidth": 1
    },
    "button": {
      "backgroundColor": "#4f46e5",
      "color": "#ffffff",
      "borderRadius": 12,
      "padding": 12,
      "fontWeight": "bold"
    }
  }
}
```

### 2.3 `pages/{number}.json`
各ページに対応するアートボードリスト、レイアウト座標、インタラクティブ結線、階層型仮想DOM (VDOM) ノードツリーが保存されます。

```json
{
  "id": "page-fintech-vdom",
  "name": "Page 1 (フィンテック仮想DOM)",
  "number": 1,
  "version": "1.0.0",
  "updatedAt": "2026-10-25T06:28:42.000Z",
  "artboards": [
    {
      "id": "artboard-s1",
      "title": "1. AI資産管理ホーム (Home)",
      "viewport": "mobile",
      "x": 80,
      "y": 140,
      "width": 390,
      "height": 844,
      "rootNode": {
        "id": "node-s1-root",
        "type": "frame",
        "name": "Home Frame Container",
        "style": {
          "width": "100%",
          "height": "100%",
          "backgroundColor": "#090d16"
        },
        "children": [ ... ]
      },
      "tweaksSchema": [ ... ]
    }
  ]
}
```

### 2.4 `assets/` ディレクトリ
- アプリケーション組み込みのベクターSVGプリセットが自動展開されて配置されます。
- ユーザーがプロパティパネルから背景画像やローカル画像ファイルを選択した場合、このディレクトリに自動コピーされ相対パス（`assets/ファイル名`）で参照されます。

---

## 3. 保存パスの変更および自動移行

1. トップバーの設定ダイアログ（`⚙️` アイコン）から**ドキュメント保存パス (Page Docs Path)** を変更できます（例: `docs/mobile-spec` など）。
2. パスを変更すると、Electronバックエンドサービスが旧パス(`docs/ui-boards`)内の全ファイル(`project.json`, `design-system.json`, `pages/`, `assets/`)を**新しい指定先パスへ自動移動(Move)** します。
3. 以降のすべての自動保存およびGit追跡は、変更後のパスを基準として動作します。

---

## 4. ターゲットプロジェクト設定 (`.screen-designer/`)

Screen Designer CLIおよびMCPサーバーが対象プロジェクトを認識・制御する際、ルート直下に以下の構成が生成されます:

```
.screen-designer/
├── config.json       # プロジェクト連携設定 (パス、ポート、自動コミット)
└── cache/            # Chrome Headlessによるビジュアルレンダリング画像キャッシュ (*.png)
```

### 4.1 `.screen-designer/config.json` 仕様
```json
{
  "$schema": "https://screen-designer.dev/schema/config.json",
  "version": "1.0.0",
  "pagesDir": "docs/ui-boards/pages",
  "designSystemFile": "docs/ui-boards/design-system.json",
  "assetsDir": "docs/ui-boards/assets",
  "mcpPort": 4318,
  "appPort": 5173,
  "gitAutoCommit": true
}
```

---

## 5. モノレポパッケージ構成 (Monorepo Packages)

Screen Designerリポジトリ自体は `npm workspaces` ベースの3つのパッケージにモジュール化されています:

- **`packages/app`**: React 19 + TypeScript + Electron 35 によるビジュアルメインキャンバスアプリケーション
  - `packages/app/src/components/`: キャンバス、レイヤー、属性インスペクタ、コマンドパレット、Gitダイアログ等
  - `packages/app/src/i18n/`: 3言語 (日本語・韓国語・英語) 翻訳ディクショナリ
  - `packages/app/electron/`: ファイル永続化、IPCブリッジ、`es-git` サービス
- **`packages/mcp-server`**: Model Context Protocol (SDK 1.6) に基づく17種のMCPツールおよびChrome Headlessレンダラー
  - `src/tools.ts`: MCPツール登録および実行ハンドラ
  - `src/headless-renderer.ts`: ヘッドレスPNGスクリーンショット生成エンジン
- **`packages/cli`**: グローバル／ローカル実行可能なコマンドライン実行バイナリ (`screen-designer`)
  - `bin/screen-designer`: CLIエントリスクリプト
  - `src/commands/`: `init`, `serve/mcp`, `ui`, `page`, `artboard`, `tokens`, `commit`, `doctor` 等の実装
