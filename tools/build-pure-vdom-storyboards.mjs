import fs from 'fs';
import path from 'path';

const DOCS_DIR = '/home/jay94ks/screen-designer/docs/ui-boards';

// Helper function to create standard VNodes
function vnode(id, type, name, style = {}, props = {}, children = [], content = '') {
  const node = { id, type, name, style, props };
  if (content) node.content = content;
  if (children && children.length > 0) node.children = children;
  return node;
}

// -------------------------------------------------------------
// Helper: 2-Tier Claude Header VDOM
// -------------------------------------------------------------
function createHeaderVNode(prefix = 'hdr', activeMenu = null) {
  // 1. Top Caption Bar (36px)
  const captionBar = vnode(`${prefix}-cap`, 'header', 'ClaudeHeader Caption Bar', {
    height: 36,
    backgroundColor: '#f8fafc',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 12,
    paddingRight: 12,
    fontSize: 12
  }, {}, [
    // Left Group: Logo, Title, Divider, Page Selector
    vnode(`${prefix}-cap-left`, 'container', 'Caption Left Group', {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
    }, {}, [
      // Squircle App Icon
      vnode(`${prefix}-logo`, 'box', 'App Logo', {
        width: 18,
        height: 18,
        borderRadius: 5,
        background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#ffffff',
        fontSize: 10,
        fontWeight: 'bold'
      }, {}, [], '◈'),
      vnode(`${prefix}-title`, 'text', 'App Title', {
        fontSize: 12,
        fontWeight: 600,
        color: '#0f172a'
      }, {}, [], 'Screen Designer - Visual Storyboard Canvas'),
      vnode(`${prefix}-div1`, 'divider', 'Divider', {
        width: 1,
        height: 14,
        backgroundColor: '#cbd5e1'
      }),
      vnode(`${prefix}-page-btn`, 'button', 'Page Selector Button', {
        height: 24,
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: '#f1f5f9',
        borderRadius: 6,
        fontSize: 11,
        color: '#334155',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
      }, {}, [
        vnode(`${prefix}-page-txt`, 'text', 'Page Text', { fontSize: 11, color: '#334155' }, {}, [], '1. 핵심 작업 공간 & 인스펙터'),
        vnode(`${prefix}-page-arr`, 'icon', 'Down Arrow', { color: '#64748b' }, { icon: 'chevron-down', size: 12 })
      ])
    ]),

    // Center Group: Drag Handle Pill
    vnode(`${prefix}-cap-center`, 'box', 'Window Drag Handle', {
      width: 48,
      height: 4,
      borderRadius: 9999,
      backgroundColor: '#cbd5e1'
    }),

    // Right Group: Share, Design System, Language, Settings, Window Controls
    vnode(`${prefix}-cap-right`, 'container', 'Caption Right Group', {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6
    }, {}, [
      vnode(`${prefix}-share-btn`, 'button', 'Share Button', {
        width: 26,
        height: 26,
        borderRadius: 6,
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748b'
      }, {}, [vnode(`${prefix}-ic-share`, 'icon', 'Share Icon', { color: '#64748b' }, { icon: 'share-2', size: 14 })]),
      vnode(`${prefix}-ds-btn`, 'button', 'Design System Button', {
        height: 24,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 6,
        backgroundColor: '#e0e7ff',
        color: '#4338ca',
        fontSize: 11,
        fontWeight: 600,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
      }, {}, [
        vnode(`${prefix}-ic-ds`, 'icon', 'DS Icon', { color: '#4338ca' }, { icon: 'palette', size: 12 }),
        vnode(`${prefix}-txt-ds`, 'text', 'DS Text', { fontSize: 11, fontWeight: 600, color: '#4338ca' }, {}, [], '디자인 시스템')
      ]),
      vnode(`${prefix}-lang-btn`, 'button', 'Language Button', {
        height: 24,
        paddingLeft: 6,
        paddingRight: 6,
        borderRadius: 6,
        backgroundColor: '#f1f5f9',
        color: '#475569',
        fontSize: 11,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3
      }, {}, [
        vnode(`${prefix}-ic-globe`, 'icon', 'Globe Icon', { color: '#64748b' }, { icon: 'globe', size: 12 }),
        vnode(`${prefix}-txt-lang`, 'text', 'Lang Text', { fontSize: 11, color: '#475569' }, {}, [], 'KO'),
        vnode(`${prefix}-arr-lang`, 'icon', 'Arrow', { color: '#94a3b8' }, { icon: 'chevron-down', size: 10 })
      ]),
      vnode(`${prefix}-set-btn`, 'button', 'Settings Button', {
        width: 26,
        height: 26,
        borderRadius: 6,
        backgroundColor: 'transparent',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#64748b'
      }, {}, [vnode(`${prefix}-ic-gear`, 'icon', 'Gear Icon', { color: '#64748b' }, { icon: 'settings', size: 14 })]),
      vnode(`${prefix}-div2`, 'divider', 'Divider', { width: 1, height: 14, backgroundColor: '#e2e8f0' }),
      vnode(`${prefix}-win-min`, 'button', 'Minimize', { width: 24, height: 24, color: '#64748b', fontSize: 11 }, {}, [], '─'),
      vnode(`${prefix}-win-max`, 'button', 'Maximize', { width: 24, height: 24, color: '#64748b', fontSize: 10 }, {}, [], '□'),
      vnode(`${prefix}-win-close`, 'button', 'Close', { width: 24, height: 24, color: '#64748b', fontSize: 12 }, {}, [], '✕')
    ])
  ]);

  // 2. Bottom Toolbar (40px)
  const toolbar = vnode(`${prefix}-tb`, 'nav', 'ClaudeHeader Sub Toolbar', {
    height: 40,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingLeft: 12,
    paddingRight: 12,
    position: 'relative'
  }, {}, [
    // Left: Menus + Search
    vnode(`${prefix}-tb-left`, 'container', 'Toolbar Left', {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4
    }, {}, [
      // Menubar items
      vnode(`${prefix}-m-file`, 'button', 'File Menu Button', {
        height: 26,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 6,
        backgroundColor: activeMenu === 'file' ? '#f1f5f9' : 'transparent',
        fontWeight: activeMenu === 'file' ? 700 : 500,
        color: activeMenu === 'file' ? '#0f172a' : '#475569',
        fontSize: 11
      }, {}, [], '파일'),
      vnode(`${prefix}-m-edit`, 'button', 'Edit Menu Button', {
        height: 26,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 6,
        backgroundColor: 'transparent',
        color: '#475569',
        fontSize: 11
      }, {}, [], '편집'),
      vnode(`${prefix}-m-view`, 'button', 'View Menu Button', {
        height: 26,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 6,
        backgroundColor: 'transparent',
        color: '#475569',
        fontSize: 11
      }, {}, [], '보기'),
      vnode(`${prefix}-m-help`, 'button', 'Help Menu Button', {
        height: 26,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 6,
        backgroundColor: 'transparent',
        color: '#475569',
        fontSize: 11
      }, {}, [], '도움말'),

      // Search Bar
      vnode(`${prefix}-search-box`, 'container', 'Search Input Box', {
        width: 140,
        height: 26,
        marginLeft: 8,
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: '#f1f5f9',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }, {}, [
        vnode(`${prefix}-search-txt`, 'text', 'Search Text', { fontSize: 10, color: '#94a3b8' }, {}, [], '명령 검색...'),
        vnode(`${prefix}-search-k`, 'badge', 'Kbd Badge', { fontSize: 9, color: '#64748b', fontWeight: 600 }, {}, [], 'Ctrl+K')
      ])
    ]),

    // Center: Undo/Redo + Canvas Tools
    vnode(`${prefix}-tb-center`, 'container', 'Toolbar Center', {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 4
    }, {}, [
      vnode(`${prefix}-undo`, 'button', 'Undo', { width: 26, height: 26, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }, {}, [
        vnode(`${prefix}-ic-undo`, 'icon', 'Undo Icon', { color: '#64748b' }, { icon: 'undo-2', size: 13 })
      ]),
      vnode(`${prefix}-redo`, 'button', 'Redo', { width: 26, height: 26, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }, {}, [
        vnode(`${prefix}-ic-redo`, 'icon', 'Redo Icon', { color: '#64748b' }, { icon: 'redo-2', size: 13 })
      ]),
      vnode(`${prefix}-div3`, 'divider', 'Divider', { width: 1, height: 14, backgroundColor: '#e2e8f0', marginLeft: 4, marginRight: 4 }),
      // Active Select Tool
      vnode(`${prefix}-tool-v`, 'button', 'Select Tool Active', {
        height: 26,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 6,
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        fontSize: 11,
        fontWeight: 600,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
      }, {}, [
        vnode(`${prefix}-ic-v`, 'icon', 'MousePointer', { color: '#ffffff' }, { icon: 'mouse-pointer-2', size: 12 }),
        vnode(`${prefix}-txt-v`, 'text', 'Select', { fontSize: 11, color: '#ffffff' }, {}, [], '선택 (V)')
      ]),
      vnode(`${prefix}-tool-h`, 'button', 'Hand Tool', { width: 26, height: 26, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }, {}, [
        vnode(`${prefix}-ic-h`, 'icon', 'Hand', { color: '#64748b' }, { icon: 'hand', size: 13 })
      ]),
      vnode(`${prefix}-tool-f`, 'button', 'Frame Tool', { width: 26, height: 26, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }, {}, [
        vnode(`${prefix}-ic-f`, 'icon', 'Frame', { color: '#64748b' }, { icon: 'layout', size: 13 })
      ]),
      vnode(`${prefix}-tool-t`, 'button', 'Text Tool', { width: 26, height: 26, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }, {}, [
        vnode(`${prefix}-ic-t`, 'icon', 'Type', { color: '#64748b' }, { icon: 'type', size: 13 })
      ]),
      vnode(`${prefix}-tool-r`, 'button', 'Shape Tool', { width: 26, height: 26, color: '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center' }, {}, [
        vnode(`${prefix}-ic-r`, 'icon', 'Square', { color: '#64748b' }, { icon: 'square', size: 13 })
      ])
    ]),

    // Right: Flow Wire Toggle, Play Button, Zoom, Page, Git
    vnode(`${prefix}-tb-right`, 'container', 'Toolbar Right', {
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6
    }, {}, [
      // Flow Wire Pill
      vnode(`${prefix}-flow-btn`, 'button', 'Flow Wire Toggle', {
        height: 24,
        paddingLeft: 8,
        paddingRight: 8,
        borderRadius: 9999,
        backgroundColor: '#faf5ff',
        borderWidth: 1,
        borderColor: '#e9d5ff',
        borderStyle: 'solid',
        color: '#7e22ce',
        fontSize: 10,
        fontWeight: 600,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
      }, {}, [
        vnode(`${prefix}-ic-zap`, 'icon', 'Zap', { color: '#9333ea' }, { icon: 'zap', size: 11 }),
        vnode(`${prefix}-txt-flow`, 'text', 'Flow Text', { fontSize: 10, color: '#7e22ce' }, {}, [], '플로우 •')
      ]),
      // Play Button
      vnode(`${prefix}-play-btn`, 'button', 'Play Mode Button', {
        height: 26,
        paddingLeft: 12,
        paddingRight: 12,
        borderRadius: 6,
        backgroundColor: '#4f46e5',
        color: '#ffffff',
        fontSize: 11,
        fontWeight: 700,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        boxShadow: '0 1px 2px rgba(79, 70, 229, 0.3)'
      }, {}, [
        vnode(`${prefix}-ic-play`, 'icon', 'Play Icon', { color: '#ffffff' }, { icon: 'play', size: 11 }),
        vnode(`${prefix}-txt-play`, 'text', 'PLAY Text', { fontSize: 11, fontWeight: 700, color: '#ffffff' }, {}, [], 'PLAY')
      ]),
      // Zoom
      vnode(`${prefix}-zoom-box`, 'container', 'Zoom Box', {
        height: 24,
        paddingLeft: 6,
        paddingRight: 6,
        backgroundColor: '#f8fafc',
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 3,
        fontSize: 10,
        color: '#475569'
      }, {}, [
        vnode(`${prefix}-ic-zoom`, 'icon', 'Search Zoom', { color: '#64748b' }, { icon: 'search', size: 11 }),
        vnode(`${prefix}-txt-zoom`, 'text', '80%', { fontSize: 10, color: '#475569' }, {}, [], '80% ⌄')
      ]),
      // Page Counter
      vnode(`${prefix}-page-nav`, 'container', 'Page Nav', {
        height: 24,
        paddingLeft: 6,
        paddingRight: 6,
        backgroundColor: '#f8fafc',
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        fontSize: 10,
        color: '#64748b'
      }, {}, [
        vnode(`${prefix}-txt-pcount`, 'text', '3/1', { fontSize: 10, color: '#64748b' }, {}, [], '3 / 1'),
        vnode(`${prefix}-arr-l`, 'text', '<', { fontSize: 9, color: '#94a3b8' }, {}, [], '<'),
        vnode(`${prefix}-arr-r`, 'text', '>', { fontSize: 9, color: '#94a3b8' }, {}, [], '>')
      ]),
      // Git Indicator
      vnode(`${prefix}-git-box`, 'container', 'Git Indicator', {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4
      }, {}, [
        vnode(`${prefix}-git-branch`, 'badge', 'Branch Badge', {
          height: 22,
          paddingLeft: 6,
          paddingRight: 6,
          backgroundColor: '#fffbeb',
          borderWidth: 1,
          borderColor: '#fef3c7',
          borderStyle: 'solid',
          borderRadius: 6,
          fontSize: 10,
          fontWeight: 600,
          color: '#b45309',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 3
        }, {}, [
          vnode(`${prefix}-ic-br`, 'icon', 'GitBranch', { color: '#b45309' }, { icon: 'git-branch', size: 11 }),
          vnode(`${prefix}-txt-br`, 'text', 'Branch Text', { fontSize: 10, color: '#b45309' }, {}, [], 'main 35')
        ]),
        vnode(`${prefix}-git-commit-btn`, 'button', 'Commit Button', {
          height: 24,
          paddingLeft: 8,
          paddingRight: 8,
          backgroundColor: '#2563eb',
          borderRadius: 6,
          fontSize: 11,
          fontWeight: 700,
          color: '#ffffff',
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 3
        }, {}, [
          vnode(`${prefix}-ic-commit`, 'icon', 'GitCommit', { color: '#ffffff' }, { icon: 'git-commit', size: 11 }),
          vnode(`${prefix}-txt-commit`, 'text', 'Commit Text', { fontSize: 11, fontWeight: 700, color: '#ffffff' }, {}, [], '커밋 (35)')
        ])
      ])
    ])
  ]);

  return vnode(`${prefix}-container`, 'container', 'Claude Header Full', {
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    flexShrink: 0,
    zIndex: 40
  }, {}, [captionBar, toolbar]);
}

