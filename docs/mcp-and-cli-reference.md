# Screen Designer MCP 툴 & CLI 제어 레퍼런스

Screen Designer는 AI 에이전트(Claude, Cursor, Codex, Gemini 등)가 UI를 시각적으로 직접 보고 제어할 수 있는 **MCP(Model Context Protocol)** 서버와, 터미널 환경에서 모든 MCP 툴과 프로젝트 데이터를 직접 호출하고 검수할 수 있는 **CLI 제어 인터페이스**를 제공합니다.

---

## 1. 재설계된 MCP 툴 목록 (17종)

기존 레거시 `storyboard_*` 네이밍을 탈피하고, 명확한 도메인 기반의 **`screen_designer_*`** 표준 네임스페이스로 개편되었습니다.  
*(기존 프롬프트 및 호환성을 위해 `storyboard_*` 별칭(Alias) 및 자연어 단축 별칭(`create_page`, `add_artboard`, `edit_artboard` 등)도 100% 동일하게 지원됩니다)*

```
🛠️ Screen Designer MCP Tools (17 tools registered)

📁 Project & Workspace:
  • screen_designer_get_project (alias: storyboard_init, storyboard_get_project)
    Get project configuration, workspace info, design documents path, canvas status, and list of all pages.
    Parameters: [workspacePath]

📄 Screen Pages (VDOM):
  • screen_designer_list_pages (alias: storyboard_list_pages)
    List all UI screen pages with metadata, artboard counts, viewport information, and summaries.
    Parameters: [workspacePath]

  • screen_designer_get_page (alias: storyboard_get_page)
    Get full details of a specific UI page document (all artboards, elements, coordinates, styling, layers, interactive flow wires, and tweaks).
    Parameters: <pageId> [workspacePath]

  • screen_designer_create_page (alias: create_page, page_create)
    Create a new screen page document in the project with an ID, title/name, and optional initial artboard or template.
    Parameters: <name> [pageId] [initialArtboardTitle] [viewport] [template] [workspacePath]

  • screen_designer_save_page (alias: storyboard_save_page)
    Create, save, or update a Virtual DOM page document in docs/ui-boards/pages/<pageId>.json and update project manifest.
    Parameters: <page> [workspacePath]

  • screen_designer_delete_page (alias: storyboard_delete_page)
    Delete a Virtual DOM page document from the project and update project manifest.
    Parameters: <pageId> [workspacePath]

  • screen_designer_add_artboard (alias: add_artboard, create_artboard, artboard_create)
    Add a new artboard (screen canvas) to a page with title, dimensions, viewport, and optional template or custom VDOM rootNode.
    Parameters: [pageId] <title> [viewport] [width] [height] [template] [rootNode] [tweaksSchema] [workspacePath]

  • screen_designer_update_artboard (alias: update_artboard, edit_artboard, artboard_update, artboard_edit)
    Update and modify an existing artboard on a page. Supports editing metadata (title, dimensions, viewport), replacing rootNode, or targeting specific nodes by ID to update text/styles/props without rewriting the whole tree.
    Parameters: <pageId> <artboardId> [title] [viewport] [width] [height] [x] [y] [rootNode] [nodeUpdates] [tweaksSchema] [tweakValues] [workspacePath]

  • screen_designer_delete_artboard (alias: delete_artboard, remove_artboard, artboard_delete)
    Delete an artboard (screen canvas) from a page by artboard ID or title.
    Parameters: <pageId> <artboardId> [workspacePath]

🎨 Design System & Tokens:
  • screen_designer_get_design_system (alias: storyboard_get_design_system)
    Read the design system tokens and component default styles from docs/ui-boards/design-system.json.
    Parameters: [workspacePath]

  • screen_designer_save_design_system (alias: storyboard_set_tokens, storyboard_save_design_system)
    Update or replace design system tokens or default element styles in docs/ui-boards/design-system.json, and sync with live canvas.
    Parameters: [tokens] [designSystem] [workspacePath]

👁️ Visual Inspection & Screenshots:
  • screen_designer_render_artboard_image (alias: storyboard_render_artboard_image)
    Render a high-resolution screenshot image (base64 PNG) of an artboard using headless Chrome. Returns direct image data for visual inspection and multimodal vision.
    Parameters: <pageId> [artboardId] [outPath] [width] [height] [workspacePath]

💻 Code Generation & Handoff:
  • screen_designer_export_code (alias: storyboard_export_code, storyboard_export)
    Generate production-ready React (TSX), Vue 3 SFC, or HTML code on-demand from structured VDOM page documents into project filesystem.
    Parameters: [pageId] [format] [outDir] [workspacePath]

🌿 Git Version Control (es-git):
  • screen_designer_git_status (alias: storyboard_git_status)
    Inspect Git status using native es-git to detect modified UI design documents (docs/ui-boards/, .screen-designer/) and branch ahead/behind status.
    Parameters: [workspacePath]

  • screen_designer_git_commit (alias: storyboard_git_commit)
    Stage modified design documents and create a Git commit using native es-git.
    Parameters: <message> [description] [files] [workspacePath]

⚡ Live Canvas Remote Control:
  • screen_designer_canvas_status (alias: storyboard_get_selection)
    Inspect live canvas status: WebSocket connection, selected element, active tweak slider overrides, and design tokens.

  • screen_designer_canvas_preview (alias: storyboard_render, storyboard_update)
    Push live code/artboard updates or temporary previews directly into the active canvas over WebSocket bridge.
    Parameters: [artboards] [id] [code] [title]
```

