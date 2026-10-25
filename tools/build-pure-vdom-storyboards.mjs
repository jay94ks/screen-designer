import fs from 'fs';
import path from 'path';
import { createFullWorkspaceShell } from './vdom-builders/common.mjs';
import {
  createPlayModalRootVNode,
  createDesignSystemModalOverlay,
  createGitDesktopModalOverlay,
  createCommandPaletteModalOverlay,
  createSettingsModalOverlay,
  createShortcutsModalOverlay,
  createFileDropdownOverlay
} from './vdom-builders/modals.mjs';

const DOCS_DIR = '/home/jay94ks/screen-designer/docs/ui-boards';
const PAGES_DIR = path.join(DOCS_DIR, 'pages');
fs.mkdirSync(PAGES_DIR, { recursive: true });

// ============================================================================
// Artboard-Specific Tweaks Schemas and Initial Values
// ============================================================================
const ARTBOARD_TWEAKS = {
  'ab-sd-01-workspace-main': {
    schema: [
      { id: 'themeMode', label: '테마 모드 (Theme)', control: 'buttons', options: ['Light', 'Dark', 'System'], defaultValue: 'Light', description: '에디터 UI 테마 모드' },
      { id: 'showRulers', label: '눈금자 표시 (Rulers)', control: 'boolean', defaultValue: false, description: '캔버스 상/좌 픽셀 눈금자 표시 여부' },
      { id: 'showGrid', label: '배경 그리드 (Grid)', control: 'boolean', defaultValue: true, description: '24px 그리드 가이드 배경 표시' },
      { id: 'showWires', label: '프로토타입 플로우 (Wires)', control: 'boolean', defaultValue: true, description: 'Figma 스타일 화면 간 이벤트 연결선 표시' },
      { id: 'zoomLevel', label: '캔버스 배율 (Zoom %)', control: 'slider', min: 25, max: 200, step: 5, defaultValue: 100, description: '캔버스 줌 배율' },
      { id: 'uiDensity', label: 'UI 밀도 (Density)', control: 'buttons', options: ['Compact', 'Default', 'Comfortable'], defaultValue: 'Default' }
    ],
    values: {
      themeMode: 'Light',
      showRulers: false,
      showGrid: true,
      showWires: true,
      zoomLevel: 100,
      uiDensity: 'Default'
    }
  },
  'ab-sd-02-components-palette': {
    schema: [
      { id: 'compCategory', label: '컴포넌트 카테고리', control: 'buttons', options: ['전체', '기본', '레이아웃', '입력폼', '인터랙션'], defaultValue: '전체' },
      { id: 'viewMode', label: '보기 방식 (View Mode)', control: 'buttons', options: ['Grid', 'List'], defaultValue: 'Grid' },
      { id: 'showDescriptions', label: '설명 텍스트 표시', control: 'boolean', defaultValue: true, description: '각 컴포넌트 하단 설명 요약 노출' },
      { id: 'searchFilter', label: '검색 필터 키워드', control: 'text', defaultValue: '', description: '컴포넌트 이름 및 태그 검색' }
    ],
    values: {
      compCategory: '전체',
      viewMode: 'Grid',
      showDescriptions: true,
      searchFilter: ''
    }
  },
  'ab-sd-03-templates-palette': {
    schema: [
      { id: 'templateCategory', label: '템플릿 분야', control: 'buttons', options: ['전체', '핀테크', '대시보드', '히어로', '인증'], defaultValue: '핀테크' },
      { id: 'targetDevice', label: '대상 기기 규격', control: 'buttons', options: ['반응형', 'Desktop', 'Mobile'], defaultValue: '반응형' },
      { id: 'autoInsertChildren', label: '자식 노드 자동 전개', control: 'boolean', defaultValue: true, description: '템플릿 추가 시 하위 VNode 구조 자동 생성' }
    ],
    values: {
      templateCategory: '핀테크',
      targetDevice: '반응형',
      autoInsertChildren: true
    }
  },
  'ab-sd-04-inspector-code': {
    schema: [
      { id: 'codeLanguage', label: '생성 코드 언어', control: 'buttons', options: ['React TSX', 'HTML/CSS', 'JSON VDOM'], defaultValue: 'React TSX' },
      { id: 'includeTailwind', label: 'Tailwind 유틸리티 포함', control: 'boolean', defaultValue: true, description: 'Tailwind 클래스 매핑 적용' },
      { id: 'minifyCode', label: '코드 압축 (Minify)', control: 'boolean', defaultValue: false, description: '출력 코드 한 줄 압축 여부' },
      { id: 'fontSize', label: '에디터 폰트 크기', control: 'slider', min: 10, max: 18, step: 1, defaultValue: 12, description: '코드 에디터 글자 크기 (px)' }
    ],
    values: {
      codeLanguage: 'React TSX',
      includeTailwind: true,
      minifyCode: false,
      fontSize: 12
    }
  },
  'ab-sd-05-modal-play': {
    schema: [
      { id: 'playResolution', label: '재생 뷰포트 해상도', control: 'select', options: ['반응형 (자유 조절)', 'Desktop FHD (1920×1080)', 'Desktop HD (1440×900)', 'Tablet (768×1024)', 'Mobile iPhone (390×844)'], defaultValue: 'Desktop HD (1440×900)' },
      { id: 'responsiveDragEnabled', label: '반응형 드래그 조절기', control: 'boolean', defaultValue: true, description: '외곽 드래그 핸들로 뷰포트 크기 변경' },
      { id: 'showTouchCursor', label: '터치 커서 효과', control: 'boolean', defaultValue: true, description: '모바일 시뮬레이션용 원형 터치 커서' },
      { id: 'playbackSpeed', label: '전환 애니메이션 배속', control: 'buttons', options: ['0.5x', '1x', '1.5x'], defaultValue: '1x' }
    ],
    values: {
      playResolution: 'Desktop HD (1440×900)',
      responsiveDragEnabled: true,
      showTouchCursor: true,
      playbackSpeed: '1x'
    }
  },
  'ab-sd-06-inspector-events': {
    schema: [
      { id: 'eventTriggerFilter', label: '트리거 필터', control: 'buttons', options: ['전체', '클릭(onClick)', '호버(onHover)', '단축키(Key)'], defaultValue: '전체' },
      { id: 'actionType', label: '액션 유형 필터', control: 'select', options: ['전체 액션', 'navigate (화면 이동)', 'change_tweak (트윅 변경)', 'open_modal (모달 열기)'], defaultValue: '전체 액션' },
      { id: 'highlightWires', label: '선택 노드 연결선 강조', control: 'boolean', defaultValue: true, description: '클릭 시 연결된 프로토타입 와이어 강조' },
      { id: 'showToastOnTrigger', label: '실행 토스트 알림', control: 'boolean', defaultValue: true, description: 'Play 모드 이벤트 발생 시 토스트 표시' }
    ],
    values: {
      eventTriggerFilter: '전체',
      actionType: '전체 액션',
      highlightWires: true,
      showToastOnTrigger: true
    }
  },
  'ab-sd-07-canvas-rulers': {
    schema: [
      { id: 'rulerUnit', label: '눈금자 측정 단위', control: 'buttons', options: ['PX', 'REM', 'PT'], defaultValue: 'PX' },
      { id: 'snapToGuides', label: '가이드라인 자석 스냅', control: 'boolean', defaultValue: true, description: '오브젝트 이동 시 가이드라인에 흡착' },
      { id: 'snapThreshold', label: '스냅 감도 임계값', control: 'slider', min: 2, max: 20, step: 1, defaultValue: 8, description: '가이드 스냅 반응 거리 (px)' },
      { id: 'showMouseCoordinates', label: '실시간 마우스 좌표 표시', control: 'boolean', defaultValue: true, description: '마우스 커서 위치 좌표 툴팁 표시' }
    ],
    values: {
      rulerUnit: 'PX',
      snapToGuides: true,
      snapThreshold: 8,
      showMouseCoordinates: true
    }
  },
  'ab-sd-08-inspector-tweaks': {
    schema: [
      { id: 'theme', label: '테마 모드 (Theme)', control: 'buttons', options: ['dark', 'light', 'cyber'], defaultValue: 'dark' },
      { id: 'currency', label: '통화 표시 단위', control: 'select', options: ['KRW (₩)', 'USD ($)', 'EUR (€)', 'JPY (¥)'], defaultValue: 'KRW (₩)' },
      { id: 'showAiBadge', label: 'AI 진단 뱃지 표시', control: 'boolean', defaultValue: true, description: '금융 포트폴리오 AI 분석 뱃지' },
      { id: 'balanceAmount', label: '시뮬레이션 잔고 (KRW)', control: 'slider', min: 1000000, max: 50000000, step: 1000000, defaultValue: 12480000, description: '실시간 잔고 카드 수치' },
      { id: 'accentColor', label: '브랜드 강조 컬러', control: 'color', defaultValue: '#4f46e5', description: 'CTA 및 주요 수치 하이라이트 색상' }
    ],
    values: {
      theme: 'dark',
      currency: 'KRW (₩)',
      showAiBadge: true,
      balanceAmount: 12480000,
      accentColor: '#4f46e5'
    }
  },
  'ab-sd-09-modal-design-system': {
    schema: [
      { id: 'tokenCategory', label: '토큰 분류', control: 'buttons', options: ['색상(Colors)', '타이포그래피', '곡률(Radius)', '그림자'], defaultValue: '색상(Colors)' },
      { id: 'primaryColor', label: 'Primary 브랜드 컬러', control: 'color', defaultValue: '#4f46e5', description: '전역 주요 액션 색상' },
      { id: 'baseRadius', label: '기본 모서리 곡률 (Radius)', control: 'slider', min: 0, max: 24, step: 2, defaultValue: 8, description: '컴포넌트 기본 border-radius (px)' },
      { id: 'fontFamily', label: '기본 서체 패밀리', control: 'select', options: ['Pretendard', 'Inter', 'Noto Sans KR', 'SF Pro'], defaultValue: 'Pretendard' },
      { id: 'applyToAllComponents', label: '전체 컴포넌트 자동 동기화', control: 'boolean', defaultValue: true, description: '45종 컴포넌트 전체에 즉시 토큰 전파' }
    ],
    values: {
      tokenCategory: '색상(Colors)',
      primaryColor: '#4f46e5',
      baseRadius: 8,
      fontFamily: 'Pretendard',
      applyToAllComponents: true
    }
  },
  'ab-sd-10-modal-git-desktop': {
    schema: [
      { id: 'currentBranch', label: '작업 브랜치 (Branch)', control: 'buttons', options: ['main', 'feat/vdom-pure', 'design/tokens'], defaultValue: 'feat/vdom-pure' },
      { id: 'diffViewMode', label: 'Diff 표시 모드', control: 'buttons', options: ['Split (좌우)', 'Unified (통합)'], defaultValue: 'Split (좌우)' },
      { id: 'autoFetchInterval', label: '원격 자동 동기화', control: 'select', options: ['수동 (Manual)', '1분마다', '5분마다', '15분마다'], defaultValue: '5분마다' },
      { id: 'showUntrackedFiles', label: '신규 파일 목록 포함', control: 'boolean', defaultValue: true, description: 'Untracked 새 파일 목록 포함 표시' }
    ],
    values: {
      currentBranch: 'feat/vdom-pure',
      diffViewMode: 'Split (좌우)',
      autoFetchInterval: '5분마다',
      showUntrackedFiles: true
    }
  },
  'ab-sd-11-modal-command-palette': {
    schema: [
      { id: 'paletteCategory', label: '검색 카테고리', control: 'buttons', options: ['전체', '명령어', '컴포넌트', '페이지', '설정'], defaultValue: '전체' },
      { id: 'maxDisplayCount', label: '최대 표시 결과 수', control: 'slider', min: 5, max: 20, step: 1, defaultValue: 8, description: '스포트라이트 추천 목록 개수' },
      { id: 'showShortcutsBadge', label: '단축키 뱃지 표시', control: 'boolean', defaultValue: true, description: '명령어 우측 단축키 뱃지 표시' },
      { id: 'fuzzyMatchSens', label: '퍼지 검색 감도', control: 'buttons', options: ['보통 (Normal)', '유연함 (Fuzzy)', '정확함 (Exact)'], defaultValue: '유연함 (Fuzzy)' }
    ],
    values: {
      paletteCategory: '전체',
      maxDisplayCount: 8,
      showShortcutsBadge: true,
      fuzzyMatchSens: '유연함 (Fuzzy)'
    }
  },
  'ab-sd-12-modal-settings': {
    schema: [
      { id: 'prefActiveTab', label: '설정 탭 분류', control: 'buttons', options: ['컴포넌트 스타일', '캔버스 환경', '단축키'], defaultValue: '컴포넌트 스타일' },
      { id: 'hardwareAcceleration', label: 'GPU 하드웨어 가속', control: 'boolean', defaultValue: true, description: '대형 캔버스 렌더링 성능 최적화' },
      { id: 'autoSaveIntervalSec', label: '자동 저장 주기 (초)', control: 'slider', min: 10, max: 120, step: 10, defaultValue: 30, description: '변경사항 자동 저장 인터벌' },
      { id: 'canvasBgColor', label: '캔버스 배경 색상', control: 'color', defaultValue: '#0f172a', description: '캔버스 기본 바탕색' }
    ],
    values: {
      prefActiveTab: '컴포넌트 스타일',
      hardwareAcceleration: true,
      autoSaveIntervalSec: 30,
      canvasBgColor: '#0f172a'
    }
  },
  'ab-sd-13-modal-shortcuts': {
    schema: [
      { id: 'shortcutGroup', label: '단축키 그룹 필터', control: 'buttons', options: ['전체', '도구 (Tools)', '캔버스 제어', '편집'], defaultValue: '전체' },
      { id: 'osKeySymbols', label: 'OS 키보드 표기법', control: 'buttons', options: ['Windows/Linux (Ctrl)', 'macOS (⌘ Cmd)'], defaultValue: 'Windows/Linux (Ctrl)' },
      { id: 'showTooltipsOnHover', label: '버튼 호버 시 단축키 툴팁', control: 'boolean', defaultValue: true, description: '툴바 호버 시 단축키 안내 팝업' }
    ],
    values: {
      shortcutGroup: '전체',
      osKeySymbols: 'Windows/Linux (Ctrl)',
      showTooltipsOnHover: true
    }
  },
  'ab-sd-14-header-menu-file': {
    schema: [
      { id: 'recentFilesCount', label: '최근 파일 노출 개수', control: 'slider', min: 3, max: 15, step: 1, defaultValue: 5, description: '파일 메뉴 하단 최근 열어본 파일 수' },
      { id: 'showMenuIcons', label: '메뉴 아이콘 표시', control: 'boolean', defaultValue: true, description: '드롭다운 항목 좌측 아이콘 표시 여부' },
      { id: 'menuStyleTheme', label: '메뉴 스타일 테마', control: 'buttons', options: ['Clean White', 'Glassmorphism', 'Dark'], defaultValue: 'Clean White' }
    ],
    values: {
      recentFilesCount: 5,
      showMenuIcons: true,
      menuStyleTheme: 'Clean White'
    }
  }
};