// -------------------------------------------------------------
// Helper: Left Sidebar VDOM (Layers, Components, or Templates)
// -------------------------------------------------------------
function createLeftSidebarVNode(prefix = 'ls', activeTab = 'layers', width = 260) {
  // Tabs Bar
  const tabs = vnode(`${prefix}-tabs`, 'container', 'LeftSidebar Tabs', {
    height: 38,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  }, {}, [
    vnode(`${prefix}-tab-layers`, 'button', 'Tab Layers', {
      flex: 1,
      height: 38,
      borderBottomWidth: activeTab === 'layers' ? 2 : 0,
      borderBottomColor: '#4f46e5',
      borderBottomStyle: 'solid',
      color: activeTab === 'layers' ? '#4f46e5' : '#64748b',
      fontWeight: activeTab === 'layers' ? 700 : 500,
      fontSize: 11,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4
    }, {}, [
      vnode(`${prefix}-ic-l`, 'icon', 'Layers Icon', { color: activeTab === 'layers' ? '#4f46e5' : '#64748b' }, { icon: 'layers', size: 12 }),
      vnode(`${prefix}-tx-l`, 'text', 'Layers Text', { fontSize: 11 }, {}, [], '레이어')
    ]),
    vnode(`${prefix}-tab-comps`, 'button', 'Tab Components', {
      flex: 1,
      height: 38,
      borderBottomWidth: activeTab === 'components' ? 2 : 0,
      borderBottomColor: '#4f46e5',
      borderBottomStyle: 'solid',
      color: activeTab === 'components' ? '#4f46e5' : '#64748b',
      fontWeight: activeTab === 'components' ? 700 : 500,
      fontSize: 11,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4
    }, {}, [
      vnode(`${prefix}-ic-c`, 'icon', 'Comps Icon', { color: activeTab === 'components' ? '#4f46e5' : '#64748b' }, { icon: 'component', size: 12 }),
      vnode(`${prefix}-tx-c`, 'text', 'Comps Text', { fontSize: 11 }, {}, [], '컴포넌트')
    ]),
    vnode(`${prefix}-tab-tpls`, 'button', 'Tab Templates', {
      flex: 1,
      height: 38,
      borderBottomWidth: activeTab === 'templates' ? 2 : 0,
      borderBottomColor: '#4f46e5',
      borderBottomStyle: 'solid',
      color: activeTab === 'templates' ? '#4f46e5' : '#64748b',
      fontWeight: activeTab === 'templates' ? 700 : 500,
      fontSize: 11,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 4
    }, {}, [
      vnode(`${prefix}-ic-t`, 'icon', 'Tpls Icon', { color: activeTab === 'templates' ? '#4f46e5' : '#64748b' }, { icon: 'sparkles', size: 12 }),
      vnode(`${prefix}-tx-t`, 'text', 'Tpls Text', { fontSize: 11 }, {}, [], '템플릿')
    ])
  ]);

  let bodyContent;

  if (activeTab === 'layers') {
    // Layers Tree View
    bodyContent = vnode(`${prefix}-layers-body`, 'container', 'Layers Body', {
      display: 'flex',
      flexDirection: 'column',
      padding: 8,
      gap: 6
    }, {}, [
      // Search input
      vnode(`${prefix}-search`, 'container', 'Layers Search Box', {
        height: 28,
        paddingLeft: 8,
        paddingRight: 8,
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        borderRadius: 6,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 6
      }, {}, [
        vnode(`${prefix}-ic-s`, 'icon', 'Search Icon', { color: '#94a3b8' }, { icon: 'search', size: 11 }),
        vnode(`${prefix}-tx-s`, 'text', 'Search Placeholder', { fontSize: 10, color: '#94a3b8' }, {}, [], '레이어 검색...')
      ]),

      // Tree items
      vnode(`${prefix}-tree-root`, 'container', 'Tree Root Item', {
        backgroundColor: '#eef2ff',
        borderWidth: 1,
        borderColor: '#c7d2fe',
        borderStyle: 'solid',
        borderRadius: 6,
        padding: 6,
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }, {}, [
        vnode(`${prefix}-artboard-title`, 'container', 'Artboard Title Row', {
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between'
        }, {}, [
          vnode(`${prefix}-ab-left`, 'container', 'Left', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }, {}, [
            vnode(`${prefix}-ic-ab`, 'icon', 'Artboard', { color: '#4f46e5' }, { icon: 'layout', size: 12 }),
            vnode(`${prefix}-tx-ab`, 'text', 'Title', { fontSize: 11, fontWeight: 700, color: '#312e81' }, {}, [], '1. 메인 캔버스 (Active)')
          ]),
          vnode(`${prefix}-ab-right`, 'container', 'Right', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 3 }, {}, [
            vnode(`${prefix}-ic-eye`, 'icon', 'Eye', { color: '#6366f1' }, { icon: 'eye', size: 11 }),
            vnode(`${prefix}-ic-lock`, 'icon', 'Lock', { color: '#6366f1' }, { icon: 'lock', size: 11 })
          ])
        ]),

        // Child Nodes in Tree
        vnode(`${prefix}-node-header`, 'container', 'Tree Child: Header', {
          paddingLeft: 14,
          paddingTop: 3,
          paddingBottom: 3,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          fontSize: 10,
          color: '#475569'
        }, {}, [
          vnode(`${prefix}-arr-ch1`, 'text', 'Tree Line', { color: '#cbd5e1', fontSize: 10 }, {}, [], '├─'),
          vnode(`${prefix}-ic-ch1`, 'icon', 'Container', { color: '#64748b' }, { icon: 'folder', size: 11 }),
          vnode(`${prefix}-tx-ch1`, 'text', 'Name', { fontSize: 10, color: '#475569' }, {}, [], 'Top Header Container')
        ]),

        vnode(`${prefix}-node-sidebar`, 'container', 'Tree Child: Sidebar', {
          paddingLeft: 14,
          paddingTop: 3,
          paddingBottom: 3,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 6,
          fontSize: 10,
          color: '#475569'
        }, {}, [
          vnode(`${prefix}-arr-ch2`, 'text', 'Tree Line', { color: '#cbd5e1', fontSize: 10 }, {}, [], '├─'),
          vnode(`${prefix}-ic-ch2`, 'icon', 'Sidebar', { color: '#64748b' }, { icon: 'columns', size: 11 }),
          vnode(`${prefix}-tx-ch2`, 'text', 'Name', { fontSize: 10, color: '#475569' }, {}, [], 'Left Navigation Sidebar')
        ]),

        // Selected CTA Button
        vnode(`${prefix}-node-selected`, 'container', 'Tree Child: CTA (Selected)', {
          paddingLeft: 14,
          paddingTop: 4,
          paddingBottom: 4,
          paddingRight: 6,
          backgroundColor: '#4f46e5',
          borderRadius: 4,
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          color: '#ffffff'
        }, {}, [
          vnode(`${prefix}-sel-left`, 'container', 'Left', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }, {}, [
            vnode(`${prefix}-arr-ch3`, 'text', 'Tree Line', { color: '#a5b4fc', fontSize: 10 }, {}, [], '└─'),
            vnode(`${prefix}-ic-ch3`, 'icon', 'Btn', { color: '#ffffff' }, { icon: 'square', size: 11 }),
            vnode(`${prefix}-tx-ch3`, 'text', 'Name', { fontSize: 10, fontWeight: 700, color: '#ffffff' }, {}, [], 'CTA 실행 버튼 ★ (Selected)')
          ]),
          vnode(`${prefix}-ic-sel-eye`, 'icon', 'Eye', { color: '#e0e7ff' }, { icon: 'eye', size: 10 })
        ])
      ])
    ]);
  } else if (activeTab === 'components') {
    // 20 Component Palette View
    const compCards = [
      { name: '스크롤 컨테이너', tag: '<scroll>', desc: '마우스 휠 스크롤 영역 (Auto Overflow)', icon: 'scroll-text' },
      { name: '모달 다이얼로그', tag: '<dialog>', desc: '팝업 모달 창 (Backdrop + Close)', icon: 'message-square' },
      { name: '카드 컨테이너', tag: '<card>', desc: '배경색 및 곡률이 적용된 박스', icon: 'credit-card' },
      { name: '시맨틱 섹션', tag: '<section>', desc: '페이지 주요 블록 구획', icon: 'layout' },
      { name: '헤더 영역', tag: '<header>', desc: '상단 네비게이션 및 타이틀 바', icon: 'panel-top' },
      { name: '푸터 영역', tag: '<footer>', desc: '하단 정보 및 라이선스 영역', icon: 'panel-bottom' },
      { name: '반응형 이미지', tag: '<img>', desc: '반응형 이미지 (Cover / Fit)', icon: 'image' },
      { name: '비디오 플레이어', tag: '<video>', desc: '미디어 영상 플레이어', icon: 'video' },
      { name: '대제목 (Heading)', tag: '<h2>', desc: '22px Bold 타이틀', icon: 'heading' },
      { name: '본문 단락', tag: '<p>', desc: '일반 텍스트 문단', icon: 'type' },
      { name: '인용구', tag: '<blockquote>', desc: '강조 인용 블록', icon: 'quote' },
      { name: '코드 블록', tag: '<code>', desc: '고정폭 글꼴 인라인 코드', icon: 'code' },
      { name: 'CTA 액션 버튼', tag: '<button>', desc: '클릭 인터랙션 주 버튼', icon: 'mouse-pointer-2' },
      { name: '텍스트 인풋 필드', tag: '<input>', desc: '한 줄 텍스트 입력 폼', icon: 'text-cursor-input' }
    ];

    bodyContent = vnode(`${prefix}-comps-body`, 'container', 'Components Body', {
      display: 'flex',
      flexDirection: 'column',
      padding: 8,
      gap: 6
    }, {}, [
      // Filter Pills
      vnode(`${prefix}-pills`, 'container', 'Filter Pills Row', {
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
        overflowX: 'auto',
        paddingBottom: 4
      }, {}, [
        vnode(`${prefix}-pill-all`, 'badge', 'All', { paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3, borderRadius: 9999, backgroundColor: '#4f46e5', color: '#ffffff', fontSize: 10, fontWeight: 700 }, {}, [], '전체 (20)'),
        vnode(`${prefix}-pill-lay`, 'badge', 'Layout', { paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3, borderRadius: 9999, backgroundColor: '#f1f5f9', color: '#475569', fontSize: 10 }, {}, [], '레이아웃'),
        vnode(`${prefix}-pill-med`, 'badge', 'Media', { paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3, borderRadius: 9999, backgroundColor: '#f1f5f9', color: '#475569', fontSize: 10 }, {}, [], '미디어'),
        vnode(`${prefix}-pill-txt`, 'badge', 'Text', { paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3, borderRadius: 9999, backgroundColor: '#f1f5f9', color: '#475569', fontSize: 10 }, {}, [], '텍스트')
      ]),

      // Component Cards
      ...compCards.map((c, i) => vnode(`${prefix}-card-${i}`, 'container', `Comp: ${c.name}`, {
        padding: 8,
        backgroundColor: '#ffffff',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        borderRadius: 8,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }, {}, [
        vnode(`${prefix}-c-left-${i}`, 'container', 'Card Left', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }, {}, [
          vnode(`${prefix}-c-ic-${i}`, 'box', 'Icon Box', { width: 28, height: 28, borderRadius: 6, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#e2e8f0', borderStyle: 'solid', display: 'flex', alignItems: 'center', justifyContent: 'center' }, {}, [
            vnode(`${prefix}-ic-${i}`, 'icon', c.icon, { color: '#4f46e5' }, { icon: c.icon, size: 14 })
          ]),
          vnode(`${prefix}-c-meta-${i}`, 'container', 'Meta', { display: 'flex', flexDirection: 'column', gap: 1 }, {}, [
            vnode(`${prefix}-c-title-${i}`, 'container', 'Title Row', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 4 }, {}, [
              vnode(`${prefix}-t-tx-${i}`, 'text', 'Name', { fontSize: 11, fontWeight: 700, color: '#0f172a' }, {}, [], c.name),
              vnode(`${prefix}-t-tag-${i}`, 'badge', 'Tag', { fontSize: 9, color: '#64748b', backgroundColor: '#f1f5f9', paddingLeft: 3, paddingRight: 3, borderRadius: 3 }, {}, [], c.tag)
            ]),
            vnode(`${prefix}-c-desc-${i}`, 'text', 'Desc', { fontSize: 9, color: '#64748b' }, {}, [], c.desc)
          ])
        ]),
        vnode(`${prefix}-c-btn-${i}`, 'button', 'Add', { width: 20, height: 20, borderRadius: 4, backgroundColor: '#f1f5f9', color: '#475569', fontSize: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }, {}, [], '+')
      ]))
    ]);
  } else {
    // Templates Palette View
    const tpls = [
      { name: '히어로 섹션 (Hero Section)', desc: '타이틀, 서브문구, CTA 버튼 및 배경 그라데이션', icon: 'layout' },
      { name: '가격 정책표 (Pricing Table)', desc: '3열 요금제 카드 비교 (Free, Pro, Enterprise)', icon: 'credit-card' },
      { name: '기능 소개 그리드 (Feature Grid)', desc: '아이콘과 설명이 포함된 3칸 기능 쇼케이스', icon: 'grid' },
      { name: '헤더 내비게이션 바 (Header Navbar)', desc: '로고, 메뉴 링크 및 로그인 버튼 모음', icon: 'panel-top' },
      { name: '대시보드 KPI 카드 (Dashboard Metrics)', desc: '지표 카드, 차트 추이 라인 및 증감률', icon: 'activity' }
    ];

    bodyContent = vnode(`${prefix}-tpls-body`, 'container', 'Templates Body', {
      display: 'flex',
      flexDirection: 'column',
      padding: 8,
      gap: 8
    }, {}, tpls.map((t, i) => vnode(`${prefix}-tpl-${i}`, 'container', `Tpl: ${t.name}`, {
      padding: 10,
      backgroundColor: '#ffffff',
      borderWidth: 1,
      borderColor: '#e2e8f0',
      borderStyle: 'solid',
      borderRadius: 8,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }, {}, [
      vnode(`${prefix}-tpl-top-${i}`, 'container', 'Top', { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, {}, [
        vnode(`${prefix}-tpl-left-${i}`, 'container', 'Left', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }, {}, [
          vnode(`${prefix}-tpl-ic-${i}`, 'icon', t.icon, { color: '#4f46e5' }, { icon: t.icon, size: 14 }),
          vnode(`${prefix}-tpl-nm-${i}`, 'text', 'Name', { fontSize: 11, fontWeight: 700, color: '#0f172a' }, {}, [], t.name)
        ]),
        vnode(`${prefix}-tpl-add-${i}`, 'button', 'Add', { fontSize: 10, color: '#4f46e5', fontWeight: 600 }, {}, [], '삽입 +')
      ]),
      vnode(`${prefix}-tpl-desc-${i}`, 'text', 'Desc', { fontSize: 10, color: '#64748b' }, {}, [], t.desc),
      vnode(`${prefix}-tpl-prev-${i}`, 'box', 'Mini Preview', { height: 32, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#f1f5f9', borderStyle: 'solid', borderRadius: 6, display: 'flex', alignItems: 'center', justifyContent: 'center' }, {}, [
        vnode(`${prefix}-tpl-prev-txt-${i}`, 'text', 'Preview', { fontSize: 9, color: '#94a3b8' }, {}, [], '레이아웃 프리뷰 미리보기')
      ])
    ])));
  }

  return vnode(`${prefix}-container`, 'aside', 'Left Sidebar', {
    width: width,
    height: '100%',
    backgroundColor: '#ffffff',
    borderRightWidth: 1,
    borderRightColor: '#e2e8f0',
    borderRightStyle: 'solid',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    zIndex: 30
  }, {}, [tabs, bodyContent]);
}

