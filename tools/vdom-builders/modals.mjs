import { vnode } from './common.mjs';

// Helper: Full-screen Dimmed Backdrop Overlay (z-100)
export function wrapInBackdrop(prefix, modalNode, zIndex = 100) {
  return vnode(`${prefix}-backdrop`, 'container', 'Modal Dimmed Backdrop Overlay', {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(15, 23, 42, 0.52)',
    backdropFilter: 'blur(3px)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex
  }, {}, [modalNode]);
}

// 1. Play Mode Simulator Root (Artboard 5 - Mirrors 07-modal-play.png)
export function createPlayModalRootVNode(prefix = 'play') {
  // Top Floating Control Bar
  const topBar = vnode(`${prefix}-topbar`, 'header', 'Play Simulator Control Bar', {
    height: 44,
    paddingLeft: 16,
    paddingRight: 16,
    borderRadius: 9999,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#1e293b',
    borderStyle: 'solid',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12
  }, {}, [
    // Green Status Dot + Counter
    vnode(`${prefix}-tb-l`, 'container', 'Status & Counter', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }, {}, [
      vnode(`${prefix}-dot`, 'box', 'Green Dot', { width: 8, height: 8, borderRadius: 9999, backgroundColor: '#10b981' }),
      vnode(`${prefix}-cnt`, 'text', '(1 / 4)', { fontSize: 11, fontWeight: 700, color: '#94a3b8' }, {}, [], '(1 / 4)')
    ]),

    // Device Switcher Pill
    vnode(`${prefix}-dev-grp`, 'container', 'Device Switcher Group', {
      padding: 3,
      borderRadius: 10,
      backgroundColor: '#1e293b',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4
    }, {}, [
      { id: 'iphone', label: '📱 iPhone', active: true },
      { id: 'ipad', label: '📟 iPad', active: false },
      { id: 'mac', label: '🖥 Mac', active: false },
      { id: 'orig', label: '⤢ 원본', active: false }
    ].map((d) =>
      vnode(`${prefix}-dev-${d.id}`, 'button', d.label, {
        height: 26,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 7,
        backgroundColor: d.active ? '#4f46e5' : 'transparent',
        color: d.active ? '#ffffff' : '#94a3b8',
        fontSize: 11,
        fontWeight: 700
      }, {}, [], d.label)
    )),

    // Orientation & Hotspot Hints
    vnode(`${prefix}-btn-rot`, 'button', 'Orientation Button', {
      height: 28,
      paddingLeft: 10,
      paddingRight: 10,
      borderRadius: 8,
      backgroundColor: '#1e293b',
      color: '#cbd5e1',
      fontSize: 11,
      fontWeight: 600
    }, {}, [], '↻ 세로'),
    vnode(`${prefix}-btn-hot`, 'button', 'Hotspot Hint Button', {
      height: 28,
      paddingLeft: 10,
      paddingRight: 10,
      borderRadius: 8,
      backgroundColor: '#1e293b',
      color: '#cbd5e1',
      fontSize: 11,
      fontWeight: 600
    }, {}, [], '✨ 핫스팟 힌트'),

    vnode(`${prefix}-div`, 'divider', 'Divider', { width: 1, height: 18, backgroundColor: '#334155' }),

    // Prev / Next / Close
    vnode(`${prefix}-nav`, 'container', 'Nav Controls', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }, {}, [
      vnode(`${prefix}-prev`, 'icon', 'ChevronLeft', { color: '#64748b' }, { icon: 'chevron-left', size: 14 }),
      vnode(`${prefix}-next`, 'icon', 'ChevronRight', { color: '#e2e8f0' }, { icon: 'chevron-right', size: 14 }),
      vnode(`${prefix}-close`, 'icon', 'X', { color: '#94a3b8' }, { icon: 'x', size: 14 })
    ])
  ]);

  // iPhone 15 Pro Bezel Frame (396 x 812)
  const iphoneBezel = vnode(`${prefix}-iphone`, 'container', 'iPhone 15 Pro Bezel', {
    width: 396,
    height: 812,
    borderRadius: 54,
    backgroundColor: '#131b2e',
    borderWidth: 3,
    borderColor: '#26324d',
    borderStyle: 'solid',
    boxShadow: '0 30px 60px -12px rgba(0, 0, 0, 0.75)',
    padding: 14,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'relative'
  }, {}, [
    // Dynamic Island
    vnode(`${prefix}-island`, 'container', 'Dynamic Island', {
      width: 112,
      height: 28,
      borderRadius: 9999,
      backgroundColor: '#04070d',
      paddingLeft: 12,
      paddingRight: 12,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginTop: 6
    }, {}, [
      vnode(`${prefix}-cam1`, 'box', 'Lens', { width: 9, height: 9, borderRadius: 9999, backgroundColor: '#1e293b' }),
      vnode(`${prefix}-cam2`, 'box', 'Sensor', { width: 8, height: 8, borderRadius: 9999, backgroundColor: '#10b981' })
    ]),

    // Screen Interactive Preview Content
    vnode(`${prefix}-screen`, 'container', 'Interactive Prototype Screen', {
      width: '100%',
      height: 440,
      borderRadius: 12,
      backgroundColor: '#f1f5f9',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
      boxShadow: '0 10px 25px rgba(0,0,0,0.4)'
    }, {}, [
      vnode(`${prefix}-sc-hdr`, 'container', 'Mini Header', {
        height: 28,
        backgroundColor: '#ffffff',
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        borderBottomStyle: 'solid',
        paddingLeft: 8,
        paddingRight: 8,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }, {}, [
        vnode(`${prefix}-sc-t`, 'text', 'Title', { fontSize: 8, fontWeight: 700, color: '#0f172a' }, {}, [], '● Fintech Service UI Storyboard'),
        vnode(`${prefix}-sc-p`, 'badge', 'PLAY', { fontSize: 7, backgroundColor: '#4f46e5', color: '#ffffff', paddingLeft: 4, paddingRight: 4, borderRadius: 3 }, {}, [], 'PLAY')
      ]),
      vnode(`${prefix}-sc-body`, 'container', 'Mini Body', {
        flex: 1,
        backgroundColor: '#cbd5e1',
        padding: 12,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }, {}, [
        vnode(`${prefix}-sc-card`, 'card', 'Mini Spotlight Card', {
          width: '90%',
          padding: 10,
          borderRadius: 10,
          backgroundColor: '#ffffff',
          boxShadow: '0 10px 20px rgba(0,0,0,0.2)',
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }, {}, [
          vnode(`${prefix}-scc-1`, 'box', 'Active Cmd', {
            padding: 6,
            borderRadius: 6,
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            fontSize: 8,
            fontWeight: 700
          }, {}, [], '▶ 인터랙티브 프로토타입 실행 (Ctrl+P)'),
          vnode(`${prefix}-scc-2`, 'text', 'Cmd 2', { fontSize: 8, color: '#334155' }, {}, [], '🎨 디자인 시스템 스튜디오 열기 (Alt+D)'),
          vnode(`${prefix}-scc-3`, 'text', 'Cmd 3', { fontSize: 8, color: '#334155' }, {}, [], '🌿 Git 변경사항 감지 & 커밋 다이얼로그'),
          vnode(`${prefix}-scc-4`, 'text', 'Cmd 4', { fontSize: 8, color: '#334155' }, {}, [], '＋ 새 스크린 프레임/아트보드 추가 (F)')
        ])
      ])
    ]),

    // Bottom Home Indicator Bar
    vnode(`${prefix}-home-bar`, 'box', 'Home Indicator', {
      width: 128,
      height: 5,
      borderRadius: 9999,
      backgroundColor: '#475569',
      marginBottom: 4
    })
  ]);

  const footerText = vnode(`${prefix}-footer`, 'text', 'Play Mode Legend', {
    fontSize: 11,
    color: '#64748b'
  }, {}, [], '인터랙티브 모드 가동 중 · 화면 내 버튼 클릭 시 연결된 화면으로 전환 (좌/우 방향키 또는 Esc)');

  return vnode(`${prefix}-root`, 'frame', 'Play Mode Fullscreen Frame', {
    width: '100%',
    height: '100%',
    backgroundColor: '#070b14',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 18,
    paddingBottom: 16,
    overflow: 'hidden'
  }, {}, [topBar, iphoneBezel, footerText]);
}