function makeArtboard(id, title, rootNode, x = 0, y = 0) {
  const tweakData = ARTBOARD_TWEAKS[id] || {
    schema: [
      { id: 'theme', label: 'Theme Mode', control: 'buttons', options: ['dark', 'light'], defaultValue: 'dark' },
      { id: 'currency', label: 'Currency', control: 'select', options: ['KRW (₩)', 'USD ($)'], defaultValue: 'KRW (₩)' },
      { id: 'showAiBadge', label: 'Show AI Badge', control: 'boolean', defaultValue: true }
    ],
    values: {
      theme: 'dark',
      currency: 'KRW (₩)',
      showAiBadge: true
    }
  };

  return {
    id,
    title,
    name: title,
    viewport: 'desktop',
    width: 1600,
    height: 1000,
    x,
    y,
    backgroundColor: '#f1f5f9',
    rootNode,
    tweaksSchema: tweakData.schema,
    tweakValues: tweakData.values
  };
}

// ============================================================================
// Page 1: 핵심 작업 공간 & 인스펙터 (4 Artboards)
// ============================================================================
const page1Artboards = [
  makeArtboard(
    'ab-sd-01-workspace-main',
    '1. Screen Designer 3분할 메인 작업 공간 (순수 VDOM)',
    createFullWorkspaceShell('ab1', {
      pageTitle: '1. 핵심 작업 공간 & 인스펙터',
      leftTab: 'layers',
      rightTab: 'properties',
      rightMode: 'selected'
    }),
    0,
    0
  ),
  makeArtboard(
    'ab-sd-02-components-palette',
    '2. 좌측 사이드바: 20종 컴포넌트 팔레트 (순수 VDOM)',
    createFullWorkspaceShell('ab2', {
      pageTitle: '1. 핵심 작업 공간 & 인스펙터',
      leftTab: 'components',
      rightTab: 'properties',
      rightMode: 'empty'
    }),
    1648,
    0
  ),
  makeArtboard(
    'ab-sd-03-templates-palette',
    '3. 좌측 사이드바: 반응형 섹션 템플릿 (순수 VDOM)',
    createFullWorkspaceShell('ab3', {
      pageTitle: '1. 핵심 작업 공간 & 인스펙터',
      leftTab: 'templates',
      rightTab: 'properties',
      rightMode: 'empty'
    }),
    3296,
    0
  ),
  makeArtboard(
    'ab-sd-04-inspector-code',
    '4. 우측 인스펙터: 실시간 React TSX 코드 생성기 (순수 VDOM)',
    createFullWorkspaceShell('ab4', {
      pageTitle: '1. 핵심 작업 공간 & 인스펙터',
      leftTab: 'layers',
      rightTab: 'code'
    }),
    4944,
    0
  )
];

