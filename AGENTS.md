# Screen Designer — Agent Development & Architecture Guide

이 문서는 **Screen Designer** 코드베이스에서 작업하는 모든 AI 에이전트(Claude, Cursor, Codex, Gemini, Antigravity 등)와 기여자를 위한 종합 아키텍처 및 작업 지침서입니다.

---

## 1. 프로젝트 개요 (Project Overview)

**Screen Designer**는 개발자와 디자이너가 실시간으로 소통할 수 있도록 지원하는 **시각적 가상 DOM(VDOM) 기반 UI 디자인 도구이자 인터랙티브 스토리보드 에디터**입니다.

- **실행 모드**:
  - **Electron 데스크톱 앱**: 프레임리스 윈도우, 네이티브 윈도우 캡션 컨트롤, 로컬 파일 시스템 직접 제어.
  - **웹 브라우저 모드 (`--web`)**: 리눅스 헤드리스 및 원격 환경 지원을 위한 Vite HTTP 서버 서빙.
- **모노레포 패키지 구성**:
  - `packages/app`: React + Vite 기반의 메인 디자이너 GUI 및 Electron 데스크톱 앱.
  - `packages/mcp-server`: AI 에이전트와의 실시간 시각적 상호작용을 위한 Model Context Protocol(MCP) 서버.
  - `packages/cli`: 프로젝트 초기화, 시안 렌더링, 코드 추출, Git 커밋, MCP 도구 호출을 수행하는 통합 CLI 도구.
  - `docs/`: 기능 명세서, MCP/CLI 레퍼런스, 전역 설치 설계 문서 등.

---

## 2. 기술 스택 & 핵심 라이브러리 (Tech Stack)

| 영역 | 기술 스택 | 설명 |
|---|---|---|
| **Frontend Framework** | React 18, TypeScript, Tailwind CSS | 반응형 VDOM 에디터 및 컴포넌트 렌더러 |
| **Icons & UI Assets** | Lucide React | 일관된 모던 UI 아이콘 세트 |
| **Desktop Environment** | Electron 35 | 크로스 플랫폼 데스크톱 셸 (Windows/macOS/Linux) |
| **Git Engine** | **`es-git`** (Toss) | 외부 바이너리 종속 없는 네이티브 libgit2 바인딩 (초고속 diff 및 커밋) |
| **AI Protocol** | `@modelcontextprotocol/sdk` (MCP) | 17종 도메인 기반 표준 MCP 툴 세트 |
| **Image Rendering** | Chrome Headless (`winreg` 레지스트리 탐색) | 가상 DOM을 실제 고해상도 PNG 이미지로 즉각 렌더링 |
| **Internationalization** | 자체 내장 경량 i18n (`packages/app/src/i18n/`) | 한국어(`ko`, 기본), 영어(`en`), 일본어(`ja`) 완전 지원 |

---

## 3. 프로젝트 저장 체계 (Project Storage Architecture)

모든 디자인 데이터는 사람이 읽을 수 있는 표준 JSON 파일로 저장되며, Git 버전 관리 시스템과 완벽히 동기화됩니다.

```
<project-root>/
├── docs/ui-boards/              # 프로젝트 UI 디자인 및 스토리보드 기본 저장소 (설정에서 변경 가능)
│   ├── project.json             # 프로젝트 매니페스트 (페이지 목록, 에셋 목록, 캔버스 환경 설정)
│   ├── design-system.json       # 디자인 토큰 (컬러 팔레트, 타이포그래피, 45종 컴포넌트 기본 스타일)
│   ├── pages/                   # 페이지별 가상 DOM 문서
│   │   ├── 1.json               # 페이지 1 (가상 DOM 계층 트리, 아트보드 목록, 프로토타입 연결선)
│   │   └── 2.json               # 페이지 2
│   └── assets/                  # 프로젝트 에셋 (SVG, 프리셋 그래픽)
├── .screen-designer/            # 앱 내부 캐시 및 로컬 설정 디렉터리
│   ├── config.json              # 작업 공간 설정 (pageDocsPath, gitAutoCheck 등)
│   └── cache/manifest.json      # 페이지 인덱스 캐시
```

---

## 4. MCP 도구 목록 (17 Domain Tools)

AI 에이전트는 `@screen-designer/mcp-server`의 도구를 호출하여 프로젝트를 읽고, 시안을 직접 생성·편집·검수할 수 있습니다.

### 1) 프로젝트 및 작업 공간
- `screen_designer_get_project`: 프로젝트 설정, 페이지 목록, 캔버스 연결 상태 조회.

### 2) 페이지 (Pages) 관리
- `screen_designer_list_pages`: 전체 페이지 목록, 아트보드 수, 뷰포트 정보 조회.
- `screen_designer_get_page`: 특정 페이지의 전체 VDOM JSON(아트보드, 노드, 스타일) 조회.
- `screen_designer_create_page`: 새 페이지 생성 (템플릿 지정 가능).
- `screen_designer_save_page`: 외부 VDOM JSON을 페이지로 저장/임포트.
- `screen_designer_delete_page`: 지정된 페이지 삭제 및 프로젝트 매니페스트 동기화.

