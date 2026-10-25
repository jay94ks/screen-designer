# Screen Designer (화면 기획 & UI 스토리보드 디자이너)

> **React 19 + TypeScript + Electron + MCP + Headless CLI** 기반의 크로스 플랫폼 화면 설계 및 프로토타이핑 시스템입니다.  
> 기획자, UI 디자이너, 프론트엔드 개발자 및 AI 에이전트(Claude, Gemini, GPT 등)가 가상 DOM(VDOM) 기반으로 모바일 및 웹 화면을 시각적으로 설계하고, 피그마 스타일 프로토타이핑, 디자인 시스템 관리, React/Tailwind 코드 자동 추출, Headless CLI 자동화까지 원스톱으로 수행할 수 있습니다.

---

## 📚 문서 목록 (Documentation Hub)

- [기능 명세서 (Features)](./features.md): 현재까지 구현된 14개 핵심 기능(캔버스, 프로토타이핑, 디자인 시스템, Git 연동, 다국어, Headless CLI 등)의 상세 안내
- [MCP 툴 & CLI 제어 레퍼런스 (MCP & CLI Reference)](./mcp-and-cli-reference.md): 재설계된 17종 도메인 기반 MCP 도구(`screen_designer_*`) 규격 및 터미널 CLI 직접 제어 가이드
- [프로젝트 파일 구조 스펙 (Project Structure)](./project-structure.md): `docs/ui-boards/` 및 `.screen-designer/` 내 자동 저장 데이터 규격 (`project.json`, `design-system.json`, `pages/`, `config.json` 등)
- [전역 설치 및 특정 프로젝트 대상 실행 설계서 (Global Installation & Target Execution)](./global-install-and-target-execution.md): `npm install -g` 전역 설치, `screen-designer [path]` 특정 프로젝트 지정 실행 및 스마트 실행 모드 설계
- [단축키 & 생산성 가이드 (Shortcuts)](./shortcuts.md): 커맨드 팔레트(`Ctrl+K`), 눈금자/가이드라인, 도구 전환 및 캔버스 조작 단축키
- [에이전트 유지보수 가이드 (AGENTS.md)](../AGENTS.md): 본 프로젝트의 코드베이스 구조, 아키텍처 규칙, 빌드/테스트/검증 워크플로우

---

## 🚀 빠른 시작 (Getting Started)

### 환경 요구 사항
- **Node.js**: v18.0.0 이상 (v20 권장)
- **패키지 매니저**: `npm` v9.0.0 이상
- **지원 OS**: Windows 10/11, Linux (Ubuntu/Debian, WSL2 포함), macOS

### 1. 전역 CLI 설치 & 실행
```bash
# 전역 설치
npm install -g screen-designer

# 프로젝트 초기화
screen-designer init

# 대화형 UI 실행
screen-designer ui

# MCP 서버 실행 (에이전트 연동)
screen-designer serve
```

### 2. 저장소 클론 및 로컬 개발 환경 구축
```bash
# 저장소 클론
git clone https://github.com/jay94ks/screen-designer.git
cd screen-designer

# 의존성 설치
npm install

# 전체 패키지 빌드 (packages/app, packages/mcp-server, packages/cli)
npm run build

# 1. 웹 브라우저 개발 서버 실행 (기본 포트: 5173)
npm run dev

# 2. 일렉트론 데스크톱 앱 실행 (Windows / 데스크톱 환경)
npm run electron:dev

# 3. MCP 개발 서버 실행
npm run dev:mcp
```

---

## 🛠 기술 스택 (Tech Stack)

| 구분 | 기술 스택 | 설명 |
| :--- | :--- | :--- |
| **Frontend Core** | React 19, TypeScript, Vite 6 | 고속 번들링 및 최신 React 가상 DOM 조작 |
| **Desktop App** | Electron 35 | 크로스 플랫폼 데스크톱 네이티브 윈도우 지원 |
| **Styling** | Tailwind CSS 4, Lucide Icons | 유틸리티 퍼스트 스타일링 및 일관된 아이콘 시스템 |
| **Version Control** | es-git (Toss libgit2 binding) | 외부 Git 종속 없는 순수 네이티브 고성능 Git 스테이징, Diff, 커밋 |
| **Cross-Agent MCP** | Model Context Protocol (SDK 1.6) | Claude/Cursor/Codex/Gemini 연동 17종 도메인 기반 제어 도구 |
| **Visual Headless** | Chrome Headless | 에이전트 비주얼 검증을 위한 무헤드리스 실시간 화면 캡처 |
| **Localization** | i18n Core (TypeScript Dictionaries) | 한국어(`ko`), 영어(`en`), 일본어(`ja`) 3개 국어 실시간 전환 |
| **CLI & Automation** | Commander.js, Chalk | 터미널 기반 헤드리스 프로젝트 조작 및 진단 도구 |

---

## 📁 디렉터리 구성 (Monorepo Layout)

```
screen-designer/
├── docs/                             # 프로젝트 문서 및 기본 작업 공간
│   ├── README.md                     # 문서 메인 허브
│   ├── features.md                   # 14개 핵심 기능 상세 명세서
│   ├── project-structure.md          # 프로젝트 저장 구조 스펙
│   ├── shortcuts.md                  # 키보드 단축키 가이드
│   ├── mcp-and-cli-reference.md      # 17개 MCP 도구 및 CLI 상세 규격
│   ├── global-install-and-target-execution.md # 전역 설치 및 타겟 실행 설계서
│   └── ui-boards/                    # 기본 자동 저장 프로젝트 폴더
│       ├── project.json              # 프로젝트 메타데이터 및 에셋 목록
│       ├── design-system.json        # 디자인 시스템 기본 컴포넌트 스타일
│       ├── pages/                    # 페이지별 구조화된 JSON 데이터
│       └── assets/                   # 프로젝트 이미지, 벡터 SVG 프리셋 등
├── packages/
│   ├── app/                          # React 19 + Electron 메인 애플리케이션
│   │   ├── electron/                 # Electron 메인 프로세스 및 네이티브 서비스
│   │   ├── src/                      # React UI 소스코드 (컴포넌트, 상태, 렌더러, i18n)
│   │   └── package.json
│   ├── mcp-server/                   # 17종 도메인 기반 Screen Designer MCP 브리지 서버
│   │   ├── src/                      # tools.ts, index.ts, headless-renderer.ts
│   │   └── package.json
│   └── cli/                          # 전역/로컬 CLI 실행 바이너리 (screen-designer)
│       ├── bin/                      # screen-designer 실행 진입점
│       ├── src/                      # CLI 서브커맨드 구현부
│       └── package.json
├── AGENTS.md                         # 본 프로젝트 유지보수 에이전트 지침서
├── CLAUDE.md                         # Claude Code 에이전트 가이드 (AGENTS.md 참조)
└── package.json                      # 모노레포 루트 설정 (npm workspaces)
```