// -------------------------------------------------------------
// Helper: Right Sidebar Inspector VDOM (Props, Events, Code, Tweaks)
// -------------------------------------------------------------
function createRightSidebarVNode(prefix = 'rs', activeTab = 'properties', width = 320) {
  // Tabs Bar
  const tabs = vnode(`${prefix}-tabs`, 'container', 'RightSidebar Tabs', {
    height: 38,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff'
  }, {}, [
    vnode(`${prefix}-tab-props`, 'button', 'Props Tab', {
      flex: 1,
      height: 38,
      borderBottomWidth: activeTab === 'properties' ? 2 : 0,
      borderBottomColor: '#4f46e5',
      borderBottomStyle: 'solid',
      color: activeTab === 'properties' ? '#4f46e5' : '#64748b',
      fontWeight: activeTab === 'properties' ? 700 : 500,
      fontSize: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }, {}, [], '속성 인스펙터'),
    vnode(`${prefix}-tab-events`, 'button', 'Events Tab', {
      flex: 1,
      height: 38,
      borderBottomWidth: activeTab === 'events' ? 2 : 0,
      borderBottomColor: '#4f46e5',
      borderBottomStyle: 'solid',
      color: activeTab === 'events' ? '#4f46e5' : '#64748b',
      fontWeight: activeTab === 'events' ? 700 : 500,
      fontSize: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }, {}, [], '프로토타입'),
    vnode(`${prefix}-tab-code`, 'button', 'Code Tab', {
      flex: 1,
      height: 38,
      borderBottomWidth: activeTab === 'code' ? 2 : 0,
      borderBottomColor: '#4f46e5',
      borderBottomStyle: 'solid',
      color: activeTab === 'code' ? '#4f46e5' : '#64748b',
      fontWeight: activeTab === 'code' ? 700 : 500,
      fontSize: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }, {}, [], '코드'),
    vnode(`${prefix}-tab-tweaks`, 'button', 'Tweaks Tab', {
      flex: 1,
      height: 38,
      borderBottomWidth: activeTab === 'tweaks' ? 2 : 0,
      borderBottomColor: '#4f46e5',
      borderBottomStyle: 'solid',
      color: activeTab === 'tweaks' ? '#4f46e5' : '#64748b',
      fontWeight: activeTab === 'tweaks' ? 700 : 500,
      fontSize: 10,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }, {}, [], '트윅')
  ]);

  let bodyContent;

  if (activeTab === 'properties') {
    // Full Props Inspector
    const swatches = ['#00000000', '#020617', '#1e293b', '#64748b', '#ffffff', '#4f46e5', '#8b5cf6', '#ec4899', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'];

    bodyContent = vnode(`${prefix}-props-body`, 'container', 'Props Body', {
      display: 'flex',
      flexDirection: 'column',
      padding: 12,
      gap: 12,
      overflowY: 'auto'
    }, {}, [
      // 1. Visibility Condition Card
      vnode(`${prefix}-vis-card`, 'card', 'Visibility Card', {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        borderRadius: 8,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }, {}, [
        vnode(`${prefix}-vis-row`, 'container', 'Header', { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, {}, [
          vnode(`${prefix}-vis-t`, 'text', 'Label', { fontSize: 10, fontWeight: 700, color: '#334155' }, {}, [], '👁 표시 조건 (Visibility)'),
          vnode(`${prefix}-vis-sw`, 'box', 'Switch', { width: 28, height: 16, borderRadius: 9999, backgroundColor: '#4f46e5', position: 'relative' }, {}, [
            vnode(`${prefix}-vis-dot`, 'box', 'Dot', { width: 12, height: 12, borderRadius: 9999, backgroundColor: '#ffffff', position: 'absolute', top: 2, right: 2 })
          ])
        ]),
        vnode(`${prefix}-vis-badge`, 'badge', 'Condition Badge', {
          backgroundColor: '#ecfdf5',
          borderWidth: 1,
          borderColor: '#a7f3d0',
          borderStyle: 'solid',
          borderRadius: 4,
          padding: 4,
          fontSize: 9,
          color: '#065f46',
          fontWeight: 600
        }, {}, [], '✓ 조건 일치 (표시 중) · AND 2/2 충족')
      ]),

      // 2. Element Properties
      vnode(`${prefix}-elem-card`, 'container', 'Element Meta', {
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }, {}, [
        vnode(`${prefix}-el-tag`, 'text', 'Category', { fontSize: 9, fontWeight: 700, color: '#6366f1' }, {}, [], 'BUTTON 요소 속성'),
        vnode(`${prefix}-el-input`, 'input', 'Name Input', {
          height: 28,
          backgroundColor: '#ffffff',
          borderWidth: 1,
          borderColor: '#cbd5e1',
          borderStyle: 'solid',
          borderRadius: 6,
          paddingLeft: 8,
          paddingRight: 8,
          fontSize: 11,
          fontWeight: 600,
          color: '#0f172a'
        }, { placeholder: 'root-ws-1' }, [], 'cta-execute-btn')
      ]),

      // 3. Color Swatches
      vnode(`${prefix}-swatches-sec`, 'container', 'Swatches Section', {
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }, {}, [
        vnode(`${prefix}-sw-t`, 'text', 'Label', { fontSize: 9, fontWeight: 700, color: '#64748b' }, {}, [], '색상 & 팔레트 스와치 (COLORS)'),
        vnode(`${prefix}-sw-grid`, 'container', 'Grid', {
          display: 'flex',
          flexDirection: 'row',
          flexWrap: 'wrap',
          gap: 6
        }, {}, swatches.map((color, idx) => vnode(`${prefix}-sw-${idx}`, 'box', `Swatch ${idx}`, {
          width: 18,
          height: 18,
          borderRadius: 4,
          backgroundColor: color,
          borderWidth: 1,
          borderColor: color === '#ffffff' ? '#cbd5e1' : 'transparent',
          borderStyle: 'solid'
        }))),
        // Hex inputs
        vnode(`${prefix}-hex-row`, 'container', 'Hex Row', { display: 'flex', flexDirection: 'row', gap: 8 }, {}, [
          vnode(`${prefix}-hex-bg`, 'container', 'BG Hex', { flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }, {}, [
            vnode(`${prefix}-hex-bg-l`, 'text', 'BG Label', { fontSize: 9, color: '#64748b' }, {}, [], '배경색'),
            vnode(`${prefix}-hex-bg-val`, 'badge', 'Value', { height: 26, backgroundColor: '#f1f5f9', borderRadius: 4, display: 'flex', alignItems: 'center', paddingLeft: 6, fontSize: 10, fontMono: true, color: '#0f172a', fontWeight: 600 }, {}, [], '#4f46e5')
          ]),
          vnode(`${prefix}-hex-txt`, 'container', 'Text Hex', { flex: 1, display: 'flex', flexDirection: 'column', gap: 2 }, {}, [
            vnode(`${prefix}-hex-txt-l`, 'text', 'Text Label', { fontSize: 9, color: '#64748b' }, {}, [], '글자색'),
            vnode(`${prefix}-hex-txt-val`, 'badge', 'Value', { height: 26, backgroundColor: '#f1f5f9', borderRadius: 4, display: 'flex', alignItems: 'center', paddingLeft: 6, fontSize: 10, fontMono: true, color: '#0f172a', fontWeight: 600 }, {}, [], '#ffffff')
          ])
        ])
      ]),

      // 4. Flex Alignment
      vnode(`${prefix}-flex-sec`, 'container', 'Flex Section', { display: 'flex', flexDirection: 'column', gap: 4 }, {}, [
        vnode(`${prefix}-flx-t`, 'text', 'Label', { fontSize: 9, fontWeight: 700, color: '#64748b' }, {}, [], '컨테이너 정렬 행렬 (FLEX LAYOUT)'),
        vnode(`${prefix}-flx-btns`, 'container', 'Flex Buttons', { display: 'flex', flexDirection: 'row', gap: 6 }, {}, [
          vnode(`${prefix}-flx-row`, 'button', 'Row', { flex: 1, height: 26, backgroundColor: '#4f46e5', color: '#ffffff', borderRadius: 6, fontSize: 10, fontWeight: 700 }, {}, [], '가로 방향 (Row ↔)'),
          vnode(`${prefix}-flx-col`, 'button', 'Col', { flex: 1, height: 26, backgroundColor: '#f1f5f9', color: '#475569', borderRadius: 6, fontSize: 10 }, {}, [], '세로 방향 (Col ↕)')
        ])
      ])
    ]);
  } else if (activeTab === 'events') {
    // Events & Prototype Flow Tab
    bodyContent = vnode(`${prefix}-events-body`, 'container', 'Events Body', {
      display: 'flex',
      flexDirection: 'column',
      padding: 12,
      gap: 12
    }, {}, [
      vnode(`${prefix}-ev-card`, 'card', 'Event Definition Card', {
        backgroundColor: '#f8fafc',
        borderWidth: 1,
        borderColor: '#e2e8f0',
        borderStyle: 'solid',
        borderRadius: 8,
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        gap: 8
      }, {}, [
        vnode(`${prefix}-ev-title`, 'text', 'Event Title', { fontSize: 11, fontWeight: 700, color: '#0f172a' }, {}, [], '인터랙션 이벤트 #1'),
        vnode(`${prefix}-ev-trig`, 'container', 'Trigger', { display: 'flex', flexDirection: 'column', gap: 2 }, {}, [
          vnode(`${prefix}-trig-l`, 'text', 'L', { fontSize: 9, color: '#64748b' }, {}, [], '트리거 (Trigger)'),
          vnode(`${prefix}-trig-b`, 'badge', 'V', { height: 26, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderStyle: 'solid', borderRadius: 6, paddingLeft: 8, display: 'flex', alignItems: 'center', fontSize: 10, fontWeight: 600, color: '#0f172a' }, {}, [], '🖱 클릭 시 (onClick)')
        ]),
        vnode(`${prefix}-ev-act`, 'container', 'Action', { display: 'flex', flexDirection: 'column', gap: 2 }, {}, [
          vnode(`${prefix}-act-l`, 'text', 'L', { fontSize: 9, color: '#64748b' }, {}, [], '실행 액션 (Action)'),
          vnode(`${prefix}-act-b`, 'badge', 'V', { height: 26, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderStyle: 'solid', borderRadius: 6, paddingLeft: 8, display: 'flex', alignItems: 'center', fontSize: 10, fontWeight: 600, color: '#0f172a' }, {}, [], '➔ 화면 이동 (Navigate)')
        ]),
        vnode(`${prefix}-ev-target`, 'container', 'Target', { display: 'flex', flexDirection: 'column', gap: 2 }, {}, [
          vnode(`${prefix}-tgt-l`, 'text', 'L', { fontSize: 9, color: '#64748b' }, {}, [], '대상 아트보드 (Target)'),
          vnode(`${prefix}-tgt-b`, 'badge', 'V', { height: 26, backgroundColor: '#e0e7ff', borderWidth: 1, borderColor: '#c7d2fe', borderStyle: 'solid', borderRadius: 6, paddingLeft: 8, display: 'flex', alignItems: 'center', fontSize: 10, fontWeight: 700, color: '#4338ca' }, {}, [], '2. 간편 주문 모달 (Order)')
        ]),
        vnode(`${prefix}-ev-trans`, 'container', 'Transition', { display: 'flex', flexDirection: 'column', gap: 2 }, {}, [
          vnode(`${prefix}-trs-l`, 'text', 'L', { fontSize: 9, color: '#64748b' }, {}, [], '전환 애니메이션 (Transition)'),
          vnode(`${prefix}-trs-b`, 'badge', 'V', { height: 26, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderStyle: 'solid', borderRadius: 6, paddingLeft: 8, display: 'flex', alignItems: 'center', fontSize: 10, color: '#334155' }, {}, [], '슬라이드 (Slide Left 300ms)')
        ])
      ]),
      vnode(`${prefix}-ev-info`, 'badge', 'Info Badge', {
        backgroundColor: '#faf5ff',
        borderWidth: 1,
        borderColor: '#e9d5ff',
        borderStyle: 'solid',
        borderRadius: 6,
        padding: 8,
        fontSize: 10,
        color: '#6b21a8'
      }, {}, [], '⚡ 베지어 곡선 와이어 3개가 캔버스에 실시간 렌더링 중입니다.')
    ]);
  } else if (activeTab === 'code') {
    // Code Tab
    const codeSnippet = `import React from 'react';

// Auto-generated Component
export default function Screen_1(props) {
  return (
    <div className="w-full h-full bg-slate-900 flex">
      <header className="h-9 bg-slate-800 border-b">
        <h1 className="text-white text-xs">Screen Designer</h1>
      </header>
    </div>
  );
}`;

    bodyContent = vnode(`${prefix}-code-body`, 'container', 'Code Body', {
      display: 'flex',
      flexDirection: 'column',
      padding: 10,
      gap: 8,
      height: '100%'
    }, {}, [
      vnode(`${prefix}-code-hdr`, 'container', 'Header', { display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, {}, [
        vnode(`${prefix}-code-t`, 'text', 'Title', { fontSize: 10, fontWeight: 700, color: '#334155' }, {}, [], 'JSX / Tailwind Component'),
        vnode(`${prefix}-code-cpy`, 'button', 'Copy', { height: 22, paddingLeft: 6, paddingRight: 6, borderRadius: 4, backgroundColor: '#f1f5f9', color: '#475569', fontSize: 10, fontWeight: 600 }, {}, [], '📋 복사')
      ]),
      vnode(`${prefix}-code-block`, 'code', 'Code Editor', {
        flex: 1,
        backgroundColor: '#020617',
        color: '#38bdf8',
        borderRadius: 8,
        padding: 10,
        fontFamily: 'monospace',
        fontSize: 10,
        lineHeight: 1.5,
        overflow: 'hidden',
        whiteSpace: 'pre'
      }, {}, [], codeSnippet)
    ]);
  } else {
    // Tweaks Tab
    bodyContent = vnode(`${prefix}-tweaks-body`, 'container', 'Tweaks Body', {
      display: 'flex',
      flexDirection: 'column',
      padding: 12,
      gap: 10
    }, {}, [
      vnode(`${prefix}-twk-desc`, 'text', 'Desc', { fontSize: 10, color: '#64748b' }, {}, [], '런타임 트윅 변수로 컴포넌트의 가시성 및 스타일을 동적으로 조작합니다.'),
      // Tweak 1: Theme
      vnode(`${prefix}-twk-1`, 'card', 'Tweak 1', { padding: 8, backgroundColor: '#f8fafc', borderRadius: 6, display: 'flex', flexDirection: 'column', gap: 4 }, {}, [
        vnode(`${prefix}-twk-1-l`, 'text', 'Label', { fontSize: 10, fontWeight: 700, color: '#0f172a' }, {}, [], '컬러 모드 (theme)'),
        vnode(`${prefix}-twk-1-pills`, 'container', 'Pills', { display: 'flex', flexDirection: 'row', gap: 4 }, {}, [
          vnode(`${prefix}-twk-1-p1`, 'badge', 'Dark', { paddingLeft: 8, paddingRight: 8, paddingTop: 2, paddingBottom: 2, borderRadius: 4, backgroundColor: '#4f46e5', color: '#ffffff', fontSize: 9, fontWeight: 700 }, {}, [], 'dark •'),
          vnode(`${prefix}-twk-1-p2`, 'badge', 'Light', { paddingLeft: 8, paddingRight: 8, paddingTop: 2, paddingBottom: 2, borderRadius: 4, backgroundColor: '#e2e8f0', color: '#475569', fontSize: 9 }, {}, [], 'light'),
          vnode(`${prefix}-twk-1-p3`, 'badge', 'Cyber', { paddingLeft: 8, paddingRight: 8, paddingTop: 2, paddingBottom: 2, borderRadius: 4, backgroundColor: '#e2e8f0', color: '#475569', fontSize: 9 }, {}, [], 'cyber')
        ])
      ]),
      // Tweak 2: Badge toggle
      vnode(`${prefix}-twk-2`, 'card', 'Tweak 2', { padding: 8, backgroundColor: '#f8fafc', borderRadius: 6, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, {}, [
        vnode(`${prefix}-twk-2-l`, 'text', 'Label', { fontSize: 10, fontWeight: 700, color: '#0f172a' }, {}, [], 'AI 추천 뱃지 표시'),
        vnode(`${prefix}-twk-2-sw`, 'box', 'Switch', { width: 28, height: 16, borderRadius: 9999, backgroundColor: '#10b981', position: 'relative' }, {}, [
          vnode(`${prefix}-twk-2-dot`, 'box', 'Dot', { width: 12, height: 12, borderRadius: 9999, backgroundColor: '#ffffff', position: 'absolute', top: 2, right: 2 })
        ])
      ]),
      // Tweak 3: Font Size
      vnode(`${prefix}-twk-3`, 'card', 'Tweak 3', { padding: 8, backgroundColor: '#f8fafc', borderRadius: 6, display: 'flex', flexDirection: 'column', gap: 4 }, {}, [
        vnode(`${prefix}-twk-3-top`, 'container', 'Top', { display: 'flex', flexDirection: 'row', justifyContent: 'space-between' }, {}, [
          vnode(`${prefix}-twk-3-l`, 'text', 'Label', { fontSize: 10, fontWeight: 700, color: '#0f172a' }, {}, [], '기본 글자 크기'),
          vnode(`${prefix}-twk-3-val`, 'text', 'Val', { fontSize: 10, fontMono: true, color: '#4f46e5', fontWeight: 700 }, {}, [], '14px')
        ]),
        vnode(`${prefix}-twk-3-bar`, 'box', 'Slider Bar', { height: 6, borderRadius: 9999, backgroundColor: '#e2e8f0', position: 'relative' }, {}, [
          vnode(`${prefix}-twk-3-fill`, 'box', 'Fill', { width: '45%', height: '100%', borderRadius: 9999, backgroundColor: '#4f46e5' })
        ])
      ])
    ]);
  }

  return vnode(`${prefix}-container`, 'aside', 'Right Sidebar', {
    width: width,
    height: '100%',
    backgroundColor: '#ffffff',
    borderLeftWidth: 1,
    borderLeftColor: '#e2e8f0',
    borderLeftStyle: 'solid',
    display: 'flex',
    flexDirection: 'column',
    flexShrink: 0,
    zIndex: 30
  }, {}, [tabs, bodyContent]);
}

// -------------------------------------------------------------
// Helper: Canvas Dot Grid & Artboard Card VDOM
// -------------------------------------------------------------
function createCanvasAreaVNode(prefix = 'canvas') {
  return vnode(`${prefix}-area`, 'main', 'Canvas Area', {
    flex: 1,
    height: '100%',
    backgroundColor: '#f1f5f9',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  }, {}, [
    // Centered Artboard Card
    vnode(`${prefix}-card`, 'card', 'Artboard Card on Canvas', {
      width: 520,
      height: 480,
      backgroundColor: '#020617',
      borderRadius: 16,
      borderWidth: 1,
      borderColor: '#1e293b',
      borderStyle: 'solid',
      boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
      display: 'flex',
      flexDirection: 'column',
      overflow: 'hidden'
    }, {}, [
      // Artboard Title Header
      vnode(`${prefix}-card-hdr`, 'header', 'Artboard Header', {
        height: 36,
        paddingLeft: 12,
        paddingRight: 12,
        backgroundColor: '#090d16',
        borderBottomWidth: 1,
        borderBottomColor: '#1e293b',
        borderBottomStyle: 'solid',
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between'
      }, {}, [
        vnode(`${prefix}-c-title`, 'text', 'Card Title', { fontSize: 11, fontWeight: 700, color: '#f8fafc' }, {}, [], '📱 메인 홈 화면 (Mobile)'),
        vnode(`${prefix}-c-res`, 'badge', 'Res', { fontSize: 9, color: '#94a3b8', backgroundColor: '#1e293b', paddingLeft: 6, paddingRight: 6, paddingTop: 2, paddingBottom: 2, borderRadius: 4 }, {}, [], '390×844')
      ]),
      // Artboard Body
      vnode(`${prefix}-card-body`, 'container', 'Card Body', {
        flex: 1,
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        alignItems: 'center',
        justifyContent: 'center'
      }, {}, [
        vnode(`${prefix}-card-banner`, 'box', 'Hero Banner', {
          width: '100%',
          height: 140,
          borderRadius: 12,
          background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 6,
          color: '#ffffff',
          boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.3)'
        }, {}, [
          vnode(`${prefix}-b-title`, 'heading', 'Hero Title', { fontSize: 16, fontWeight: 800, color: '#ffffff' }, {}, [], 'Screen Designer VDOM Engine'),
          vnode(`${prefix}-b-sub`, 'text', 'Hero Sub', { fontSize: 11, opacity: 0.9, color: '#ffffff' }, {}, [], '인터랙티브 디자인 & 실시간 코드 생성')
        ]),
        // Selected Button with Glow
        vnode(`${prefix}-cta-btn`, 'button', 'Selected CTA', {
          width: '100%',
          height: 44,
          borderRadius: 10,
          backgroundColor: '#8b5cf6',
          boxShadow: '0 0 16px rgba(139, 92, 246, 0.6)',
          borderWidth: 2,
          borderColor: '#c4b5fd',
          borderStyle: 'solid',
          color: '#ffffff',
          fontSize: 12,
          fontWeight: 700,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }, {}, [], '★ 컴포넌트 삽입 및 스타일 편집 (Selected)')
      ])
    ])
  ]);
}

// -------------------------------------------------------------
// Artboard Builders for All 14 Screens
// -------------------------------------------------------------

// Page 1: 핵심 작업 공간 & 인스펙터
function buildArtboard1_Workspace() {
  const header = createHeaderVNode('ab1-hdr');
  const leftSidebar = createLeftSidebarVNode('ab1-ls', 'layers', 240);
  const canvasArea = createCanvasAreaVNode('ab1-cv');
  const rightSidebar = createRightSidebarVNode('ab1-rs', 'properties', 300);

  const mainArea = vnode('ab1-main', 'container', 'Workspace 3-Pane Body', {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    overflow: 'hidden'
  }, {}, [leftSidebar, canvasArea, rightSidebar]);

  return {
    id: 'ab-sd-workspace-main',
    name: '1. Screen Designer 3분할 작업 공간 (VDOM 1:1 실측)',
    width: 1600,
    height: 1000,
    backgroundColor: '#f1f5f9',
    rootNode: vnode('root-ab1', 'frame', 'Screen Designer Workspace Root', {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f1f5f9',
      overflow: 'hidden'
    }, {}, [header, mainArea])
  };
}

function buildArtboard2_Components() {
  const header = createHeaderVNode('ab2-hdr');
  const leftSidebar = createLeftSidebarVNode('ab2-ls', 'components', 340);
  const canvasArea = createCanvasAreaVNode('ab2-cv');

  const mainArea = vnode('ab2-main', 'container', 'Main Area', {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    overflow: 'hidden'
  }, {}, [leftSidebar, canvasArea]);

  return {
    id: 'ab-sd-components-palette',
    name: '2. 좌측 사이드바: 20종 컴포넌트 팔레트 (VDOM 1:1 실측)',
    width: 1600,
    height: 1000,
    backgroundColor: '#f1f5f9',
    rootNode: vnode('root-ab2', 'frame', 'Components Palette Root', {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f1f5f9',
      overflow: 'hidden'
    }, {}, [header, mainArea])
  };
}

function buildArtboard3_Templates() {
  const header = createHeaderVNode('ab3-hdr');
  const leftSidebar = createLeftSidebarVNode('ab3-ls', 'templates', 340);
  const canvasArea = createCanvasAreaVNode('ab3-cv');

  const mainArea = vnode('ab3-main', 'container', 'Main Area', {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    overflow: 'hidden'
  }, {}, [leftSidebar, canvasArea]);

  return {
    id: 'ab-sd-templates-palette',
    name: '3. 좌측 사이드바: 반응형 섹션 템플릿 (VDOM 1:1 실측)',
    width: 1600,
    height: 1000,
    backgroundColor: '#f1f5f9',
    rootNode: vnode('root-ab3', 'frame', 'Section Templates Root', {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f1f5f9',
      overflow: 'hidden'
    }, {}, [header, mainArea])
  };
}

function buildArtboard4_Code() {
  const header = createHeaderVNode('ab4-hdr');
  const leftSidebar = createLeftSidebarVNode('ab4-ls', 'layers', 240);
  const canvasArea = createCanvasAreaVNode('ab4-cv');
  const rightSidebar = createRightSidebarVNode('ab4-rs', 'code', 360);

  const mainArea = vnode('ab4-main', 'container', 'Main Area', {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    overflow: 'hidden'
  }, {}, [leftSidebar, canvasArea, rightSidebar]);

  return {
    id: 'ab-sd-inspector-code',
    name: '4. 우측 인스펙터: 실시간 React TSX 코드 생성기 (VDOM 1:1 실측)',
    width: 1600,
    height: 1000,
    backgroundColor: '#f1f5f9',
    rootNode: vnode('root-ab4', 'frame', 'Code Generator Root', {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f1f5f9',
      overflow: 'hidden'
    }, {}, [header, mainArea])
  };
}

// Page 2: 프로토타이핑 & 동적 트윅
function buildArtboard5_PlayMode() {
  // Play Mode Modal Full Takeover
  const playHeader = vnode('play-hdr', 'header', 'Play Modal Floating Bar', {
    height: 48,
    backgroundColor: '#0f172a',
    borderWidth: 1,
    borderColor: '#334155',
    borderStyle: 'solid',
    borderRadius: 9999,
    paddingLeft: 20,
    paddingRight: 20,
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
    color: '#ffffff',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
  }, {}, [
    vnode('play-h-title', 'container', 'Title', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }, {}, [
      vnode('play-h-dot', 'box', 'Dot', { width: 8, height: 8, borderRadius: 9999, backgroundColor: '#10b981' }),
      vnode('play-h-txt', 'text', 'Txt', { fontSize: 12, fontWeight: 700 }, {}, [], '1. 메인 무한 캔버스 & 삼분할 워크스페이스 (1 / 3)')
    ]),
    vnode('play-h-devices', 'container', 'Devices', { display: 'flex', flexDirection: 'row', gap: 4 }, {}, [
      vnode('play-d-ip', 'badge', 'iPhone', { backgroundColor: '#4f46e5', color: '#ffffff', paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3, borderRadius: 6, fontSize: 11, fontWeight: 700 }, {}, [], 'iPhone'),
      vnode('play-d-pad', 'badge', 'iPad', { backgroundColor: 'transparent', color: '#94a3b8', paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3, borderRadius: 6, fontSize: 11 }, {}, [], 'iPad'),
      vnode('play-d-mac', 'badge', 'Mac', { backgroundColor: 'transparent', color: '#94a3b8', paddingLeft: 8, paddingRight: 8, paddingTop: 3, paddingBottom: 3, borderRadius: 6, fontSize: 11 }, {}, [], 'Mac')
    ]),
    vnode('play-h-close', 'button', 'Close', { width: 24, height: 24, color: '#94a3b8', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }, {}, [], '✕')
  ]);

  // iPhone 15 Pro Bezel
  const phone = vnode('play-phone', 'box', 'iPhone Bezel Frame', {
    width: 380,
    height: 760,
    backgroundColor: '#020617',
    borderRadius: 48,
    borderWidth: 4,
    borderColor: '#334155',
    borderStyle: 'solid',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.8)',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    position: 'relative',
    overflow: 'hidden'
  }, {}, [
    // Dynamic Island
    vnode('play-island', 'box', 'Dynamic Island', {
      width: 100,
      height: 24,
      borderRadius: 9999,
      backgroundColor: '#000000',
      position: 'absolute',
      top: 10,
      zIndex: 40
    }),
    // Inner Screen Content
    vnode('play-screen', 'container', 'Screen Content', {
      width: '100%',
      height: '100%',
      paddingTop: 48,
      paddingLeft: 16,
      paddingRight: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 12
    }, {}, [
      vnode('play-card-1', 'card', 'Card 1', { width: '100%', height: 120, borderRadius: 16, background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)', padding: 16, color: '#ffffff', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }, {}, [
        vnode('play-c1-t', 'text', 'Balance Label', { fontSize: 11, opacity: 0.8 }, {}, [], '총 평가 자산'),
        vnode('play-c1-amt', 'heading', 'Amount', { fontSize: 24, fontWeight: 800 }, {}, [], '₩ 34,820,000')
      ]),
      vnode('play-card-2', 'card', 'Card 2', { width: '100%', height: 80, borderRadius: 12, backgroundColor: '#0f172a', borderWidth: 1, borderColor: '#1e293b', borderStyle: 'solid', padding: 12, color: '#ffffff' }, {}, [
        vnode('play-c2-t', 'text', 'T', { fontSize: 11, fontWeight: 700 }, {}, [], '비트코인 (BTC) 45% 보유')
      ])
    ]),
    // Home Indicator Bar
    vnode('play-home-bar', 'box', 'Home Bar', {
      width: 120,
      height: 4,
      borderRadius: 9999,
      backgroundColor: 'rgba(255, 255, 255, 0.4)',
      position: 'absolute',
      bottom: 8
    })
  ]);

  return {
    id: 'ab-sd-modal-play',
    name: '5. 디바이스 프레임 플레이 모드 (VDOM 1:1 실측)',
    width: 1600,
    height: 1000,
    backgroundColor: '#020617',
    rootNode: vnode('root-ab5', 'frame', 'Play Mode Root', {
      width: '100%',
      height: '100%',
      backgroundColor: '#020617',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'space-between',
      padding: 24,
      overflow: 'hidden'
    }, {}, [
      playHeader,
      phone,
      vnode('play-foot', 'text', 'Legend', { fontSize: 11, color: '#64748b' }, {}, [], '인터랙티브 모드 가동 중 · 화면 내 버튼 클릭 시 연결된 화면으로 전환 (좌/우 방향키 또는 Esc)')
    ])
  };
}