// ============================================================================
// Page 2: 프로토타이핑 & 동적 트윅 (4 Artboards)
// ============================================================================
const page2Artboards = [
  makeArtboard(
    'ab-sd-05-modal-play',
    '5. 디바이스 프레임 플레이 모드 (순수 VDOM)',
    createPlayModalRootVNode('ab5'),
    0,
    0
  ),
  makeArtboard(
    'ab-sd-06-inspector-events',
    '6. 우측 인스펙터: 프로토타입 이벤트 & 플로우 (순수 VDOM)',
    createFullWorkspaceShell('ab6', {
      pageTitle: '2. 프로토타이핑 & 동적 트윅',
      leftTab: 'layers',
      rightTab: 'events'
    }),
    1648,
    0
  ),
  makeArtboard(
    'ab-sd-07-canvas-rulers',
    '7. 정밀 픽셀 눈금자 & 가이드라인 시스템 (순수 VDOM)',
    createFullWorkspaceShell('ab7', {
      pageTitle: '2. 프로토타이핑 & 동적 트윅',
      leftTab: 'layers',
      rightTab: 'properties',
      rightMode: 'empty',
      showRulers: true
    }),
    3296,
    0
  ),
  makeArtboard(
    'ab-sd-08-inspector-tweaks',
    '8. 우측 인스펙터: 동적 트윅 변수 편집기 (순수 VDOM)',
    createFullWorkspaceShell('ab8', {
      pageTitle: '2. 프로토타이핑 & 동적 트윅',
      leftTab: 'layers',
      rightTab: 'tweaks'
    }),
    4944,
    0
  )
];

