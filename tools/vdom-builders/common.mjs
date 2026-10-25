// Common Pure VDOM Builders for Screen Designer 1:1 Self-Storyboard
export function vnode(id, type, name, style = {}, props = {}, children = [], content = undefined) {
  const node = { id, type, name, style };
  if (props && Object.keys(props).length > 0) node.props = props;
  if (content !== undefined) node.content = content;
  if (children && children.length > 0) node.children = children;
  return node;
}

// 1. Two-Tier ClaudeHeader (Exact 1:1 with ClaudeHeader.tsx)
export function createHeaderVNode(prefix = 'hdr', options = {}) {
  const {
    pageTitle = '4. 커맨드 팔레트 & 환경설정',
    activeMenu = null,
    zoomText = '88%',
    pageCountText = '4 / 1',
    gitCount = '35',
    activeTool = 'select'
  } = options;

  // Row 1: Top Caption Bar (36px)
  const row1 = vnode(`${prefix}-r1`, 'header', 'Header Row 1 (Title & Window Bar)', {
    width: '100%',
    height: 36,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
    paddingLeft: 12,
    paddingRight: 10,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0
  }, {}, [
    // Left: App Dot + Icon + Title + Divider + Page Selector
    vnode(`${prefix}-r1-l`, 'container', 'Caption Left', {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
    }, {}, [
      vnode(`${prefix}-dot`, 'box', 'Status Dot', {
        width: 10,
        height: 10,
        borderRadius: 9999,
        backgroundColor: '#4f46e5'
      }),
      vnode(`${prefix}-logo`, 'box', 'App Logo Box', {
        width: 20,
        height: 20,
        borderRadius: 6,
        backgroundColor: '#4f46e5',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }, {}, [
        vnode(`${prefix}-logo-ic`, 'icon', 'Layers Icon', { color: '#ffffff' }, { icon: 'layers', size: 12 })
      ]),
      vnode(`${prefix}-title`, 'text', 'App Title', {
        fontSize: 12,
        fontWeight: 700,
        color: '#0f172a',
        whiteSpace: 'nowrap'
      }, {}, [], 'Screen Designer - Visual Storyb...'),
      vnode(`${prefix}-div1`, 'divider', 'Divider', {
        width: 1,
        height: 14,
        backgroundColor: '#e2e8f0'
      }),
      vnode(`${prefix}-page-sel`, 'button', 'Page Selector', {
        height: 24,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 6,
        backgroundColor: '#ffffff',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
      }, {}, [
        vnode(`${prefix}-page-txt`, 'text', 'Active Page Name', {
          fontSize: 11,
          fontWeight: 600,
          color: '#334155'
        }, {}, [], pageTitle),
        vnode(`${prefix}-page-chv`, 'icon', 'ChevronDown', { color: '#94a3b8' }, { icon: 'chevron-down', size: 12 })
      ])
    ]),

    // Center: Drag Pill
    vnode(`${prefix}-drag-pill`, 'box', 'Window Drag Handle', {
      width: 44,
      height: 4,
      borderRadius: 9999,
      backgroundColor: '#e2e8f0'
    }),

    // Right: Share, Design System, Language, Settings, Sidebar Toggle, Fullscreen
    vnode(`${prefix}-r1-r`, 'container', 'Caption Right', {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6
    }, {}, [
      vnode(`${prefix}-btn-share`, 'button', 'Share Button', {
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: 'transparent'
      }, {}, [
        vnode(`${prefix}-ic-share`, 'icon', 'Share2', { color: '#64748b' }, { icon: 'share-2', size: 13 })
      ]),
      vnode(`${prefix}-btn-ds`, 'button', 'Design System Pill', {
        height: 24,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 9999,
        backgroundColor: '#eef2ff',
        borderWidth: 1,
        borderColor: '#c7d2fe',
        borderStyle: 'solid',
        gap: 5
      }, {}, [
        vnode(`${prefix}-ic-ds`, 'icon', 'Palette', { color: '#4f46e5' }, { icon: 'palette', size: 12 }),
        vnode(`${prefix}-txt-ds`, 'text', 'DS Label', { fontSize: 11, fontWeight: 700, color: '#4f46e5' }, {}, [], '디자인 시스템')
      ]),
      vnode(`${prefix}-btn-lang`, 'button', 'Language Selector', {
        height: 24,
        paddingLeft: 6,
        paddingRight: 6,
        borderRadius: 6,
        gap: 4
      }, {}, [
        vnode(`${prefix}-ic-lang`, 'icon', 'Globe', { color: '#64748b' }, { icon: 'globe', size: 12 }),
        vnode(`${prefix}-txt-lang`, 'text', 'KO', { fontSize: 11, fontWeight: 600, color: '#475569' }, {}, [], 'KO'),
        vnode(`${prefix}-chv-lang`, 'icon', 'ChevronDown', { color: '#94a3b8' }, { icon: 'chevron-down', size: 10 })
      ]),
      vnode(`${prefix}-btn-set`, 'button', 'Settings Button', {
        width: 24,
        height: 24,
        borderRadius: 6
      }, {}, [
        vnode(`${prefix}-ic-set`, 'icon', 'Settings', { color: '#64748b' }, { icon: 'settings', size: 13 })
      ]),
      vnode(`${prefix}-btn-pnl`, 'button', 'Right Panel Toggle', {
        width: 24,
        height: 24,
        borderRadius: 6,
        backgroundColor: '#eef2ff',
        borderWidth: 1,
        borderColor: '#c7d2fe',
        borderStyle: 'solid'
      }, {}, [
        vnode(`${prefix}-ic-pnl`, 'icon', 'PanelRight', { color: '#4f46e5' }, { icon: 'panel-right', size: 13 })
      ]),
      vnode(`${prefix}-div2`, 'divider', 'Divider', {
        width: 1,
        height: 14,
        backgroundColor: '#e2e8f0'
      }),
      vnode(`${prefix}-btn-fs`, 'button', 'Fullscreen Button', {
        height: 24,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 6,
        gap: 4
      }, {}, [
        vnode(`${prefix}-ic-fs`, 'icon', 'Maximize2', { color: '#64748b' }, { icon: 'maximize-2', size: 11 }),
        vnode(`${prefix}-txt-fs`, 'text', 'Fullscreen Text', { fontSize: 11, fontWeight: 600, color: '#475569' }, {}, [], '전체화면')
      ])
    ])
  ]);

  // Row 2: Main Toolbar (40px)
  const menuItems = [
    { id: 'file', label: '파일' },
    { id: 'edit', label: '편집' },
    { id: 'view', label: '보기' },
    { id: 'help', label: '도움말' }
  ];

  const row2 = vnode(`${prefix}-r2`, 'container', 'Header Row 2 (Toolbar)', {
    width: '100%',
    height: 40,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
    paddingLeft: 12,
    paddingRight: 12,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    flexShrink: 0
  }, {}, [
    // Left: Menu Bar + Search Input
    vnode(`${prefix}-r2-l`, 'container', 'Toolbar Left', {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6
    }, {}, [
      ...menuItems.map((m) =>
        vnode(`${prefix}-m-${m.id}`, 'button', `Menu ${m.label}`, {
          height: 26,
          paddingLeft: 8,
          paddingRight: 8,
          borderRadius: 6,
          backgroundColor: activeMenu === m.id ? '#eef2ff' : 'transparent',
          color: activeMenu === m.id ? '#4f46e5' : '#334155',
          fontSize: 12,
          fontWeight: activeMenu === m.id ? 700 : 600
        }, {}, [], m.label)
      ),
      vnode(`${prefix}-cmd-box`, 'button', 'Command Search Trigger', {
        width: 156,
        height: 26,
        paddingLeft: 8,
        paddingRight: 6,
        borderRadius: 8,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        justifyContent: 'space-between'
      }, {}, [
        vnode(`${prefix}-cmd-l`, 'container', 'Search Left', {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 5
        }, {}, [
          vnode(`${prefix}-cmd-ic`, 'icon', 'Search', { color: '#94a3b8' }, { icon: 'search', size: 12 }),
          vnode(`${prefix}-cmd-txt`, 'text', 'Placeholder', { fontSize: 11, color: '#94a3b8' }, {}, [], '명령 검색...')
        ]),
        vnode(`${prefix}-cmd-kbd`, 'badge', 'Ctrl+K', {
          paddingLeft: 4,
          paddingRight: 4,
          paddingTop: 1,
          paddingBottom: 1,
          borderRadius: 4,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderStyle: 'solid',
          fontSize: 9,
          fontWeight: 700,
          color: '#64748b'
        }, {}, [], 'Ctrl+K')
      ])
    ]),

    // Center: Undo/Redo + Tools + Alignment
    vnode(`${prefix}-r2-c`, 'container', 'Toolbar Center', {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
    }, {}, [
      // Undo / Redo
      vnode(`${prefix}-grp-hist`, 'container', 'History Group', {
        height: 28,
        paddingLeft: 4,
        paddingRight: 4,
        borderRadius: 8,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
      }, {}, [
        vnode(`${prefix}-btn-undo`, 'button', 'Undo', { width: 24, height: 22, borderRadius: 5 }, {}, [
          vnode(`${prefix}-ic-undo`, 'icon', 'RotateCcw', { color: '#cbd5e1' }, { icon: 'rotate-ccw', size: 13 })
        ]),
        vnode(`${prefix}-btn-redo`, 'button', 'Redo', { width: 24, height: 22, borderRadius: 5 }, {}, [
          vnode(`${prefix}-ic-redo`, 'icon', 'RotateCw', { color: '#cbd5e1' }, { icon: 'rotate-cw', size: 13 })
        ])
      ]),

      // Tools Group (Select, Hand, Frame, Text, Box, Circle)
      vnode(`${prefix}-grp-tools`, 'container', 'Tools Group', {
        height: 28,
        paddingLeft: 4,
        paddingRight: 4,
        borderRadius: 8,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
      }, {}, [
        { id: 'select', icon: 'mouse-pointer' },
        { id: 'hand', icon: 'hand' },
        { id: 'frame', icon: 'hash' },
        { id: 'text', icon: 'type' },
        { id: 'box', icon: 'square' },
        { id: 'circle', icon: 'circle' }
      ].map((t) =>
        vnode(`${prefix}-tl-${t.id}`, 'button', `Tool ${t.id}`, {
          width: 24,
          height: 22,
          borderRadius: 5,
          backgroundColor: activeTool === t.id ? '#eef2ff' : 'transparent',
          borderWidth: activeTool === t.id ? 1 : 0,
          borderColor: '#c7d2fe',
          borderStyle: 'solid'
        }, {}, [
          vnode(`${prefix}-ic-tl-${t.id}`, 'icon', t.icon, {
            color: activeTool === t.id ? '#4f46e5' : '#475569'
          }, { icon: t.icon, size: 13 })
        ])
      )),

      // Alignment Group
      vnode(`${prefix}-grp-align`, 'container', 'Align Group', {
        height: 28,
        paddingLeft: 4,
        paddingRight: 4,
        borderRadius: 8,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2
      }, {}, [
        'align-left',
        'align-center',
        'align-right',
        'arrow-up-down'
      ].map((ic, idx) =>
        vnode(`${prefix}-al-${idx}`, 'button', `Align ${idx}`, { width: 22, height: 22, borderRadius: 5 }, {}, [
          vnode(`${prefix}-ic-al-${idx}`, 'icon', ic, { color: '#cbd5e1' }, { icon: ic, size: 12 })
        ])
      ))
    ]),

    // Right: Flow, PLAY, Zoom, Counter, Git Branch, Commit
    vnode(`${prefix}-r2-r`, 'container', 'Toolbar Right', {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6
    }, {}, [
      vnode(`${prefix}-btn-flow`, 'button', 'Flow Toggle', {
        height: 28,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 8,
        backgroundColor: '#faf5ff',
        borderWidth: 1,
        borderColor: '#d8b4fe',
        borderStyle: 'solid',
        gap: 5
      }, {}, [
        vnode(`${prefix}-ic-zap`, 'icon', 'Zap', { color: '#7e22ce' }, { icon: 'zap', size: 12 }),
        vnode(`${prefix}-txt-flow`, 'text', '플로우', { fontSize: 11, fontWeight: 700, color: '#7e22ce' }, {}, [], '플로우'),
        vnode(`${prefix}-dot-flow`, 'box', 'Dot', { width: 6, height: 6, borderRadius: 9999, backgroundColor: '#a855f7' })
      ]),
      vnode(`${prefix}-btn-play`, 'button', 'PLAY Button', {
        height: 28,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 8,
        backgroundColor: '#4f46e5',
        gap: 5
      }, {}, [
        vnode(`${prefix}-ic-play`, 'icon', 'Play', { color: '#ffffff' }, { icon: 'play', size: 11 }),
        vnode(`${prefix}-txt-play`, 'text', 'PLAY', { fontSize: 11, fontWeight: 700, color: '#ffffff' }, {}, [], 'PLAY')
      ]),
      vnode(`${prefix}-div3`, 'divider', 'Divider', { width: 1, height: 16, backgroundColor: '#e2e8f0' }),
      vnode(`${prefix}-zoom`, 'container', 'Zoom Control', {
        height: 28,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 8,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 5
      }, {}, [
        vnode(`${prefix}-ic-zout`, 'icon', 'ZoomOut', { color: '#64748b' }, { icon: 'zoom-out', size: 12 }),
        vnode(`${prefix}-txt-zoom`, 'text', 'Zoom Val', { fontSize: 11, fontWeight: 700, color: '#334155' }, {}, [], zoomText),
        vnode(`${prefix}-ic-zchv`, 'icon', 'ChevronDown', { color: '#94a3b8' }, { icon: 'chevron-down', size: 10 }),
        vnode(`${prefix}-ic-zin`, 'icon', 'ZoomIn', { color: '#64748b' }, { icon: 'zoom-in', size: 12 })
      ]),
      vnode(`${prefix}-cnt`, 'container', 'Artboard Counter', {
        height: 28,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 8,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
      }, {}, [
        vnode(`${prefix}-txt-cnt`, 'text', 'Counter', { fontSize: 11, fontWeight: 700, color: '#334155' }, {}, [], pageCountText),
        vnode(`${prefix}-ic-prev`, 'icon', 'ChevronLeft', { color: '#94a3b8' }, { icon: 'chevron-left', size: 11 }),
        vnode(`${prefix}-ic-next`, 'icon', 'ChevronRight', { color: '#94a3b8' }, { icon: 'chevron-right', size: 11 })
      ]),
      vnode(`${prefix}-git-br`, 'button', 'Git Branch Pill', {
        height: 28,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 8,
        backgroundColor: '#fffbeb',
        borderWidth: 1,
        borderColor: '#fde68a',
        borderStyle: 'solid',
        gap: 5
      }, {}, [
        vnode(`${prefix}-ic-gbr`, 'icon', 'GitBranch', { color: '#d97706' }, { icon: 'git-branch', size: 12 }),
        vnode(`${prefix}-txt-gbr`, 'text', 'main', { fontSize: 11, fontWeight: 700, color: '#92400e' }, {}, [], 'main'),
        vnode(`${prefix}-bdg-gbr`, 'badge', 'Count', {
          paddingLeft: 5,
          paddingRight: 5,
          paddingTop: 1,
          paddingBottom: 1,
          borderRadius: 9999,
          backgroundColor: '#f59e0b',
          color: '#ffffff',
          fontSize: 9,
          fontWeight: 700
        }, {}, [], gitCount)
      ]),
      vnode(`${prefix}-git-cm`, 'button', 'Git Commit Button', {
        height: 28,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 8,
        backgroundColor: '#2563eb',
        gap: 5
      }, {}, [
        vnode(`${prefix}-ic-gcm`, 'icon', 'GitCommit', { color: '#ffffff' }, { icon: 'git-commit', size: 12 }),
        vnode(`${prefix}-txt-gcm`, 'text', 'Commit Label', { fontSize: 11, fontWeight: 700, color: '#ffffff' }, {}, [], `커밋 (${gitCount})`)
      ])
    ])
  ]);

  return vnode(`${prefix}-wrap`, 'container', 'ClaudeHeader 2-Tier', {
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    zIndex: 40
  }, {}, [row1, row2]);
}

