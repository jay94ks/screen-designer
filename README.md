# 🎨 Screen Designer

> **Universal Cross-Agent Visual Storyboard Canvas & MCP Tool**  
> Claude Code, OpenAI Codex/GPT, Google Gemini(Antigravity) 모두를 위한 실시간 UI 디자인 & 스토리보드 프로토타이핑 도구

---

## 🌟 왜 Screen Designer인가?

1. **초고속 핑퐁 (Zero-Delay Live Refresh)**:  
   수십 초씩 걸리는 정적 생성 도구(Stitch 등)와 달리, 에이전트가 코드를 전달하는 즉시 0.1초 만에 캔버스에 인터랙티브 UI가 렌더링됩니다.
2. **다중 아트보드 스토리보드 (Multi-Artboard Flow)**:  
   온보딩 → 메인 대시보드 → 상세 모달로 이어지는 유저 플로우를 나란히 배치해 시각적으로 한눈에 기획할 수 있습니다.
3. **양방향 인스펙터 & 실시간 슬라이더 (Inspector & Dynamic Sliders)**:  
   화면 속 요소를 마우스로 클릭하면 스타일 정보가 캡처되고, 패딩/곡률(Radius)/색상 슬라이더를 마우스로 조작해 실시간 튜닝이 가능합니다.
4. **완벽한 멀티 AI 에이전트 호환**:  
   MCP(Model Context Protocol) 표준을 준수하여 **Gemini**, **GPT/Codex**, **Claude Code** 어느 환경에서든 명령어 한 줄로 즉시 도입할 수 있습니다.

---

## 🚀 빠른 시작 (어느 프로젝트든 도입하기)

프로젝트 루트 디렉토리에서 아래 명령어를 실행하면 끝납니다:

```bash
npx screen-designer init
```

실행 즉시 다음 파일들이 자동 구성됩니다:
- `AGENTS.md` (OpenAI Codex, GPT, Gemini 공통 에이전트 지침서)
- `CLAUDE.md` (Anthropic Claude Code / Desktop 지침서)
- `.cursorrules` (Cursor IDE 에이전트 지침서)
- `.screen-designer.json` (프로젝트 연동 설정 파일)

---

## 💬 에이전트별 사용 프롬프트 예시

### 1. Google Gemini (Antigravity)
```text
"Gemini야 이 프로젝트의 스토리보드 기획 시작해줘"
"회원가입에서 결제 완료까지 3단계 모바일 화면을 캔버스에 띄워줘"
```

### 2. OpenAI GPT / Codex
```text
"GPT야 우리 프로젝트에 screen-designer 도입하자"
"스토리보드 캔버스에 다크모드 대시보드 화면 그려줘"
```

### 3. Anthropic Claude (Claude Code / Desktop)
```text
"Render 3 onboarding artboards for our app on the Screen Designer canvas"
"Export the approved modal component directly into src/components"
```

---

## 🔌 제공되는 MCP Tools

| Tool 이름 | 설명 |
| :--- | :--- |
| `storyboard_init` | 프로젝트 워크스페이스 경로를 등록하고 캔버스 연결 준비 |
| `storyboard_render` | 다중 아트보드(화면 흐름)를 캔버스에 실시간 렌더링 |
| `storyboard_update` | 특정 화면/컴포넌트 코드를 실시간 갱신 (0-Delay) |
| `storyboard_get_selection` | 사용자가 캔버스에서 클릭한 엘리먼트 및 슬라이더 조절값 획득 |
| `storyboard_set_tokens` | 전역 디자인 시스템 토큰(브랜드 색상, 폰트 등) 일괄 적용 |
| `storyboard_export` | 최종 승인된 컴포넌트 코드를 실제 프로젝트 파일(`src/components/...`)로 저장 |

---

## 💻 로컬 개발 및 실행

```bash
# 의존성 설치
npm install

# 1. MCP 서버 빌드 & 실행
npm run dev:mcp

# 2. Electron 캔버스 데스크톱 앱 실행
npm run dev:app
```