// ============================================================================
// Page 3: 디자인 시스템 & Git 데스크톱 (2 Artboards)
// ============================================================================
const page3Artboards = [
  makeArtboard(
    'ab-sd-09-modal-design-system',
    '9. 글로벌 디자인 시스템 스튜디오 (순수 VDOM)',
    createFullWorkspaceShell('ab9', {
      pageTitle: '3. 디자인 시스템 & Git 데스크톱',
      leftTab: 'layers',
      rightTab: 'properties',
      rightMode: 'empty',
      overlayNodes: [createDesignSystemModalOverlay('ab9-ds')]
    }),
    0,
    0
  ),
  makeArtboard(
    'ab-sd-10-modal-git-desktop',
    '10. 내장 Git 데스크톱 & Diff 뷰어 (순수 VDOM)',
    createFullWorkspaceShell('ab10', {
      pageTitle: '3. 디자인 시스템 & Git 데스크톱',
      leftTab: 'layers',
      rightTab: 'properties',
      rightMode: 'empty',
      overlayNodes: [createGitDesktopModalOverlay('ab10-git')]
    }),
    1648,
    0
  )
];

// ============================================================================
// Page 4: 커맨드 팔레트 & 환경설정 (4 Artboards)
// ============================================================================
const page4Artboards = [
  makeArtboard(
    'ab-sd-11-modal-command-palette',
    '11. 스포트라이트 커맨드 팔레트 (Ctrl+K) (순수 VDOM)',
    createFullWorkspaceShell('ab11', {
      pageTitle: '4. 커맨드 팔레트 & 환경설정',
      leftTab: 'layers',
      rightTab: 'properties',
      rightMode: 'empty',
      overlayNodes: [createCommandPaletteModalOverlay('ab11-cmd')]
    }),
    0,
    0
  ),
  makeArtboard(
    'ab-sd-12-modal-settings',
    '12. 환경설정 및 기본 컴포넌트 스타일 관리 (순수 VDOM)',
    createFullWorkspaceShell('ab12', {
      pageTitle: '4. 커맨드 팔레트 & 환경설정',
      leftTab: 'layers',
      rightTab: 'properties',
      rightMode: 'empty',
      overlayNodes: [createSettingsModalOverlay('ab12-set')]
    }),
    1648,
    0
  ),
  makeArtboard(
    'ab-sd-13-modal-shortcuts',
    '13. 키보드 단축키 안내 다이얼로그 (순수 VDOM)',
    createFullWorkspaceShell('ab13', {
      pageTitle: '4. 커맨드 팔레트 & 환경설정',
      leftTab: 'layers',
      rightTab: 'properties',
      rightMode: 'empty',
      overlayNodes: [createShortcutsModalOverlay('ab13-sc')]
    }),
    3296,
    0
  ),
  makeArtboard(
    'ab-sd-14-header-menu-file',
    '14. 데스크톱 헤더 메뉴바 & 파일 드롭다운 메뉴 (순수 VDOM)',
    createFullWorkspaceShell('ab14', {
      pageTitle: '4. 커맨드 팔레트 & 환경설정',
      activeMenu: 'file',
      leftTab: 'layers',
      rightTab: 'properties',
      rightMode: 'empty',
      overlayNodes: [createFileDropdownOverlay('ab14-file')]
    }),
    4944,
    0
  )
];