// 2. Left Sidebar (Layers, Components, Templates)
export function createLeftSidebarVNode(prefix = 'ls', activeTab = 'layers', width = 270) {
  const tabDefs = [
    { id: 'layers', label: '레이어', icon: 'layers' },
    { id: 'components', label: '컴포넌트', icon: 'component' },
    { id: 'templates', label: '템플릿', icon: 'sparkles' }
  ];

  const tabBar = vnode(`${prefix}-tabs`, 'container', 'Left Sidebar Tabs', {
    width: '100%',
    height: 44,
    padding: 5,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    flexShrink: 0
  }, {}, tabDefs.map((t) => {
    const isAct = activeTab === t.id;
    return vnode(`${prefix}-tab-${t.id}`, 'button', `Tab ${t.label}`, {
      flex: 1,
      height: 32,
      borderRadius: 8,
      backgroundColor: isAct ? '#ffffff' : 'transparent',
      borderWidth: isAct ? 1 : 0,
      borderColor: '#e2e8f0',
      borderStyle: 'solid',
      boxShadow: isAct ? '0 1px 2px rgba(0,0,0,0.04)' : 'none',
      gap: 5
    }, {}, [
      vnode(`${prefix}-tic-${t.id}`, 'icon', t.icon, { color: isAct ? '#0f172a' : '#64748b' }, { icon: t.icon, size: 12 }),
      vnode(`${prefix}-ttx-${t.id}`, 'text', t.label, {
        fontSize: 11,
        fontWeight: isAct ? 700 : 600,
        color: isAct ? '#0f172a' : '#64748b'
      }, {}, [], t.label)
    ]);
  }));

  let bodyContent = [];

  if (activeTab === 'layers') {
    const searchRow = vnode(`${prefix}-search-wrap`, 'container', 'Search Box Wrap', {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f1f5f9',
      borderBottomStyle: 'solid'
    }, {}, [
      vnode(`${prefix}-search-box`, 'container', 'Search Input Box', {
        height: 30,
        paddingLeft: 10,
        paddingRight: 10,
        borderRadius: 8,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
      }, {}, [
        vnode(`${prefix}-s-ic`, 'icon', 'Search', { color: '#94a3b8' }, { icon: 'search', size: 12 }),
        vnode(`${prefix}-s-txt`, 'text', '레이어 검색...', { fontSize: 11, color: '#94a3b8' }, {}, [], '레이어 검색...')
      ])
    ]);

    const treeItems = [
      { id: 'ab1', type: 'artboard', label: '11. 스포트라이트 커맨드 팔레...', dim: '1600×1000', open: true },
      { id: 'n1', indent: 1, icon: 'square', color: '#6366f1', label: 'root-ws-1 (Frame Root)', active: true },
      { id: 'n2', indent: 2, icon: 'square', color: '#64748b', label: 'bar-caption (Header Row 1)' },
      { id: 'n3', indent: 3, icon: 'square', color: '#64748b', label: 'cap-left' },
      { id: 'n4', indent: 4, icon: 'square', color: '#6366f1', label: 'cap-logo' },
      { id: 'n5', indent: 4, icon: 'type', color: '#d97706', label: 'cap-title' },
      { id: 'n6', indent: 4, icon: 'minus', color: '#94a3b8', label: 'cap-divider' },
      { id: 'n7', indent: 4, icon: 'mouse-pointer', color: '#6366f1', label: 'cap-page-selector' },
      { id: 'n8', indent: 3, icon: 'square', color: '#64748b', label: 'cap-right' },
      { id: 'n9', indent: 4, icon: 'mouse-pointer', color: '#6366f1', label: 'cap-btn-design-system' },
      { id: 'n10', indent: 4, icon: 'mouse-pointer', color: '#6366f1', label: 'cap-btn-settings' },
      { id: 'n11', indent: 2, icon: 'square', color: '#64748b', label: 'bar-toolbar (Header Row 2)' },
      { id: 'n12', indent: 3, icon: 'square', color: '#64748b', label: 'tb-left (Menus & Search)' },
      { id: 'n13', indent: 3, icon: 'square', color: '#64748b', label: 'tb-center (Tools)' },
      { id: 'n14', indent: 3, icon: 'square', color: '#64748b', label: 'tb-right (Play & Git)' },
      { id: 'ab2', type: 'artboard', label: '12. 환경설정 및 저장소 경로 ...', dim: '1600×1000', open: false },
      { id: 'ab3', type: 'artboard', label: '13. 키보드 단축키 안내 다이...', dim: '1600×1000', open: false },
      { id: 'ab4', type: 'artboard', label: '14. 데스크톱 헤더 메뉴바 & ...', dim: '1600×1000', open: false }
    ];

    const treeContainer = vnode(`${prefix}-tree`, 'container', 'Layer Tree List', {
      padding: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 3,
      flex: 1,
      overflow: 'hidden'
    }, {}, treeItems.map((item) => {
      if (item.type === 'artboard') {
        return vnode(`${prefix}-tr-${item.id}`, 'container', item.label, {
          height: 28,
          paddingLeft: 6,
          paddingRight: 6,
          borderRadius: 6,
          backgroundColor: item.open ? '#f8fafc' : 'transparent',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }, {}, [
          vnode(`${prefix}-tr-l-${item.id}`, 'container', 'Left', {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6
          }, {}, [
            vnode(`${prefix}-tr-ic-${item.id}`, 'icon', 'Monitor', { color: '#4f46e5' }, { icon: 'monitor', size: 12 }),
            vnode(`${prefix}-tr-tx-${item.id}`, 'text', item.label, {
              fontSize: 11,
              fontWeight: 700,
              color: '#1e293b'
            }, {}, [], item.label)
          ]),
          vnode(`${prefix}-tr-dm-${item.id}`, 'text', item.dim, {
            fontSize: 9,
            fontMono: true,
            color: '#94a3b8'
          }, {}, [], item.dim)
        ]);
      }
      return vnode(`${prefix}-tr-${item.id}`, 'container', item.label, {
        height: 24,
        paddingLeft: 8 + item.indent * 12,
        paddingRight: 8,
        borderRadius: 6,
        backgroundColor: item.active ? '#eef2ff' : 'transparent',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
      }, {}, [
        vnode(`${prefix}-tr-chv-${item.id}`, 'icon', 'ChevronDown', { color: '#94a3b8' }, { icon: 'chevron-down', size: 10 }),
        vnode(`${prefix}-tr-ic-${item.id}`, 'icon', item.icon, { color: item.active ? '#4f46e5' : item.color }, { icon: item.icon, size: 11 }),
        vnode(`${prefix}-tr-tx-${item.id}`, 'text', item.label, {
          fontSize: 11,
          fontWeight: item.active ? 700 : 500,
          color: item.active ? '#4f46e5' : '#475569'
        }, {}, [], item.label)
      ]);
    }));

    bodyContent = [searchRow, treeContainer];
  } else if (activeTab === 'components') {
    const cats = ['전체', '레이아웃', '미디어', '텍스트', '폼·버튼'];
    const catRow = vnode(`${prefix}-c-cats`, 'container', 'Component Categories', {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f1f5f9',
      borderBottomStyle: 'solid',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4
    }, {}, cats.map((c, idx) =>
      vnode(`${prefix}-cc-${idx}`, 'badge', c, {
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 9999,
        backgroundColor: idx === 0 ? '#4f46e5' : '#f1f5f9',
        color: idx === 0 ? '#ffffff' : '#475569',
        fontSize: 10,
        fontWeight: 700
      }, {}, [], c)
    ));

    const subHdr = vnode(`${prefix}-c-sub`, 'container', 'Components Subheader', {
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 8,
      paddingBottom: 4,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    }, {}, [
      vnode(`${prefix}-cs-l`, 'text', 'Count', { fontSize: 10, fontWeight: 600, color: '#94a3b8' }, {}, [], '클릭하여 캔버스에 추가 (20개)'),
      vnode(`${prefix}-cs-r`, 'text', 'Defaults', { fontSize: 10, fontWeight: 700, color: '#4f46e5' }, {}, [], '†† 기본값')
    ]);

    const compItems = [
      { title: '스크롤 컨테이너', sub: '마우스 휠 스크롤 영역 (Auto O...', icon: 'scroll-text', bg: '#fffbeb', fg: '#d97706' },
      { title: '모달 다이얼로그', sub: '팝업 모달 창 (Backdrop + Close)', icon: 'message-square', bg: '#ecfdf5', fg: '#059669' },
      { title: '카드 컨테이너', sub: '배경색 및 곡률이 적용된 박스', icon: 'credit-card', bg: '#f5f3ff', fg: '#7c3aed' },
      { title: '시맨틱 섹션 (<section>)', sub: '페이지 주요 블록 구획', icon: 'layout', bg: '#eff6ff', fg: '#2563eb' },
      { title: '헤더 영역 (<header>)', sub: '상단 네비게이션 및 타이틀 바', icon: 'panel-top', bg: '#eef2ff', fg: '#4f46e5' },
      { title: '푸터 영역 (<footer>)', sub: '하단 정보 및 라이선스 영역', icon: 'panel-bottom', bg: '#eef2ff', fg: '#4f46e5' },
      { title: '이미지 (<img>)', sub: '반응형 이미지 (Cover / Fit)', icon: 'image', bg: '#fdf2f8', fg: '#db2777' },
      { title: '비디오 플레이어 (<video>)', sub: '미디어 영상 플레이어', icon: 'video', bg: '#fef2f2', fg: '#dc2626' },
      { title: '대제목 (Heading H2)', sub: '22px Bold 타이틀', icon: 'heading', bg: '#fffbeb', fg: '#d97706' },
      { title: '본문 단락 (<p>)', sub: '일반 텍스트 문단', icon: 'type', bg: '#fffbeb', fg: '#d97706' },
      { title: '인용구 (<blockquote>)', sub: '강조 인용 블록', icon: 'quote', bg: '#eff6ff', fg: '#2563eb' },
      { title: '코드 블록 (<code>)', sub: '고정폭 글꼴 인라인 코드', icon: 'code', bg: '#eef2ff', fg: '#4f46e5' },
      { title: 'CTA 액션 버튼', sub: '클릭 인터랙션 주 버튼', icon: 'mouse-pointer', bg: '#eef2ff', fg: '#4f46e5' }
    ];

    const compList = vnode(`${prefix}-c-list`, 'container', 'Component Cards List', {
      padding: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 8,
      flex: 1,
      overflow: 'hidden'
    }, {}, compItems.map((c, idx) =>
      vnode(`${prefix}-ci-${idx}`, 'card', c.title, {
        padding: 10,
        borderRadius: 14,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }, {}, [
        vnode(`${prefix}-ci-l-${idx}`, 'container', 'Left', {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 10
        }, {}, [
          vnode(`${prefix}-ci-ib-${idx}`, 'box', 'Icon Box', {
            width: 34,
            height: 34,
            borderRadius: 10,
            backgroundColor: c.bg,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }, {}, [
            vnode(`${prefix}-ci-ic-${idx}`, 'icon', c.icon, { color: c.fg }, { icon: c.icon, size: 15 })
          ]),
          vnode(`${prefix}-ci-tx-${idx}`, 'container', 'Texts', {
            display: 'flex',
            flexDirection: 'column',
            gap: 1
          }, {}, [
            vnode(`${prefix}-ci-t-${idx}`, 'text', 'Title', { fontSize: 11, fontWeight: 700, color: '#0f172a' }, {}, [], c.title),
            vnode(`${prefix}-ci-s-${idx}`, 'text', 'Sub', { fontSize: 10, color: '#64748b' }, {}, [], c.sub)
          ])
        ]),
        vnode(`${prefix}-ci-pl-${idx}`, 'box', 'Plus Circle', {
          width: 22,
          height: 22,
          borderRadius: 9999,
          backgroundColor: '#f8fafc',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderStyle: 'solid',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: 12,
          color: '#64748b',
          flexShrink: 0
        }, {}, [], '+')
      ])
    ));

    bodyContent = [catRow, subHdr, compList];
  } else if (activeTab === 'templates') {
    const cats = ['전체', '히어로', '지표 카드', '헤더 바', '로그인'];
    const catRow = vnode(`${prefix}-t-cats`, 'container', 'Template Categories', {
      padding: 10,
      borderBottomWidth: 1,
      borderBottomColor: '#f1f5f9',
      borderBottomStyle: 'solid',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4
    }, {}, cats.map((c, idx) =>
      vnode(`${prefix}-tc-${idx}`, 'badge', c, {
        paddingLeft: 8,
        paddingRight: 8,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 9999,
        backgroundColor: idx === 0 ? '#4f46e5' : '#f1f5f9',
        color: idx === 0 ? '#ffffff' : '#475569',
        fontSize: 10,
        fontWeight: 700
      }, {}, [], c)
    ));

    const subHdr = vnode(`${prefix}-t-sub`, 'container', 'Templates Subheader', {
      paddingLeft: 12,
      paddingRight: 12,
      paddingTop: 8,
      paddingBottom: 4
    }, {}, [
      vnode(`${prefix}-ts-l`, 'text', 'Count', { fontSize: 10, fontWeight: 600, color: '#94a3b8' }, {}, [], '원클릭 섹션 템플릿 삽입 (6개)')
    ]);

    const tplItems = [
      { title: '모던 히어로 섹션 (Hero Section)', badge: '인기', desc: '타이틀, 배지, 서브텍스트 및 액션 CTA 버튼 그룹' },
      { title: '통계 지표 카드 행 (Metric Cards Row)', badge: '필수', desc: '3열 핵심 KPI 지표 및 상승/하락 트렌드 배지' },
      { title: '앱 상단 네비게이션 (Navbar / Header)', badge: '', desc: '로고, 4개 메뉴 링크, 검색 입력창 및 사용자 프로필 버튼' },
      { title: '로그인 & 가입 폼 카드 (Auth Form)', badge: '추천', desc: '이메일, 비밀번호, 자동로그인 체크박스 및 그라데이션 로그인 버튼' },
      { title: '가격 책정 티어 카드 (Pricing Tier Card)', badge: '', desc: '월간 요금제, 인기 배지, 5개 기능 체크리스트 및 결제 버튼' },
      { title: '모바일 하단 탭 바 (Mobile Bottom Tab Bar)', badge: '모바일', desc: '모바일 앱용 5개 탭 네비게이션 (홈, 지갑, 마켓, 알림, 프로필)' }
    ];

    const tplList = vnode(`${prefix}-t-list`, 'container', 'Template Cards List', {
      padding: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      flex: 1,
      overflow: 'hidden'
    }, {}, tplItems.map((t, idx) =>
      vnode(`${prefix}-ti-${idx}`, 'card', t.title, {
        padding: 12,
        borderRadius: 16,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }, {}, [
        vnode(`${prefix}-ti-top-${idx}`, 'container', 'Top Row', {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 6
        }, {}, [
          vnode(`${prefix}-ti-tl-${idx}`, 'container', 'Icon & Title', {
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            gap: 6
          }, {}, [
            vnode(`${prefix}-ti-ic-${idx}`, 'icon', 'Layout', { color: '#4f46e5' }, { icon: 'layout', size: 13 }),
            vnode(`${prefix}-ti-tx-${idx}`, 'text', 'Title', { fontSize: 11, fontWeight: 700, color: '#0f172a' }, {}, [], t.title)
          ]),
          ...(t.badge ? [
            vnode(`${prefix}-ti-bdg-${idx}`, 'badge', t.badge, {
              paddingLeft: 6,
              paddingRight: 6,
              paddingTop: 2,
              paddingBottom: 2,
              borderRadius: 6,
              backgroundColor: '#eef2ff',
              color: '#4f46e5',
              fontSize: 9,
              fontWeight: 700
            }, {}, [], t.badge)
          ] : [])
        ]),
        vnode(`${prefix}-ti-desc-${idx}`, 'text', 'Desc', { fontSize: 10, color: '#64748b', lineHeight: 1.4 }, {}, [], t.desc),
        vnode(`${prefix}-ti-bot-${idx}`, 'container', 'Bottom Action', {
          display: 'flex',
          flexDirection: 'row',
          justifyContent: 'flex-end'
        }, {}, [
          vnode(`${prefix}-ti-btn-${idx}`, 'button', '+ 장표에 추가', {
            height: 26,
            paddingLeft: 10,
            paddingRight: 10,
            borderRadius: 8,
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            fontSize: 10,
            fontWeight: 700
          }, {}, [], '+ 장표에 추가')
        ])
      ])
    ));

    bodyContent = [catRow, subHdr, tplList];
  }

  return vnode(`${prefix}-sidebar`, 'aside', 'Left Sidebar Panel', {
    width,
    height: '100%',
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    borderRightStyle: 'solid',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    overflow: 'hidden'
  }, {}, [tabBar, ...bodyContent]);
}