// 2. Design System Studio Modal (Artboard 9 - Mirrors 08-modal-design-system.png)
export function createDesignSystemModalOverlay(prefix = 'dsm') {
  const compListItems = [
    { name: '프레임', tag: '<frame>', desc: '최상위 스크린 프레임', active: false },
    { name: '컨테이너', tag: '<div>', desc: '일반 레이아웃 블록', active: false },
    { name: '시맨틱 섹션', tag: '<section>', desc: '페이지 주요 블록 구획', active: false },
    { name: '헤더 영역', tag: '<header>', desc: '상단 네비게이션 및 타이틀 바', active: false },
    { name: '푸터 영역', tag: '<footer>', desc: '하단 정보 및 라이선스 영역', active: false },
    { name: '네비게이션', tag: '<nav>', desc: '내비게이션 링크 컨테이너', active: false },
    { name: '사이드바', tag: '<aside>', desc: '보조 컨텐츠/사이드 패널', active: false },
    { name: '메인 영역', tag: '<main>', desc: '페이지 주요 본문 블록', active: false },
    { name: '아티클', tag: '<article>', desc: '독립적인 기사/포스트 블록', active: false },
    { name: '스크롤 컨테이너', tag: '<scroll>', desc: '마우스 휠 스크롤 영역', active: false },
    { name: '모달 다이얼로그', tag: '<dialog>', desc: '팝업 모달 창 (Backdrop + Close)', active: false },
    { name: '사각형 박스', tag: '<box>', desc: '고정 크기 레이아웃 구획 박스', active: false },
    { name: '카드 컨테이너', tag: '<card>', desc: '배경색 및 곡률이 적용된 박스', active: false },
    { name: 'CTA 버튼', tag: '<button>', desc: '클릭 인터랙션 주 버튼', active: true }
  ];

  const modal = vnode(`${prefix}-modal`, 'dialog', 'Design System Studio Modal', {
    width: 1520,
    height: 920,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }, {}, [
    // Modal Header (64px)
    vnode(`${prefix}-hdr`, 'header', 'Studio Header', {
      height: 64,
      paddingLeft: 20,
      paddingRight: 20,
      backgroundColor: '#ffffff',
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
      borderBottomStyle: 'solid',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0
    }, {}, [
      vnode(`${prefix}-hl`, 'container', 'Header Left', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 }, {}, [
        vnode(`${prefix}-h-ic`, 'box', 'Purple Icon Box', {
          width: 38,
          height: 38,
          borderRadius: 12,
          backgroundColor: '#4f46e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }, {}, [
          vnode(`${prefix}-ic-pal`, 'icon', 'Palette', { color: '#ffffff' }, { icon: 'palette', size: 20 })
        ]),
        vnode(`${prefix}-h-txts`, 'container', 'Titles', { display: 'flex', flexDirection: 'column', gap: 2 }, {}, [
          vnode(`${prefix}-h-trow`, 'container', 'Title & Badge', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }, {}, [
            vnode(`${prefix}-h-t`, 'text', '디자인 시스템 스튜디오', { fontSize: 15, fontWeight: 800, color: '#0f172a' }, {}, [], '디자인 시스템 스튜디오'),
            vnode(`${prefix}-h-bdg`, 'badge', '45종 컴포넌트 기본값 관리', {
              paddingLeft: 8,
              paddingRight: 8,
              paddingTop: 2,
              paddingBottom: 2,
              borderRadius: 9999,
              backgroundColor: '#eef2ff',
              color: '#4f46e5',
              fontSize: 10,
              fontWeight: 700
            }, {}, [], '45종 컴포넌트 기본값 관리')
          ]),
          vnode(`${prefix}-h-sub`, 'text', 'Subtitle', { fontSize: 11, color: '#64748b' }, {}, [], '각 VDOM 요소가 캔버스에 추가될 때 기본 적용되는 스타일을 편집하며, docs/ui-boards/design-system.json에 자동 반영됩니다.')
        ])
      ]),
      vnode(`${prefix}-hr`, 'container', 'Header Right Actions', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }, {}, [
        vnode(`${prefix}-btn-rst`, 'button', '전체 초기화', {
          height: 34,
          paddingLeft: 14,
          paddingRight: 14,
          borderRadius: 10,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderStyle: 'solid',
          color: '#475569',
          fontSize: 12,
          fontWeight: 700
        }, {}, [], '↺ 전체 초기화'),
        vnode(`${prefix}-btn-ok`, 'button', '적용 및 완료', {
          height: 34,
          paddingLeft: 18,
          paddingRight: 18,
          borderRadius: 10,
          backgroundColor: '#4f46e5',
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 700
        }, {}, [], '✓ 적용 및 완료'),
        vnode(`${prefix}-btn-x`, 'icon', 'X', { color: '#94a3b8' }, { icon: 'x', size: 18 })
      ])
    ]),

    // 3-Column Body
    vnode(`${prefix}-body`, 'container', 'Studio 3-Column Body', {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden'
    }, {}, [
      // Col 1: Component Selector (290px)
      vnode(`${prefix}-col1`, 'container', 'Component List Column', {
        width: 290,
        backgroundColor: '#ffffff',
        borderRightWidth: 1,
        borderRightColor: '#e2e8f0',
        borderRightStyle: 'solid',
        display: 'flex',
        flexDirection: 'column',
        flexShrink: 0
      }, {}, [
        // Search & Filter Pills
        vnode(`${prefix}-c1-top`, 'container', 'Search & Filters', {
          padding: 12,
          borderBottomWidth: 1,
          borderBottomColor: '#f1f5f9',
          borderBottomStyle: 'solid',
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }, {}, [
          vnode(`${prefix}-c1-s`, 'box', 'Search Input', {
            height: 32,
            paddingLeft: 10,
            borderRadius: 8,
            backgroundColor: '#f8fafc',
            borderWidth: 1,
            borderColor: '#e2e8f0',
            borderStyle: 'solid',
            display: 'flex',
            alignItems: 'center',
            fontSize: 11,
            color: '#94a3b8'
          }, {}, [], '🔍 컴포넌트 검색 (태그, 이름)...'),
          vnode(`${prefix}-c1-cats`, 'container', 'Cats', { display: 'flex', flexDirection: 'row', gap: 4 }, {},
            ['전체', '레이아웃', '텍스트', '폼·버튼', '미디어'].map((c, i) =>
              vnode(`${prefix}-c1c-${i}`, 'badge', c, {
                paddingLeft: 8,
                paddingRight: 8,
                paddingTop: 4,
                paddingBottom: 4,
                borderRadius: 8,
                backgroundColor: i === 0 ? '#4f46e5' : '#f8fafc',
                borderWidth: 1,
                borderColor: i === 0 ? '#4f46e5' : '#e2e8f0',
                borderStyle: 'solid',
                color: i === 0 ? '#ffffff' : '#475569',
                fontSize: 10,
                fontWeight: 700
              }, {}, [], c)
            )
          )
        ]),
        // Component Rows
        vnode(`${prefix}-c1-list`, 'container', 'Components List', {
          flex: 1,
          padding: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 6,
          overflow: 'hidden'
        }, {}, compListItems.map((it, idx) =>
          vnode(`${prefix}-c1i-${idx}`, 'container', it.name, {
            padding: 8,
            borderRadius: 10,
            backgroundColor: it.active ? '#eef2ff' : '#ffffff',
            borderWidth: it.active ? 1 : 0,
            borderColor: '#c7d2fe',
            borderStyle: 'solid',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 10
          }, {}, [
            vnode(`${prefix}-c1i-ic-${idx}`, 'box', 'Icon', {
              width: 28,
              height: 28,
              borderRadius: 8,
              backgroundColor: it.active ? '#e0e7ff' : '#f8fafc',
              borderWidth: 1,
              borderColor: '#e2e8f0',
              borderStyle: 'solid',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }, {}, [
              vnode(`${prefix}-c1i-ico-${idx}`, 'icon', 'Layout', { color: it.active ? '#4f46e5' : '#64748b' }, { icon: 'layout', size: 13 })
            ]),
            vnode(`${prefix}-c1i-tx-${idx}`, 'container', 'Text Col', { display: 'flex', flexDirection: 'column' }, {}, [
              vnode(`${prefix}-c1i-tr-${idx}`, 'container', 'Title Row', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }, {}, [
                vnode(`${prefix}-c1i-nm-${idx}`, 'text', it.name, { fontSize: 11, fontWeight: 700, color: '#0f172a' }, {}, [], it.name),
                vnode(`${prefix}-c1i-tg-${idx}`, 'text', it.tag, { fontSize: 10, fontMono: true, color: '#94a3b8' }, {}, [], it.tag)
              ]),
              vnode(`${prefix}-c1i-ds-${idx}`, 'text', it.desc, { fontSize: 10, color: '#64748b' }, {}, [], it.desc)
            ])
          ])
        ))
      ]),

      // Col 2: Token Style Editor (460px)
      vnode(`${prefix}-col2`, 'container', 'Style Token Editor Column', {
        width: 460,
        backgroundColor: '#ffffff',
        borderRightWidth: 1,
        borderRightColor: '#e2e8f0',
        borderRightStyle: 'solid',
        padding: 20,
        display: 'flex',
        flexDirection: 'column',
        gap: 18,
        flexShrink: 0,
        overflow: 'hidden'
      }, {}, [
        // Selected Component Banner
        vnode(`${prefix}-c2-hdr`, 'container', 'Selected Component Header', {
          paddingBottom: 14,
          borderBottomWidth: 1,
          borderBottomColor: '#f1f5f9',
          borderBottomStyle: 'solid',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }, {}, [
          vnode(`${prefix}-c2-hl`, 'container', 'Left', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }, {}, [
            vnode(`${prefix}-c2-ib`, 'box', 'Icon Box', { width: 36, height: 36, borderRadius: 10, backgroundColor: '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center' }, {}, [
              vnode(`${prefix}-c2-ic`, 'icon', 'MousePointer', { color: '#4f46e5' }, { icon: 'mouse-pointer', size: 16 })
            ]),
            vnode(`${prefix}-c2-tx`, 'container', 'Texts', { display: 'flex', flexDirection: 'column', gap: 2 }, {}, [
              vnode(`${prefix}-c2-t1`, 'text', 'CTA 버튼 <button>', { fontSize: 13, fontWeight: 800, color: '#0f172a' }, {}, [], 'CTA 버튼  <button>'),
              vnode(`${prefix}-c2-t2`, 'text', '클릭 인터랙션 주 버튼', { fontSize: 11, color: '#64748b' }, {}, [], '클릭 인터랙션 주 버튼')
            ])
          ]),
          vnode(`${prefix}-c2-rst`, 'text', '↺ 기본값 복원', { fontSize: 11, fontWeight: 600, color: '#64748b' }, {}, [], '↺ 기본값 복원')
        ]),

        // Section 1: Colors & Opacity
        vnode(`${prefix}-c2-s1`, 'container', 'Colors & Opacity', { display: 'flex', flexDirection: 'column', gap: 10 }, {}, [
          vnode(`${prefix}-s1-t`, 'text', 'Title', { fontSize: 12, fontWeight: 700, color: '#1e293b' }, {}, [], '🎨 색상 및 불투명도 (Colors & Opacity)'),
          vnode(`${prefix}-s1-row`, 'container', 'Color Pickers Row', { display: 'flex', flexDirection: 'row', gap: 10 }, {}, [
            vnode(`${prefix}-s1-bg`, 'container', 'BG Col', { flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }, {}, [
              vnode(`${prefix}-s1-bgl`, 'text', '배경색 (Background)', { fontSize: 10, color: '#64748b' }, {}, [], '배경색 (Background)'),
              vnode(`${prefix}-s1-bgb`, 'container', 'BG Input', {
                height: 36,
                paddingLeft: 8,
                borderRadius: 8,
                backgroundColor: '#f8fafc',
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderStyle: 'solid',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8
              }, {}, [
                vnode(`${prefix}-s1-bgs`, 'box', 'Swatch', { width: 20, height: 20, borderRadius: 4, backgroundColor: '#4f46e5' }),
                vnode(`${prefix}-s1-bgv`, 'text', '#4f46e5', { fontSize: 11, fontMono: true, color: '#0f172a' }, {}, [], '#4f46e5')
              ])
            ]),
            vnode(`${prefix}-s1-fg`, 'container', 'FG Col', { flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }, {}, [
              vnode(`${prefix}-s1-fgl`, 'text', '글자색 (Text Color)', { fontSize: 10, color: '#64748b' }, {}, [], '글자색 (Text Color)'),
              vnode(`${prefix}-s1-fgb`, 'container', 'FG Input', {
                height: 36,
                paddingLeft: 8,
                borderRadius: 8,
                backgroundColor: '#f8fafc',
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderStyle: 'solid',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8
              }, {}, [
                vnode(`${prefix}-s1-fgs`, 'box', 'Swatch', { width: 20, height: 20, borderRadius: 4, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderStyle: 'solid' }),
                vnode(`${prefix}-s1-fgv`, 'text', '#ffffff', { fontSize: 11, fontMono: true, color: '#0f172a' }, {}, [], '#ffffff')
              ])
            ])
          ]),
          // Swatches Row
          vnode(`${prefix}-s1-dots`, 'container', 'Swatches', { display: 'flex', flexDirection: 'row', gap: 6 }, {},
            ['#4f46e5', '#6366f1', '#3b82f6', '#0ea5e9', '#06b6d4', '#10b981', '#22c55e', '#f59e0b', '#ef4444', '#ec4899', '#a855f7', '#0f172a', '#334155', '#64748b', '#94a3b8', '#e2e8f0'].map((c, i) =>
              vnode(`${prefix}-s1d-${i}`, 'box', c, { width: 16, height: 16, borderRadius: 9999, backgroundColor: c })
            )
          ),
          // Opacity Bar
          vnode(`${prefix}-s1-op`, 'container', 'Opacity Slider', { display: 'flex', flexDirection: 'column', gap: 4 }, {}, [
            vnode(`${prefix}-s1-opt`, 'container', 'Top', { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }, {}, [
              vnode(`${prefix}-s1-opl`, 'text', '불투명도 (Opacity)', { fontSize: 10, color: '#64748b' }, {}, [], '불투명도 (Opacity)'),
              vnode(`${prefix}-s1-opv`, 'text', '1', { fontSize: 10, fontWeight: 700, color: '#0f172a' }, {}, [], '1')
            ]),
            vnode(`${prefix}-s1-bar`, 'box', 'Bar', { width: '100%', height: 6, borderRadius: 9999, backgroundColor: '#4f46e5' })
          ])
        ]),

        // Section 2: Typography
        vnode(`${prefix}-c2-s2`, 'container', 'Typography', { display: 'flex', flexDirection: 'column', gap: 8 }, {}, [
          vnode(`${prefix}-s2-t`, 'text', 'T 타이포그래피 (Typography)', { fontSize: 12, fontWeight: 700, color: '#1e293b' }, {}, [], 'T 타이포그래피 (Typography)'),
          vnode(`${prefix}-s2-weights`, 'container', 'Weights', { display: 'flex', flexDirection: 'row', gap: 6 }, {},
            ['300', '400', '500', '600', '700', '800'].map((w) =>
              vnode(`${prefix}-s2w-${w}`, 'button', w, {
                flex: 1,
                height: 28,
                borderRadius: 6,
                backgroundColor: w === '600' ? '#eef2ff' : '#f8fafc',
                borderWidth: 1,
                borderColor: w === '600' ? '#6366f1' : '#e2e8f0',
                borderStyle: 'solid',
                color: w === '600' ? '#4f46e5' : '#475569',
                fontSize: 10,
                fontWeight: 700
              }, {}, [], w)
            )
          )
        ]),

        // Section 3: Spacing & Border Radius
        vnode(`${prefix}-c2-s3`, 'container', 'Spacing & Border', { display: 'flex', flexDirection: 'column', gap: 8 }, {}, [
          vnode(`${prefix}-s3-t`, 'text', '여백 및 곡률 (Padding, Margin & Radius)', { fontSize: 12, fontWeight: 700, color: '#1e293b' }, {}, [], '⤢ 여백 및 테두리 곡률 (Spacing & Radius)'),
          vnode(`${prefix}-s3-row`, 'container', 'Inputs', { display: 'flex', flexDirection: 'row', gap: 8 }, {}, [
            { l: '패딩 (Padding)', v: '12' },
            { l: '마진 (Margin)', v: '0' },
            { l: '곡률 (Radius)', v: '12px' }
          ].map((it, idx) =>
            vnode(`${prefix}-s3i-${idx}`, 'container', it.l, { flex: 1, display: 'flex', flexDirection: 'column', gap: 4 }, {}, [
              vnode(`${prefix}-s3l-${idx}`, 'text', it.l, { fontSize: 10, color: '#64748b' }, {}, [], it.l),
              vnode(`${prefix}-s3v-${idx}`, 'box', it.v, {
                height: 32,
                paddingLeft: 10,
                borderRadius: 8,
                backgroundColor: '#f8fafc',
                borderWidth: 1,
                borderColor: '#e2e8f0',
                borderStyle: 'solid',
                display: 'flex',
                alignItems: 'center',
                fontSize: 11,
                fontWeight: 700,
                color: '#0f172a'
              }, {}, [], it.v)
            ])
          ))
        ]),

        // Section 4: Box Shadow
        vnode(`${prefix}-c2-s4`, 'container', 'Box Shadow', { display: 'flex', flexDirection: 'column', gap: 8 }, {}, [
          vnode(`${prefix}-s4-t`, 'text', '✨ 그림자 효과 (Box Shadow)', { fontSize: 12, fontWeight: 700, color: '#1e293b' }, {}, [], '✨ 그림자 효과 (Box Shadow)'),
          vnode(`${prefix}-s4-row`, 'container', 'Shadow Presets', { display: 'flex', flexDirection: 'row', gap: 6 }, {},
            ['None', 'SM', 'MD', 'LG', 'XL', 'Glow'].map((sh) =>
              vnode(`${prefix}-s4b-${sh}`, 'button', sh, {
                flex: 1,
                height: 30,
                borderRadius: 8,
                backgroundColor: sh === 'MD' ? '#eef2ff' : '#ffffff',
                borderWidth: 1,
                borderColor: sh === 'MD' ? '#6366f1' : '#e2e8f0',
                borderStyle: 'solid',
                color: sh === 'MD' ? '#4f46e5' : '#475569',
                fontSize: 10,
                fontWeight: 700
              }, {}, [], sh)
            )
          )
        ])
      ]),

      // Col 3: Dark Live Preview & JSON Spec (flex: 1)
      vnode(`${prefix}-col3`, 'container', 'Live Preview & JSON Column', {
        flex: 1,
        backgroundColor: '#0b0f19',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        overflow: 'hidden'
      }, {}, [
        // Top Preview Toolbar
        vnode(`${prefix}-c3-bar`, 'container', 'Preview Toolbar', {
          height: 50,
          paddingLeft: 16,
          paddingRight: 16,
          backgroundColor: '#ffffff',
          borderBottomWidth: 1,
          borderBottomColor: '#e2e8f0',
          borderBottomStyle: 'solid',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }, {}, [
          vnode(`${prefix}-c3-bl`, 'container', 'BG Modes', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }, {}, [
            vnode(`${prefix}-c3-bgl`, 'text', '미리보기 배경:', { fontSize: 10, fontWeight: 700, color: '#64748b' }, {}, [], '미리보기 배경:'),
            vnode(`${prefix}-c3-m1`, 'badge', 'Dark', { paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5, borderRadius: 8, backgroundColor: '#0f172a', color: '#ffffff', fontSize: 10, fontWeight: 700 }, {}, [], '다크 (#0f172a)'),
            vnode(`${prefix}-c3-m2`, 'badge', 'Light', { paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5, borderRadius: 8, backgroundColor: '#f8fafc', color: '#475569', fontSize: 10, fontWeight: 600 }, {}, [], '라이트 (White)'),
            vnode(`${prefix}-c3-m3`, 'badge', 'Slate', { paddingLeft: 10, paddingRight: 10, paddingTop: 5, paddingBottom: 5, borderRadius: 8, backgroundColor: '#f8fafc', color: '#475569', fontSize: 10, fontWeight: 600 }, {}, [], '슬레이트 (Gray)')
          ]),
          vnode(`${prefix}-c3-br`, 'button', 'JSON 복사', {
            height: 30,
            paddingLeft: 10,
            paddingRight: 10,
            borderRadius: 8,
            backgroundColor: '#f8fafc',
            borderWidth: 1,
            borderColor: '#e2e8f0',
            borderStyle: 'solid',
            color: '#334155',
            fontSize: 10,
            fontWeight: 700
          }, {}, [], '📋 JSON 복사')
        ]),

        // Center Interactive Preview Box
        vnode(`${prefix}-c3-stage`, 'container', 'Preview Stage', {
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 16
        }, {}, [
          vnode(`${prefix}-c3-pbox`, 'container', 'Preview Frame', {
            width: 320,
            height: 140,
            borderRadius: 20,
            backgroundColor: '#111827',
            borderWidth: 1,
            borderColor: '#1e293b',
            borderStyle: 'solid',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }, {}, [
            vnode(`${prefix}-c3-cta`, 'button', '지금 바로 시작하기', {
              height: 46,
              paddingLeft: 26,
              paddingRight: 26,
              borderRadius: 12,
              backgroundColor: '#4f46e5',
              color: '#ffffff',
              fontSize: 14,
              fontWeight: 700,
              boxShadow: '0 10px 25px rgba(79, 70, 229, 0.45)'
            }, {}, [], '지금 바로 시작하기')
          ]),
          vnode(`${prefix}-c3-hint`, 'text', 'Hint', { fontSize: 11, color: '#64748b' }, {}, [], '직접 클릭하거나 타이핑하여 반응성을 테스트 할 수 있습니다')
        ]),

        // Bottom Live JSON Console
        vnode(`${prefix}-c3-json`, 'container', 'Live JSON Spec Console', {
          height: 150,
          backgroundColor: '#070a12',
          borderTopWidth: 1,
          borderTopColor: '#1e293b',
          borderTopStyle: 'solid',
          padding: 14,
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }, {}, [
          vnode(`${prefix}-c3-jh`, 'container', 'JSON Header', { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }, {}, [
            vnode(`${prefix}-c3-jl`, 'text', 'Title', { fontSize: 10, fontMono: true, color: '#64748b' }, {}, [], '디자인 시스템 JSON 속성 스펙 (docs/ui-boards/design-system.json)'),
            vnode(`${prefix}-c3-jr`, 'text', 'Live', { fontSize: 10, fontWeight: 700, color: '#10b981' }, {}, [], '● 실시간 반영 중')
          ]),
          vnode(`${prefix}-c3-jc1`, 'text', 'L1', { fontSize: 11, fontMono: true, color: '#e2e8f0', whiteSpace: 'pre' }, {}, [], '"componentDefaults": {'),
          vnode(`${prefix}-c3-jc2`, 'text', 'L2', { fontSize: 11, fontMono: true, color: '#93c5fd', whiteSpace: 'pre' }, {}, [], '  "button": {'),
          vnode(`${prefix}-c3-jc3`, 'text', 'L3', { fontSize: 11, fontMono: true, color: '#a7f3d0', whiteSpace: 'pre' }, {}, [], '    "backgroundColor": "#4f46e5", "color": "#ffffff", "borderRadius": 12'),
          vnode(`${prefix}-c3-jc4`, 'text', 'L4', { fontSize: 11, fontMono: true, color: '#93c5fd', whiteSpace: 'pre' }, {}, [], '  }')
        ])
      ])
    ])
  ]);

  return wrapInBackdrop(prefix, modal, 100);
}

