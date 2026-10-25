# Screen Designer ドキュメントハブ (Documentation Hub)

> **React 19 + TypeScript + Electron + MCP + Headless CLI** を基盤としたクロスプラットフォーム画面設計・プロトタイピングシステムです。  
> 企画者、UI/UXデザイナー、フロントエンドエンジニア、およびAIコーディングエージェント（Claude、Gemini、Cursor、Codexなど）が仮想DOM(VDOM)ベースで視覚的にUIを設計し、プロトタイピングからReactコード自動抽出、CLI自動化までを統合サポートします。

---

## 📚 ドキュメント一覧

- [実装機能詳細仕様書 (features.md)](./features.md): 現在実装されている14のコア機能（無限キャンバス、プロトタイプ結線、デザインシステム、Git連携、多言語対応、ヘッドレスCLI等）の詳細解説
- [MCPツール＆CLIリファレンス (mcp-and-cli-reference.md)](./mcp-and-cli-reference.md): 17種のドメイン指向MCPツール (`screen_designer_*`) 仕様およびターミナルCLIコマンド構文
- [プロジェクト保存構造仕様書 (project-structure.md)](./project-structure.md): `docs/ui-boards/` および `.screen-designer/` 配下の保存規格（`project.json`、`design-system.json`、`pages/`、`config.json` 等）
- [グローバルインストール＆ターゲット実行設計書 (global-install-and-target-execution.md)](./global-install-and-target-execution.md): `npm install -g` グローバルインストール、`npx` 実行、およびスマートフォールバック設計
- [キーボードショートカットガイド (shortcuts.md)](./shortcuts.md): コマンドパレット（`Ctrl+K`）、ツール選択、ルーラー、キャンバス操作ショートカット一覧
- [エージェント開発・保守マニュアル (AGENTS.md)](../../AGENTS.md): コードベース構造、設計原則、ビルド/テスト/検証ワークフロー

---

## 🚀 クイックスタート (Getting Started)

### 動作環境要件
- **Node.js**: v18.0.0 以上 (v20以上を推奨)
- **パッケージマネージャー**: `npm` v9.0.0 以上
- **対応OS**: Windows 10/11, Linux (Ubuntu/Debian, WSL2含む), macOS

### 1. グローバルCLIインストール＆実行
```bash
# グローバルインストール
npm install -g screen-designer

# プロジェクト初期化
screen-designer init

# UIキャンバス起動
screen-designer ui

# MCPサーバー起動
screen-designer serve
```

### 2. ローカルリポジトリ環境構築
```bash
# リポジトリのクローン
git clone https://github.com/jay94ks/screen-designer.git
cd screen-designer

# 依存関係のインストール
npm install

# 全パッケージのビルド
npm run build

# 1. Webブラウザ開発サーバー起動 (デフォルトポート: 5173)
npm run dev

# 2. Electronデスクトップアプリ起動
npm run electron:dev

# 3. MCP開発サーバー起動
npm run dev:mcp
```

---

## 🛠 技術スタック (Tech Stack)

| 区分 | 技術 | 説明 |
| :--- | :--- | :--- |
| **Frontend Core** | React 19, TypeScript, Vite 6 | 高速バンドリングおよび最新React仮想DOM操作 |
| **Desktop App** | Electron 35 | クロスプラットフォームデスクトップネイティブウィンドウ |
| **Styling** | Tailwind CSS 4, Lucide Icons | ユーティリティファーストスタイリングおよび統一アイコンシステム |
| **Version Control** | es-git (Toss libgit2 binding) | 外部Git不要の純粋ネイティブGitステージング、diff、コミット |
| **Cross-Agent MCP** | Model Context Protocol (SDK 1.6) | Claude/Cursor/Codex/Gemini連携 17種のドメイン指向制御ツール |
| **Visual Headless** | Chrome Headless | エージェント向けビジュアル検証用ヘッドレス高速画像レンダラー |
| **Localization** | i18n Core (TypeScript Dictionaries) | 日本語(`ja`)、韓国語(`ko`)、英語(`en`)のリアルタイム言語切り替え |
| **CLI & Automation** | Commander.js, Chalk | ターミナルベースのヘッドレス操作および環境診断ツール |

---

## 📁 モノレポ構成

```
screen-designer/
├── docs/                             # ドキュメントおよび既定の絵コンテワークスペース
│   ├── en/                           # 英語版ドキュメント
│   ├── ja/                           # 日本語版ドキュメント
│   ├── README.md                     # 韓国語ドキュメントハブ
│   ├── features.md                   # 機能仕様書
│   ├── project-structure.md          # 保存構造仕様書
│   ├── shortcuts.md                  # ショートカットガイド
│   ├── mcp-and-cli-reference.md      # MCPツール＆CLIリファレンス
│   ├── global-install-and-target-execution.md # アーキテクチャ設計書
│   └── ui-boards/                    # 既定のサンプルプロジェクト
├── packages/
│   ├── app/                          # React 19 + Electron メインアプリ
│   ├── mcp-server/                   # 17種MCPツール＆ヘッドレスレンダラー
│   └── cli/                          # CLI実行バイナリ
```
