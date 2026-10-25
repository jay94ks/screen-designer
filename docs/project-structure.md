# 프로젝트 저장 구조 명세서 (Project Structure Specification)

**Screen Designer**는 별도의 수동 내보내기 없이 작업 중인 모든 페이지와 디자인 시스템, 에셋을 파일 시스템에 자동으로 실시간 저장하고 관리합니다.

기본적으로 프로젝트의 루트 아래 `docs/ui-boards/` 디렉터리 내에 규격화된 파일 구조로 저장되며, 환경설정(`Settings`)에서 저장 경로를 자유롭게 변경할 수 있습니다.

---

## 1. 기본 저장 디렉터리 구조

```
docs/ui-boards/
├── project.json          # 프로젝트 메타데이터, 페이지 순서 및 에셋 파일 목록
├── design-system.json   # 디자인 시스템 설정 (컴포넌트별 기본 스타일 및 스펙)
├── pages/                # 페이지별 구조화된 JSON 데이터
│   ├── 1.json           # 1번 페이지 (장표 및 VDOM 노드 트리)
│   ├── 2.json           # 2번 페이지
│   └── {number}.json    # N번 페이지...
└── assets/               # 프로젝트에서 사용하는 이미지, 벡터 SVG 프리셋 등
    ├── preset-gradient.svg
    ├── preset-tech.svg
    ├── preset-nature.svg
    └── {uploaded_files}.png
```

---

## 2. 파일별 상세 스펙

### 2.1 `project.json`
프로젝트의 전체 개요와 페이지 구성 목록, 사용 중인 에셋 목록을 관리합니다.

```json
{
  "name": "Fintech Service UI Storyboard",
  "version": "1.0.0",
  "description": "핀테크 모바일 앱 및 가상 자산 관리 스토리보드",
  "updatedAt": "2026-10-25T06:28:42.000Z",
  "pages": [
    {
      "id": "page-fintech-vdom",
      "name": "Page 1 (핀테크 가상 DOM)",
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
디자인 시스템 스튜디오에서 편집한 각 컴포넌트(`frame`, `card`, `button`, `input`, `text` 등)의 기본 스타일을 영속화합니다.

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
각 페이지 번호에 해당하는 장표(Artboard) 목록과 계층형 VDOM(Virtual DOM) 노드 트리가 저장됩니다.

```json
{
  "id": "page-fintech-vdom",
  "name": "Page 1 (핀테크 가상 DOM)",
  "number": 1,
  "version": "1.0.0",
  "updatedAt": "2026-10-25T06:28:42.000Z",
  "artboards": [
    {
      "id": "artboard-s1",
      "title": "1. AI 자산 관리 홈 (Home)",
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

### 2.4 `assets/` 디렉터리
- 애플리케이션 내장 벡터 SVG 프리셋이 자동으로 생성(Materialize)되어 배치됩니다.
- 사용자가 속성 패널에서 `배경 파일` 또는 이미지 컴포넌트의 `파일 선택`을 통해 로컬 이미지를 지정하면, 파일이 이 디렉터리로 복사되며 상대 경로(`assets/파일명`)로 참조됩니다.

---

## 3. 관리 경로 변경 및 자동 마이그레이션

1. 탑 바의 설정 다이얼로그(`⚙️` 아이콘)에서 **문서 저장 경로(Page Docs Path)**를 변경할 수 있습니다 (예: `docs/mobile-spec` 등).
2. 경로를 변경하면 Electron 백엔드 서비스가 기존 경로(`docs/ui-boards`) 내의 모든 파일(`project.json`, `design-system.json`, `pages/`, `assets/`)을 **새 대상 경로로 자동 이동(Move)**시킵니다.
3. 이후 모든 자동 저장 및 Git 추적은 변경된 경로를 기준으로 동작합니다.

---

## 4. 타겟 프로젝트 설정 (`.screen-designer/`)

Screen Designer CLI 및 MCP 서버가 타겟 프로젝트를 인식하고 제어할 때 프로젝트 루트에 생성하는 설정 및 캐시 구조입니다:

```
.screen-designer/
├── config.json       # 프로젝트 연동 설정 (페이지 경로, 디자인 시스템 경로, 서버 포트 등)
└── cache/            # Chrome Headless 기반 비주얼 렌더링 임시 이미지 캐시 (*.png)
```

### 4.1 `.screen-designer/config.json` 스펙
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

## 5. 모노레포 패키지 구성 (Monorepo Packages)

Screen Designer 저장소 자체는 `npm workspaces` 기반의 3개 핵심 패키지로 모듈화되어 있습니다:

- **`packages/app`**: React 19 + TypeScript + Electron 35 기반의 시각적 메인 캔버스 애플리케이션
  - `packages/app/src/components/`: 캔버스, 레이어, 속성 인스펙터, 커맨드 팔레트, Git 모달 등
  - `packages/app/src/i18n/`: 3개 국어(한국어, 영어, 일본어) 번역 딕셔너리
  - `packages/app/electron/`: 파일 저장, IPC 핸들러, `es-git` 서비스
- **`packages/mcp-server`**: Model Context Protocol (SDK 1.6) 기반의 17개 도메인 MCP 도구 및 Chrome Headless 렌더러
  - `src/tools.ts`: 17종 `screen_designer_*` 도구 등록 및 실행 핸들러
  - `src/headless-renderer.ts`: 브라우저 없이 장표를 PNG로 스크린샷 캡처하는 고속 헤드리스 엔진
- **`packages/cli`**: 전역/로컬 실행 가능한 커맨드라인 바이너리 (`screen-designer`)
  - `bin/screen-designer`: 실행 진입 스크립트
  - `src/commands/`: `init`, `serve/mcp`, `ui`, `page`, `artboard`, `tokens`, `commit`, `doctor` 등의 서브커맨드 구현체