// 3. Center Canvas Area (With 24px Radial Grid, Optional Rulers, and Nested Artboard Preview)
export function createCenterCanvasVNode(prefix = 'cv', options = {}) {
  const { showRulers = false } = options;

  // Nested Artboard Card rendered inside the infinite canvas (mirrors 01-workspace-main.png)
  const nestedArtboard = vnode(`${prefix}-artboard-card`, 'container', 'Canvas Artboard Preview', {
    width: 920,
    height: 760,
    borderRadius: 16,
    backgroundColor: '#cbd5e1',
    borderWidth: 2,
    borderColor: '#6366f1',
    borderStyle: 'solid',
    boxShadow: '0 25px 50px -12px rgba(15, 23, 42, 0.25)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'relative'
  }, {}, [
    // Simulated nested workspace header inside canvas artboard
    vnode(`${prefix}-na-hdr`, 'container', 'Nested Header', {
      height: 56,
      backgroundColor: '#f8fafc',
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
      borderBottomStyle: 'solid',
      paddingLeft: 14,
      paddingRight: 14,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    }, {}, [
      vnode(`${prefix}-na-hl`, 'container', 'Left', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }, {}, [
        vnode(`${prefix}-na-dot`, 'box', 'Dot', { width: 10, height: 10, borderRadius: 9999, backgroundColor: '#4f46e5' }),
        vnode(`${prefix}-na-t`, 'text', 'Title', { fontSize: 11, fontWeight: 700, color: '#1e293b' }, {}, [], 'Fintech Service UI Storyboard  |  1. Core Canvas Workspace')
      ]),
      vnode(`${prefix}-na-hr`, 'badge', 'PLAY', {
        paddingLeft: 10,
        paddingRight: 10,
        paddingTop: 4,
        paddingBottom: 4,
        borderRadius: 6,
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        fontSize: 10,
        fontWeight: 700
      }, {}, [], '▶ PLAY')
    ]),

    // Simulated nested body (Left tree + dark canvas with spotlight card)
    vnode(`${prefix}-na-body`, 'container', 'Nested Body', {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden',
      position: 'relative'
    }, {}, [
      // Nested Left Tree (210px)
      vnode(`${prefix}-na-ls`, 'container', 'Nested Left Tree', {
        width: 210,
        backgroundColor: '#f1f5f9',
        borderRightWidth: 1,
        borderRightColor: '#cbd5e1',
        borderRightStyle: 'solid',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }, {}, [
        vnode(`${prefix}-nl-1`, 'text', 'T1', { fontSize: 10, fontWeight: 700, color: '#334155' }, {}, [], '▣ 1. 메인 무한 캔버스 & 3분할...'),
        vnode(`${prefix}-nl-2`, 'text', 'T2', { fontSize: 10, color: '#475569', paddingLeft: 10 }, {}, [], '⌄ ◻ root-ws-1'),
        vnode(`${prefix}-nl-3`, 'text', 'T3', { fontSize: 10, color: '#475569', paddingLeft: 20 }, {}, [], '⌄ ◻ bar-caption'),
        vnode(`${prefix}-nl-4`, 'text', 'T4', { fontSize: 10, color: '#64748b', paddingLeft: 30 }, {}, [], '◻ cap-logo'),
        vnode(`${prefix}-nl-5`, 'text', 'T5', { fontSize: 10, color: '#64748b', paddingLeft: 30 }, {}, [], 'T cap-title'),
        vnode(`${prefix}-nl-6`, 'text', 'T6', { fontSize: 10, color: '#475569', paddingLeft: 20 }, {}, [], '⌄ ◻ bar-toolbar'),
        vnode(`${prefix}-nl-7`, 'text', 'T7', { fontSize: 10, color: '#64748b', paddingLeft: 30 }, {}, [], 'T tb-m-file'),
        vnode(`${prefix}-nl-8`, 'text', 'T8', { fontSize: 10, color: '#64748b', paddingLeft: 30 }, {}, [], 'T tb-m-edit')
      ]),

      // Nested Dark Canvas Area
      vnode(`${prefix}-na-cv`, 'container', 'Nested Dark Canvas', {
        flex: 1,
        backgroundColor: '#94a3b8',
        backgroundImage: 'radial-gradient(#64748b 1px, transparent 1px)',
        backgroundSize: '18px 18px',
        padding: 28,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative'
      }, {}, [
        // Dark Frame Box
        vnode(`${prefix}-na-dark`, 'container', 'Dark Artboard', {
          width: '100%',
          height: '100%',
          borderRadius: 14,
          backgroundColor: '#090d16',
          borderWidth: 1,
          borderColor: '#334155',
          borderStyle: 'solid',
          padding: 20,
          display: 'flex',
          flexDirection: 'column',
          gap: 12,
          position: 'relative'
        }, {}, [
          vnode(`${prefix}-nd-hdr`, 'text', 'Header', { fontSize: 11, fontWeight: 700, color: '#94a3b8' }, {}, [], 'Screen Designer - Live Storyboard Engine'),
          vnode(`${prefix}-nd-sel`, 'badge', 'Selected CTA', {
            padding: 8,
            borderRadius: 8,
            backgroundColor: '#312e81',
            borderWidth: 1,
            borderColor: '#6366f1',
            borderStyle: 'solid',
            color: '#e0e7ff',
            fontSize: 10,
            fontWeight: 700,
            width: 200
          }, {}, [], '★ CTA 실행 버튼 (Selected)'),

          // Mini Spotlight Preview Card (matches 01-workspace-main.png center!)
          vnode(`${prefix}-nd-spot`, 'card', 'Spotlight Preview Card', {
            width: 440,
            backgroundColor: '#ffffff',
            borderRadius: 14,
            boxShadow: '0 20px 35px rgba(0,0,0,0.45)',
            padding: 12,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            position: 'absolute',
            top: 24,
            left: 130
          }, {}, [
            vnode(`${prefix}-nds-s`, 'container', 'Search Row', {
              height: 32,
              borderBottomWidth: 1,
              borderBottomColor: '#f1f5f9',
              borderBottomStyle: 'solid',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }, {}, [
              vnode(`${prefix}-nds-st`, 'text', 'Search Text', { fontSize: 11, color: '#94a3b8' }, {}, [], '🔍 명령어, 컴포넌트, 페이지 또는 화면 검색... (Ctrl+K)'),
              vnode(`${prefix}-nds-esc`, 'badge', 'ESC', { fontSize: 9, backgroundColor: '#f1f5f9', color: '#64748b', paddingLeft: 5, paddingRight: 5, borderRadius: 4 }, {}, [], 'ESC')
            ]),
            vnode(`${prefix}-nds-r1`, 'container', 'Active Row', {
              padding: 10,
              borderRadius: 10,
              backgroundColor: '#4f46e5',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between'
            }, {}, [
              vnode(`${prefix}-nds-r1t`, 'text', 'Row1 Text', { fontSize: 11, fontWeight: 700, color: '#ffffff' }, {}, [], '▶ 인터랙티브 프로토타입 실행 (Play Mode)'),
              vnode(`${prefix}-nds-r1k`, 'badge', 'Ctrl+P', { fontSize: 9, backgroundColor: 'rgba(255,255,255,0.2)', color: '#ffffff', paddingLeft: 5, paddingRight: 5, borderRadius: 4 }, {}, [], 'Ctrl+P ↵')
            ]),
            vnode(`${prefix}-nds-r2`, 'text', 'Row2', { fontSize: 10, fontWeight: 600, color: '#1e293b', paddingLeft: 6 }, {}, [], '🎨 디자인 시스템 스튜디오 열기 (45종 컴포넌트 기본값 설정)'),
            vnode(`${prefix}-nds-r3`, 'text', 'Row3', { fontSize: 10, fontWeight: 600, color: '#1e293b', paddingLeft: 6 }, {}, [], '🌿 Git 변경사항 감지 & 커밋/푸시 다이얼로그 (Ctrl+G)'),
            vnode(`${prefix}-nds-r4`, 'text', 'Row4', { fontSize: 10, fontWeight: 600, color: '#1e293b', paddingLeft: 6 }, {}, [], '＋ 새 스크린 프레임/아트보드 추가 (F)'),
            vnode(`${prefix}-nds-r5`, 'text', 'Row5', { fontSize: 10, fontWeight: 600, color: '#1e293b', paddingLeft: 6 }, {}, [], '📏 캔버스 눈금자 & 가이드라인 토글 (Shift+R)')
          ])
        ])
      ])
    ])
  ]);

  const children = [nestedArtboard];

  if (showRulers) {
    // Top Horizontal Ruler (24px)
    const topRuler = vnode(`${prefix}-ruler-top`, 'container', 'Top Horizontal Ruler', {
      position: 'absolute',
      top: 0,
      left: 24,
      right: 0,
      height: 24,
      backgroundColor: '#f8fafc',
      borderBottomWidth: 1,
      borderBottomColor: '#cbd5e1',
      borderBottomStyle: 'solid',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 20
    }, {}, ['0', '100', '200', '300', '400', '500', '600', '700', '800', '900', '1000', '1100'].map((tk, i) =>
      vnode(`${prefix}-rt-${i}`, 'text', tk, { fontSize: 9, fontMono: true, color: '#64748b' }, {}, [], tk)
    ));

    // Left Vertical Ruler (24px)
    const leftRuler = vnode(`${prefix}-ruler-left`, 'container', 'Left Vertical Ruler', {
      position: 'absolute',
      top: 24,
      left: 0,
      bottom: 0,
      width: 24,
      backgroundColor: '#f8fafc',
      borderRightWidth: 1,
      borderRightColor: '#cbd5e1',
      borderRightStyle: 'solid',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-around',
      zIndex: 20
    }, {}, ['0', '100', '200', '300', '400', '500', '600', '700'].map((tk, i) =>
      vnode(`${prefix}-rl-${i}`, 'text', tk, { fontSize: 8, fontMono: true, color: '#64748b' }, {}, [], tk)
    ));

    // Corner px Box
    const cornerBox = vnode(`${prefix}-ruler-corner`, 'box', 'Ruler Corner px', {
      position: 'absolute',
      top: 0,
      left: 0,
      width: 24,
      height: 24,
      backgroundColor: '#f1f5f9',
      borderRightWidth: 1,
      borderRightColor: '#cbd5e1',
      borderRightStyle: 'solid',
      borderBottomWidth: 1,
      borderBottomColor: '#cbd5e1',
      borderBottomStyle: 'solid',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 8,
      fontMono: true,
      color: '#64748b',
      zIndex: 25
    }, {}, [], 'px');

    // Cyan Vertical Guideline (X: 400px)
    const vGuide = vnode(`${prefix}-guide-v`, 'box', 'Vertical Cyan Guide', {
      position: 'absolute',
      top: 0,
      bottom: 0,
      left: 260,
      width: 1,
      backgroundColor: '#06b6d4',
      zIndex: 15
    });

    // Cyan Horizontal Guideline (Y: 180px) + Badge
    const hGuide = vnode(`${prefix}-guide-h`, 'container', 'Horizontal Cyan Guide', {
      position: 'absolute',
      left: 0,
      right: 0,
      top: 180,
      height: 1,
      backgroundColor: '#06b6d4',
      zIndex: 15
    }, {}, [
      vnode(`${prefix}-guide-h-bdg`, 'badge', 'Y: 180px', {
        position: 'absolute',
        left: 32,
        top: -18,
        paddingLeft: 6,
        paddingRight: 6,
        paddingTop: 2,
        paddingBottom: 2,
        borderRadius: 4,
        backgroundColor: '#0891b2',
        color: '#ffffff',
        fontSize: 9,
        fontMono: true,
        fontWeight: 700
      }, {}, [], 'Y: 180px')
    ]);

    children.push(topRuler, leftRuler, cornerBox, vGuide, hGuide);
  }

  return vnode(`${prefix}-canvas-main`, 'main', 'Infinite Dot Grid Canvas', {
    flex: 1,
    height: '100%',
    backgroundColor: '#e2e8f0',
    backgroundImage: 'radial-gradient(#94a3b8 1px, transparent 1px)',
    backgroundSize: '24px 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
    overflow: 'hidden'
  }, {}, children);
}

