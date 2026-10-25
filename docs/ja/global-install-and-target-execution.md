# グローバルインストール＆ターゲット実行設計書 (Global Installation & Target Execution Architecture)

本文書は、**Screen Designer** をグローバル(Global)ツールとしてインストールし、任意の対象プロジェクト（Target Project）パスを指定して絵コンテキャンバスを即時起動・管理できるようにするアーキテクチャおよびCLI設計を定義します。

---

## 1. 概要および設計目標

### 1.1 解決する課題
- 従来は `screen-designer` リポジトリ自身の内部ディレクトリからのみアプリを実行可能でした。
- ユーザーは自身の既存プロジェクト（例: `C:\workspace\my-fintech-app`, `/home/user/nextjs-shopping-mall`）のどこからでも、ターミナルコマンド1行で絵コンテ企画キャンバスを立ち上げ、そのリポジトリ内で `docs/ui-boards/` 構成を管理することを望んでいます。

### 1.2 コア設計原則
1. **Zero-Config ワンクリック実行**: 複雑な設定なしに `screen-designer [パス]` の入力のみで即座に起動。
2. **グローバルインストールおよびnpx完全対応**:
   - `npm install -g screen-designer`
   - `npx screen-designer [target-path]`
3. **インテリジェントな環境適応 (Electron Desktop vs Web Mode)**:
   - ディスプレイ表示が利用可能なデスクトップ環境 (Windows, macOS, Linux GUI) ではネイティブな **Electron ウィンドウ** を起動。
   - GUIのない環境 (WSL2ターミナル、リモートSSHサーバー、Linuxコンソール) または `--web` フラグ指定時は、**ローカルWebサーバー＋ブラウザ自動オープン** へスマートにフォールバック。
4. **プロジェクトの自動検知＆初期化 (Auto-Scaffolding)**:
   - 対象プロジェクトに `docs/ui-boards/` が存在しない場合、最新規格（`project.json`, `design-system.json`, `pages/1.json`, `assets/`）で自動初期化。
   - すでに存在する場合は、既存の絵コンテデータをそのままロード。

---

## 2. CLIコマンドおよびオプション仕様 (CLI Specification)

### 2.1 基本コマンド構文
```bash
screen-designer [target-path] [options]
```

### 2.2 使用例 (Usage Examples)

```bash
# 1. カレントディレクトリを対象に起動
screen-designer .

# 2. 特定のプロジェクトパスを指定して起動
screen-designer /home/jay94ks/projects/e-commerce-app
screen-designer C:\Projects\FintechMobileApp

# 3. パスを省略した場合はカレントディレクトリ(.)を既定として起動
screen-designer

# 4. Webブラウザモードで強制実行
screen-designer . --web

# 5. Webモードのポート番号指定およびブラウザ自動オープン無効化
screen-designer . --web --port=3000 --no-open

# 6. GUIを起動せずに対象プロジェクトへディレクトリ構成のみを初期化
screen-designer . --init
# または
screen-designer init ./my-new-app

# 7. 対象プロジェクトの企画データを基にReact/Vueコードを生成
screen-designer export --workspace=./my-app --format=react --out=src/components

# 8. 対象画面を画像(PNG)として即座にレンダリング
screen-designer render-image page-1 screen-1-main --workspace=./my-app
```

### 2.3 オプションおよびフラグ一覧

| フラグ | エイリアス | 既定値 | 説明 |
| :--- | :---: | :---: | :--- |
| `[target-path]` | - | `.` (現在のフォルダ) | 対象プロジェクトのディレクトリパス (相対/絶対パス両対応) |
| `--web` | `-w` | `false` | Electronの代わりにローカルWebサーバーおよび標準ブラウザで実行 |
| `--port <num>` | `-p` | `5173` | Webサーバーモード実行時のバインドポート番号 |
| `--host <ip>` | - | `0.0.0.0` | サーバーのホストIPアドレス (ローカルLAN経由の外部接続対応) |
| `--no-open` | - | `false` | サーバー起動時の標準Webブラウザ自動オープンをスキップ |
| `--init` | `-i` | `false` | GUIを起動せず `docs/ui-boards` のファイル構成のみを生成 |
| `--help` | `-h` | - | コマンドヘルプを表示 |
| `--version` | `-v` | - | Screen Designerのバージョン情報を表示 |

---

## 3. プロジェクトライフサイクルおよび実行フロー

1. 対象プロジェクトのパスを検証・解決。
2. `.screen-designer/config.json` の存在を確認し、なければデフォルト構成を生成。
3. `docs/ui-boards/` の存在を確認し、なければサンプルボードとトークンを初期化。
4. 環境変数 `SCREEN_DESIGNER_WORKSPACE=<target-path>` を渡してElectronウィンドウまたはVite Webサーバーを起動。