function buildArtboard6_Events() {
  const header = createHeaderVNode('ab6-hdr');
  const leftSidebar = createLeftSidebarVNode('ab6-ls', 'layers', 240);
  const canvasArea = createCanvasAreaVNode('ab6-cv');
  const rightSidebar = createRightSidebarVNode('ab6-rs', 'events', 320);

  const mainArea = vnode('ab6-main', 'container', 'Main Area', {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    overflow: 'hidden'
  }, {}, [leftSidebar, canvasArea, rightSidebar]);

  return {
    id: 'ab-sd-inspector-events',
    name: '6. 우측 인스펙터: 프로토타입 이벤트 & 네비게이션 (VDOM 1:1 실측)',
    width: 1600,
    height: 1000,
    backgroundColor: '#f1f5f9',
    rootNode: vnode('root-ab6', 'frame', 'Events Tab Root', {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f1f5f9',
      overflow: 'hidden'
    }, {}, [header, mainArea])
  };
}

function buildArtboard7_Rulers() {
  const header = createHeaderVNode('ab7-hdr');
  const leftSidebar = createLeftSidebarVNode('ab7-ls', 'layers', 240);

  // Canvas with Rulers Overlay
  const canvasRulersArea = vnode('ab7-cv', 'main', 'Canvas with Rulers', {
    flex: 1,
    height: '100%',
    backgroundColor: '#f1f5f9',
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden'
  }, {}, [
    // Corner
    vnode('ab7-r-corner', 'box', 'Ruler Corner', { width: 18, height: 18, backgroundColor: '#e2e8f0', borderWidth: 1, borderColor: '#cbd5e1', borderStyle: 'solid', position: 'absolute', top: 0, left: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 9, color: '#64748b' }, {}, [], 'px'),
    // Horizontal Ruler
    vnode('ab7-r-top', 'box', 'Top Ruler Bar', { height: 18, width: 'calc(100% - 18px)', backgroundColor: '#f8fafc', borderBottomWidth: 1, borderBottomColor: '#cbd5e1', borderBottomStyle: 'solid', position: 'absolute', top: 0, left: 18, display: 'flex', alignItems: 'center', paddingLeft: 10, fontSize: 8, color: '#94a3b8' }, {}, [], '0    100    200    300    400    500    600    700    800    900   1000'),
    // Vertical Ruler
    vnode('ab7-r-left', 'box', 'Left Ruler Bar', { width: 18, height: 'calc(100% - 18px)', backgroundColor: '#f8fafc', borderRightWidth: 1, borderRightColor: '#cbd5e1', borderRightStyle: 'solid', position: 'absolute', top: 18, left: 0, display: 'flex', flexDirection: 'column', paddingLeft: 2, fontSize: 8, color: '#94a3b8' }, {}, [], '0 100 200 300 400'),
    // Guideline Horizontal
    vnode('ab7-guide-h', 'box', 'Guide H', { width: '100%', height: 1, backgroundColor: '#06b6d4', position: 'absolute', top: 220, left: 18, display: 'flex', alignItems: 'center' }, {}, [
      vnode('ab7-gh-b', 'badge', 'Y Badge', { backgroundColor: '#0891b2', color: '#ffffff', fontSize: 9, paddingLeft: 4, paddingRight: 4, borderRadius: 2, position: 'absolute', top: -14, left: 24 }, {}, [], 'Y: 220px ✕')
    ]),
    // Guideline Vertical
    vnode('ab7-guide-v', 'box', 'Guide V', { width: 1, height: '100%', backgroundColor: '#06b6d4', position: 'absolute', top: 18, left: 420 }, {}, [
      vnode('ab7-gv-b', 'badge', 'X Badge', { backgroundColor: '#0891b2', color: '#ffffff', fontSize: 9, paddingLeft: 4, paddingRight: 4, borderRadius: 2, position: 'absolute', top: 24, left: 4 }, {}, [], 'X: 420px ✕')
    ]),
    // Center Card
    vnode('ab7-card', 'card', 'Card', { width: 500, height: 400, backgroundColor: '#020617', borderRadius: 16, borderTopWidth: 2, borderTopColor: '#06b6d4', borderTopStyle: 'solid', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)' })
  ]);

  const rightSidebar = createRightSidebarVNode('ab7-rs', 'properties', 300);

  const mainArea = vnode('ab7-main', 'container', 'Main Area', {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    overflow: 'hidden'
  }, {}, [leftSidebar, canvasRulersArea, rightSidebar]);

  return {
    id: 'ab-sd-canvas-rulers',
    name: '7. 정밀 픽셀 눈금자 & 가이드라인 시스템 (VDOM 1:1 실측)',
    width: 1600,
    height: 1000,
    backgroundColor: '#f1f5f9',
    rootNode: vnode('root-ab7', 'frame', 'Rulers Root', {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f1f5f9',
      overflow: 'hidden'
    }, {}, [header, mainArea])
  };
}

function buildArtboard8_Tweaks() {
  const header = createHeaderVNode('ab8-hdr');
  const leftSidebar = createLeftSidebarVNode('ab8-ls', 'layers', 240);
  const canvasArea = createCanvasAreaVNode('ab8-cv');
  const rightSidebar = createRightSidebarVNode('ab8-rs', 'tweaks', 320);

  const mainArea = vnode('ab8-main', 'container', 'Main Area', {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    overflow: 'hidden'
  }, {}, [leftSidebar, canvasArea, rightSidebar]);

  return {
    id: 'ab-sd-inspector-tweaks',
    name: '8. 우측 인스펙터: 동적 트윅 변수 편집기 (VDOM 1:1 실측)',
    width: 1600,
    height: 1000,
    backgroundColor: '#f1f5f9',
    rootNode: vnode('root-ab8', 'frame', 'Tweaks Root', {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f1f5f9',
      overflow: 'hidden'
    }, {}, [header, mainArea])
  };
}

// Page 3: 디자인 시스템 & 버전 관리
function buildArtboard9_DesignSystem() {
  const header = createHeaderVNode('ab9-hdr');
  const canvasArea = createCanvasAreaVNode('ab9-cv');

  // Modal Dialog (1000x720) centered
  const modal = vnode('ab9-ds-modal', 'dialog', 'Design System Modal', {
    width: 1040,
    height: 720,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'absolute',
    zIndex: 100
  }, {}, [
    // Header
    vnode('ab9-m-hdr', 'header', 'Modal Header', {
      height: 56,
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
      vnode('ab9-m-h-l', 'container', 'Left', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }, {}, [
        vnode('ab9-m-h-ic', 'box', 'Icon Box', { width: 32, height: 32, borderRadius: 8, backgroundColor: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center' }, {}, [
          vnode('ab9-m-ic', 'icon', 'Palette', { color: '#ffffff' }, { icon: 'palette', size: 16 })
        ]),
        vnode('ab9-m-meta', 'container', 'Meta', { display: 'flex', flexDirection: 'column' }, {}, [
          vnode('ab9-m-title', 'text', 'Title', { fontSize: 13, fontWeight: 700, color: '#0f172a' }, {}, [], '디자인 시스템 스튜디오 (45종 컴포넌트 기본값 관리)'),
          vnode('ab9-m-sub', 'text', 'Sub', { fontSize: 10, color: '#64748b' }, {}, [], '각 VDOM 요소가 캔버스에 추가될 때 기본 적용되는 스타일을 편집하며, docs/ui-boards/design-system.json에 자동 반영됩니다.')
        ])
      ]),
      vnode('ab9-m-h-r', 'container', 'Right Buttons', { display: 'flex', flexDirection: 'row', gap: 8 }, {}, [
        vnode('ab9-btn-reset', 'button', 'Reset', { height: 28, paddingLeft: 10, paddingRight: 10, borderRadius: 6, backgroundColor: '#f1f5f9', color: '#475569', fontSize: 11 }, {}, [], '전체 초기화'),
        vnode('ab9-btn-save', 'button', 'Save', { height: 28, paddingLeft: 12, paddingRight: 12, borderRadius: 6, backgroundColor: '#4f46e5', color: '#ffffff', fontSize: 11, fontWeight: 700 }, {}, [], '✓ 적용 및 완료')
      ])
    ]),

    // 3-Column Studio Body
    vnode('ab9-m-body', 'container', '3-Column Body', {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden'
    }, {}, [
      // Col 1: Categories (220px)
      vnode('ab9-col-1', 'container', 'Category Column', {
        width: 220,
        borderRightWidth: 1,
        borderRightColor: '#e2e8f0',
        borderRightStyle: 'solid',
        padding: 8,
        display: 'flex',
        flexDirection: 'column',
        gap: 6
      }, {}, [
        vnode('ab9-cat-item1', 'badge', 'Button Active', { backgroundColor: '#eef2ff', color: '#4338ca', fontWeight: 700, padding: 6, borderRadius: 6, fontSize: 11 }, {}, [], 'CTA 버튼 <button>'),
        vnode('ab9-cat-item2', 'badge', 'Frame', { backgroundColor: 'transparent', color: '#475569', padding: 6, fontSize: 11 }, {}, [], '프레임 <frame>'),
        vnode('ab9-cat-item3', 'badge', 'Container', { backgroundColor: 'transparent', color: '#475569', padding: 6, fontSize: 11 }, {}, [], '컨테이너 <div>'),
        vnode('ab9-cat-item4', 'badge', 'Section', { backgroundColor: 'transparent', color: '#475569', padding: 6, fontSize: 11 }, {}, [], '시맨틱 섹션 <section>')
      ]),

      // Col 2: Form Controls (420px)
      vnode('ab9-col-2', 'container', 'Controls Column', {
        width: 420,
        borderRightWidth: 1,
        borderRightColor: '#e2e8f0',
        borderRightStyle: 'solid',
        padding: 14,
        display: 'flex',
        flexDirection: 'column',
        gap: 12,
        overflowY: 'auto'
      }, {}, [
        vnode('ab9-sec-col', 'container', 'Colors', { display: 'flex', flexDirection: 'column', gap: 6 }, {}, [
          vnode('ab9-sec-col-t', 'text', 'T', { fontSize: 11, fontWeight: 700, color: '#334155' }, {}, [], '색상 및 불투명도 (Colors & Opacity)'),
          vnode('ab9-col-row', 'container', 'Row', { display: 'flex', flexDirection: 'row', gap: 8 }, {}, [
            vnode('ab9-c-bg', 'box', 'BG Color Box', { flex: 1, height: 32, backgroundColor: '#4f46e5', borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 8, color: '#ffffff', fontSize: 11, fontWeight: 700 }, {}, [], '#4f46e5'),
            vnode('ab9-c-txt', 'box', 'Text Color Box', { flex: 1, height: 32, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderStyle: 'solid', borderRadius: 6, display: 'flex', alignItems: 'center', paddingLeft: 8, color: '#0f172a', fontSize: 11 }, {}, [], '#ffffff')
          ])
        ]),
        vnode('ab9-sec-typo', 'container', 'Typography', { display: 'flex', flexDirection: 'column', gap: 6 }, {}, [
          vnode('ab9-typo-t', 'text', 'T', { fontSize: 11, fontWeight: 700, color: '#334155' }, {}, [], '타이포그래피 (Typography)'),
          vnode('ab9-typo-weights', 'container', 'Weights', { display: 'flex', flexDirection: 'row', gap: 4 }, {}, [
            vnode('ab9-w1', 'badge', '300', { padding: 4, borderRadius: 4, backgroundColor: '#f1f5f9', fontSize: 10 }, {}, [], '300'),
            vnode('ab9-w2', 'badge', '400', { padding: 4, borderRadius: 4, backgroundColor: '#f1f5f9', fontSize: 10 }, {}, [], '400'),
            vnode('ab9-w3', 'badge', '600', { padding: 4, borderRadius: 4, backgroundColor: '#4f46e5', color: '#ffffff', fontSize: 10, fontWeight: 700 }, {}, [], '600'),
            vnode('ab9-w4', 'badge', '800', { padding: 4, borderRadius: 4, backgroundColor: '#f1f5f9', fontSize: 10 }, {}, [], '800')
          ])
        ])
      ]),

      // Col 3: Live Preview (400px)
      vnode('ab9-col-3', 'container', 'Live Preview Column', {
        flex: 1,
        backgroundColor: '#0f172a',
        padding: 16,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 16
      }, {}, [
        vnode('ab9-prev-lbl', 'text', 'Preview Label', { fontSize: 11, color: '#94a3b8' }, {}, [], '실시간 컴포넌트 프리뷰'),
        vnode('ab9-prev-btn', 'button', 'Preview CTA Button', {
          height: 48,
          paddingLeft: 24,
          paddingRight: 24,
          borderRadius: 12,
          backgroundColor: '#4f46e5',
          color: '#ffffff',
          fontSize: 14,
          fontWeight: 700,
          boxShadow: '0 10px 15px -3px rgba(79, 70, 229, 0.4)'
        }, {}, [], '지금 바로 시작하기')
      ])
    ])
  ]);

  const mainArea = vnode('ab9-main', 'container', 'Main Area', {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  }, {}, [canvasArea, modal]);

  return {
    id: 'ab-sd-design-system-studio',
    name: '9. 글로벌 디자인 시스템 스튜디오 (VDOM 1:1 실측)',
    width: 1600,
    height: 1000,
    backgroundColor: '#f1f5f9',
    rootNode: vnode('root-ab9', 'frame', 'Design System Studio Root', {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f1f5f9',
      overflow: 'hidden'
    }, {}, [header, mainArea])
  };
}

