<p align="center">
  <img src="docs/logo.png" width="128" height="128" alt="Screen Designer Logo" />
</p>

<h1 align="center">Screen Designer</h1>

<p align="center">
  <strong>Universal Cross-Agent Visual Storyboard Canvas, MCP Suite & Headless CLI</strong><br>
  Claude Code, Cursor, OpenAI Codex/GPT, Google Gemini(Antigravity)를 위한 차세대 실시간 UI 디자인 & 비주얼 프로토타이핑 시스템
</p>

<p align="center">
  <a href="https://www.npmjs.com/"><img src="https://img.shields.io/badge/npm-v1.0.0-blue.svg" alt="npm version" /></a>
  <a href="https://modelcontextprotocol.io/"><img src="https://img.shields.io/badge/MCP-17%20Tools-brightgreen.svg" alt="MCP Standard" /></a>
  <a href="LICENSE"><img src="https://img.shields.io/badge/License-MIT-yellow.svg" alt="License: MIT" /></a>
  <a href="docs/features.md#13-다국어-지원"><img src="https://img.shields.io/badge/i18n-KO%20%7C%20EN%20%7C%20JA-purple.svg" alt="i18n" /></a>
</p>

---

![Screen Designer Live Visual Canvas Workspace](docs/preview-canvas.png)

---

## 🌟 핵심 특징 (Key Features)

1. **⚡ 초고속 실시간 렌더링 & 무한 캔버스 (Zero-Delay Live Canvas)**:
   - AI 에이전트가 코드를 전달하는 즉시 **0.1초** 만에 캔버스에 인터랙티브 VDOM UI가 즉각 렌더링됩니다.
   - 레이어 트리 DOM 최적화(-92% 경량화) 및 window-level rAF 기반 60FPS 부드러운 패닝/줌 엔진을 탑재했습니다.
2. **📐 캔버스 역할(Role) & 반응형 해상도 시스템**:
   - 단순 기기 규격이 아닌 화면의 목적과 역할(`main-page`, `sub-page`, `modal`, `bottom-sheet`, `widget`, `responsive-viewport`)을 기준으로 프레임을 설계합니다.
   - 설계 가로×세로 직접 입력 및 원클릭 회전, 편집 중 실시간 구동 해상도 프리셋 미리보기, 해상도별 조건부 노출 규칙(Resolution Rules)을 완벽 지원합니다.
3. **⚡ 인터랙티브 프로토타이핑 & 동적 트윅 (Events & Tweaks)**:
   - Figma 스타일 베지어 곡선 인터랙션 연결선(Wires), 디바이스 목업 플레이 모드(`▶ PLAY`), 핫스팟 가이드 지원.
   - 화면별 테마(Dark/Light/Cyber), 통화 및 금액(₩/$/€/¥), 언어, UI 밀도 등을 실시간 조절하면 VDOM 시안이 즉시 반응하여 서식을 동적으로 변환합니다.
4. **🛠️ 17종 도메인 기반 MCP 도구 (`screen_designer_*`)**:
   - 프로젝트 조회부터 페이지/장표(Artboard) 생성, 정밀 노드 스타일 수정, 디자인 시스템 토큰 관리, Chrome Headless 기반 비주얼 스크린샷 검증까지 모든 도구를 표준 MCP 프로토콜로 제공합니다.
5. **💻 강력한 CLI 제어 인터페이스 (`screen-designer`)**:
   - GUI 없이도 터미널 환경에서 `screen-designer page create`, `screen-designer artboard add/update/delete`, `screen-designer commit` 등의 서브커맨드로 프로젝트를 자유자재로 제어할 수 있습니다.
6. **📦 네이티브 Git 엔진 (`es-git`) 통합**:
   - 외부 Git 바이너리 종속 없이 순수 고성능 `es-git` 엔진으로 작업 내역을 자동 감지하고 다이얼로그에서 변경점 diff 확인 및 원클릭 커밋/푸시를 지원합니다.
