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

function makeArtboard(id, title, rootNode, x = 0, y = 0) {
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
    tweaksSchema: [
      { id: 'theme', name: 'Theme Mode', type: 'segment', options: ['dark', 'light', 'cyber'], defaultValue: 'dark' },
      { id: 'currency', name: 'Display Currency', type: 'select', options: ['KRW (₩)', 'USD ($)'], defaultValue: 'KRW (₩)' },
      { id: 'showAiBadge', name: 'Show AI Badge', type: 'boolean', defaultValue: true }
    ],
    tweakValues: {
      theme: 'dark',
      currency: 'KRW (₩)',
      showAiBadge: true
    }
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