function buildArtboard10_GitDesktop() {
  const header = createHeaderVNode('ab10-hdr');
  const canvasArea = createCanvasAreaVNode('ab10-cv');

  // Git Modal (1000x700)
  const modal = vnode('ab10-git-modal', 'dialog', 'Git Desktop Modal', {
    width: 1040,
    height: 700,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'absolute',
    zIndex: 100
  }, {}, [
    // Top Tabs Header
    vnode('ab10-m-hdr', 'header', 'Git Modal Header', {
      height: 48,
      paddingLeft: 16,
      paddingRight: 16,
      backgroundColor: '#f8fafc',
      borderBottomWidth: 1,
      borderBottomColor: '#e2e8f0',
      borderBottomStyle: 'solid',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    }, {}, [
      vnode('ab10-m-tabs', 'container', 'Tabs', { display: 'flex', flexDirection: 'row', gap: 12 }, {}, [
        vnode('ab10-tab-ch', 'badge', 'Changes Active', { fontSize: 12, fontWeight: 700, color: '#2563eb' }, {}, [], 'Changes 38'),
        vnode('ab10-tab-hi', 'badge', 'History', { fontSize: 12, color: '#64748b' }, {}, [], 'History')
      ]),
      vnode('ab10-active-fp', 'text', 'Active File', { fontSize: 11, fontMono: true, color: '#334155' }, {}, [], '.screen-designer/config.json'),
      vnode('ab10-close-btn', 'button', 'Close', { width: 24, height: 24, color: '#64748b', fontSize: 13 }, {}, [], '✕')
    ]),

    // Body: Left Files + Right Diff
    vnode('ab10-m-body', 'container', 'Git Body', {
      flex: 1,
      display: 'flex',
      flexDirection: 'row',
      overflow: 'hidden'
    }, {}, [
      // Left File List (320px)
      vnode('ab10-f-list', 'container', 'File List Pane', {
        width: 320,
        borderRightWidth: 1,
        borderRightColor: '#e2e8f0',
        borderRightStyle: 'solid',
        padding: 10,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between'
      }, {}, [
        // Files
        vnode('ab10-files-box', 'container', 'Files', { display: 'flex', flexDirection: 'column', gap: 6 }, {}, [
          vnode('ab10-f1', 'container', 'F1', { padding: 6, backgroundColor: '#eff6ff', borderRadius: 6, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }, {}, [
            vnode('ab10-f1-cb', 'badge', '☑', { fontSize: 11, color: '#2563eb' }, {}, [], '☑'),
            vnode('ab10-f1-tg', 'badge', 'Tag', { fontSize: 9, backgroundColor: '#dbeafe', color: '#1e40af', paddingLeft: 4, paddingRight: 4, borderRadius: 3 }, {}, [], '앱 관리'),
            vnode('ab10-f1-nm', 'text', 'Name', { fontSize: 10, fontMono: true, color: '#1e3a8a', fontWeight: 600 }, {}, [], '.screen-designer/config.json')
          ]),
          vnode('ab10-f2', 'container', 'F2', { padding: 6, backgroundColor: '#ffffff', borderRadius: 6, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }, {}, [
            vnode('ab10-f2-cb', 'badge', '☑', { fontSize: 11, color: '#2563eb' }, {}, [], '☑'),
            vnode('ab10-f2-tg', 'badge', 'Tag', { fontSize: 9, backgroundColor: '#dbeafe', color: '#1e40af', paddingLeft: 4, paddingRight: 4, borderRadius: 3 }, {}, [], '앱 관리'),
            vnode('ab10-f2-nm', 'text', 'Name', { fontSize: 10, fontMono: true, color: '#334155' }, {}, [], 'docs/ui-boards/pages/1.json')
          ])
        ]),

        // Bottom Commit Box
        vnode('ab10-c-box', 'container', 'Commit Box', {
          backgroundColor: '#f8fafc',
          borderWidth: 1,
          borderColor: '#e2e8f0',
          borderStyle: 'solid',
          borderRadius: 8,
          padding: 10,
          display: 'flex',
          flexDirection: 'column',
          gap: 6
        }, {}, [
          vnode('ab10-c-msg', 'input', 'Commit Message', { height: 26, backgroundColor: '#ffffff', borderWidth: 1, borderColor: '#cbd5e1', borderStyle: 'solid', borderRadius: 4, paddingLeft: 6, fontSize: 10 }, {}, [], 'feat(ui): update storyboard canvas design docs'),
          vnode('ab10-c-btn', 'button', 'Commit Button', { height: 30, backgroundColor: '#2563eb', borderRadius: 6, color: '#ffffff', fontSize: 11, fontWeight: 700, display: 'flex', alignItems: 'center', justifyContent: 'center' }, {}, [], 'Commit 21 files to main')
        ])
      ]),

      // Right Diff Pane
      vnode('ab10-diff-pane', 'container', 'Diff Pane', {
        flex: 1,
        backgroundColor: '#ffffff',
        padding: 12,
        fontFamily: 'monospace',
        fontSize: 11,
        display: 'flex',
        flexDirection: 'column',
        gap: 4
      }, {}, [
        vnode('ab10-d-h1', 'badge', 'Diff Header', { backgroundColor: '#f1f5f9', padding: 4, color: '#64748b' }, {}, [], '@@ -4,8 +4,8 @@'),
        vnode('ab10-d-del', 'text', 'Del Line', { backgroundColor: '#fee2e2', color: '#991b1b', padding: 2 }, {}, [], '-  "lastActivePage": "page-workspace"'),
        vnode('ab10-d-add', 'text', 'Add Line', { backgroundColor: '#dcfce7', color: '#166534', padding: 2 }, {}, [], '+  "lastActivePage": "page-1"')
      ])
    ])
  ]);

  const mainArea = vnode('ab10-main', 'container', 'Main Area', {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  }, {}, [canvasArea, modal]);

  return {
    id: 'ab-sd-git-desktop-modal',
    name: '10. 내장 Git 데스크톱 & Diff 뷰어 (VDOM 1:1 실측)',
    width: 1600,
    height: 1000,
    backgroundColor: '#f1f5f9',
    rootNode: vnode('root-ab10', 'frame', 'Git Desktop Root', {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f1f5f9',
      overflow: 'hidden'
    }, {}, [header, mainArea])
  };
}