// 3. Git Desktop & Side-by-Side Diff Modal (Artboard 10 - Mirrors 09-modal-git-desktop.png)
export function createGitDesktopModalOverlay(prefix = 'gitm') {
  const fileItems = [
    { name: '.screen-designer/config.json', managed: true, checked: true, active: true },
    { name: 'assets/screenshots/01-workspace-mai...', managed: false, checked: false },
    { name: 'assets/screenshots/02-components-pa...', managed: false, checked: false },
    { name: 'assets/screenshots/03-templates-pal...', managed: false, checked: false },
    { name: 'assets/screenshots/04-inspector-eve...', managed: false, checked: false },
    { name: 'docs/ui-boards/design-system.json', managed: true, checked: true },
    { name: 'docs/ui-boards/pages/1.json', managed: true, checked: true },
    { name: 'docs/ui-boards/pages/2.json', managed: true, checked: true },
    { name: 'docs/ui-boards/pages/3.json', managed: true, checked: true },
    { name: 'docs/ui-boards/pages/4.json', managed: true, checked: true },
    { name: 'docs/ui-boards/project.json', managed: true, checked: true }
  ];

  const diffRows = [
    { lNum: '4', lTxt: '  "pageDocsPath": "docs/ui-boards",', rNum: '4', rTxt: '  "pageDocsPath": "docs/ui-boards",', type: 'ctx' },
    { lNum: '5', lTxt: '  "mcpServer": "@screen-designer/mcp-server",', rNum: '5', rTxt: '  "mcpServer": "@screen-designer/mcp-server",', type: 'ctx' },
    { lNum: '6', lTxt: '  "bridgePort": 49494,', rNum: '6', rTxt: '  "bridgePort": 49494,', type: 'ctx' },
    { lNum: '7', lTxt: '- "lastActivePage": "page-workspace",', rNum: '7', rTxt: '+ "lastActivePage": "page-1",', type: 'mod' },
    { lNum: '8', lTxt: '  "updatedAt": "2026-10-25T06:42:03.346Z",', rNum: '8', rTxt: '  "updatedAt": "2026-10-25T07:12:08.000Z",', type: 'mod' },
    { lNum: '9', lTxt: '  "migratedFrom": "docs/ui-boards-test"', rNum: '9', rTxt: '  "migratedFrom": "docs/ui-boards-test"', type: 'ctx' }
  ];

  const modal = vnode(`${prefix}-modal`, 'dialog', 'Git Desktop Diff Modal', {
    width: 1260,
    height: 860,
    borderRadius: 18,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden'
  }, {}, [
    // Left Column: Changes & Commit Box (310px)
    vnode(`${prefix}-left`, 'container', 'Git Left Column', {
      width: 310,
      backgroundColor: '#ffffff',
      borderRightWidth: 1,
      borderRightColor: '#e2e8f0',
      borderRightStyle: 'solid',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      flexShrink: 0
    }, {}, [
      // Top Tabs + Filter + File List
      vnode(`${prefix}-l-top`, 'container', 'Top Section', { display: 'flex', flexDirection: 'column', flex: 1, overflow: 'hidden' }, {}, [
        // Changes / History Tabs
        vnode(`${prefix}-tabs`, 'container', 'Tabs', {
          height: 46,
          borderBottomWidth: 1,
          borderBottomColor: '#e2e8f0',
          borderBottomStyle: 'solid',
          display: 'flex',
          flexDirection: 'row'
        }, {}, [
          vnode(`${prefix}-t-ch`, 'button', 'Changes Tab', {
            flex: 1,
            height: 46,
            borderBottomWidth: 2,
            borderBottomColor: '#2563eb',
            borderBottomStyle: 'solid',
            color: '#2563eb',
            fontSize: 12,
            fontWeight: 700,
            gap: 6
          }, {}, [
            vnode(`${prefix}-tc-tx`, 'text', 'Changes', { fontSize: 12, fontWeight: 700, color: '#2563eb' }, {}, [], 'Changes'),
            vnode(`${prefix}-tc-bd`, 'badge', '41', { paddingLeft: 6, paddingRight: 6, paddingTop: 1, paddingBottom: 1, borderRadius: 9999, backgroundColor: '#dbeafe', color: '#1d4ed8', fontSize: 10, fontWeight: 700 }, {}, [], '41')
          ]),
          vnode(`${prefix}-t-hi`, 'button', 'History Tab', {
            flex: 1,
            height: 46,
            color: '#64748b',
            fontSize: 12,
            fontWeight: 600
          }, {}, [], '🕒 History')
        ]),

        // Filter Input & Count Bar
        vnode(`${prefix}-filter-wrap`, 'container', 'Filter Wrap', {
          padding: 10,
          borderBottomWidth: 1,
          borderBottomColor: '#f1f5f9',
          borderBottomStyle: 'solid',
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }, {}, [
          vnode(`${prefix}-f-in`, 'box', 'Filter Input', {
            height: 30,
            paddingLeft: 10,
            borderRadius: 6,
            backgroundColor: '#f8fafc',
            borderWidth: 1,
            borderColor: '#e2e8f0',
            borderStyle: 'solid',
            display: 'flex',
            alignItems: 'center',
            fontSize: 11,
            color: '#94a3b8'
          }, {}, [], '🔍 Filter'),
          vnode(`${prefix}-f-cnt`, 'container', 'Select All Row', { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, {}, [
            vnode(`${prefix}-fc-l`, 'text', '41 files', { fontSize: 11, fontWeight: 600, color: '#334155' }, {}, [], '☐ 41 files'),
            vnode(`${prefix}-fc-r`, 'container', 'Right', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }, {}, [
              vnode(`${prefix}-fc-b`, 'badge', '앱 관리만', { paddingLeft: 6, paddingRight: 6, paddingTop: 2, paddingBottom: 2, borderRadius: 6, backgroundColor: '#ecfdf5', color: '#059669', fontSize: 9, fontWeight: 700 }, {}, [], '앱 관리만'),
              vnode(`${prefix}-fc-s`, 'text', '21 selected', { fontSize: 10, color: '#94a3b8' }, {}, [], '21 selected')
            ])
          ])
        ]),

        // File List
        vnode(`${prefix}-flist`, 'container', 'Files List', {
          padding: 8,
          display: 'flex',
          flexDirection: 'column',
          gap: 4,
          flex: 1,
          overflow: 'hidden'
        }, {}, fileItems.map((f, i) =>
          vnode(`${prefix}-fi-${i}`, 'container', f.name, {
            height: 28,
            paddingLeft: 8,
            paddingRight: 8,
            borderRadius: 6,
            backgroundColor: f.active ? '#eff6ff' : 'transparent',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }, {}, [
            vnode(`${prefix}-fil-${i}`, 'container', 'Left', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }, {}, [
              vnode(`${prefix}-fic-${i}`, 'text', 'Check', { fontSize: 12, color: f.checked ? '#2563eb' : '#cbd5e1' }, {}, [], f.checked ? '☑' : '☐'),
              vnode(`${prefix}-fib-${i}`, 'badge', f.managed ? '앱 관리' : '외부', {
                paddingLeft: 4,
                paddingRight: 4,
                paddingTop: 1,
                paddingBottom: 1,
                borderRadius: 4,
                backgroundColor: f.managed ? '#ecfdf5' : '#f1f5f9',
                color: f.managed ? '#059669' : '#64748b',
                fontSize: 9,
                fontWeight: 700
              }, {}, [], f.managed ? '앱 관리' : '외부'),
              vnode(`${prefix}-fin-${i}`, 'text', f.name, { fontSize: 10, fontMono: true, fontWeight: f.active ? 700 : 500, color: '#1e293b' }, {}, [], f.name)
            ]),
            vnode(`${prefix}-fir-${i}`, 'badge', 'Status', {
              width: 14,
              height: 14,
              borderRadius: 3,
              backgroundColor: f.active ? '#fef3c7' : '#dbeafe',
              color: f.active ? '#d97706' : '#2563eb',
              fontSize: 9,
              fontWeight: 700,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }, {}, [], f.active ? '●' : '+')
          ])
        ))
      ]),

      // Bottom Commit Form
      vnode(`${prefix}-commit-box`, 'container', 'Commit Box', {
        padding: 12,
        backgroundColor: '#f8fafc',
        borderTopWidth: 1,
        borderTopColor: '#e2e8f0',
        borderTopStyle: 'solid',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }, {}, [
        vnode(`${prefix}-cm-in`, 'box', 'Commit Summary', {
          height: 32,
          paddingLeft: 10,
          borderRadius: 8,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#cbd5e1',
          borderStyle: 'solid',
          display: 'flex',
          alignItems: 'center',
          fontSize: 11,
          color: '#0f172a'
        }, {}, [], 'feat(ui): update storyboard canvas design doc'),
        vnode(`${prefix}-cm-desc`, 'box', 'Commit Description', {
          height: 60,
          padding: 8,
          borderRadius: 8,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#cbd5e1',
          borderStyle: 'solid',
          fontSize: 11,
          color: '#94a3b8'
        }, {}, [], 'Description'),
        vnode(`${prefix}-cm-btn`, 'button', 'Commit 21 files to main', {
          height: 36,
          borderRadius: 10,
          backgroundColor: '#2563eb',
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 700
        }, {}, [], '⊸ Commit 21 files to main')
      ])
    ]),

    // Right Column: Side-by-Side Diff Viewer (flex: 1)
    vnode(`${prefix}-right`, 'container', 'Git Right Diff Viewer', {
      flex: 1,
      backgroundColor: '#ffffff',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }, {}, [
      // Top Diff Header
      vnode(`${prefix}-r-hdr`, 'container', 'Diff Header', {
        height: 46,
        paddingLeft: 16,
        paddingRight: 16,
        borderBottomWidth: 1,
        borderBottomColor: '#e2e8f0',
        borderBottomStyle: 'solid',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }, {}, [
        vnode(`${prefix}-rh-l`, 'box', ' Spacer', { width: 10, height: 10 }),
        vnode(`${prefix}-rh-r`, 'container', 'Right Controls', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }, {}, [
          vnode(`${prefix}-rh-fp`, 'badge', '.screen-designer/config.json', {
            paddingLeft: 10,
            paddingRight: 10,
            paddingTop: 4,
            paddingBottom: 4,
            borderRadius: 6,
            backgroundColor: '#f8fafc',
            borderWidth: 1,
            borderColor: '#e2e8f0',
            borderStyle: 'solid',
            fontSize: 11,
            fontMono: true,
            color: '#334155'
          }, {}, [], '.screen-designer/config.json'),
          vnode(`${prefix}-rh-x`, 'icon', 'X', { color: '#64748b' }, { icon: 'x', size: 16 })
        ])
      ]),

      // LF Warning Banner
      vnode(`${prefix}-warn`, 'container', 'LF Line Endings Warning', {
        height: 34,
        paddingLeft: 16,
        backgroundColor: '#fffbeb',
        borderBottomWidth: 1,
        borderBottomColor: '#fde68a',
        borderBottomStyle: 'solid',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 8
      }, {}, [
        vnode(`${prefix}-w-txt`, 'text', 'Warning', { fontSize: 11, color: '#b45309' }, {}, [], "⚠ This file uses 'LF' line endings, but Git is configured to convert them to 'CRLF' the next time the file is checked out.")
      ]),

      // Hunk Header
      vnode(`${prefix}-hunk`, 'container', 'Hunk Header', {
        height: 28,
        paddingLeft: 16,
        backgroundColor: '#f8fafc',
        borderBottomWidth: 1,
        borderBottomColor: '#f1f5f9',
        borderBottomStyle: 'solid',
        display: 'flex',
        alignItems: 'center'
      }, {}, [
        vnode(`${prefix}-hk-t`, 'text', '@@ -4,8 +4,8 @@', { fontSize: 11, fontMono: true, color: '#64748b' }, {}, [], '↑ @@ -4,8 +4,8 @@')
      ]),

      // Side-by-Side Diff Table
      vnode(`${prefix}-diff-rows`, 'container', 'Side-by-Side Diff Lines', {
        flex: 1,
        display: 'flex',
        flexDirection: 'column'
      }, {}, diffRows.map((dr, idx) =>
        vnode(`${prefix}-dr-${idx}`, 'container', `Diff Row ${idx}`, {
          height: 24,
          display: 'flex',
          flexDirection: 'row',
          borderBottomWidth: 1,
          borderBottomColor: '#f8fafc',
          borderBottomStyle: 'solid'
        }, {}, [
          // Left Side
          vnode(`${prefix}-drl-${idx}`, 'container', 'Left Side', {
            flex: 1,
            backgroundColor: dr.type === 'mod' ? '#fef2f2' : '#ffffff',
            borderRightWidth: 1,
            borderRightColor: '#f1f5f9',
            borderRightStyle: 'solid',
            paddingLeft: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12
          }, {}, [
            vnode(`${prefix}-drln-${idx}`, 'text', dr.lNum, { fontSize: 10, fontMono: true, color: '#94a3b8', width: 20 }, {}, [], dr.lNum),
            vnode(`${prefix}-drlt-${idx}`, 'text', dr.lTxt, { fontSize: 11, fontMono: true, color: dr.type === 'mod' ? '#991b1b' : '#334155', whiteSpace: 'pre' }, {}, [], dr.lTxt)
          ]),
          // Right Side
          vnode(`${prefix}-drr-${idx}`, 'container', 'Right Side', {
            flex: 1,
            backgroundColor: dr.type === 'mod' ? '#f0fdf4' : '#ffffff',
            paddingLeft: 10,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 12
          }, {}, [
            vnode(`${prefix}-drrn-${idx}`, 'text', dr.rNum, { fontSize: 10, fontMono: true, color: '#94a3b8', width: 20 }, {}, [], dr.rNum),
            vnode(`${prefix}-drrt-${idx}`, 'text', dr.rTxt, { fontSize: 11, fontMono: true, color: dr.type === 'mod' ? '#166534' : '#334155', whiteSpace: 'pre' }, {}, [], dr.rTxt)
          ])
        ])
      ))
    ])
  ]);

  return wrapInBackdrop(prefix, modal, 100);
}

