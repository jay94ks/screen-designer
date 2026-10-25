# Screen Designer — 코드베이스 유지보수 및 개발 지침서 (Maintenance & Development Guide)

> **대상**: 이 문서(`AGENTS.md`)는 **Screen Designer 프로젝트 자체를 개발, 유지보수, 확장, 리팩토링, 디버깅하는 AI 에이전트와 엔지니어**를 위한 핵심 개발 지침서입니다.  
> 외부 사용자 관점의 사용법이 아니라, **이 레포지토리의 소스 코드를 안전하게 수정하고 올바르게 빌드·배포하기 위한 기술 명세와 내부 아키텍처 규칙**을 규정합니다.

---

## 1. 모노레포 구조 및 패키지별 역할 (Monorepo Architecture)

이 프로젝트는 npm workspaces 기반의 모노레포 구조를 채택하고 있습니다.

```
screen-designer/
├── packages/
│   ├── app/                 # [GUI & Desktop] React 18 + Vite + Electron 데스크톱 앱
│   ├── mcp-server/          # [MCP Server] AI 에이전트 제어용 Model Context Protocol 서버 (17종 툴)
│   └── cli/                 # [CLI Launcher] 터미널 명령어, 캔버스 실행기, 크롬 헤드리스 렌더러
├── docs/                    # [문서] 기능 명세, MCP/CLI 레퍼런스, 배포 및 전역 설치 설계
│   ├── features.md          # 13개 핵심 기능 상세 구현 명세서
│   ├── mcp-and-cli-reference.md  # 17개 MCP 툴 및 CLI 명령어 레퍼런스
│   └── global-install-and-execution-design.md
├── AGENTS.md                # [본 문서] 코드베이스 개발/유지보수 지침서
└── CLAUDE.md                # AGENTS.md 참조 포인터
```

---

## 2. 패키지별 내부 구조 및 핵심 소스 파일

### 2.1 `packages/app` (디자이너 프론트엔드 & Electron)
- **`src/components/`**:
  - `ClaudeHeader.tsx`: 상단 2단 헤더 (캡션 바 + 메뉴바/도구상자/정렬바/플레이/줌/Git 상태/언어 선택기).
  - `LeftSidebar.tsx`: 좌측 사이드바 (레이어 트리 탐색기, 45종 컴포넌트 목록, 섹션 템플릿).
  - `RightSidebar.tsx`: 우측 인스펙터 패널 (속성 `Properties`, 인터랙션 `Events`, 코드 `Code`, 동적 `Tweaks` 4단 탭).
  - `PropertiesPanel.tsx`: 플렉스박스 레이아웃, 크기, 타이포그래피, 배경색/그라디언트/패턴/메시, 테두리, 그림자 등 정밀 제어기.
  - `VNodeRenderer.tsx`: 가상 DOM(`VNode`) 트리를 브라우저 DOM으로 재귀 렌더링하고 클릭/호버 인터랙션 처리.
  - `PlayModal.tsx`: 모바일 디바이스 목업 프레임 안에서 실제 화면 전환 및 클릭 액션을 수행하는 프레젠테이션 플레이어.
  - `CanvasRulers.tsx`: 상단/좌측 픽셀 눈금자 및 사용자 가이드라인 오버레이.
  - `PrototypeWiresOverlay.tsx`: 화면 간 전환 연결선(Figma Prototype Wire) SVG 오버레이.
  - `Modals/`: `GitDesktopModal.tsx`, `SettingsModal.tsx`, `DesignSystemModal.tsx`, `ExportModal.tsx`, `CommandPaletteModal.tsx`, `NewArtboardModal.tsx` 등.
- **`src/i18n/`**: 다국어(i18n) 시스템 코어.
  - `types.ts`: `TranslationSchema` 표준 스키마 인터페이스.
  - `ko.ts`, `en.ts`, `ja.ts`: 한국어/영어/일본어 사전.
  - `index.tsx`: `I18nProvider`, `useTranslation()`, `AVAILABLE_LANGUAGES` 및 Fallback 로직.
- **`src/types/`**:
  - `types.ts`: `ProjectSettings`, `CanvasTool`, `TweakDefinition`, `GitStatusInfo` 등.
  - `types/vdom.ts`: `VNode`, `NodeType`(45종), `VNodeStyle`, `NodeEventBinding`, `VDomArtboard`.
- **`src/utils/`**:
  - `gitClient.ts`: Electron IPC를 통한 `es-git` Git 연동 클라이언트.
  - `projectClient.ts`: `project.json` 로드, 저장, 디렉터리 마이그레이션.
  - `artboardExporter.ts`: 이미지/JSON/코드 클라이언트 내보내기.
  - `serializer.ts`: VDOM을 React TSX 및 Tailwind 코드로 컴파일.
  - `history.ts`: 실행 취소(Undo) / 다시 실행(Redo) 상태 히스토리 매니저.