// Page 4: 커맨드 팔레트 & 환경설정
function buildArtboard11_CommandPalette() {
  const header = createHeaderVNode('ab11-hdr');
  const canvasArea = createCanvasAreaVNode('ab11-cv');

  // Spotlight Box (620x460)
  const spotlight = vnode('ab11-spotlight', 'dialog', 'Command Palette Modal', {
    width: 620,
    height: 480,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'absolute',
    zIndex: 110
  }, {}, [
    // Search Bar
    vnode('ab11-s-bar', 'container', 'Search Bar', {
      height: 52,
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
      vnode('ab11-s-left', 'container', 'Search Left', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }, {}, [
        vnode('ab11-s-ic', 'icon', 'Search', { color: '#94a3b8' }, { icon: 'search', size: 16 }),
        vnode('ab11-s-ph', 'text', 'Placeholder', { fontSize: 13, color: '#94a3b8' }, {}, [], '명령어, 컴포넌트, 페이지 또는 화면 검색... (Ctrl+K)')
      ]),
      vnode('ab11-s-esc', 'badge', 'ESC', { fontSize: 10, color: '#64748b', backgroundColor: '#f1f5f9', paddingLeft: 6, paddingRight: 6, paddingTop: 2, paddingBottom: 2, borderRadius: 4 }, {}, [], 'ESC')
    ]),

    // Actions List
    vnode('ab11-actions', 'container', 'Actions List', {
      flex: 1,
      padding: 10,
      display: 'flex',
      flexDirection: 'column',
      gap: 6
    }, {}, [
      // Highlighted Action
      vnode('ab11-act-1', 'container', 'Action 1 Active', {
        padding: 10,
        backgroundColor: '#4f46e5',
        borderRadius: 10,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        color: '#ffffff'
      }, {}, [
        vnode('ab11-a1-l', 'container', 'Left', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }, {}, [
          vnode('ab11-a1-ic', 'icon', 'Play', { color: '#ffffff' }, { icon: 'play', size: 16 }),
          vnode('ab11-a1-txts', 'container', 'Texts', { display: 'flex', flexDirection: 'column' }, {}, [
            vnode('ab11-a1-t', 'text', 'Title', { fontSize: 12, fontWeight: 700, color: '#ffffff' }, {}, [], '인터랙티브 프로토타입 실행 (Play Mode)'),
            vnode('ab11-a1-d', 'text', 'Desc', { fontSize: 10, opacity: 0.8, color: '#ffffff' }, {}, [], '실제 모바일/데스크톱 뷰포트에서 클릭 및 인터랙션 테스트')
          ])
        ]),
        vnode('ab11-a1-k', 'badge', 'Kbd', { fontSize: 10, fontWeight: 700, backgroundColor: 'rgba(255,255,255,0.2)', paddingLeft: 6, paddingRight: 6, paddingTop: 2, paddingBottom: 2, borderRadius: 4 }, {}, [], 'Ctrl+P ↵')
      ]),

      // Other Actions
      vnode('ab11-act-2', 'container', 'Action 2', { padding: 10, backgroundColor: '#ffffff', borderRadius: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, {}, [
        vnode('ab11-a2-l', 'container', 'L', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }, {}, [
          vnode('ab11-a2-ic', 'icon', 'Palette', { color: '#64748b' }, { icon: 'palette', size: 16 }),
          vnode('ab11-a2-t', 'text', 'T', { fontSize: 12, fontWeight: 600, color: '#0f172a' }, {}, [], '디자인 시스템 스튜디오 열기')
        ]),
        vnode('ab11-a2-k', 'badge', 'K', { fontSize: 10, color: '#64748b' }, {}, [], 'Alt+D')
      ]),

      vnode('ab11-act-3', 'container', 'Action 3', { padding: 10, backgroundColor: '#ffffff', borderRadius: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, {}, [
        vnode('ab11-a3-l', 'container', 'L', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }, {}, [
          vnode('ab11-a3-ic', 'icon', 'Git', { color: '#64748b' }, { icon: 'git-branch', size: 16 }),
          vnode('ab11-a3-t', 'text', 'T', { fontSize: 12, fontWeight: 600, color: '#0f172a' }, {}, [], 'Git 변경사항 감지 & 커밋/푸시 다이얼로그')
        ]),
        vnode('ab11-a3-k', 'badge', 'K', { fontSize: 10, color: '#64748b' }, {}, [], 'Ctrl+G')
      ]),

      vnode('ab11-act-4', 'container', 'Action 4', { padding: 10, backgroundColor: '#ffffff', borderRadius: 8, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, {}, [
        vnode('ab11-a4-l', 'container', 'L', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 10 }, {}, [
          vnode('ab11-a4-ic', 'icon', 'Layout', { color: '#64748b' }, { icon: 'layout', size: 16 }),
          vnode('ab11-a4-t', 'text', 'T', { fontSize: 12, fontWeight: 600, color: '#0f172a' }, {}, [], '새 스크린 프레임/아트보드 추가')
        ]),
        vnode('ab11-a4-k', 'badge', 'K', { fontSize: 10, color: '#64748b' }, {}, [], 'F')
      ])
    ]),

    // Footer Legend
    vnode('ab11-foot', 'footer', 'Palette Footer', {
      height: 38,
      backgroundColor: '#f8fafc',
      borderTopWidth: 1,
      borderTopColor: '#e2e8f0',
      borderTopStyle: 'solid',
      paddingLeft: 16,
      paddingRight: 16,
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      fontSize: 11,
      color: '#64748b'
    }, {}, [
      vnode('ab11-f-legend', 'text', 'Legend', { fontSize: 10, color: '#64748b' }, {}, [], '↑↓ 이동  ↵ 실행  ESC 닫기'),
      vnode('ab11-f-cnt', 'text', 'Count', { fontSize: 10, color: '#94a3b8' }, {}, [], '총 27개 결과')
    ])
  ]);

  const mainArea = vnode('ab11-main', 'container', 'Main Area', {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  }, {}, [canvasArea, spotlight]);

  return {
    id: 'ab-sd-modal-command-palette',
    name: '11. 스포트라이트 커맨드 팔레트 (Ctrl+K) (VDOM 1:1 실측)',
    width: 1600,
    height: 1000,
    backgroundColor: '#f1f5f9',
    rootNode: vnode('root-ab11', 'frame', 'Command Palette Root', {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f1f5f9',
      overflow: 'hidden'
    }, {}, [header, mainArea])
  };
}