// 4. Spotlight Command Palette Modal (Artboard 11 - Mirrors 10-modal-command-palette.png)
export function createCommandPaletteModalOverlay(prefix = 'cmdm') {
  const cmdItems = [
    {
      title: '인터랙티브 프로토타입 실행 (Play Mode)',
      desc: '실제 모바일/데스크톱 뷰포트에서 클릭 및 인터랙션 테스트',
      kbd: 'Ctrl+P ↵',
      icon: 'play',
      active: true
    },
    {
      title: '디자인 시스템 스튜디오 열기',
      desc: '45종 컴포넌트 기본값 설정 및 테마 토큰 관리',
      kbd: 'Alt+D',
      icon: 'palette',
      active: false
    },
    {
      title: 'Git 변경사항 감지 & 커밋/푸시 다이얼로그',
      desc: '디자인 변경점 diff 뷰어 및 버전 관리',
      kbd: 'Ctrl+G',
      icon: 'git-branch',
      active: false
    },
    {
      title: '새 스크린 프레임/아트보드 추가',
      desc: '모바일, 태블릿, 데스크톱 프리셋 선택',
      kbd: 'F',
      icon: 'plus',
      active: false
    },
    {
      title: '캔버스 눈금자 & 가이드라인 토글',
      desc: '픽셀 눈금자와 정렬 가이드라인 표시/숨김',
      kbd: 'Shift+R',
      icon: 'maximize-2',
      active: false
    },
    {
      title: '격자 배경 그리드 토글',
      desc: '24px 도트/그리드 배경 켜기/끄기',
      kbd: 'Ctrl+G',
      icon: 'grid',
      active: false
    },
    {
      title: '화면 배율 100%로 맞추기',
      desc: '캔버스 배율 초기화',
      kbd: 'Ctrl+0',
      icon: 'search',
      active: false
    }
  ];

  const modal = vnode(`${prefix}-modal`, 'dialog', 'Spotlight Command Palette Modal', {
    width: 580,
    height: 480,
    borderRadius: 20,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }, {}, [
    // Search Bar Header (56px)
    vnode(`${prefix}-sbar`, 'container', 'Spotlight Search Bar', {
      height: 56,
      paddingLeft: 18,
      paddingRight: 18,
      borderBottomWidth: 1,
      borderBottomColor: '#f1f5f9',
      borderBottomStyle: 'solid',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0
    }, {}, [
      vnode(`${prefix}-sb-l`, 'container', 'Search Left', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }, {}, [
        vnode(`${prefix}-sb-ic`, 'icon', 'Search', { color: '#94a3b8' }, { icon: 'search', size: 16 }),
        vnode(`${prefix}-sb-tx`, 'text', 'Placeholder', { fontSize: 13, color: '#94a3b8' }, {}, [], '명령어, 컴포넌트, 페이지 또는 화면 검색... (Ctrl+K)')
      ]),
      vnode(`${prefix}-sb-esc`, 'badge', 'ESC', {
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 3,
        paddingBottom: 3,
        borderRadius: 6,
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        color: '#64748b',
        fontSize: 10,
        fontWeight: 700
      }, {}, [], 'ESC')
    ]),

    // Command Items List
    vnode(`${prefix}-list`, 'container', 'Commands List', {
      flex: 1,
      padding: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 4,
      overflow: 'hidden'
    }, {}, cmdItems.map((c, idx) =>
      vnode(`${prefix}-ci-${idx}`, 'container', c.title, {
        paddingLeft: 12,
        paddingRight: 12,
        paddingTop: 10,
        paddingBottom: 10,
        borderRadius: 12,
        backgroundColor: c.active ? '#4f46e5' : '#ffffff',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }, {}, [
        vnode(`${prefix}-cil-${idx}`, 'container', 'Left', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 }, {}, [
          vnode(`${prefix}-ciib-${idx}`, 'box', 'Icon Box', {
            width: 30,
            height: 30,
            borderRadius: 8,
            backgroundColor: c.active ? 'rgba(255,255,255,0.18)' : '#f8fafc',
            borderWidth: c.active ? 0 : 1,
            borderColor: '#e2e8f0',
            borderStyle: 'solid',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }, {}, [
            vnode(`${prefix}-ciic-${idx}`, 'icon', c.icon, { color: c.active ? '#ffffff' : '#64748b' }, { icon: c.icon, size: 14 })
          ]),
          vnode(`${prefix}-citx-${idx}`, 'container', 'Texts', { display: 'flex', flexDirection: 'column', gap: 2 }, {}, [
            vnode(`${prefix}-citr-${idx}`, 'container', 'Title & Action Tag', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }, {}, [
              vnode(`${prefix}-cit-${idx}`, 'text', c.title, { fontSize: 12, fontWeight: 700, color: c.active ? '#ffffff' : '#0f172a' }, {}, [], c.title),
              vnode(`${prefix}-citg-${idx}`, 'badge', '액션', {
                paddingLeft: 5,
                paddingRight: 5,
                paddingTop: 1,
                paddingBottom: 1,
                borderRadius: 4,
                backgroundColor: c.active ? 'rgba(255,255,255,0.2)' : '#f1f5f9',
                color: c.active ? '#ffffff' : '#64748b',
                fontSize: 9,
                fontWeight: 700
              }, {}, [], '액션')
            ]),
            vnode(`${prefix}-cid-${idx}`, 'text', c.desc, { fontSize: 10, color: c.active ? '#e0e7ff' : '#94a3b8' }, {}, [], c.desc)
          ])
        ]),
        vnode(`${prefix}-cik-${idx}`, 'badge', c.kbd, {
          paddingLeft: 8,
          paddingRight: 8,
          paddingTop: 3,
          paddingBottom: 3,
          borderRadius: 6,
          backgroundColor: c.active ? 'rgba(255,255,255,0.2)' : '#f8fafc',
          borderWidth: c.active ? 0 : 1,
          borderColor: '#e2e8f0',
          borderStyle: 'solid',
          color: c.active ? '#ffffff' : '#64748b',
          fontSize: 10,
          fontMono: true,
          fontWeight: 700
        }, {}, [], c.kbd)
      ])
    )),

    // Footer Legend
    vnode(`${prefix}-foot`, 'footer', 'Command Palette Footer', {
      height: 36,
      paddingLeft: 18,
      paddingRight: 18,
      backgroundColor: '#f8fafc',
      borderTopWidth: 1,
      borderTopColor: '#e2e8f0',
      borderTopStyle: 'solid',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0
    }, {}, [
      vnode(`${prefix}-fl`, 'text', 'Legend', { fontSize: 10, color: '#64748b' }, {}, [], '↑↓ 이동   ↵ 실행   ESC 닫기'),
      vnode(`${prefix}-fr`, 'text', 'Total', { fontSize: 10, color: '#94a3b8' }, {}, [], '총 28개 결과')
    ])
  ]);

  return wrapInBackdrop(prefix, modal, 110);
}