// 4. Right Inspector Sidebar (Properties, Events, Code, Tweaks - Upgraded with Text Overflow Policy & Min Width 320px)
export function createRightSidebarVNode(prefix = 'rs', activeTab = 'properties', width = 350, selectedMode = 'selected') {
  const tabDefs = [
    { id: 'properties', label: '속성', color: '#4f46e5' },
    { id: 'events', label: '⚡ 이벤트', color: '#b45309' },
    { id: 'code', label: '코드', color: '#047857' },
    { id: 'tweaks', label: '트윅', color: '#4f46e5' }
  ];

  const tabBar = vnode(`${prefix}-tabs`, 'container', 'Right Sidebar Tabs (No-Wrap Policy)', {
    width: '100%',
    height: 44,
    paddingLeft: 8,
    paddingRight: 8,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 4,
    flexShrink: 0
  }, {}, [
    vnode(`${prefix}-tab-seg`, 'container', '4-Tab Segmented Grid', {
      flex: 1,
      padding: 2,
      borderRadius: 8,
      backgroundColor: '#e2e8f0',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 2
    }, {}, tabDefs.map((t) => {
      const isAct = activeTab === t.id;
      return vnode(`${prefix}-tab-${t.id}`, 'button', t.label, {
        flex: 1,
        height: 28,
        borderRadius: 6,
        backgroundColor: isAct ? '#ffffff' : 'transparent',
        borderWidth: isAct ? 1 : 0,
        borderColor: '#cbd5e1',
        borderStyle: 'solid',
        fontSize: 11,
        fontWeight: isAct ? 700 : 600,
        color: isAct ? t.color : '#475569',
        textAlign: 'center',
        whiteSpace: 'nowrap',
        textOverflow: 'ellipsis',
        overflow: 'hidden'
      }, {}, [], t.label);
    })),
    vnode(`${prefix}-tab-close`, 'button', 'Close Inspector', {
      width: 24,
      height: 24,
      borderRadius: 6,
      flexShrink: 0
    }, {}, [
      vnode(`${prefix}-ic-x`, 'icon', 'X', { color: '#94a3b8' }, { icon: 'x', size: 12 })
    ])
  ]);

  let body;

  if (activeTab === 'properties' && selectedMode === 'empty') {
    body = vnode(`${prefix}-empty`, 'container', 'Empty Inspector State', {
      flex: 1,
      padding: 24,
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10
    }, {}, [
      vnode(`${prefix}-em-ic`, 'icon', 'Box', { color: '#cbd5e1' }, { icon: 'box', size: 28 }),
      vnode(`${prefix}-em-t`, 'text', '선택된 노드가 없습니다', { fontSize: 12, fontWeight: 700, color: '#475569' }, {}, [], '선택된 노드가 없습니다'),
      vnode(`${prefix}-em-s`, 'text', 'Sub', { fontSize: 11, color: '#94a3b8', textAlign: 'center', lineHeight: 1.5 }, {}, [], '캔버스 화면에서 요소를 클릭하거나 좌측 레이어 목록에서 요소를 선택하세요.')
    ]);
  } else if (activeTab === 'properties') {
    const swatches = [
      '#0f172a', '#1e293b', '#334155', '#64748b', '#94a3b8', '#ffffff',
      '#4f46e5', '#6366f1', '#2563eb', '#0284c7', '#059669', '#10b981',
      '#d97706', '#ea580c', '#dc2626', '#e11d48', '#9333ea', '#7c3aed'
    ];

    body = vnode(`${prefix}-props-body`, 'container', 'Properties Inspector Body', {
      flex: 1,
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      overflow: 'hidden'
    }, {}, [
      // Visibility Card
      vnode(`${prefix}-vis-card`, 'card', 'Visibility Rule Card', {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }, {}, [
        vnode(`${prefix}-vis-top`, 'container', 'Top Row', {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }, {}, [
          vnode(`${prefix}-vis-lbl`, 'text', '표시 조건 (Visibility)', { fontSize: 11, fontWeight: 700, color: '#1e293b' }, {}, [], '👁 표시 조건 (Visibility)'),
          vnode(`${prefix}-vis-sw`, 'box', 'Toggle Switch', { width: 30, height: 16, borderRadius: 9999, backgroundColor: '#4f46e5' })
        ]),
        vnode(`${prefix}-vis-bdg`, 'badge', 'Condition Match', {
          padding: 4,
          borderRadius: 6,
          backgroundColor: '#ecfdf5',
          borderWidth: 1,
          borderColor: '#a7f3d0',
          borderStyle: 'solid',
          color: '#059669',
          fontSize: 10,
          fontWeight: 700
        }, {}, [], '✓ 조건 일치 (표시 중) · AND 2/2 충족')
      ]),

      // Selected Node Header
      vnode(`${prefix}-sec-id`, 'container', 'Node ID Section', { display: 'flex', flexDirection: 'column', gap: 5 }, {}, [
        vnode(`${prefix}-id-lbl`, 'text', 'BUTTON 요소 속성', { fontSize: 10, fontWeight: 700, color: '#4f46e5' }, {}, [], 'BUTTON 요소 속성'),
        vnode(`${prefix}-id-val`, 'box', 'Node ID Input', {
          height: 28,
          paddingLeft: 10,
          borderRadius: 6,
          backgroundColor: '#f8fafc',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderStyle: 'solid',
          display: 'flex',
          alignItems: 'center',
          fontSize: 11,
          fontMono: true,
          color: '#334155'
        }, {}, [], 'cta-action-btn-1')
      ]),

      // Color Swatches & Pickers
      vnode(`${prefix}-sec-col`, 'container', 'Colors Section', { display: 'flex', flexDirection: 'column', gap: 8 }, {}, [
        vnode(`${prefix}-col-lbl`, 'text', '색상 & 팔레트 스와치 (COLORS)', { fontSize: 10, fontWeight: 700, color: '#64748b' }, {}, [], '색상 & 팔레트 스와치 (COLORS)'),
        vnode(`${prefix}-sw-grid`, 'container', 'Swatch Row', {
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 5
        }, {}, swatches.map((hex, i) =>
          vnode(`${prefix}-sw-${i}`, 'box', hex, {
            width: 16,
            height: 16,
            borderRadius: 4,
            backgroundColor: hex,
            borderWidth: 1,
            borderColor: '#cbd5e1',
            borderStyle: 'solid'
          })
        )),
        vnode(`${prefix}-col-inputs`, 'container', 'BG & FG Inputs', {
          display: 'flex',
          flexDirection: 'row',
          gap: 8
        }, {}, [
          vnode(`${prefix}-ci-bg`, 'container', 'BG Col', { flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }, {}, [
            vnode(`${prefix}-ci-bgl`, 'text', '배경색', { fontSize: 9, color: '#94a3b8' }, {}, [], '배경색'),
            vnode(`${prefix}-ci-bgv`, 'box', '#4f46e5', {
              height: 28,
              paddingLeft: 8,
              borderRadius: 6,
              backgroundColor: '#f8fafc',
              borderWidth: 1,
              borderColor: '#e2e8f0',
              borderStyle: 'solid',
              display: 'flex',
              alignItems: 'center',
              fontSize: 11,
              fontMono: true,
              color: '#0f172a'
            }, {}, [], '#4f46e5')
          ]),
          vnode(`${prefix}-ci-fg`, 'container', 'FG Col', { flex: 1, display: 'flex', flexDirection: 'column', gap: 3 }, {}, [
            vnode(`${prefix}-ci-fgl`, 'text', '글자색', { fontSize: 9, color: '#94a3b8' }, {}, [], '글자색'),
            vnode(`${prefix}-ci-fgv`, 'box', '#ffffff', {
              height: 28,
              paddingLeft: 8,
              borderRadius: 6,
              backgroundColor: '#f8fafc',
              borderWidth: 1,
              borderColor: '#e2e8f0',
              borderStyle: 'solid',
              display: 'flex',
              alignItems: 'center',
              fontSize: 11,
              fontMono: true,
              color: '#0f172a'
            }, {}, [], '#ffffff')
          ])
        ])
      ]),

      // Flex Direction
      vnode(`${prefix}-sec-flex`, 'container', 'Flex Direction Section', { display: 'flex', flexDirection: 'column', gap: 6 }, {}, [
        vnode(`${prefix}-fl-lbl`, 'text', '컨테이너 정렬 방향 (FLEX LAYOUT)', { fontSize: 10, fontWeight: 700, color: '#64748b' }, {}, [], '컨테이너 정렬 방향 (FLEX LAYOUT)'),
        vnode(`${prefix}-fl-row`, 'container', 'Buttons Row', { display: 'flex', flexDirection: 'row', gap: 6 }, {}, [
          vnode(`${prefix}-fl-r`, 'button', 'Row', {
            flex: 1,
            height: 28,
            borderRadius: 6,
            backgroundColor: '#4f46e5',
            color: '#ffffff',
            fontSize: 10,
            fontWeight: 700
          }, {}, [], '가로 방향 (Row ➞)'),
          vnode(`${prefix}-fl-c`, 'button', 'Col', {
            flex: 1,
            height: 28,
            borderRadius: 6,
            backgroundColor: '#f8fafc',
            borderWidth: 1,
            borderColor: '#e2e8f0',
            borderStyle: 'solid',
            color: '#475569',
            fontSize: 10,
            fontWeight: 600
          }, {}, [], '세로 방향 (Col ⇣)')
        ])
      ]),

      // Text Overflow Policy & Minimum Size Section
      vnode(`${prefix}-sec-overflow`, 'card', 'Text Overflow & Min Size Policy', {
        padding: 10,
        borderRadius: 10,
        backgroundColor: '#eef2ff',
        borderWidth: 1,
        borderColor: '#c7d2fe',
        borderStyle: 'solid',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }, {}, [
        vnode(`${prefix}-ov-lbl`, 'text', '글자 넘침 정책 & 최소 크기 (OVERFLOW & MIN SIZE)', { fontSize: 10, fontWeight: 700, color: '#3730a3' }, {}, [], '글자 넘침 정책 & 최소 크기 (OVERFLOW & MIN SIZE)'),
        vnode(`${prefix}-ov-row`, 'container', 'Overflow Pills', { display: 'flex', flexDirection: 'row', gap: 4 }, {}, [
          vnode(`${prefix}-ov-1`, 'button', '단어 보호', { flex: 1, height: 24, borderRadius: 6, backgroundColor: '#4f46e5', color: '#ffffff', fontSize: 9, fontWeight: 700, whiteSpace: 'nowrap' }, {}, [], '단어 단위 (keep-all)'),
          vnode(`${prefix}-ov-2`, 'button', '1줄 말줄임', { flex: 1, height: 24, borderRadius: 6, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderStyle: 'solid', color: '#334155', fontSize: 9, fontWeight: 600, whiteSpace: 'nowrap' }, {}, [], '1줄 말줄임 (...)')
        ]),
        vnode(`${prefix}-ov-min`, 'container', 'Min W/H Row', { display: 'flex', flexDirection: 'row', gap: 6 }, {}, [
          vnode(`${prefix}-ov-mw`, 'box', 'Min W', { flex: 1, height: 24, paddingLeft: 6, borderRadius: 6, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderStyle: 'solid', display: 'flex', alignItems: 'center', fontSize: 10, fontMono: true, color: '#0f172a' }, {}, [], 'Min W: 120px'),
          vnode(`${prefix}-ov-mh`, 'box', 'Min H', { flex: 1, height: 24, paddingLeft: 6, borderRadius: 6, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderStyle: 'solid', display: 'flex', alignItems: 'center', fontSize: 10, fontMono: true, color: '#0f172a' }, {}, [], 'Min H: 36px')
        ])
      ]),

      // Dimensions & Spacing
      vnode(`${prefix}-sec-dim`, 'container', 'Dimensions & Radius', { display: 'flex', flexDirection: 'column', gap: 6 }, {}, [
        vnode(`${prefix}-dm-lbl`, 'text', '여백 및 곡률 (SPACING & RADIUS)', { fontSize: 10, fontWeight: 700, color: '#64748b' }, {}, [], '여백 및 곡률 (SPACING & RADIUS)'),
        vnode(`${prefix}-dm-grid`, 'container', 'Grid', { display: 'flex', flexDirection: 'row', gap: 6 }, {}, [
          { k: 'Padding', v: '12px' },
          { k: 'Gap', v: '8px' },
          { k: 'Radius', v: '10px' }
        ].map((d, idx) =>
          vnode(`${prefix}-dm-${idx}`, 'container', d.k, {
            flex: 1,
            padding: 6,
            borderRadius: 6,
            backgroundColor: '#f8fafc',
            borderWidth: 1,
            borderColor: '#e2e8f0',
            borderStyle: 'solid',
            display: 'flex',
            flexDirection: 'column',
            gap: 2
          }, {}, [
            vnode(`${prefix}-dmk-${idx}`, 'text', d.k, { fontSize: 9, color: '#94a3b8' }, {}, [], d.k),
            vnode(`${prefix}-dmv-${idx}`, 'text', d.v, { fontSize: 11, fontWeight: 700, color: '#0f172a', fontMono: true }, {}, [], d.v)
          ])
        ))
      ])
    ]);
  } else if (activeTab === 'events') {
    body = vnode(`${prefix}-events-body`, 'container', 'Events Inspector Body', {
      flex: 1,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }, {}, [
      vnode(`${prefix}-ev-hdr`, 'container', 'Events Top Bar', {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }, {}, [
        vnode(`${prefix}-ev-t`, 'text', '인터랙션 & 플로우', { fontSize: 11, fontWeight: 700, color: '#0f172a' }, {}, [], '⚡ 프로토타입 이벤트 핸들러'),
        vnode(`${prefix}-ev-add`, 'button', '+ 이벤트 추가', {
          height: 26,
          paddingLeft: 8,
          paddingRight: 8,
          borderRadius: 6,
          backgroundColor: '#fffbeb',
          borderWidth: 1,
          borderColor: '#fde68a',
          borderStyle: 'solid',
          color: '#b45309',
          fontSize: 10,
          fontWeight: 700
        }, {}, [], '+ 이벤트 추가')
      ]),
      // Event Card 1: Navigate
      vnode(`${prefix}-ev-c1`, 'card', 'Click Navigate Rule', {
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }, {}, [
        vnode(`${prefix}-ev1-r1`, 'container', 'Trigger Row', { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, {}, [
          vnode(`${prefix}-ev1-bdg`, 'badge', 'onClick', { paddingLeft: 6, paddingRight: 6, paddingTop: 2, paddingBottom: 2, borderRadius: 4, backgroundColor: '#eef2ff', color: '#4f46e5', fontSize: 10, fontWeight: 700 }, {}, [], '클릭 시 (onClick)'),
          vnode(`${prefix}-ev1-act`, 'text', '화면 이동', { fontSize: 10, fontWeight: 700, color: '#059669' }, {}, [], '➔ 화면 전환 (Navigate)')
        ]),
        vnode(`${prefix}-ev1-target`, 'box', 'Target Screen', {
          padding: 8,
          borderRadius: 8,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#cbd5e1',
          borderStyle: 'solid',
          fontSize: 11,
          fontWeight: 600,
          color: '#1e293b'
        }, {}, [], '▣ 2. 좌측 사이드바: 20종 컴포넌트 팔레트')
      ]),
      // Event Card 2: Change Tweak
      vnode(`${prefix}-ev-c2`, 'card', 'DoubleClick Tweak Rule', {
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }, {}, [
        vnode(`${prefix}-ev2-r1`, 'container', 'Trigger Row', { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, {}, [
          vnode(`${prefix}-ev2-bdg`, 'badge', 'onDoubleClick', { paddingLeft: 6, paddingRight: 6, paddingTop: 2, paddingBottom: 2, borderRadius: 4, backgroundColor: '#fef3c7', color: '#b45309', fontSize: 10, fontWeight: 700 }, {}, [], '더블클릭 (onDblClick)'),
          vnode(`${prefix}-ev2-act`, 'text', '트윅 변경', { fontSize: 10, fontWeight: 700, color: '#7c3aed' }, {}, [], '⚙ 변수 변경 (Set Tweak)')
        ]),
        vnode(`${prefix}-ev2-target`, 'box', 'Target Tweak', {
          padding: 8,
          borderRadius: 8,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#cbd5e1',
          borderStyle: 'solid',
          fontSize: 11,
          fontMono: true,
          color: '#334155'
        }, {}, [], 'theme = "cyber" (Toggle)')
      ])
    ]);
  } else if (activeTab === 'code') {
    const codeLines = [
      "import React from 'react';",
      "",
      "// Auto-generated React Component by Screen",
      "// Designer VDOM Engine",
      "export default function Screen_Workspace(props: {",
      "  tweaks?: Record<string, any>;",
      "}) {",
      "  const { tweaks = {} } = props;",
      "",
      "  return (",
      "    <div",
      "      style={{",
      "        width: '100%',",
      "        height: '100%',",
      "        position: 'relative',",
      "        display: 'flex',",
      "        flexDirection: 'column',",
      "        backgroundColor: '#f1f5f9',",
      "        overflow: 'hidden'",
      "      }}",
      "    >",
      "      <header className=\"claude-header-2tier\">",
      "        <span>Screen Designer - Visual Storyboard</span>",
      "      </header>",
      "      <main className=\"canvas-viewport-grid\" />",
      "    </div>",
      "  );",
      "}"
    ];

    body = vnode(`${prefix}-code-body`, 'container', 'Code Generator Body', {
      flex: 1,
      backgroundColor: '#0f172a',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }, {}, [
      vnode(`${prefix}-cd-bar`, 'container', 'Code Top Bar', {
        height: 38,
        paddingLeft: 12,
        paddingRight: 12,
        backgroundColor: '#1e293b',
        borderBottomWidth: 1,
        borderBottomColor: '#334155',
        borderBottomStyle: 'solid',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }, {}, [
        vnode(`${prefix}-cd-lbl`, 'text', 'JSX / Tailwind Component', { fontSize: 11, fontMono: true, fontWeight: 700, color: '#94a3b8' }, {}, [], '</> JSX / Tailwind Component'),
        vnode(`${prefix}-cd-cpy`, 'button', 'Copy Code', {
          height: 24,
          paddingLeft: 8,
          paddingRight: 8,
          borderRadius: 6,
          backgroundColor: '#334155',
          color: '#e2e8f0',
          fontSize: 10,
          fontWeight: 600
        }, {}, [], '📋 복사')
      ]),
      vnode(`${prefix}-cd-pre`, 'container', 'Code Lines', {
        flex: 1,
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 3
      }, {}, codeLines.map((ln, idx) =>
        vnode(`${prefix}-cl-${idx}`, 'text', `Line ${idx}`, {
          fontSize: 11,
          fontMono: true,
          color: ln.startsWith('//') ? '#64748b' : ln.includes('export') || ln.includes('import') || ln.includes('return') ? '#93c5fd' : '#e2e8f0',
          whiteSpace: 'pre'
        }, {}, [], ln || ' ')
      ))
    ]);
  } else if (activeTab === 'tweaks') {
    body = vnode(`${prefix}-tweaks-body`, 'container', 'Tweaks Inspector Body', {
      flex: 1,
      padding: 14,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }, {}, [
      vnode(`${prefix}-tw-hdr`, 'container', 'Tweaks Header Row', {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }, {}, [
        vnode(`${prefix}-tw-hl`, 'container', 'Left', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }, {}, [
          vnode(`${prefix}-tw-ic`, 'icon', 'Sliders', { color: '#4f46e5' }, { icon: 'sliders-horizontal', size: 13 }),
          vnode(`${prefix}-tw-ht`, 'text', 'Title', { fontSize: 11, fontWeight: 700, color: '#334155' }, {}, [], '컴포넌트 상태 & PROPS (TWEAKS)')
        ]),
        vnode(`${prefix}-tw-add`, 'button', '+ 변수 추가', {
          height: 28,
          paddingLeft: 10,
          paddingRight: 10,
          borderRadius: 8,
          backgroundColor: '#eef2ff',
          borderWidth: 1,
          borderColor: '#c7d2fe',
          borderStyle: 'solid',
          color: '#4f46e5',
          fontSize: 10,
          fontWeight: 700
        }, {}, [], '+ 변수 추가')
      ]),

      // Tweak Variable 1: Theme
      vnode(`${prefix}-tw-c1`, 'card', 'Theme Tweak Card', {
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }, {}, [
        vnode(`${prefix}-tw1-top`, 'container', 'Top', { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }, {}, [
          vnode(`${prefix}-tw1-nm`, 'text', 'theme (테마 모드)', { fontSize: 11, fontWeight: 700, color: '#0f172a' }, {}, [], 'theme (테마 모드)'),
          vnode(`${prefix}-tw1-tp`, 'badge', 'SEGMENT', { fontSize: 9, backgroundColor: '#eef2ff', color: '#4f46e5', paddingLeft: 5, paddingRight: 5, borderRadius: 4, fontWeight: 700 }, {}, [], 'SEGMENT')
        ]),
        vnode(`${prefix}-tw1-seg`, 'container', 'Segment Options', { display: 'flex', flexDirection: 'row', gap: 4 }, {}, [
          { k: 'dark', active: true },
          { k: 'light', active: false },
          { k: 'cyber', active: false }
        ].map((o, i) =>
          vnode(`${prefix}-tw1-o-${i}`, 'button', o.k, {
            flex: 1,
            height: 26,
            borderRadius: 6,
            backgroundColor: o.active ? '#4f46e5' : '#ffffff',
            borderWidth: 1,
            borderColor: o.active ? '#4f46e5' : '#e2e8f0',
            borderStyle: 'solid',
            color: o.active ? '#ffffff' : '#475569',
            fontSize: 10,
            fontWeight: 700
          }, {}, [], o.k)
        ))
      ]),

      // Tweak Variable 2: Currency
      vnode(`${prefix}-tw-c2`, 'card', 'Currency Tweak Card', {
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }, {}, [
        vnode(`${prefix}-tw2-top`, 'container', 'Top', { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }, {}, [
          vnode(`${prefix}-tw2-nm`, 'text', 'currency (통화 단위)', { fontSize: 11, fontWeight: 700, color: '#0f172a' }, {}, [], 'currency (표시 통화 단위)'),
          vnode(`${prefix}-tw2-tp`, 'badge', 'SELECT', { fontSize: 9, backgroundColor: '#ecfdf5', color: '#059669', paddingLeft: 5, paddingRight: 5, borderRadius: 4, fontWeight: 700 }, {}, [], 'SELECT')
        ]),
        vnode(`${prefix}-tw2-val`, 'box', 'KRW (₩)', {
          height: 28,
          paddingLeft: 10,
          borderRadius: 6,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#cbd5e1',
          borderStyle: 'solid',
          display: 'flex',
          alignItems: 'center',
          fontSize: 11,
          color: '#1e293b'
        }, {}, [], 'KRW (₩ 원화 표시) ⌄')
      ]),

      // Tweak Variable 3: Show AI Badge
      vnode(`${prefix}-tw-c3`, 'card', 'Boolean Tweak Card', {
        padding: 12,
        borderRadius: 12,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }, {}, [
        vnode(`${prefix}-tw3-nm`, 'text', 'showAiBadge (AI 추천 배지)', { fontSize: 11, fontWeight: 700, color: '#0f172a' }, {}, [], 'showAiBadge (AI 배지 표시)'),
        vnode(`${prefix}-tw3-sw`, 'box', 'Toggle True', { width: 32, height: 18, borderRadius: 9999, backgroundColor: '#10b981' })
      ])
    ]);
  }

  return vnode(`${prefix}-sidebar`, 'aside', 'Right Inspector Panel', {
    width,
    height: '100%',
    backgroundColor: '#ffffff',
    borderLeftWidth: 1,
    borderLeftColor: '#e2e8f0',
    borderLeftStyle: 'solid',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    overflow: 'hidden'
  }, {}, [tabBar, body]);
}

// 5. Full 3-Pane Workspace Shell Builder (Supports Layering Modals & Dropdowns on Top!)
export function createFullWorkspaceShell(prefix, options = {}) {
  const {
    pageTitle = '1. 핵심 작업 공간 & 인스펙터',
    activeMenu = null,
    leftTab = 'layers',
    rightTab = 'properties',
    rightMode = 'selected',
    showRulers = false,
    overlayNodes = []
  } = options;

  const header = createHeaderVNode(`${prefix}-hdr`, { pageTitle, activeMenu });
  const leftSidebar = createLeftSidebarVNode(`${prefix}-ls`, leftTab, 270);
  const centerCanvas = createCenterCanvasVNode(`${prefix}-cv`, { showRulers });
  const rightSidebar = createRightSidebarVNode(`${prefix}-rs`, rightTab, 350, rightMode);

  const mainRow = vnode(`${prefix}-main-row`, 'container', '3-Pane Workspace Body', {
    flex: 1,
    width: '100%',
    display: 'flex',
    flexDirection: 'row',
    overflow: 'hidden',
    position: 'relative'
  }, {}, [leftSidebar, centerCanvas, rightSidebar]);

  return vnode(`${prefix}-root`, 'frame', 'Screen Designer Workspace Frame', {
    width: '100%',
    height: '100%',
    backgroundColor: '#f1f5f9',
    display: 'flex',
    flexDirection: 'column',
    position: 'relative',
    overflow: 'hidden'
  }, {}, [header, mainRow, ...overlayNodes]);
}