function buildArtboard12_Settings() {
  const header = createHeaderVNode('ab12-hdr');
  const canvasArea = createCanvasAreaVNode('ab12-cv');

  // Settings Modal (760x560)
  const modal = vnode('ab12-set-modal', 'dialog', 'Settings Modal', {
    width: 760,
    height: 560,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'absolute',
    zIndex: 100
  }, {}, [
    // Header
    vnode('ab12-m-hdr', 'header', 'Settings Header', {
      height: 52,
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
      vnode('ab12-h-left', 'container', 'Left', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }, {}, [
        vnode('ab12-h-ic', 'icon', 'Settings', { color: '#4f46e5' }, { icon: 'settings', size: 16 }),
        vnode('ab12-h-txt', 'text', 'Title', { fontSize: 13, fontWeight: 700, color: '#0f172a' }, {}, [], '환경 설정 (Preferences)')
      ]),
      vnode('ab12-h-close', 'button', 'Close', { width: 24, height: 24, color: '#64748b', fontSize: 14 }, {}, [], '✕')
    ]),

    // Body
    vnode('ab12-m-body', 'container', 'Settings Body', {
      flex: 1,
      padding: 20,
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }, {}, [
      // Storage location
      vnode('ab12-sec-loc', 'container', 'Storage Location', { display: 'flex', flexDirection: 'column', gap: 6 }, {}, [
        vnode('ab12-loc-l', 'text', 'Label', { fontSize: 11, fontWeight: 700, color: '#334155' }, {}, [], '스토리보드 문서 저장 위치'),
        vnode('ab12-loc-row', 'container', 'Row', { display: 'flex', flexDirection: 'row', gap: 8 }, {}, [
          vnode('ab12-loc-in', 'input', 'Path', { flex: 1, height: 32, backgroundColor: '#f8fafc', borderWidth: 1, borderColor: '#cbd5e1', borderStyle: 'solid', borderRadius: 6, paddingLeft: 10, fontSize: 11, fontMono: true }, {}, [], 'docs/ui-boards'),
          vnode('ab12-loc-btn', 'button', 'Migrate', { height: 32, paddingLeft: 12, paddingRight: 12, backgroundColor: '#4f46e5', color: '#ffffff', borderRadius: 6, fontSize: 11, fontWeight: 600 }, {}, [], '폴더 변경 및 마이그레이션')
        ])
      ]),

      // Canvas grid options
      vnode('ab12-sec-grid', 'container', 'Grid Options', { display: 'flex', flexDirection: 'column', gap: 8 }, {}, [
        vnode('ab12-grid-l', 'text', 'Label', { fontSize: 11, fontWeight: 700, color: '#334155' }, {}, [], '캔버스 환경 설정'),
        vnode('ab12-row-opt1', 'container', 'Opt1', { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, {}, [
          vnode('ab12-o1-t', 'text', 'T', { fontSize: 11, color: '#475569' }, {}, [], '24px 배경 격자 그리드 표시'),
          vnode('ab12-o1-sw', 'box', 'SW', { width: 28, height: 16, borderRadius: 9999, backgroundColor: '#4f46e5' })
        ]),
        vnode('ab12-row-opt2', 'container', 'Opt2', { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }, {}, [
          vnode('ab12-o2-t', 'text', 'T', { fontSize: 11, color: '#475569' }, {}, [], '픽셀 정밀 눈금자 표시'),
          vnode('ab12-o2-sw', 'box', 'SW', { width: 28, height: 16, borderRadius: 9999, backgroundColor: '#4f46e5' })
        ])
      ])
    ]),

    // Footer
    vnode('ab12-m-foot', 'footer', 'Settings Footer', {
      height: 48,
      paddingLeft: 16,
      paddingRight: 16,
      backgroundColor: '#f8fafc',
      borderTopWidth: 1,
      borderTopColor: '#e2e8f0',
      borderTopStyle: 'solid',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end',
      gap: 8
    }, {}, [
      vnode('ab12-f-close', 'button', 'Close', { height: 30, paddingLeft: 14, paddingRight: 14, borderRadius: 6, backgroundColor: '#4f46e5', color: '#ffffff', fontSize: 11, fontWeight: 700 }, {}, [], '적용 및 닫기')
    ])
  ]);

  const mainArea = vnode('ab12-main', 'container', 'Main Area', {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  }, {}, [canvasArea, modal]);

  return {
    id: 'ab-sd-modal-settings',
    name: '12. 환경설정 및 저장소 경로 관리 다이얼로그 (VDOM 1:1 실측)',
    width: 1600,
    height: 1000,
    backgroundColor: '#f1f5f9',
    rootNode: vnode('root-ab12', 'frame', 'Settings Root', {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f1f5f9',
      overflow: 'hidden'
    }, {}, [header, mainArea])
  };
}