// 5. Preferences / Settings Modal (Artboard 12 - Mirrors 11-modal-settings.png)
export function createSettingsModalOverlay(prefix = 'setm') {
  const modal = vnode(`${prefix}-modal`, 'dialog', 'Preferences Settings Modal', {
    width: 1060,
    height: 700,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }, {}, [
    // Header (64px)
    vnode(`${prefix}-hdr`, 'header', 'Preferences Header', {
      height: 64,
      paddingLeft: 22,
      paddingRight: 22,
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
      borderBottomStyle: 'solid',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0
    }, {}, [
      vnode(`${prefix}-hl`, 'container', 'Left', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 12 }, {}, [
        vnode(`${prefix}-hic`, 'box', 'Indigo Icon', {
          width: 38,
          height: 38,
          borderRadius: 12,
          backgroundColor: '#4f46e5',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }, {}, [
          vnode(`${prefix}-ic-sl`, 'icon', 'Sliders', { color: '#ffffff' }, { icon: 'sliders-horizontal', size: 18 })
        ]),
        vnode(`${prefix}-htx`, 'container', 'Titles', { display: 'flex', flexDirection: 'column', gap: 2 }, {}, [
          vnode(`${prefix}-ht1`, 'text', '환경 설정 (Preferences)', { fontSize: 15, fontWeight: 800, color: '#0f172a' }, {}, [], '환경 설정 (Preferences)'),
          vnode(`${prefix}-ht2`, 'text', 'Subtitle', { fontSize: 11, color: '#64748b' }, {}, [], '캔버스 환경 및 VDOM 전체 요소(45종)의 기본 스타일 토큰 관리')
        ])
      ]),
      vnode(`${prefix}-hr`, 'container', 'Right Tabs & Close', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }, {}, [
        vnode(`${prefix}-tabs`, 'container', 'Mode Switcher', {
          padding: 4,
          borderRadius: 12,
          backgroundColor: '#f1f5f9',
          display: 'flex',
          flexDirection: 'row',
          gap: 4
        }, {}, [
          vnode(`${prefix}-tb1`, 'button', '기본 컴포넌트 스타일 (45종)', {
            height: 30,
            paddingLeft: 12,
            paddingRight: 12,
            borderRadius: 8,
            backgroundColor: '#ffffff',
            color: '#4f46e5',
            fontSize: 11,
            fontWeight: 700,
            boxShadow: '0 1px 2px rgba(0,0,0,0.06)'
          }, {}, [], '✨ 기본 컴포넌트 스타일 (45종) (45)'),
          vnode(`${prefix}-tb2`, 'button', '캔버스 설정', {
            height: 30,
            paddingLeft: 12,
            paddingRight: 12,
            borderRadius: 8,
            color: '#64748b',
            fontSize: 11,
            fontWeight: 600
          }, {}, [], '⊞ 캔버스 설정')
        ]),
        vnode(`${prefix}-hx`, 'icon', 'X', { color: '#94a3b8' }, { icon: 'x', size: 18 })
      ])
    ]),

    // 3-Column Body
    vnode(`${prefix}-body`, 'container', 'Preferences Body', {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden'
    }, {}, [
      // Col 1: Component List (250px)
      vnode(`${prefix}-c1`, 'container', 'Left List', {
        width: 250,
        borderRightWidth: 1,
        borderRightColor: '#e2e8f0',
        borderRightStyle: 'solid',
        padding: 12,
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }, {}, [
        vnode(`${prefix}-c1-s`, 'box', 'Search', {
          height: 32,
          paddingLeft: 10,
          borderRadius: 8,
          backgroundColor: '#f8fafc',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderStyle: 'solid',
          display: 'flex',
          alignItems: 'center',
          fontSize: 11,
          color: '#94a3b8'
        }, {}, [], '🔍 컴포넌트 검색 (45종)...'),
        vnode(`${prefix}-c1-cats`, 'container', 'Cats', { display: 'flex', flexDirection: 'row', gap: 4 }, {},
          ['전체 (45)', '레이아웃 (13)', '타이포 (7)'].map((c, i) =>
            vnode(`${prefix}-c1c-${i}`, 'badge', c, {
              paddingLeft: 8,
              paddingRight: 8,
              paddingTop: 4,
              paddingBottom: 4,
              borderRadius: 9999,
              backgroundColor: i === 0 ? '#4f46e5' : '#f1f5f9',
              color: i === 0 ? '#ffffff' : '#64748b',
              fontSize: 9,
              fontWeight: 700
            }, {}, [], c)
          )
        ),
        ...[
          { n: '프레임', t: '<frame>', d: '최상위 스크린 프레임' },
          { n: '컨테이너', t: '<div>', d: '일반 레이아웃 블록' },
          { n: '시맨틱 섹션', t: '<section>', d: '페이지 주요 블록 구획' },
          { n: '헤더 영역', t: '<header>', d: '상단 네비게이션 및 타이틀 바' },
          { n: '푸터 영역', t: '<footer>', d: '하단 정보 및 라이선스 영역' },
          { n: '네비게이션', t: '<nav>', d: '내비게이션 링크 컨테이너' },
          { n: '사이드바', t: '<aside>', d: '보조 컨텐츠/사이드 패널' },
          { n: '메인 영역', t: '<main>', d: '페이지 주요 본문 블록' }
        ].map((it, idx) =>
          vnode(`${prefix}-c1i-${idx}`, 'container', it.n, {
            padding: 8,
            borderRadius: 8,
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }, {}, [
            vnode(`${prefix}-c1il-${idx}`, 'container', 'L', { display: 'flex', flexDirection: 'column' }, {}, [
              vnode(`${prefix}-c1in-${idx}`, 'text', it.n, { fontSize: 11, fontWeight: 700, color: '#1e293b' }, {}, [], it.n),
              vnode(`${prefix}-c1id-${idx}`, 'text', it.d, { fontSize: 9, color: '#94a3b8' }, {}, [], it.d)
            ]),
            vnode(`${prefix}-c1it-${idx}`, 'badge', it.t, {
              paddingLeft: 5,
              paddingRight: 5,
              paddingTop: 2,
              paddingBottom: 2,
              borderRadius: 4,
              backgroundColor: '#f1f5f9',
              color: '#64748b',
              fontSize: 9,
              fontMono: true
            }, {}, [], it.t)
          ])
        )
      ]),

      // Col 2: Style Editor (460px)
      vnode(`${prefix}-c2`, 'container', 'Center Style Controls', {
        width: 460,
        borderRightWidth: 1,
        borderRightColor: '#e2e8f0',
        borderRightStyle: 'solid',
        padding: 18,
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }, {}, [
        vnode(`${prefix}-c2-top`, 'card', 'Selected Header', {
          padding: 12,
          borderRadius: 14,
          backgroundColor: '#f8fafc',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderStyle: 'solid',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }, {}, [
          vnode(`${prefix}-c2-tl`, 'text', 'CTA 버튼 <button> FORMS', { fontSize: 13, fontWeight: 800, color: '#0f172a' }, {}, [], '↖ CTA 버튼  <button>  FORMS'),
          vnode(`${prefix}-c2-tr`, 'badge', '기본값 복원', { paddingLeft: 8, paddingRight: 8, paddingTop: 4, paddingBottom: 4, borderRadius: 6, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'solid', fontSize: 10, color: '#475569' }, {}, [], '↺ 기본값 복원')
        ]),
        vnode(`${prefix}-c2-col`, 'card', 'Colors Card', {
          padding: 14,
          borderRadius: 14,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderStyle: 'solid',
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }, {}, [
          vnode(`${prefix}-c2-ct`, 'text', '🎨 배경색 및 텍스트 색상 (Colors)', { fontSize: 11, fontWeight: 700, color: '#1e293b' }, {}, [], '🎨 배경색 및 텍스트 색상 (Colors)'),
          vnode(`${prefix}-c2-cr1`, 'container', 'BG Row', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }, {}, [
            vnode(`${prefix}-c2-cbox`, 'box', '#4f46e5', { width: 120, height: 32, paddingLeft: 10, borderRadius: 8, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'solid', display: 'flex', alignItems: 'center', fontSize: 11, fontMono: true, color: '#0f172a' }, {}, [], '■ #4f46e5'),
            ...['#4f46e5', '#2563eb', '#0ea5e9', '#10b981', '#f59e0b', '#ef4444', '#a855f7', '#0f172a'].map((hex, i) =>
              vnode(`${prefix}-c2-sw-${i}`, 'box', hex, { width: 18, height: 18, borderRadius: 6, backgroundColor: hex })
            )
          ])
        ]),
        vnode(`${prefix}-c2-typo`, 'card', 'Typography Card', {
          padding: 14,
          borderRadius: 14,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderStyle: 'solid',
          display: 'flex',
          flexDirection: 'column',
          gap: 10
        }, {}, [
          vnode(`${prefix}-c2-tt`, 'text', 'T 타이포그래피 (Typography)', { fontSize: 11, fontWeight: 700, color: '#1e293b' }, {}, [], 'T 타이포그래피 (Typography)'),
          vnode(`${prefix}-c2-align`, 'container', 'Alignment Buttons', { display: 'flex', flexDirection: 'row', gap: 8 }, {}, [
            vnode(`${prefix}-c2-a1`, 'button', 'Left', { flex: 1, height: 34, borderRadius: 8, backgroundColor: '#4f46e5', color: '#ffffff', fontSize: 11, fontWeight: 700 }, {}, [], '≡ 왼쪽 (Left)'),
            vnode(`${prefix}-c2-a2`, 'button', 'Center', { flex: 1, height: 34, borderRadius: 8, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'solid', color: '#475569', fontSize: 11, fontWeight: 600 }, {}, [], '≡ 가운데 (Center)'),
            vnode(`${prefix}-c2-a3`, 'button', 'Right', { flex: 1, height: 34, borderRadius: 8, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'solid', color: '#475569', fontSize: 11, fontWeight: 600 }, {}, [], '≡ 오른쪽 (Right)')
          ])
        ])
      ]),

      // Col 3: Live Preview Card (flex: 1)
      vnode(`${prefix}-c3`, 'container', 'Right Live Preview', {
        flex: 1,
        padding: 18,
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'column',
        gap: 14
      }, {}, [
        vnode(`${prefix}-c3-t`, 'text', '✨ 실시간 적용 프리뷰 (Live Preview)', { fontSize: 12, fontWeight: 700, color: '#0f172a' }, {}, [], '✨ 실시간 적용 프리뷰 (Live Preview)'),
        vnode(`${prefix}-c3-grid`, 'container', 'Dot Grid Stage', {
          flex: 1,
          borderRadius: 16,
          backgroundColor: '#f8fafc',
          backgroundImage: 'radial-gradient(#cbd5e1 1px, transparent 1px)',
          backgroundSize: '16px 16px',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderStyle: 'solid',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }, {}, [
          vnode(`${prefix}-c3-btn`, 'button', 'CTA 버튼 액션', {
            height: 44,
            paddingLeft: 24,
            paddingRight: 24,
            borderRadius: 12,
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            fontSize: 13,
            fontWeight: 700,
            boxShadow: '0 10px 20px rgba(79,70,229,0.3)'
          }, {}, [], 'CTA 버튼 액션')
        ]),
        vnode(`${prefix}-c3-info`, 'card', 'Inheritance Info', {
          padding: 12,
          borderRadius: 12,
          backgroundColor: '#eff6ff',
          borderWidth: 1,
          borderColor: '#bfdbfe',
          borderStyle: 'solid',
          display: 'flex',
          flexDirection: 'column',
          gap: 4
        }, {}, [
          vnode(`${prefix}-c3-it`, 'text', 'ℹ 스타일 상속 안내:', { fontSize: 10, fontWeight: 700, color: '#1d4ed8' }, {}, [], 'ℹ 스타일 상속 안내:'),
          vnode(`${prefix}-c3-id`, 'text', 'Desc', { fontSize: 10, color: '#1e40af', lineHeight: 1.4 }, {}, [], '새로 추가되는 모든 CTA 버튼 요소에 이 기본 스타일이 자동 적용되며, 언제든 개별 속성을 수정할 수 있습니다.')
        ])
      ])
    ]),

    // Footer (54px)
    vnode(`${prefix}-foot`, 'footer', 'Preferences Footer', {
      height: 54,
      paddingLeft: 22,
      paddingRight: 22,
      backgroundColor: '#ffffff',
      borderTopWidth: 1,
      borderTopColor: '#e2e8f0',
      borderTopStyle: 'solid',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      flexShrink: 0
    }, {}, [
      vnode(`${prefix}-fl`, 'text', 'Auto Save Note', { fontSize: 11, color: '#64748b' }, {}, [], '실시간으로 프로젝트 설정에 자동 저장됩니다.'),
      vnode(`${prefix}-fr`, 'button', '적용 및 닫기', {
        height: 36,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 700
      }, {}, [], '적용 및 닫기')
    ])
  ]);

  return wrapInBackdrop(prefix, modal, 100);
}