const pagesData = [
  { id: 'page-1', number: 1, name: '1. 핵심 작업 공간 & 인스펙터', artboards: page1Artboards },
  { id: 'page-2', number: 2, name: '2. 프로토타이핑 & 동적 트윅', artboards: page2Artboards },
  { id: 'page-3', number: 3, name: '3. 디자인 시스템 & Git 데스크톱', artboards: page3Artboards },
  { id: 'page-4', number: 4, name: '4. 커맨드 팔레트 & 환경설정', artboards: page4Artboards }
];

for (const p of pagesData) {
  const filePath = path.join(PAGES_DIR, `${p.number}.json`);
  fs.writeFileSync(filePath, JSON.stringify(p, null, 2), 'utf-8');
  console.log(`✓ Wrote ${filePath} (${p.artboards.length} pure VDOM artboards)`);
}

const projectMeta = {
  id: 'proj-screen-designer-self-ui',
  title: 'Screen Designer - Visual Storyboard Canvas',
  name: 'Screen Designer - Visual Storyboard Canvas',
  version: '2.0.0',
  activePageId: 'page-1',
  updatedAt: new Date().toISOString(),
  pages: pagesData.map((p) => ({
    id: p.id,
    number: p.number,
    name: p.name,
    file: `pages/${p.number}.json`,
    artboardCount: p.artboards.length
  }))
};

fs.writeFileSync(path.join(DOCS_DIR, 'project.json'), JSON.stringify(projectMeta, null, 2), 'utf-8');
console.log('✓ Wrote project.json successfully.');
