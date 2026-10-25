# Screen Designer (화면 기획 & UI 스토리보드 디자이너)

> **React 19 + TypeScript + Electron** 기반의 크로스 플랫폼 화면 설계 및 프로토타이핑 도구입니다.  
> 기획자, UI 디자이너, 프론트엔드 개발자가 가상 DOM(VDOM) 기반으로 모바일 및 웹 화면을 시각적으로 설계하고, 피그마 스타일 프로토타이핑, 디자인 시스템 관리, React/Tailwind 코드 자동 추출까지 원스톱으로 수행할 수 있습니다.

---

## 📚 문서 목록 (Documentation)

- [기능 명세서 (Features)](./features.md): 현재까지 구현된 모든 기능(캔버스, 프로토타이핑, 디자인 시스템, Git 연동 등)의 상세 안내
- [MCP 툴 & CLI 제어 레퍼런스 (MCP & CLI Reference)](./mcp-and-cli-reference.md): 재설계된 13종 MCP 도구 규격 및 터미널 CLI를 통한 직접 제어 가이드
- [프로젝트 파일 구조 스펙 (Project Structure)](./project-structure.md): `docs/ui-boards/` 내 자동 저장 데이터 규격 (`project.json`, `design-system.json`, `pages/`, `assets/`)
- [전역 설치 및 특정 프로젝트 대상 실행 설계서 (Global Installation & Target Execution)](./global-install-and-target-execution.md): `npm install -g` 전역 설치, `screen-designer [path]` 특정 프로젝트 지정 실행 및 스마트 실행 모드 설계
- [단축키 & 생산성 가이드 (Shortcuts)](./shortcuts.md): 커맨드 팔레트(`Ctrl+K`), 도구 전환 및 캔버스 조작 단축키

---

## 🚀 빠른 시작 (Getting Started)

### 환경 요구 사항
- **Node.js**: v18.0.0 이상
- **패키지 매니저**: `npm` v9.0.0 이상
- **지원 OS**: Windows 10/11, Linux (WSL2 포함), macOS

### 설치 및 실행
```bash
# 저장소 클론
git clone https://github.com/jay94ks/screen-designer.git
cd screen-designer

# 의존성 설치
npm install

# 1. 웹 브라우저 개발 서버 실행 (기본 포트: 5173)
cd packages/app
npm run dev

# 2. 일렉트론 데스크톱 앱 실행 (Windows / 데스크톱 환경)
npm run electron:dev

# 3. 프로덕션 빌드
npm run build
```

---

## 🛠 기술 스택 (Tech Stack)

| 구분 | 기술 스택 | 설명 |
| :--- | :--- | :--- |
| **Frontend Core** | React 19, TypeScript, Vite 6 | 고속 번들링 및 최신 React 가상 DOM 조작 |
| **Desktop App** | Electron 35 | 크로스 플랫폼 데스크톱 네이티브 윈도우 지원 |
| **Styling** | Tailwind CSS 4, Lucide Icons | 유틸리티 퍼스트 스타일링 및 일관된 아이콘 시스템 |
| **Version Control** | es-git (Toss libgit2 binding) | 네이티브 고성능 Git 스테이징, Diff, 커밋 연동 |
| **Cross-Agent MCP** | Model Context Protocol (SDK 1.6) | Claude/Cursor/Codex/Gemini 연동 13종 시각적 제어 도구 |
| **Canvas & Graphic** | HTML5 Canvas, SVG Bezier Curve | 아트보드 와이어 연결선 및 이미지/코드 추출 |

---

## 📁 디렉터리 구성

```
screen-designer/
├── docs/                     # 프로젝트 문서 및 기본 작업 공간
│   ├── README.md             # 문서 메인 허브
│   ├── features.md           # 기능 상세 설명서
│   ├── project-structure.md  # 프로젝트 저장 구조 스펙
│   ├── shortcuts.md          # 키보드 단축키 가이드
│   └── ui-boards/            # 기본 자동 저장 프로젝트 폴더
│       ├── project.json      # 프로젝트 메타데이터 및 에셋 목록
│       ├── design-system.json# 디자인 시스템 기본 컴포넌트 스타일
│       ├── pages/            # 페이지별 구조화된 JSON 데이터
│       └── assets/           # 프로젝트 이미지, 벡터 SVG 프리셋 등
├── packages/
│   ├── app/                  # React + Electron 메인 애플리케이션
│   │   ├── electron/         # Electron 메인 프로세스 및 네이티브 서비스
│   │   ├── src/              # React UI 소스코드 (컴포넌트, 상태, 렌더러)
│   │   └── package.json
│   └── mcp-server/           # Screen Designer 전용 MCP 브리지 서버
└── package.json              # 모노레포 루트 설정
```
