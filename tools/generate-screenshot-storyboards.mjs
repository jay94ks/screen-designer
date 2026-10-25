import fs from 'fs';
import path from 'path';

const DOCS_DIR = '/home/jay94ks/screen-designer/docs/ui-boards';
const ASSETS_DIR = path.join(DOCS_DIR, 'assets/screenshots');

function getBase64DataUrl(fileName) {
  const filePath = path.join(ASSETS_DIR, fileName);
  if (!fs.existsSync(filePath)) {
    throw new Error(`Screenshot not found: ${filePath}`);
  }
  const buf = fs.readFileSync(filePath);
  return `data:image/png;base64,${buf.toString('base64')}`;
}

function createImageArtboard(artboardId, name, fileName, width = 1600, height = 1000) {
  const dataUrl = getBase64DataUrl(fileName);
  const src = `assets/screenshots/${fileName}`;

  return {
    id: artboardId,
    name: name,
    width: width,
    height: height,
    backgroundColor: '#0f172a',
    rootNode: {
      id: `root-${artboardId}`,
      type: 'frame',
      name: `${name} 프레임`,
      style: {
        width: '100%',
        height: '100%',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: '#0f172a',
        borderRadius: '8px',
        overflow: 'hidden'
      },
      children: [
        {
          id: `img-${artboardId}`,
          type: 'image',
          name: `${name} 실제 스크린샷`,
          props: {
            src: src,
            dataUrl: dataUrl,
            alt: name
          },
          style: {
            width: '100%',
            height: '100%',
            objectFit: 'contain'
          }
        }
      ]
    }
  };
}

// 1. Page 1: 핵심 작업 환경 (Core Workspace & Inspectors)
const page1Artboards = [
  createImageArtboard(
    'ab-sd-workspace-main',
    '1. Screen Designer 3분할 작업 공간 (실제 UI)',
    '01-workspace-main.png'
  ),
  createImageArtboard(
    'ab-sd-components-palette',
    '2. 좌측 사이드바: 20종 컴포넌트 팔레트 (실제 UI)',
    '02-components-palette.png'
  ),
  createImageArtboard(
    'ab-sd-templates-palette',
    '3. 좌측 사이드바: 반응형 섹션 템플릿 (실제 UI)',
    '03-templates-palette.png'
  ),
  createImageArtboard(
    'ab-sd-inspector-code',
    '4. 우측 인스펙터: 실시간 React TSX 코드 생성기 (실제 UI)',
    '05-inspector-code.png'
  )
];

// 2. Page 2: 인터랙션 & 프로토타이핑 (Prototyping & Flow)
const page2Artboards = [
  createImageArtboard(
    'ab-sd-modal-play',
    '5. 디바이스 프레임 플레이 모드 (실제 UI)',
    '07-modal-play.png'
  ),
  createImageArtboard(
    'ab-sd-inspector-events',
    '6. 우측 인스펙터: 프로토타입 이벤트 & 네비게이션 (실제 UI)',
    '04-inspector-events.png'
  ),
  createImageArtboard(
    'ab-sd-canvas-rulers',
    '7. 정밀 픽셀 눈금자 & 가이드라인 시스템 (실제 UI)',
    '14-canvas-rulers.png'
  ),
  createImageArtboard(
    'ab-sd-inspector-tweaks',
    '8. 우측 인스펙터: 동적 트윅 변수 편집기 (실제 UI)',
    '06-inspector-tweaks.png'
  )
];

// 3. Page 3: 디자인 시스템 & 버전 관리 (Design System & Git)
const page3Artboards = [
  createImageArtboard(
    'ab-sd-design-system-studio',
    '9. 글로벌 디자인 시스템 스튜디오 (실제 UI)',
    '08-modal-design-system.png'
  ),
  createImageArtboard(
    'ab-sd-git-desktop-modal',
    '10. 내장 Git 데스크톱 & Diff 뷰어 (실제 UI)',
    '09-modal-git-desktop.png'
  )
];

// 4. Page 4: 스포트라이트 검색 & 환경설정 (Search & Settings)
const page4Artboards = [
  createImageArtboard(
    'ab-sd-modal-command-palette',
    '11. 스포트라이트 커맨드 팔레트 (Ctrl+K) (실제 UI)',
    '10-modal-command-palette.png'
  ),
  createImageArtboard(
    'ab-sd-modal-settings',
    '12. 환경설정 및 저장소 경로 관리 다이얼로그 (실제 UI)',
    '11-modal-settings.png'
  ),
  createImageArtboard(
    'ab-sd-modal-shortcuts',
    '13. 키보드 단축키 안내 다이얼로그 (실제 UI)',
    '12-modal-shortcuts.png'
  ),
  createImageArtboard(
    'ab-sd-header-menu-file',
    '14. 데스크톱 헤더 메뉴바 & 파일 드롭다운 메뉴 (실제 UI)',
    '13-header-menu-file.png'
  )
];

// Write Page JSONs
function wrapPage(id, name, number, artboards) {
  return {
    id,
    name,
    number,
    version: '2.0.0',
    updatedAt: new Date().toISOString(),
    artboards
  };
}

fs.writeFileSync(path.join(DOCS_DIR, 'pages/1.json'), JSON.stringify(wrapPage('page-1', '1. 핵심 작업 공간 & 인스펙터', 1, page1Artboards), null, 2), 'utf-8');
console.log('✓ Wrote docs/ui-boards/pages/1.json (4 artboards)');

fs.writeFileSync(path.join(DOCS_DIR, 'pages/2.json'), JSON.stringify(wrapPage('page-2', '2. 프로토타이핑 & 동적 트윅', 2, page2Artboards), null, 2), 'utf-8');
console.log('✓ Wrote docs/ui-boards/pages/2.json (4 artboards)');

fs.writeFileSync(path.join(DOCS_DIR, 'pages/3.json'), JSON.stringify(wrapPage('page-3', '3. 디자인 시스템 & Git 데스크톱', 3, page3Artboards), null, 2), 'utf-8');
console.log('✓ Wrote docs/ui-boards/pages/3.json (2 artboards)');

fs.writeFileSync(path.join(DOCS_DIR, 'pages/4.json'), JSON.stringify(wrapPage('page-4', '4. 커맨드 팔레트 & 환경설정', 4, page4Artboards), null, 2), 'utf-8');
console.log('✓ Wrote docs/ui-boards/pages/4.json (4 artboards)');

// Update project.json
const projectMeta = {
  version: '2.0.0',
  title: 'Screen Designer - Official UI Storyboard (Live Captures)',
  description: 'Screen Designer 도구 자체의 실제 구동 화면 스크린샷으로 100% 동일하게 구성된 공식 UI 시안 및 스토리보드',
  activePageId: 'page-1',
  pages: [
    {
      id: 'page-1',
      name: '1. 핵심 작업 공간 & 인스펙터',
      artboardCount: page1Artboards.length
    },
    {
      id: 'page-2',
      name: '2. 프로토타이핑 & 동적 트윅',
      artboardCount: page2Artboards.length
    },
    {
      id: 'page-3',
      name: '3. 디자인 시스템 & Git 데스크톱',
      artboardCount: page3Artboards.length
    },
    {
      id: 'page-4',
      name: '4. 커맨드 팔레트 & 환경설정',
      artboardCount: page4Artboards.length
    }
  ],
  updatedAt: new Date().toISOString()
};

fs.writeFileSync(path.join(DOCS_DIR, 'project.json'), JSON.stringify(projectMeta, null, 2), 'utf-8');
console.log('✓ Updated docs/ui-boards/project.json');