- **`electron/`**:
  - `main.ts`: Electron 메인 프로세스, 프레임리스 윈도우 생성, IPC 핸들러, WebSocket 브릿지 서버.
  - `preload.ts`: `window.electronAPI` 브릿지 노출 (윈도우 최소화/최대화/닫기, es-git 통신).

### 2.2 `packages/mcp-server` (AI 에이전트 제어 서버)
- **`src/index.ts`**: MCP 서버 인스턴스 초기화, Stdio 트랜스포트 연결, `CanvasBridge` 연동.
- **`src/tools.ts`**: 17종 도메인 도구 구현 (`screen_designer_*`) 및 Zod 스키마, VDOM 템플릿 빌더, 재귀 노드 업데이트.
- **`src/bridge.ts`**: 캔버스 GUI와의 실시간 원격 제어를 위한 WebSocket 통신 브릿지 (`CanvasBridge`).
- **`src/imageRenderer.ts`**: Chrome Headless를 구동하여 VDOM을 캡처하고 Base64 PNG 이미지로 반환하는 렌더러.
- **`src/codeGenerator.ts`**: VDOM을 순수 React, Vue 3, HTML 코드로 컴파일하는 오프라인 제너레이터.

### 2.3 `packages/cli` (통합 실행 및 제어 CLI)
- **`bin/index.js`**: `screen-designer` 바이너리 엔트리포인트.
  - 데스크톱/웹 캔버스 런처 (`launch`, `init`).
  - MCP 서버 서빙 및 직접 도구 호출 (`screen-designer mcp list`, `screen-designer mcp call`).
  - 1등급 CLI 액션: `page`, `artboard`, `tokens`, `commit`, `status`, `export`, `render-image`.

---

## 3. 핵심 엔지니어링 원칙 (Strict Maintenance Rules)

에이전트는 이 프로젝트를 수정할 때 다음 원칙을 반드시 준수해야 합니다.

### 원칙 1: `simple-git` 완전 배제 및 `es-git` 전용 사용
- 과거 사용되던 `simple-git`은 외부 git 바이너리 의존성 및 환경 불안정성 문제로 **프로젝트 전역에서 완전히 제거**되었습니다.
- 모든 Git 상태 조회, diff 파싱, 스테이징, 커밋, 푸시는 Toss의 네이티브 libgit2 바인딩 라이브러리인 **`es-git`**을 일관되게 사용해야 합니다.

### 원칙 2: 빌드 무결성 (`npm run build` 0 Error)
- 코드를 수정한 후에는 반드시 루트에서 빌드를 검증해야 합니다:
  ```bash
  npm run build
  ```
- `@screen-designer/app`의 Vite 번들링 및 `@screen-designer/mcp-server`의 TypeScript 컴파일(`tsc`) 모두 에러가 없어야 합니다.
- `any` 타입을 남발하지 말고 명확한 TypeScript 인터페이스와 Zod 스키마를 정의하세요.