### 3) 아트보드 (Artboards / 시안) 관리
- `screen_designer_add_artboard`: 페이지에 새 아트보드 추가 (`login`, `dashboard`, `hero`, `blank` 템플릿 지원).
- `screen_designer_update_artboard`: 기존 아트보드 속성/크기/제목 수정, `rootNode` 교체, 또는 `nodeUpdates`로 **특정 노드(버튼 텍스트, 색상 등)만 타겟 수정**.
- `screen_designer_delete_artboard`: 페이지 내 특정 아트보드 삭제.

### 4) 디자인 시스템 & 토큰
- `screen_designer_get_design_system`: 토큰 및 45종 컴포넌트 기본 스타일 조회.
- `screen_designer_save_design_system`: 디자인 시스템 토큰 오버라이드 및 라이브 캔버스 반영.

### 5) 시각적 검수 & 코드 변환
- `screen_designer_render_artboard_image`: 헤드리스 크롬으로 아트보드를 고해상도 PNG(Base64)로 렌더링하여 반환.
- `screen_designer_export_code`: VDOM을 React TSX, Vue 3, HTML 코드로 일괄 컴파일.

### 6) Git 버전 관리 & 라이브 원격 제어
- `screen_designer_git_status`: 디자인 문서 변경 사항 조회 (`es-git`).
- `screen_designer_git_commit`: 디자인 문서 변경분 스마트 자동 커밋 (`es-git`).
- `screen_designer_canvas_status`: 웹소켓 브리지 연결 및 캔버스 선택 상태 조회.
- `screen_designer_canvas_preview`: 열려 있는 캔버스에 실시간 라이브 코드/프리뷰 전송.

---

## 5. CLI 명령어 레퍼런스 (CLI Usage)

```bash
# 디자이너 GUI 실행
screen-designer [경로]                       # Electron 데스크톱 앱 실행 (기본: .)
screen-designer [경로] --web                 # 웹 브라우저 모드로 실행

# 페이지 및 아트보드 제어
screen-designer page list                   # 전체 페이지 및 아트보드 목록
screen-designer page create "온보딩"        # 새 페이지 생성
screen-designer page show <pageId>          # 페이지 VDOM JSON 출력
screen-designer artboard list <pageId>      # 페이지 내 아트보드 목록
screen-designer artboard add 1 "회원가입"   # 새 아트보드 추가
screen-designer artboard update 1 <id>      # 아트보드 수정
screen-designer artboard delete 1 <id>      # 아트보드 삭제

# MCP 서버 및 툴 호출
screen-designer mcp list                    # 등록된 17종 MCP 도구 및 파라미터 조회
screen-designer mcp call <tool-name> [args] # MCP 도구 직접 호출
screen-designer mcp [serve]                 # Stdio MCP 서버 기동 (Claude Desktop 연동)

# 코드 추출, 렌더링, Git 커밋
screen-designer export --format=react       # React TSX 컴포넌트 코드 일괄 생성
screen-designer render-image <pageId>       # 헤드리스 크롬으로 시안 캡처
screen-designer commit -m "feat: design"    # es-git 스마트 커밋
screen-designer tokens                      # 디자인 시스템 토큰 조회
screen-designer status                      # Git 변경 상태 확인
```

---

## 6. 개발 빌드 및 에이전트 작업 원칙 (Agent Work Guidelines)

1. **빌드 무결성 유지**:
   - 코드 변경 후 반드시 루트에서 `npm run build`를 실행하여 `@screen-designer/app`과 `@screen-designer/mcp-server`의 TypeScript 컴파일 0 에러를 확인합니다.
2. **타입 안전성(Type-Safety)**:
   - TypeScript `strict` 모드를 준수하며 암시적 `any`를 피하고, 명확한 스키마(Zod / TypeScript 인터페이스)를 사용합니다.
3. **기존 주석 및 문서 보존**:
   - 기존의 유용한 주석과 docstring, JSDoc을 삭제하지 않고 보존합니다.
4. **Git 엔진 원칙**:
   - `simple-git`을 사용하지 않으며, Toss의 네이티브 바인딩인 **`es-git`**을 일관되게 사용합니다.
5. **Windows 미러 동기화**:
   - WSL 환경(`/home/jay94ks/screen-designer`)에서 작업 후 `origin main`에 푸시하고, Windows 미러 경로(`/mnt/c/Users/jay94/screen-designer`)에서 `git pull origin main`을 실행하여 항상 양방향 동기화 상태를 유지합니다.
6. **사용자 소통 및 파일 링크**:
   - 사용자 응답은 한국어로 간결하고 명확하게 작성합니다.
   - 모든 파일 경로 및 코드 심볼은 `file://` 스키마 기반의 클릭 가능한 마크다운 링크(예: [ClaudeHeader.tsx](file:///home/jay94ks/screen-designer/packages/app/src/components/ClaudeHeader.tsx))로 제공합니다.
