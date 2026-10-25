# Screen Designer MCPツール＆CLIリファレンス

Screen Designerは、AIコーディングエージェント（Claude、Cursor、Codex、Geminiなど）がUIを視覚的に直接確認・操作できる **MCP (Model Context Protocol)** サーバーと、ターミナル環境から全ツールやプロジェクトデータを直接呼び出せる **CLI制御インターフェース** を提供します。

---

## 1. ドメイン指向MCPツール一覧 (17種)

公式の **`screen_designer_*`** 名前空間配下に整理され、従来のプロンプトとの完全な互換エイリアスもサポートしています:

```
🛠️ Screen Designer MCP Tools (17 tools registered)

📁 Project & Workspace:
  • screen_designer_get_project (alias: storyboard_init, storyboard_get_project)
    プロジェクト設定、ワークスペース情報、保存先パス、キャンバス状態、全ページ一覧の取得。
    Parameters: [workspacePath]

📄 Screen Pages (VDOM):
  • screen_designer_list_pages (alias: storyboard_list_pages)
    UI画面ページ一覧、メタデータ、アートボード数、ビューポート情報の取得。
    Parameters: [workspacePath]

  • screen_designer_get_page (alias: storyboard_get_page)
    特定ページの詳細データ（全アートボード、要素、座標、スタイル、階層、フロー結線、調整値）の取得。
    Parameters: <pageId> [workspacePath]

  • screen_designer_create_page (alias: create_page, page_create)
    プロジェクト内にID、タイトル、初期アートボードまたはテンプレートを指定して新規ページを作成。
    Parameters: <name> [pageId] [initialArtboardTitle] [viewport] [template] [workspacePath]

  • screen_designer_save_page (alias: storyboard_save_page)
    仮想DOMページドキュメントを docs/ui-boards/pages/<pageId>.json へ保存・更新し、マニフェストを同期。
    Parameters: <page> [workspacePath]

  • screen_designer_delete_page (alias: storyboard_delete_page)
    仮想DOMページドキュメントをプロジェクトから削除し、マニフェストを更新。
    Parameters: <pageId> [workspacePath]

  • screen_designer_add_artboard (alias: add_artboard, create_artboard, artboard_create)
    ページへタイトル、寸法、ビューポート、テンプレートまたはカスタムVDOM rootNodeを指定して新規アートボードを追加。
    Parameters: [pageId] <title> [viewport] [width] [height] [template] [rootNode] [tweaksSchema] [workspacePath]

  • screen_designer_update_artboard (alias: update_artboard, edit_artboard, artboard_update, artboard_edit)
    ページ上の既存アートボードを変更・更新。メタデータ変更、rootNode全置換、またはID指定によるノード部分更新に対応。
    Parameters: <pageId> <artboardId> [title] [viewport] [width] [height] [x] [y] [rootNode] [nodeUpdates] [tweaksSchema] [tweakValues] [workspacePath]

  • screen_designer_delete_artboard (alias: delete_artboard, remove_artboard, artboard_delete)
    ページからアートボードIDまたはタイトルを指定してアートボードを削除。
    Parameters: <pageId> <artboardId> [workspacePath]

🎨 Design System & Tokens:
  • screen_designer_get_design_system (alias: storyboard_get_design_system)
    docs/ui-boards/design-system.json からデザイントークンおよびコンポーネント初期スタイルを読み取り。
    Parameters: [workspacePath]

  • screen_designer_save_design_system (alias: storyboard_set_tokens, storyboard_save_design_system)
    デザイントークンまたは標準スタイルを一括更新し、ライブキャンバスとリアルタイム同期。
    Parameters: [tokens] [designSystem] [workspacePath]

👁️ Visual Inspection & Screenshots:
  • screen_designer_render_artboard_image (alias: storyboard_render_artboard_image)
    ヘッドレスChromeを使用してアートボードの高解像度スクリーンショット (base64 PNG) をレンダリング。視覚的検証向け。
    Parameters: <pageId> [artboardId] [outPath] [width] [height] [workspacePath]

💻 Code Generation & Handoff:
  • screen_designer_export_code (alias: storyboard_export_code, storyboard_export)
    VDOMページドキュメントから本番対応のReact (TSX)、Vue 3 SFC、HTMLコードをオンデマンドで生成。
    Parameters: [pageId] [format] [outDir] [workspacePath]

🎛️ Live Canvas Interaction:
  • screen_designer_get_live_selection (alias: storyboard_get_live_selection)
    キャンバスのリアルタイム状態（選択中要素ID、スライダー調整値、ズーム倍率）を取得。
    Parameters: [workspacePath]

  • screen_designer_sync_canvas (alias: storyboard_sync_canvas)
    キャンバスカメラのズーム・パン移動、特定アートボードやノードへのフォーカスおよびハイライト表示。
    Parameters: [artboardId] [nodeId] [zoom] [workspacePath]

📦 Git & Version Control:
  • screen_designer_git_status (alias: storyboard_git_status)
    UI絵コンテファイルの変更、ステージング状態、diff差分を確認。
    Parameters: [workspacePath]

  • screen_designer_git_commit (alias: storyboard_git_commit)
    UI変更内容を自動ステージングし、コミットメッセージを作成して記録。
    Parameters: <message> [workspacePath]
```

---

## 2. CLIコマンド体系

```bash
# 1. プロジェクト初期化＆診断
screen-designer init [path]
screen-designer doctor [path]
screen-designer status [path]

# 2. ページおよびアートボード操作
screen-designer page list
screen-designer page create "プロフィール設定"
screen-designer artboard add <pageId> --title "セキュリティ" --viewport desktop
screen-designer artboard delete <pageId> <artboardId>

# 3. ヘッドレス検証＆コード出力
screen-designer render-image <pageId> [artboardId] -o ./screenshots
screen-designer export <pageId> --format=react --out=./src/components

# 4. Git連携
screen-designer commit -m "feat(ui): オンボーディング画面更新"
```