### 원칙 3: 다국어(i18n) 동기화 원칙
- UI 컴포넌트(`ClaudeHeader`, `LeftSidebar`, `RightSidebar`, `PropertiesPanel`, `SettingsModal` 등)에 새로운 라벨, 버튼 텍스트, 툴팁을 추가할 때는 하드코딩하지 마세요.
- **추가 절차**:
  1. [packages/app/src/i18n/types.ts](file:///home/jay94ks/screen-designer/packages/app/src/i18n/types.ts)의 `TranslationSchema`에 키 추가.
  2. [packages/app/src/i18n/ko.ts](file:///home/jay94ks/screen-designer/packages/app/src/i18n/ko.ts), [en.ts](file:///home/jay94ks/screen-designer/packages/app/src/i18n/en.ts), [ja.ts](file:///home/jay94ks/screen-designer/packages/app/src/i18n/ja.ts)에 각 언어 번역 동시 등록.
  3. 컴포넌트에서 `const { t } = useTranslation();`을 통해 `t('category.key')` 형태로 호출.

### 원칙 4: 문서 및 주석 무결성 유지 (Documentation Integrity)
- 기존 코드에 작성된 주석, JSDoc 설명, 명세 문서는 임의로 삭제하지 말고 보존해야 합니다.
- 새로운 기능이나 MCP 도구를 추가한 경우 반드시 `docs/features.md` 및 `docs/mcp-and-cli-reference.md`를 함께 갱신하세요.

### 원칙 5: WSL ↔ Windows 미러 동기화 원칙
- 주 개발 작업은 WSL 리눅스 환경(`/home/jay94ks/screen-designer`)에서 수행됩니다.
- 변경 사항을 커밋하고 `origin main`에 푸시한 후, Windows 미러 경로(`/mnt/c/Users/jay94/screen-designer`)에서도 항상 `git pull origin main`을 실행하여 Windows 네이티브 환경과 100% 동기화 상태를 유지해야 합니다.
- (주의: WSL 9P 파일시스템 레이턴시로 인해 `/mnt/c` 직접 rsync는 지양하고, Git 워크플로우를 사용하세요.)

---

## 4. 기능 추가 및 확장 개발 가이드 (How-to Guide)

### 4.1 새로운 VDOM 컴포넌트(NodeType) 추가 시
1. `packages/app/src/types/vdom.ts`: `NodeType` 유니온 타입에 신규 태그 추가 (예: `accordion`).
2. `packages/app/src/types/vdom.ts`: 기본 `VNodeStyle` 및 `props` 확장.
3. `packages/app/src/components/VNodeRenderer.tsx`: 신규 노드 타입에 대한 HTML 태그 렌더링 및 스타일 매핑 로직 추가.
4. `packages/app/src/components/Modals/SettingsModal.tsx`: `COMPONENT_CATALOG`에 신규 컴포넌트 메타데이터(아이콘, 설명, 기본값) 등록.
5. `packages/mcp-server/src/codeGenerator.ts` & `packages/cli/bin/index.js`: `getHtmlTag()` 및 코드 제너레이터 매핑 추가.

### 4.2 새로운 MCP 도구(Tool) 추가 시
1. `packages/mcp-server/src/tools.ts`:
   - `ToolDefinition` 객체를 생성하여 `TOOLS` 배열에 추가.
   - 명확한 표준 도구명 (`screen_designer_*`)과 별칭(`aliases`), Zod 파라미터 스키마 정의.
   - `execute` 비동기 함수 구현 (결과는 표준 JSON 텍스트 또는 이미지 반환).
2. `packages/mcp-server/`: `npm run build`를 실행하여 컴파일 검증.
3. `packages/cli/bin/index.js`: CLI 명령어로 직접 호출할 수 있도록 라우팅 및 도움말(`help()`) 추가.
4. `docs/mcp-and-cli-reference.md`: 신규 도구 및 CLI 사용법 문서화.

---

## 5. 자주 발생하는 이슈 및 트러블슈팅 (Troubleshooting)

| 현상 / 에러 | 원인 | 해결책 |
|---|---|---|
| `ERR_MODULE_NOT_FOUND` (MCP 서버) | 패키지 간 상대 경로 해석 오류 | `packages/cli/package.json`의 dependencies에 `@screen-designer/mcp-server`를 등록하고 패키지명으로 import |
| `Parameter 'args' implicitly has an 'any' type` | MCP SDK 콜백 함수 타입 누락 | `(args: any) => tool.execute(...)`로 명시적 타입 부여 |
| `options.pageId.endsWith is not a function` | CLI 인자 파서가 숫자 `"1"`을 정수 `1`로 파싱 | `String(options.pageId)`로 문자열 보장 처리 |
| Windows에서 헤드리스 크롬을 찾지 못함 | PATH 미등록 또는 레지스트리 미검색 | `winreg` 라이브러리로 `App Paths\chrome.exe` 및 `msedge.exe` 레지스트리 자동 탐색 |
| 저장 후 페이지 파일명이 분리되는 문제 | `id`(`page-2`)와 파일명(`2.json`) 불일치 | `findPageDoc`에서 원본 파일 경로(`fullPath`)를 추적하여 `persistPageDoc` 시 기존 파일명 우선 저장 |

---

## 6. 에이전트 체크리스트 (Agent Final Checklist)

작업 완료 전 다음 5가지를 반드시 점검하세요:
- [ ] `npm run build` 실행 시 TypeScript 및 Vite 빌드 에러가 0건인가?
- [ ] 새롭게 추가된 UI 라벨이 `packages/app/src/i18n/` 3개 언어 사전에 모두 등록되었는가?
- [ ] `simple-git`이 포함되지 않고 `es-git`을 정상 사용하고 있는가?
- [ ] 변경 사항이 `origin main`에 푸시되고 Windows 미러(`/mnt/c/Users/jay94/screen-designer`)에 pull 되었는가?
- [ ] 사용자 응답 시 클릭 가능한 마크다운 링크(`file://...`)와 한국어 설명으로 작성되었는가?