// 6. Keyboard Shortcuts Modal (Artboard 13 - Mirrors 12-modal-shortcuts.png)
export function createShortcutsModalOverlay(prefix = 'scm') {
  const toolShortcuts = [
    { label: '선택 도구 (Select Tool)', kbd: 'V' },
    { label: '화면 이동 손바닥 도구 (Hand Tool)', kbd: 'H / Space + 드래그' },
    { label: '새 프레임/아트보드 추가 (Frame Tool)', kbd: 'F' },
    { label: '텍스트 삽입 (Text Tool)', kbd: 'T' },
    { label: '사각형 컴포넌트 삽입 (Rectangle)', kbd: 'R' }
  ];

  const canvasShortcuts = [
    { label: '캔버스 줌 인 / 줌 아웃', kbd: 'Ctrl + 마우스 휠' },
    { label: '100% 실제 크기로 재설정', kbd: 'Ctrl + 0' },
    { label: '화면에 맞추기 (Zoom to Fit)', kbd: 'Ctrl + 1' },
    { label: '캔버스 자유 패닝 (Pan)', kbd: '스페이스바 + 드래그' }
  ];

  const modal = vnode(`${prefix}-modal`, 'dialog', 'Keyboard Shortcuts Modal', {
    width: 560,
    height: 620,
    borderRadius: 22,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  }, {}, [
    // Header
    vnode(`${prefix}-hdr`, 'header', 'Shortcuts Header', {
      height: 56,
      paddingLeft: 22,
      paddingRight: 22,
      borderBottomWidth: 1,
      borderBottomColor: '#f1f5f9',
      borderBottomStyle: 'solid',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    }, {}, [
      vnode(`${prefix}-hl`, 'container', 'Left', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }, {}, [
        vnode(`${prefix}-hic`, 'icon', 'Keyboard', { color: '#4f46e5' }, { icon: 'keyboard', size: 18 }),
        vnode(`${prefix}-ht`, 'text', '키보드 단축키 안내 (Keyboard Shortcuts)', { fontSize: 14, fontWeight: 800, color: '#0f172a' }, {}, [], '키보드 단축키 안내 (Keyboard Shortcuts)')
      ]),
      vnode(`${prefix}-hx`, 'icon', 'X', { color: '#94a3b8' }, { icon: 'x', size: 16 })
    ]),

    // Body
    vnode(`${prefix}-body`, 'container', 'Shortcuts Body', {
      flex: 1,
      padding: 22,
      display: 'flex',
      flexDirection: 'column',
      gap: 16,
      overflow: 'hidden'
    }, {}, [
      // Section 1: TOOLS
      vnode(`${prefix}-s1`, 'container', 'Tools Section', { display: 'flex', flexDirection: 'column', gap: 8 }, {}, [
        vnode(`${prefix}-s1-t`, 'text', '도구 선택 (TOOLS)', { fontSize: 11, fontWeight: 800, color: '#4f46e5' }, {}, [], '도구 선택 (TOOLS)'),
        vnode(`${prefix}-s1-box`, 'card', 'Tools Card', {
          padding: 12,
          borderRadius: 14,
          backgroundColor: '#f8fafc',
          borderWidth: 1,
          borderColor: '#f1f5f9',
          borderStyle: 'solid',
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }, {}, toolShortcuts.map((s, i) =>
          vnode(`${prefix}-ts-${i}`, 'container', s.label, {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }, {}, [
            vnode(`${prefix}-tsl-${i}`, 'text', s.label, { fontSize: 12, color: '#334155' }, {}, [], s.label),
            vnode(`${prefix}-tsk-${i}`, 'badge', s.kbd, {
              paddingLeft: 8,
              paddingRight: 8,
              paddingTop: 3,
              paddingBottom: 3,
              borderRadius: 6,
              backgroundColor: '#ffffff',
              borderWidth: 1,
              borderColor: '#e2e8f0',
              borderStyle: 'solid',
              color: '#0f172a',
              fontSize: 11,
              fontMono: true,
              fontWeight: 700
            }, {}, [], s.kbd)
          ])
        ))
      ]),

      // Section 2: CANVAS
      vnode(`${prefix}-s2`, 'container', 'Canvas Section', { display: 'flex', flexDirection: 'column', gap: 8 }, {}, [
        vnode(`${prefix}-s2-t`, 'text', '캔버스 제어 (CANVAS)', { fontSize: 11, fontWeight: 800, color: '#4f46e5' }, {}, [], '캔버스 제어 (CANVAS)'),
        vnode(`${prefix}-s2-box`, 'card', 'Canvas Card', {
          padding: 12,
          borderRadius: 14,
          backgroundColor: '#f8fafc',
          borderWidth: 1,
          borderColor: '#f1f5f9',
          borderStyle: 'solid',
          display: 'flex',
          flexDirection: 'column',
          gap: 8
        }, {}, canvasShortcuts.map((s, i) =>
          vnode(`${prefix}-cs-${i}`, 'container', s.label, {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'space-between'
          }, {}, [
            vnode(`${prefix}-csl-${i}`, 'text', s.label, { fontSize: 12, color: '#334155' }, {}, [], s.label),
            vnode(`${prefix}-csk-${i}`, 'badge', s.kbd, {
              paddingLeft: 8,
              paddingRight: 8,
              paddingTop: 3,
              paddingBottom: 3,
              borderRadius: 6,
              backgroundColor: '#ffffff',
              borderWidth: 1,
              borderColor: '#e2e8f0',
              borderStyle: 'solid',
              color: '#0f172a',
              fontSize: 11,
              fontMono: true,
              fontWeight: 700
            }, {}, [], s.kbd)
          ])
        ))
      ])
    ]),

    // Footer
    vnode(`${prefix}-foot`, 'footer', 'Shortcuts Footer', {
      height: 56,
      paddingRight: 22,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end'
    }, {}, [
      vnode(`${prefix}-ok`, 'button', '확인', {
        height: 36,
        paddingLeft: 20,
        paddingRight: 20,
        borderRadius: 10,
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        fontSize: 12,
        fontWeight: 700
      }, {}, [], '확인')
    ])
  ]);

  return wrapInBackdrop(prefix, modal, 100);
}