7. **🌐 완전한 3개 국어 다국어 지원 (i18n)**:
   - 한국어(`ko`), 영어(`en`), 일본어(`ja`) 실시간 원클릭 언어 전환 및 프로젝트 단위 영속 저장.

---

## 🚀 빠른 시작 (Getting Started)

### 1. 전역 설치 (Global Install)

```bash
# npm을 통한 전역 CLI 설치
npm install -g screen-designer

# 어디서든 특정 프로젝트를 대상으로 실행
screen-designer /path/to/my-project
```

### 2. 프로젝트 초기화 (Project Init)

기존 프로젝트 디렉터리에서 명령어 한 줄로 Screen Designer 연동 환경을 구성합니다:

```bash
npx screen-designer init
```

실행 즉시 다음 파일들이 자동 생성됩니다:
- `.screen-designer/config.json`: 프로젝트 설정 (페이지 경로, 디자인 시스템 경로 등)
- `docs/ui-boards/`: 기본 UI 스토리보드 저장소 (`project.json`, `design-system.json`, `pages/`, `assets/`)
- `AGENTS.md` & `CLAUDE.md`: AI 에이전트를 위한 지침서

### 3. MCP 서버 및 UI 실행

```bash
# MCP 표준 I/O 서버 실행 (AI 에이전트 연동용)
screen-designer serve
# 또는
screen-designer mcp

# 웹/데스크톱 캔버스 UI 실행
screen-designer ui
```

---

## ⌨️ CLI 명령어 레퍼런스 (CLI Reference)

Screen Designer는 풍부한 터미널 명령어를 기본 제공합니다:

```bash
# 상태 및 진단
screen-designer status                          # 프로젝트 상태 및 페이지 목록 확인
screen-designer doctor                          # 환경 및 종속성 상태 점검

# 페이지 관리
screen-designer page list                       # 등록된 모든 페이지 조회
screen-designer page create "결제 플로우"       # 새 페이지 생성

# 아트보드(장표) 관리
screen-designer artboard list <pageId>          # 페이지 내 장표 목록 확인
screen-designer artboard add <pageId> -t "로그인" --viewport mobile
screen-designer artboard update <pageId> <artboardId> --title "로그인 V2"
screen-designer artboard delete <pageId> <artboardId>

# 디자인 토큰 & 코드 추출
screen-designer tokens get                      # 디자인 시스템 토큰 조회
screen-designer tokens set --primary "#4f46e5"  # 브랜드 프라이머리 색상 변경
screen-designer export <artboardId> -o ./src    # React + Tailwind 컴포넌트로 추출
screen-designer render-image <pageId>           # Chrome Headless로 장표 이미지 캡처

# Git 데스크톱 버전 관리
screen-designer commit -m "feat: 결제 플로우 장표 추가"
```

---

## 🔌 제공되는 MCP Tools (17종)

Screen Designer MCP 서버는 `screen_designer_*` 표준 네임스페이스와 레거시 호환 별칭을 모두 지원합니다:

| 카테고리 | 도구 이름 | 설명 |
| :--- | :--- | :--- |
| **Project** | `screen_designer_get_project` | 프로젝트 설정, 캔버스 연결 상태, 전체 페이지 목록 조회 |
| **Pages** | `screen_designer_list_pages` | 전체 UI 장표 페이지 목록 및 메타데이터 요약 조회 |
| | `screen_designer_get_page` | 특정 페이지의 전체 장표, VDOM 노드 트리, 와이어, 트윅 조회 |
| | `screen_designer_create_page` | 새 페이지 문서 생성 (초기 장표 및 템플릿 지정 가능) |
| | `screen_designer_save_page` | 페이지 VDOM 문서 저장/갱신 (`docs/ui-boards/pages/*.json`) |
| | `screen_designer_delete_page` | 페이지 문서 삭제 및 프로젝트 매니페스트 동기화 |
| **Artboards** | `screen_designer_add_artboard` | 페이지에 새 아트보드(모바일/데스크톱/템플릿) 추가 |
| | `screen_designer_update_artboard` | 특정 아트보드의 메타데이터, VDOM 노드 트리, 스타일 부분 수정 |
| | `screen_designer_delete_artboard` | 특정 아트보드 삭제 (캔버스, 레이어 사이드바, 속성창, 단축키 연동) |
| **Tokens** | `screen_designer_get_design_system` | 디자인 시스템 토큰 및 컴포넌트 기본 스타일 조회 |
| | `screen_designer_save_design_system` | 디자인 토큰 및 컴포넌트 기본 스타일 일괄 갱신 및 캔버스 동기화 |
| **Live Canvas**| `screen_designer_get_live_selection` | 사용자가 캔버스에서 클릭한 요소 ID 및 슬라이더 조절값 획득 |
| | `screen_designer_sync_canvas` | 캔버스 뷰포트 확대/이동 및 특정 장표/요소로 카메라 포커스 이동 |
| **Visual & Code**| `screen_designer_render_image` | Chrome Headless 기반 무헤드리스 초고화질 장표 캡처 (비주얼 검증) |
| | `screen_designer_export_code` | VDOM 구조를 React 19 + Tailwind CSS 컴포넌트 코드로 컴파일 |
| **Git** | `screen_designer_git_status` | `es-git` 기반 UI 변경 파일 스테이징 상태 및 diff 조회 |
| | `screen_designer_git_commit` | `es-git` 기반 UI 변경 내역 자동 스테이징 및 커밋 생성 |

---

## 💬 에이전트별 프롬프트 활용 예시

### 1. Google Gemini (Antigravity)
```text
"Gemini야, screen_designer_create_page로 '회원가입 플로우' 페이지를 만들고 모바일 온보딩 장표 3개를 나란히 추가해줘"
```

### 2. Anthropic Claude (Claude Code / Desktop)
```text
"Inspect the active page with screen_designer_get_page, change the button color to #6366f1 using screen_designer_update_artboard, and verify the screenshot with screen_designer_render_image."
```

### 3. OpenAI GPT / Codex
```text
"디자인 시스템 토큰을 다크 사이버펑크 테마로 업데이트하고, 수정된 UI 변경사항을 es-git으로 커밋해줘"
```

---

## 📚 상세 문서 목록 (Documentation)

자세한 사양과 가이드는 [docs/](docs/README.md) 디렉터리에서 확인할 수 있습니다:

- 📖 [문서 허브 (docs/README.md)](docs/README.md)
- 📋 [구현 기능 상세 명세서 (features.md)](docs/features.md)
- 🛠️ [MCP 툴 & CLI 제어 레퍼런스 (mcp-and-cli-reference.md)](docs/mcp-and-cli-reference.md)
- 📁 [프로젝트 저장 구조 명세서 (project-structure.md)](docs/project-structure.md)
- 🌐 [전역 설치 및 특정 프로젝트 대상 실행 설계서 (global-install-and-target-execution.md)](docs/global-install-and-target-execution.md)
- ⌨️ [키보드 단축키 & 생산성 가이드 (shortcuts.md)](docs/shortcuts.md)
- 🤖 [에이전트 개발 & 유지보수 매뉴얼 (AGENTS.md)](AGENTS.md)

---

## 💻 로컬 개발 및 기여 (Development)

```bash
# 1. 의존성 설치
npm install

# 2. 전체 패키지 빌드 (packages/app, packages/mcp-server, packages/cli)
npm run build

# 3. 브라우저 개발 서버 실행 (Vite)
npm run dev:app

# 4. Electron 데스크톱 앱 실행
npm run start

# 5. MCP 서버 단독 실행
npm run dev:mcp
```

---

## 📄 라이선스 (License)

MIT License © 2026 Screen Designer Team.