function buildArtboard13_Shortcuts() {
  const header = createHeaderVNode('ab13-hdr');
  const canvasArea = createCanvasAreaVNode('ab13-cv');

  // Shortcuts Dialog (640x540)
  const modal = vnode('ab13-sc-modal', 'dialog', 'Shortcuts Modal', {
    width: 640,
    height: 540,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.4)',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    position: 'absolute',
    zIndex: 100
  }, {}, [
    // Header
    vnode('ab13-m-hdr', 'header', 'Shortcuts Header', {
      height: 48,
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
      vnode('ab13-h-l', 'container', 'L', { display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 8 }, {}, [
        vnode('ab13-h-ic', 'icon', 'Keyboard', { color: '#4f46e5' }, { icon: 'keyboard', size: 16 }),
        vnode('ab13-h-t', 'text', 'Title', { fontSize: 13, fontWeight: 700, color: '#0f172a' }, {}, [], '키보드 단축키 안내 (Keyboard Shortcuts)')
      ]),
      vnode('ab13-h-cl', 'button', 'Close', { width: 24, height: 24, color: '#64748b', fontSize: 14 }, {}, [], '✕')
    ]),

    // Body
    vnode('ab13-m-body', 'container', 'Shortcuts Body', {
      flex: 1,
      padding: 16,
      display: 'flex',
      flexDirection: 'column',
      gap: 12,
      overflowY: 'auto'
    }, {}, [
      // Cat 1: Tools
      vnode('ab13-cat-tools', 'container', 'Tools Category', { display: 'flex', flexDirection: 'column', gap: 6 }, {}, [
        vnode('ab13-t-lbl', 'text', 'Category Title', { fontSize: 10, fontWeight: 700, color: '#6366f1' }, {}, [], '도구 선택 (TOOLS)'),
        vnode('ab13-row-v', 'container', 'Row', { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 4 }, {}, [
          vnode('ab13-v-t', 'text', 'T', { fontSize: 11, color: '#334155' }, {}, [], '선택 도구 (Select Tool)'),
          vnode('ab13-v-k', 'badge', 'K', { fontSize: 10, fontMono: true, fontWeight: 700, backgroundColor: '#f1f5f9', paddingLeft: 6, paddingRight: 6, borderRadius: 4 }, {}, [], 'V')
        ]),
        vnode('ab13-row-h', 'container', 'Row', { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 4 }, {}, [
          vnode('ab13-h-t', 'text', 'T', { fontSize: 11, color: '#334155' }, {}, [], '화면 이동 손바닥 도구 (Hand Tool)'),
          vnode('ab13-h-k', 'badge', 'K', { fontSize: 10, fontMono: true, fontWeight: 700, backgroundColor: '#f1f5f9', paddingLeft: 6, paddingRight: 6, borderRadius: 4 }, {}, [], 'H / Space + 드래그')
        ]),
        vnode('ab13-row-f', 'container', 'Row', { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 4 }, {}, [
          vnode('ab13-f-t', 'text', 'T', { fontSize: 11, color: '#334155' }, {}, [], '새 프레임/아트보드 추가 (Frame Tool)'),
          vnode('ab13-f-k', 'badge', 'K', { fontSize: 10, fontMono: true, fontWeight: 700, backgroundColor: '#f1f5f9', paddingLeft: 6, paddingRight: 6, borderRadius: 4 }, {}, [], 'F')
        ])
      ]),

      // Cat 2: Canvas
      vnode('ab13-cat-canvas', 'container', 'Canvas Category', { display: 'flex', flexDirection: 'column', gap: 6 }, {}, [
        vnode('ab13-c-lbl', 'text', 'Category Title', { fontSize: 10, fontWeight: 700, color: '#6366f1' }, {}, [], '캔버스 제어 (CANVAS)'),
        vnode('ab13-row-z', 'container', 'Row', { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 4 }, {}, [
          vnode('ab13-z-t', 'text', 'T', { fontSize: 11, color: '#334155' }, {}, [], '캔버스 줌 인 / 줌 아웃'),
          vnode('ab13-z-k', 'badge', 'K', { fontSize: 10, fontMono: true, fontWeight: 700, backgroundColor: '#f1f5f9', paddingLeft: 6, paddingRight: 6, borderRadius: 4 }, {}, [], 'Ctrl + 마우스 휠')
        ]),
        vnode('ab13-row-z0', 'container', 'Row', { display: 'flex', flexDirection: 'row', justifyContent: 'space-between', padding: 4 }, {}, [
          vnode('ab13-z0-t', 'text', 'T', { fontSize: 11, color: '#334155' }, {}, [], '100% 실제 크기로 재설정'),
          vnode('ab13-z0-k', 'badge', 'K', { fontSize: 10, fontMono: true, fontWeight: 700, backgroundColor: '#f1f5f9', paddingLeft: 6, paddingRight: 6, borderRadius: 4 }, {}, [], 'Ctrl + 0')
        ])
      ])
    ]),

    // Footer
    vnode('ab13-m-foot', 'footer', 'Footer', {
      height: 48,
      paddingLeft: 16,
      paddingRight: 16,
      backgroundColor: '#f8fafc',
      borderTopWidth: 1,
      borderTopColor: '#e2e8f0',
      borderTopStyle: 'solid',
      display: 'flex',
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'flex-end'
    }, {}, [
      vnode('ab13-f-btn', 'button', 'Confirm', { height: 30, paddingLeft: 16, paddingRight: 16, borderRadius: 6, backgroundColor: '#4f46e5', color: '#ffffff', fontSize: 11, fontWeight: 700 }, {}, [], '확인')
    ])
  ]);

  const mainArea = vnode('ab13-main', 'container', 'Main Area', {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center'
  }, {}, [canvasArea, modal]);

  return {
    id: 'ab-sd-modal-shortcuts',
    name: '13. 키보드 단축키 안내 다이얼로그 (VDOM 1:1 실측)',
    width: 1600,
    height: 1000,
    backgroundColor: '#f1f5f9',
    rootNode: vnode('root-ab13', 'frame', 'Shortcuts Root', {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f1f5f9',
      overflow: 'hidden'
    }, {}, [header, mainArea])
  };
}

function buildArtboard14_HeaderMenu() {
  const header = createHeaderVNode('ab14-hdr', 'file');
  const leftSidebar = createLeftSidebarVNode('ab14-ls', 'layers', 240);
  const canvasArea = createCanvasAreaVNode('ab14-cv');

  // Floating Dropdown Menu (w-52) positioned right under '파일'
  const dropdownMenu = vnode('ab14-file-dd', 'dialog', 'File Dropdown Menu', {
    width: 210,
    backgroundColor: '#ffffff',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderStyle: 'solid',
    boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
    paddingTop: 4,
    paddingBottom: 4,
    display: 'flex',
    flexDirection: 'column',
    position: 'absolute',
    top: 76,
    left: 12,
    zIndex: 50
  }, {}, [
    vnode('ab14-dd-1', 'container', 'Item 1', { height: 30, paddingLeft: 12, paddingRight: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: '#f8fafc' }, {}, [
      vnode('ab14-dd1-t', 'text', 'T', { fontSize: 11, fontWeight: 600, color: '#0f172a' }, {}, [], '새 아트보드 생성 (F)'),
      vnode('ab14-dd1-k', 'badge', 'K', { fontSize: 10, color: '#94a3b8' }, {}, [], 'F')
    ]),
    vnode('ab14-dd-2', 'container', 'Item 2', { height: 30, paddingLeft: 12, paddingRight: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }, {}, [
      vnode('ab14-dd2-t', 'text', 'T', { fontSize: 11, color: '#334155' }, {}, [], '내보내기'),
      vnode('ab14-dd2-k', 'badge', 'K', { fontSize: 10, color: '#94a3b8' }, {}, [], 'Ctrl+E')
    ]),
    vnode('ab14-dd-div', 'divider', 'Divider', { width: '100%', height: 1, backgroundColor: '#f1f5f9', marginTop: 3, marginBottom: 3 }),
    vnode('ab14-dd-3', 'container', 'Item 3', { height: 30, paddingLeft: 12, paddingRight: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }, {}, [
      vnode('ab14-dd3-ic', 'icon', 'Palette', { color: '#6366f1' }, { icon: 'palette', size: 12 }),
      vnode('ab14-dd3-t', 'text', 'T', { fontSize: 11, color: '#334155' }, {}, [], '디자인 시스템')
    ]),
    vnode('ab14-dd-4', 'container', 'Item 4', { height: 30, paddingLeft: 12, paddingRight: 12, display: 'flex', flexDirection: 'row', alignItems: 'center', gap: 6 }, {}, [
      vnode('ab14-dd4-ic', 'icon', 'Settings', { color: '#64748b' }, { icon: 'settings', size: 12 }),
      vnode('ab14-dd4-t', 'text', 'T', { fontSize: 11, color: '#334155' }, {}, [], '환경 설정')
    ])
  ]);

  const mainArea = vnode('ab14-main', 'container', 'Main Area', {
    display: 'flex',
    flexDirection: 'row',
    flex: 1,
    width: '100%',
    position: 'relative'
  }, {}, [leftSidebar, canvasArea, dropdownMenu]);

  return {
    id: 'ab-sd-header-menu-file',
    name: '14. 데스크톱 헤더 메뉴바 & 파일 드롭다운 메뉴 (VDOM 1:1 실측)',
    width: 1600,
    height: 1000,
    backgroundColor: '#f1f5f9',
    rootNode: vnode('root-ab14', 'frame', 'Header Menu Root', {
      width: '100%',
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      backgroundColor: '#f1f5f9',
      position: 'relative',
      overflow: 'hidden'
    }, {}, [header, mainArea])
  };
}

// -------------------------------------------------------------
// Assembly & Page Generation
// -------------------------------------------------------------

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

const page1Artboards = [
  buildArtboard1_Workspace(),
  buildArtboard2_Components(),
  buildArtboard3_Templates(),
  buildArtboard4_Code()
];

const page2Artboards = [
  buildArtboard5_PlayMode(),
  buildArtboard6_Events(),
  buildArtboard7_Rulers(),
  buildArtboard8_Tweaks()
];

const page3Artboards = [
  buildArtboard9_DesignSystem(),
  buildArtboard10_GitDesktop()
];

const page4Artboards = [
  buildArtboard11_CommandPalette(),
  buildArtboard12_Settings(),
  buildArtboard13_Shortcuts(),
  buildArtboard14_HeaderMenu()
];

// Write Page JSONs
fs.writeFileSync(path.join(DOCS_DIR, 'pages/1.json'), JSON.stringify(wrapPage('page-1', '1. 핵심 작업 공간 & 인스펙터', 1, page1Artboards), null, 2), 'utf-8');
console.log('✓ Wrote docs/ui-boards/pages/1.json (4 pure VDOM artboards)');

fs.writeFileSync(path.join(DOCS_DIR, 'pages/2.json'), JSON.stringify(wrapPage('page-2', '2. 프로토타이핑 & 동적 트윅', 2, page2Artboards), null, 2), 'utf-8');
console.log('✓ Wrote docs/ui-boards/pages/2.json (4 pure VDOM artboards)');

fs.writeFileSync(path.join(DOCS_DIR, 'pages/3.json'), JSON.stringify(wrapPage('page-3', '3. 디자인 시스템 & Git 데스크톱', 3, page3Artboards), null, 2), 'utf-8');
console.log('✓ Wrote docs/ui-boards/pages/3.json (2 pure VDOM artboards)');

fs.writeFileSync(path.join(DOCS_DIR, 'pages/4.json'), JSON.stringify(wrapPage('page-4', '4. 커맨드 팔레트 & 환경설정', 4, page4Artboards), null, 2), 'utf-8');
console.log('✓ Wrote docs/ui-boards/pages/4.json (4 pure VDOM artboards)');

// Update project.json
const projectMeta = {
  version: '2.0.0',
  title: 'Screen Designer - Visual Storyboard Canvas',
  description: 'Screen Designer 도구 자체의 모든 UI를 순수 VDOM 노드 조합으로 1:1 완벽하게 재현한 공식 UI 스토리보드',
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