// 7. File Dropdown Menu Overlay (Artboard 14 - Mirrors 13-header-menu-file.png)
export function createFileDropdownOverlay(prefix = 'fdd') {
  return vnode(`${prefix}-menu`, 'dialog', 'Header File Dropdown Menu', {
    position: 'absolute',
    top: 72,
    left: 10,
    width: 210,
    borderRadius: 14,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    boxShadow: '0 20px 25px -5px rgba(15, 23, 42, 0.18)',
    paddingTop: 6,
    paddingBottom: 6,
    display: 'flex',
    flexDirection: 'column',
    zIndex: 50
  }, {}, [
    vnode(`${prefix}-i1`, 'container', '새 아트보드 생성 (F)', {
      height: 34,
      paddingLeft: 14,
      paddingRight: 14,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    }, {}, [
      vnode(`${prefix}-i1t`, 'text', '새 아트보드 생성 (F)', { fontSize: 12, fontWeight: 600, color: '#1e293b' }, {}, [], '새 아트보드 생성 (F)'),
      vnode(`${prefix}-i1k`, 'text', 'F', { fontSize: 11, color: '#94a3b8' }, {}, [], 'F')
    ]),
    vnode(`${prefix}-i2`, 'container', '내보내기', {
      height: 34,
      paddingLeft: 14,
      paddingRight: 14,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    }, {}, [
      vnode(`${prefix}-i2t`, 'text', '내보내기', { fontSize: 12, fontWeight: 600, color: '#1e293b' }, {}, [], '내보내기'),
      vnode(`${prefix}-i2k`, 'text', 'Ctrl+E', { fontSize: 11, color: '#94a3b8' }, {}, [], 'Ctrl+E')
    ]),
    vnode(`${prefix}-div`, 'divider', 'Menu Divider', {
      width: '100%',
      height: 1,
      backgroundColor: '#f1f5f9',
      marginTop: 4,
      marginBottom: 4
    }),
    vnode(`${prefix}-i3`, 'container', '디자인 시스템', {
      height: 34,
      paddingLeft: 14,
      paddingRight: 14,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
    }, {}, [
      vnode(`${prefix}-i3ic`, 'icon', 'Palette', { color: '#4f46e5' }, { icon: 'palette', size: 14 }),
      vnode(`${prefix}-i3t`, 'text', '디자인 시스템', { fontSize: 12, fontWeight: 600, color: '#1e293b' }, {}, [], '디자인 시스템')
    ]),
    vnode(`${prefix}-i4`, 'container', '환경 설정', {
      height: 34,
      paddingLeft: 14,
      paddingRight: 14,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
    }, {}, [
      vnode(`${prefix}-i4t`, 'text', '환경 설정', { fontSize: 12, fontWeight: 600, color: '#1e293b' }, {}, [], '환경 설정')
    ])
  ]);
}