---

## 2. CLI를 통한 MCP 툴 직접 제어

별도의 AI 에이전트를 연결하지 않고도, 터미널 환경에서 모든 MCP 도구를 CLI로 직접 호출하고 디버깅할 수 있습니다.

### 1) MCP 툴 목록 조회
```bash
screen-designer mcp list
```

### 2) MCP 툴 직접 호출 (`mcp call`)
JSON 문자열 또는 플래그 인자(`--key=value`) 형태로 파라미터를 전달할 수 있습니다.

```bash
# 1. 페이지 목록 조회
screen-designer mcp call screen_designer_list_pages

# 2. 특정 페이지 전체 상세 JSON 조회
screen-designer mcp call screen_designer_get_page --pageId=1

# 3. 헤드리스 크롬으로 시안 스크린샷 렌더링 & 저장
screen-designer mcp call screen_designer_render_artboard_image --pageId=1 --outPath=preview.png

# 4. 디자인 시스템 토큰 조회
screen-designer mcp call screen_designer_get_design_system

# 5. 디자인 시스템 토큰 오버라이드 갱신
screen-designer mcp call screen_designer_save_design_system '{"tokens":{"primaryColor":"#6366f1"}}'

# 6. es-git 기반 디자인 문서 Git 상태 확인
screen-designer mcp call screen_designer_git_status

# 7. 프로덕션 React 컴포넌트 코드 생성
screen-designer mcp call screen_designer_export_code --pageId=1 --format=react --outDir=src/components
```

### 3) MCP 서버 Stdio 실행 (`mcp serve`)
Claude Desktop, Cursor, Antigravity 등의 `claude_desktop_config.json`에 `screen-designer mcp`를 바로 등록할 수 있습니다:

```json
{
  "mcpServers": {
    "screen-designer": {
      "command": "screen-designer",
      "args": ["mcp"]
    }
  }
}
```

---

## 3. 전용 1등급 CLI 단축 명령어

자주 사용하는 디자인 작업은 직관적인 단축 명령어로 즉시 제어할 수 있습니다.

| 명령어 | 설명 | 예시 |
|---|---|---|
| `screen-designer page list [경로]` | 프로젝트 내 전체 페이지 및 아트보드 목록 출력 | `screen-designer page list` |
| `screen-designer page create <이름> [옵션]` | 새 페이지 생성 (템플릿 지정 가능) | `screen-designer page create "온보딩" --template=login` |
| `screen-designer page show <pageId> [경로]` | 지정된 페이지의 상세 VDOM JSON 출력 | `screen-designer page show 1` |
| `screen-designer page save <파일.json> [경로]` | 외부 JSON 파일을 프로젝트 페이지로 저장/가져오기 | `screen-designer page save new-page.json` |
| `screen-designer page delete <pageId> [경로]` | 지정된 페이지 삭제 및 프로젝트 매니페스트 동기화 | `screen-designer page delete 2` |
| `screen-designer artboard list <pageId>` | 특정 페이지 내 모든 아트보드(시안) 목록 출력 | `screen-designer artboard list 1` |
| `screen-designer artboard add <pageId> <제목> [옵션]` | 페이지에 새 아트보드 생성 (템플릿/뷰포트 지정) | `screen-designer artboard add 1 "회원가입" --template=login` |
| `screen-designer artboard update <pageId> <id> [옵션]` | 기존 아트보드 속성/크기/제목/노드 수정 | `screen-designer artboard update 1 artboard-123 --title="로그인 v2"` |
| `screen-designer artboard delete <pageId> <id>` | 페이지에서 특정 아트보드 삭제 | `screen-designer artboard delete 1 artboard-123` |
| `screen-designer tokens [경로]` | 디자인 시스템 컬러, 반경, 타이포그래피, 기본 스타일 출력 | `screen-designer tokens` |
| `screen-designer commit -m "<메시지>" [경로]` | `es-git`을 통해 변경된 UI 디자인 문서만 스마트 자동 커밋 | `screen-designer commit -m "feat: 홈 화면 개선"` |
| `screen-designer status [경로]` | 브랜치 및 UI 디자인 문서의 Git 상태 확인 | `screen-designer status` |
| `screen-designer export [옵션] [경로]` | VDOM JSON을 React/Vue/HTML 코드로 일괄 변환 | `screen-designer export --format=react` |
| `screen-designer render-image <pageId> [옵션]` | 헤드리스 크롬을 통한 아트보드 이미지 캡처 | `screen-designer render-image 1` |
| `screen-designer [경로] [--web]` | Electron 데스크톱 앱 또는 웹 브라우저 캔버스 실행 | `screen-designer .` |
