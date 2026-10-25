import React, { useState, useEffect, useRef } from 'react';
import {
  MousePointer,
  Hand,
  Type,
  Hash,
  Square,
  Circle,
  Play,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Share2,
  X,
  Minus,
  Copy,
  Settings,
  Palette,
  Download,
  Keyboard,
  Layers,
  PanelRight,
  RotateCcw,
  RotateCw,
  Zap,
  AlignLeft,
  AlignCenter,
  AlignRight,
  ArrowUpDown,
  ZoomIn,
  ZoomOut,
  FolderOpen,
  GitBranch,
  GitCommit,
  Upload,
  Search,
  Globe,
  Check,
  Maximize2,
  Minimize2
} from 'lucide-react';
import { CanvasTool, Page, GitStatusInfo } from '../types';
import { useTranslation } from '../i18n';

interface ClaudeHeaderProps {
  title: string;
  onTitleChange: (val: string) => void;
  pages: Page[];
  activePageId: string;
  onSelectPage: (id: string) => void;
  onAddPage: () => void;
  gitStatus?: GitStatusInfo;
  onOpenGitStatus?: () => void;
  zoom: number;
  onZoomChange: (val: number) => void;
  currentIndex: number;
  totalCount: number;
  onPrev: () => void;
  onNext: () => void;
  onPlay: () => void;
  activeTool: CanvasTool;
  onSelectTool: (tool: CanvasTool) => void;
  onInsertNode?: (type: any, name: string, content?: string) => void;
  onOpenNewFrame: () => void;
  onOpenExport?: () => void;
  onOpenSettings: (tab?: 'canvas' | 'components') => void;
  onOpenDesignSystem?: () => void;
  onOpenShortcuts: () => void;
  onOpenShare: () => void;
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
  isLeftSidebarOpen: boolean;
  onToggleLeftSidebar: () => void;
  isRightSidebarOpen: boolean;
  onToggleRightSidebar: () => void;
  showRulers?: boolean;
  onToggleRulers?: () => void;
  onOpenCommandPalette?: () => void;
  showPrototypeWires?: boolean;
  onTogglePrototypeWires?: () => void;
  onAlignSelected?: (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom') => void;
  hasSelectedElement?: boolean;
}

export const ClaudeHeader: React.FC<ClaudeHeaderProps> = ({
  title,
  onTitleChange,
  pages,
  activePageId,
  onSelectPage,
  onAddPage,
  zoom,
  onZoomChange,
  currentIndex,
  totalCount,
  onPrev,
  onNext,
  onPlay,
  activeTool,
  onSelectTool,
  onInsertNode,
  onOpenNewFrame,
  onOpenExport,
  onOpenSettings,
  onOpenDesignSystem,
  onOpenShortcuts,
  onOpenShare,
  gitStatus,
  onOpenGitStatus,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  isLeftSidebarOpen,
  onToggleLeftSidebar,
  isRightSidebarOpen,
  onToggleRightSidebar,
  showRulers = false,
  onToggleRulers,
  onOpenCommandPalette,
  showPrototypeWires = true,
  onTogglePrototypeWires,
  onAlignSelected,
  hasSelectedElement = false
}) => {
  const { t, language, setLanguage, languages } = useTranslation();
  const [activeMenu, setActiveMenu] = useState<'file' | 'edit' | 'view' | 'help' | null>(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      const m = params.get('menu');
      if (m === 'file' || m === 'edit' || m === 'view' || m === 'help') return m;
    }
    return null;
  });
  const [showPageMenu, setShowPageMenu] = useState(false);
  const [showZoomMenu, setShowZoomMenu] = useState(false);
  const [showLangMenu, setShowLangMenu] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);
  const isElectron = typeof window !== 'undefined' && Boolean((window as any).electronAPI);

  const pageMenuRef = useRef<HTMLDivElement>(null);
  const langMenuRef = useRef<HTMLDivElement>(null);
  const menubarRef = useRef<HTMLDivElement>(null);
  const zoomMenuRef = useRef<HTMLDivElement>(null);

  const closeMenus = () => {
    setActiveMenu(null);
    setShowPageMenu(false);
    setShowZoomMenu(false);
    setShowLangMenu(false);
  };

  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent) => {
      const target = e.target as Node;
      if (activeMenu && menubarRef.current && !menubarRef.current.contains(target)) {
        setActiveMenu(null);
      }
      if (showPageMenu && pageMenuRef.current && !pageMenuRef.current.contains(target)) {
        setShowPageMenu(false);
      }
      if (showLangMenu && langMenuRef.current && !langMenuRef.current.contains(target)) {
        setShowLangMenu(false);
      }
      if (showZoomMenu && zoomMenuRef.current && !zoomMenuRef.current.contains(target)) {
        setShowZoomMenu(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenus();
      }
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [activeMenu, showPageMenu, showLangMenu, showZoomMenu]);

  useEffect(() => {
    const api = (window as any).electronAPI;
    if (api?.onMaximizedChange) {
      api.onMaximizedChange((val: boolean) => setIsMaximized(val));
    }
    if (api?.isMaximized) {
      api.isMaximized().then((val: boolean) => setIsMaximized(val));
    }

    const handleFullscreenChange = () => {
      if (!isElectron) {
        setIsMaximized(!!document.fullscreenElement);
      }
    };
    document.addEventListener('fullscreenchange', handleFullscreenChange);
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange);
  }, [isElectron]);

  const handleToggleFullscreen = () => {
    if (typeof document === 'undefined') return;
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
      setIsMaximized(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }
      setIsMaximized(false);
    }
  };

  const handleHeaderMouseDown = (_e: React.MouseEvent) => {
    // In Electron with frame: false or titleBarOverlay, CSS -webkit-app-region: drag natively handles OS-level window movement.
  };

  const handleHeaderDoubleClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('.app-region-no-drag')
    ) {
      return;
    }
    if (isElectron) {
      const api = (window as any).electronAPI;
      if (api?.maximizeWindow) api.maximizeWindow();
    } else {
      handleToggleFullscreen();
    }
  };

  const activePage = pages.find((p) => p.id === activePageId) || pages[0];

  return (
    <div className="flex flex-col shrink-0 select-none text-slate-700 text-xs shadow-xs relative z-40">
      {/* =========================================================================
          BAR 1: CAPTION BAR (상단 캡션 바 / 윈도우 타이틀바)
          - Left: Left Sidebar Toggle, App Logo, Editable Document Title, Page Selector
          - Center: Window Drag Area
          - Right: Share, Design System Studio, Settings, Right Sidebar Toggle, Window Caption Controls
         ========================================================================= */}
      <div
        onMouseDown={handleHeaderMouseDown}
        onDoubleClick={handleHeaderDoubleClick}
        style={{ WebkitAppRegion: 'drag' } as any}
        className="h-9 border-b border-slate-200/90 bg-slate-50/90 px-3 flex items-center justify-between select-none app-region-drag cursor-default"
      >
        {/* 1-1. Left: Sidebar Toggle, Logo, Document Title & Page Selector */}
        <div className="flex items-center gap-2 app-region-no-drag" style={{ WebkitAppRegion: 'no-drag' } as any}>
          {/* Left Sidebar Toggle Button */}
          <button
            onClick={onToggleLeftSidebar}
            className={`p-1 rounded-md transition ${
              isLeftSidebarOpen ? 'bg-indigo-100/80 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-200/60'
            }`}
            title={t('header.toggleLeftSidebar')}
          >
            <Layers size={13} />
          </button>

          {/* App Logo & Document Title */}
          <div className="flex items-center gap-1.5 font-semibold text-slate-800">
            <span className="w-2.5 h-2.5 rounded bg-indigo-600 inline-block shadow-2xs pointer-events-none" />
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              className="font-bold bg-transparent border-0 hover:bg-slate-200/50 rounded px-1.5 py-0.5 focus:outline-none focus:ring-1 focus:ring-indigo-500 w-52 text-xs truncate"
              title={t('header.editTitle')}
            />
          </div>

          <div className="h-3.5 w-px bg-slate-300 mx-1" />

          {/* Page Dropdown Menu */}
          <div ref={pageMenuRef} className="relative">
            <button
              onClick={() => setShowPageMenu(!showPageMenu)}
              className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-200/60 text-slate-700 font-medium text-[11px] transition"
              title={t('header.pagesList')}
            >
              <span className="truncate max-w-[150px]">{activePage.name}</span>
              <ChevronDown size={11} className="text-slate-400 shrink-0" />
            </button>
            {showPageMenu && (
              <div
                className="absolute left-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1 text-xs z-50 animate-in fade-in duration-75"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  {t('header.pagesList')}
                </div>
                {pages.map((p) => (
                  <button
                    key={p.id}
                    onClick={() => {
                      onSelectPage(p.id);
                      setShowPageMenu(false);
                    }}
                    className={`w-full text-left px-3 py-1.5 flex items-center justify-between transition ${
                      p.id === activePageId
                        ? 'bg-indigo-50 font-bold text-indigo-700'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="truncate">{p.name}</span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {p.artboards?.length || 0} {t('header.boards')}
                    </span>
                  </button>
                ))}
                <div className="h-px bg-slate-100 my-1" />
                <button
                  onClick={() => {
                    onAddPage();
                    setShowPageMenu(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-indigo-600 font-semibold hover:bg-indigo-50 flex items-center gap-1.5"
                >
                  <span>+ {t('header.newPage')}</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 1-2. Center: Window Drag Handle Region */}
        <div
          className="flex-1 h-full flex items-center justify-center cursor-default app-region-drag select-none"
        >
          <div className="w-8 h-1 bg-slate-200 rounded-full pointer-events-none hover:bg-slate-300 transition" />
        </div>

        {/* 1-3. Right: Action Buttons & Native Window Caption Controls */}
        <div className="flex items-center gap-1.5 app-region-no-drag" style={{ WebkitAppRegion: 'no-drag' } as any}>
          {/* Share Button */}
          <button
            onClick={onOpenShare}
            className="p-1 hover:bg-slate-200/60 rounded text-slate-600 transition"
            title={t('header.share')}
          >
            <Share2 size={13} />
          </button>

          {/* Independent Design System Studio Button */}
          {onOpenDesignSystem && (
            <button
              onClick={onOpenDesignSystem}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold text-[11px] shadow-2xs transition active:scale-95 whitespace-nowrap shrink-0"
              title={t('header.designSystem')}
            >
              <Palette size={12} className="text-indigo-600 shrink-0" />
              <span>{t('header.designSystem')}</span>
            </button>
          )}

          {/* Language Switcher Dropdown */}
          <div ref={langMenuRef} className="relative">
            <button
              onClick={() => setShowLangMenu(!showLangMenu)}
              className="flex items-center gap-1 px-1.5 py-0.5 rounded hover:bg-slate-200/60 text-slate-600 font-medium text-[11px] transition"
              title={t('header.language')}
            >
              <Globe size={12} className="text-slate-500 shrink-0" />
              <span className="font-semibold uppercase text-[10px]">{language}</span>
              <ChevronDown size={10} className="text-slate-400" />
            </button>
            {showLangMenu && (
              <div
                className="absolute right-0 top-full mt-1 w-32 bg-white border border-slate-200 rounded-xl shadow-xl py-1 text-xs z-50 animate-in fade-in duration-75"
              >
                {languages.map((l) => (
                  <button
                    key={l.code}
                    onClick={() => {
                      setLanguage(l.code);
                      setShowLangMenu(false);
                    }}
                    className={`w-full text-left px-2.5 py-1.5 flex items-center justify-between text-xs transition ${
                      language === l.code ? 'bg-indigo-50 font-bold text-indigo-700' : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    <span className="flex items-center gap-1.5">
                      <span>{l.flag}</span>
                      <span>{l.nativeLabel}</span>
                    </span>
                    {language === l.code && <Check size={12} className="text-indigo-600" />}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Settings Button */}
          <button
            onClick={() => onOpenSettings('canvas')}
            className="p-1 hover:bg-slate-200/60 rounded text-slate-600 transition"
            title={t('header.settings')}
          >
            <Settings size={13} />
          </button>

          {/* Right Sidebar Toggle */}
          <button
            onClick={onToggleRightSidebar}
            className={`p-1 rounded transition ${
              isRightSidebarOpen ? 'bg-indigo-100/80 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-200/60'
            }`}
            title={t('header.toggleRightSidebar')}
          >
            <PanelRight size={13} />
          </button>

          {/* Window Caption Controls:
              1) Electron on Windows: Electron's titleBarOverlay natively renders real Windows 10/11
                 minimize/maximize/close buttons with Snap Layouts and native window animations.
                 We reserve a 138px placeholder area so header controls do not collide with native buttons.
              2) Web Browser: OS window minimize is impossible in standard web sandbox, and full-screen
                 is fundamentally different from window maximize. We render a clean Fullscreen Toggle instead.
          */}
          {isElectron ? (
            <div
              className="w-[138px] h-9 shrink-0 app-region-no-drag -mr-3"
              style={{ WebkitAppRegion: 'no-drag' } as any}
            />
          ) : (
            <div className="flex items-center h-9 ml-1.5 border-l border-slate-200 pl-1.5 app-region-no-drag">
              <button
                type="button"
                onClick={handleToggleFullscreen}
                className="px-2 py-1 flex items-center gap-1.5 rounded-md hover:bg-slate-200/70 text-slate-600 hover:text-slate-900 transition text-[11px] font-medium cursor-pointer"
                title={isMaximized ? '전체 화면 종료 (ESC)' : '전체 화면 토글 (F11)'}
              >
                {isMaximized ? (
                  <>
                    <Minimize2 size={13} className="text-slate-500" />
                    <span className="hidden sm:inline">전체화면 종료</span>
                  </>
                ) : (
                  <>
                    <Maximize2 size={13} className="text-slate-500" />
                    <span className="hidden sm:inline">전체화면</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* =========================================================================
          BAR 2: TOP BAR (탑 바 / 에디터 툴바)
          - Left: File, Edit, View, Help Menus
          - Center: Figma-style Creation & Select Toolbox
          - Right: PLAY Button, Zoom Controls, Page Navigator, Git Status & Commit/Push
         ========================================================================= */}
      <div className="h-10 border-b border-slate-200 bg-white px-3 flex items-center justify-between select-none">
        {/* 2-1. Left: Desktop Menubar (File, Edit, View, Help) */}
        <div ref={menubarRef} className="flex items-center text-[11px] font-medium text-slate-600">
          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
              onMouseEnter={() => {
                if (activeMenu) setActiveMenu('file');
              }}
              className={`px-2 py-1 rounded hover:bg-slate-100 ${
                activeMenu === 'file' ? 'bg-slate-100 font-bold text-slate-900' : ''
              }`}
            >
              {t('header.menuFile')}
            </button>
            {activeMenu === 'file' && (
              <div
                className="absolute left-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1 text-xs text-slate-700 z-50 animate-in fade-in duration-75"
              >
                <button
                  onClick={() => {
                    closeMenus();
                    onOpenNewFrame();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 flex justify-between"
                >
                  <span>{t('header.toolFrame')}</span>
                  <span className="text-[10px] text-slate-400 font-mono">F</span>
                </button>
                <button
                  onClick={() => {
                    closeMenus();
                    if (onOpenExport) onOpenExport();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 flex justify-between"
                >
                  <span>{t('common.export')}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Ctrl+E</span>
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  onClick={() => {
                    closeMenus();
                    if (onOpenDesignSystem) onOpenDesignSystem();
                    else onOpenSettings('components');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 flex items-center justify-between"
                >
                  <span className="flex items-center gap-1.5 font-medium">
                    <Palette size={12} className="text-indigo-600" />
                    <span>{t('header.designSystem')}</span>
                  </span>
                </button>
                <button
                  onClick={() => {
                    closeMenus();
                    onOpenSettings('canvas');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  {t('header.settings')}
                </button>
              </div>
            )}
          </div>

          {/* Edit Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')}
              onMouseEnter={() => {
                if (activeMenu) setActiveMenu('edit');
              }}
              className={`px-2 py-1 rounded hover:bg-slate-100 ${
                activeMenu === 'edit' ? 'bg-slate-100 font-bold text-slate-900' : ''
              }`}
            >
              {t('header.menuEdit')}
            </button>
            {activeMenu === 'edit' && (
              <div
                className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 text-xs text-slate-700 z-50 animate-in fade-in duration-75"
              >
                <button
                  onClick={() => {
                    closeMenus();
                    onUndo();
                  }}
                  disabled={!canUndo}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 flex justify-between disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                >
                  <span>실행 취소 (Undo)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Ctrl+Z</span>
                </button>
                <button
                  onClick={() => {
                    closeMenus();
                    onRedo();
                  }}
                  disabled={!canRedo}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 flex justify-between disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-slate-400"
                >
                  <span>다시 실행 (Redo)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Ctrl+Y</span>
                </button>
              </div>
            )}
          </div>

          {/* View Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'view' ? null : 'view')}
              onMouseEnter={() => {
                if (activeMenu) setActiveMenu('view');
              }}
              className={`px-2 py-1 rounded hover:bg-slate-100 ${
                activeMenu === 'view' ? 'bg-slate-100 font-bold text-slate-900' : ''
              }`}
            >
              {t('header.menuView')}
            </button>
            {activeMenu === 'view' && (
              <div
                className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 text-xs text-slate-700 z-50 animate-in fade-in duration-75"
              >
                <button
                  onClick={() => {
                    closeMenus();
                    onZoomChange(Math.min(2.0, zoom + 0.1));
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 flex justify-between"
                >
                  <span>{t('header.zoomIn')}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Ctrl++</span>
                </button>
                <button
                  onClick={() => {
                    closeMenus();
                    onZoomChange(Math.max(0.3, zoom - 0.1));
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 flex justify-between"
                >
                  <span>{t('header.zoomOut')}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Ctrl+-</span>
                </button>
                <button
                  onClick={() => {
                    closeMenus();
                    onZoomChange(1.0);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 flex justify-between"
                >
                  <span>{t('header.fitScreen')}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Ctrl+0</span>
                </button>
                <div className="h-px bg-slate-100 my-1" />
                {onToggleRulers && (
                  <button
                    onClick={() => {
                      closeMenus();
                      onToggleRulers();
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 flex justify-between items-center"
                  >
                    <span>{t('settings.rulersVisible')} ({showRulers ? '숨김' : '표시'})</span>
                    <span className="text-[10px] text-slate-400 font-mono">Shift+R</span>
                  </button>
                )}
                {onOpenCommandPalette && (
                  <button
                    onClick={() => {
                      closeMenus();
                      onOpenCommandPalette();
                    }}
                    className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 flex justify-between items-center"
                  >
                    <span>{t('commandPalette.placeholder')}</span>
                    <span className="text-[10px] text-slate-400 font-mono">Ctrl+K</span>
                  </button>
                )}
                <div className="h-px bg-slate-100 my-1" />
                <button
                  onClick={() => {
                    closeMenus();
                    onToggleLeftSidebar();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 flex justify-between"
                >
                  <span>{t('header.toggleLeftSidebar')}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Alt+1</span>
                </button>
                <button
                  onClick={() => {
                    closeMenus();
                    onToggleRightSidebar();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 flex justify-between"
                >
                  <span>{t('header.toggleRightSidebar')}</span>
                  <span className="text-[10px] text-slate-400 font-mono">Alt+2</span>
                </button>
              </div>
            )}
          </div>

          {/* Help Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'help' ? null : 'help')}
              onMouseEnter={() => {
                if (activeMenu) setActiveMenu('help');
              }}
              className={`px-2 py-1 rounded hover:bg-slate-100 ${
                activeMenu === 'help' ? 'bg-slate-100 font-bold text-slate-900' : ''
              }`}
            >
              {t('header.menuHelp')}
            </button>
            {activeMenu === 'help' && (
              <div
                className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 text-xs text-slate-700 z-50 animate-in fade-in duration-75"
              >
                <button
                  onClick={() => {
                    closeMenus();
                    onOpenShortcuts();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 flex items-center gap-2"
                >
                  <Keyboard size={12} className="text-slate-400" />
                  <span>단축키 목록</span>
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <div className="px-3 py-1 text-[10px] text-slate-400">
                  Screen Designer v0.1.0
                </div>
              </div>
            )}
          </div>

          {/* Quick Command Palette Button */}
          {onOpenCommandPalette && (
            <button
              onClick={onOpenCommandPalette}
              className="ml-3 flex items-center gap-1.5 px-2 py-0.5 text-[11px] text-slate-400 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition hover:text-slate-700 shadow-2xs"
              title="빠른 명령 실행 및 컴포넌트 추가 (Ctrl+K)"
            >
              <Search size={11} className="text-slate-400" />
              <span>명령 검색...</span>
              <kbd className="text-[9px] bg-white border border-slate-200 px-1 rounded font-mono text-slate-500">
                Ctrl+K
              </kbd>
            </button>
          )}
        </div>

        {/* 2-2. Center: Toolbox & Designer Power Bar (Undo/Redo, Tools, Alignments) */}
        <div className="flex items-center gap-1.5">
          {/* History Actions (Undo / Redo) */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 shadow-2xs">
            <button
              onClick={onUndo}
              disabled={!canUndo}
              title="실행 취소 (Ctrl+Z)"
              className="p-1.5 rounded transition text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <RotateCcw size={12} />
            </button>
            <button
              onClick={onRedo}
              disabled={!canRedo}
              title="다시 실행 (Ctrl+Y)"
              className="p-1.5 rounded transition text-slate-600 hover:text-slate-900 hover:bg-white disabled:opacity-30 disabled:hover:bg-transparent"
            >
              <RotateCw size={12} />
            </button>
          </div>

          {/* Canvas Tools */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 shadow-2xs">
            {[
              { id: 'select' as CanvasTool, icon: MousePointer, label: `${t('header.toolSelect')} (V)` },
              { id: 'hand' as CanvasTool, icon: Hand, label: `${t('header.toolHand')} (H)` },
              { id: 'frame' as CanvasTool, icon: Hash, label: `${t('header.toolFrame')} (F)` },
              { id: 'text' as CanvasTool, icon: Type, label: `${t('header.toolText')} (T)` },
              { id: 'rect' as CanvasTool, icon: Square, label: `${t('header.toolBox')} (R)` },
              { id: 'circle' as CanvasTool, icon: Circle, label: `${t('header.toolCircle')} (O)` }
            ].map((item) => {
              const Icon = item.icon;
              const isActive = activeTool === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.id === 'frame') {
                      onOpenNewFrame();
                    } else if (item.id === 'text' && onInsertNode) {
                      onInsertNode('text', 'New Text', 'Text');
                      onSelectTool('select');
                    } else if (item.id === 'rect' && onInsertNode) {
                      onInsertNode('box', 'Box');
                      onSelectTool('select');
                    } else if (item.id === 'circle' && onInsertNode) {
                      onInsertNode('circle', 'Circle');
                      onSelectTool('select');
                    } else {
                      onSelectTool(item.id);
                    }
                  }}
                  title={item.label}
                  className={`p-1.5 rounded transition ${
                    isActive
                      ? 'bg-white text-indigo-600 shadow-xs font-bold'
                      : 'text-slate-500 hover:text-slate-800'
                  }`}
                >
                  <Icon size={13} />
                </button>
              );
            })}
          </div>

          {/* Figma-Style Alignment Power Bar */}
          {onAlignSelected && (
            <div
              className={`flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 shadow-2xs transition ${
                hasSelectedElement ? 'opacity-100' : 'opacity-40 hover:opacity-100'
              }`}
            >
              <button
                onClick={() => onAlignSelected('left')}
                title={t('header.alignLeft')}
                className="p-1.5 rounded hover:bg-white text-slate-600 hover:text-indigo-600 transition"
              >
                <AlignLeft size={12} />
              </button>
              <button
                onClick={() => onAlignSelected('center')}
                title={t('header.alignCenter')}
                className="p-1.5 rounded hover:bg-white text-slate-600 hover:text-indigo-600 transition"
              >
                <AlignCenter size={12} />
              </button>
              <button
                onClick={() => onAlignSelected('right')}
                title={t('header.alignRight')}
                className="p-1.5 rounded hover:bg-white text-slate-600 hover:text-indigo-600 transition"
              >
                <AlignRight size={12} />
              </button>
              <div className="w-px h-3 bg-slate-300 mx-0.5" />
              <button
                onClick={() => onAlignSelected('middle')}
                title={t('header.alignMiddle')}
                className="p-1.5 rounded hover:bg-white text-slate-600 hover:text-indigo-600 transition"
              >
                <ArrowUpDown size={12} />
              </button>
            </div>
          )}
        </div>

        {/* 2-3. Right: Interactive PLAY, Prototype Flow Toggle, Zoom, Navigator & Git Actions */}
        <div className="flex items-center gap-2">
          {/* Prototype Flow Wiring Toggle Button */}
          {onTogglePrototypeWires && (
            <button
              onClick={onTogglePrototypeWires}
              className={`flex items-center gap-1 px-2.5 py-1 rounded-md text-xs font-semibold transition shadow-2xs border ${
                showPrototypeWires
                  ? 'bg-purple-50 border-purple-300 text-purple-700 shadow-purple-500/10'
                  : 'bg-white border-slate-200 text-slate-500 hover:text-slate-800'
              }`}
              title={t('header.flowWires')}
            >
              <Zap size={11} className={showPrototypeWires ? 'text-purple-600 fill-purple-600' : 'text-slate-400'} />
              <span>{t('header.flowWires')}</span>
              {showPrototypeWires && <span className="w-1.5 h-1.5 rounded-full bg-purple-500 animate-pulse" />}
            </button>
          )}

          {/* Fullscreen Interactive PLAY Button */}
          <button
            onClick={onPlay}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition active:scale-95 text-xs shadow-xs"
            title={t('header.play')}
          >
            <Play size={12} className="fill-white" />
            <span>{t('header.play')}</span>
          </button>

          <div className="h-3.5 w-px bg-slate-200 mx-0.5" />

          {/* Zoom Controls (+ / - / %) */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => onZoomChange(Math.max(0.3, zoom - 0.1))}
              className="p-1 hover:bg-white rounded text-slate-500 transition"
              title={t('header.zoomOut')}
            >
              <ZoomOut size={12} />
            </button>
            <div ref={zoomMenuRef} className="relative">
              <button
                onClick={() => setShowZoomMenu(!showZoomMenu)}
                className="px-2 text-[11px] font-mono text-slate-700 flex items-center gap-0.5"
              >
                <span>{Math.round(zoom * 100)}%</span>
                <ChevronDown size={10} className="text-slate-400" />
              </button>
              {showZoomMenu && (
                <div
                  className="absolute right-0 top-full mt-1 w-28 bg-white border border-slate-200 rounded-xl shadow-xl py-1 text-xs z-50 animate-in fade-in duration-75"
                >
                  {[0.5, 0.75, 1.0, 1.25, 1.5, 2.0].map((z) => (
                    <button
                      key={z}
                      onClick={() => {
                        onZoomChange(z);
                        setShowZoomMenu(false);
                      }}
                      className={`w-full text-left px-3 py-1 text-[11px] font-mono hover:bg-indigo-50 ${
                        zoom === z ? 'font-bold text-indigo-600' : 'text-slate-600'
                      }`}
                    >
                      {Math.round(z * 100)}%
                    </button>
                  ))}
                  <div className="h-px bg-slate-100 my-1" />
                  <button
                    onClick={() => {
                      onZoomChange(1.0);
                      setShowZoomMenu(false);
                    }}
                    className="w-full text-left px-3 py-1 text-[11px] text-slate-600 hover:bg-indigo-50"
                  >
                    {t('header.fitScreen')}
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => onZoomChange(Math.min(2.0, zoom + 0.1))}
              className="p-1 hover:bg-white rounded text-slate-500 transition"
              title={t('header.zoomIn')}
            >
              <ZoomIn size={12} />
            </button>
          </div>

          <div className="h-3.5 w-px bg-slate-200 mx-0.5" />

          {/* Screen / Artboard Navigator */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <span className="text-[11px] text-slate-500 px-2 font-mono">
              {totalCount > 0 ? `${totalCount} / ${currentIndex + 1}` : '0'}
            </span>
            <button
              onClick={onPrev}
              disabled={currentIndex <= 0}
              className="p-1 hover:bg-white disabled:opacity-30 rounded text-slate-500 transition"
              title="이전 화면 (Left Arrow)"
            >
              <ChevronLeft size={12} />
            </button>
            <button
              onClick={onNext}
              disabled={currentIndex >= totalCount - 1}
              className="p-1 hover:bg-white disabled:opacity-30 rounded text-slate-500 transition"
              title="다음 화면 (Right Arrow)"
            >
              <ChevronRight size={12} />
            </button>
          </div>

          {/* Git Branch & Action Group */}
          {gitStatus?.isRepo && (
            <div className="flex items-center gap-1.5 ml-0.5">
              <button
                onClick={onOpenGitStatus}
                className="flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 hover:bg-slate-200 text-slate-700 transition cursor-pointer border border-slate-200"
                title={`${t('header.gitStatus')}: ${gitStatus.branch || 'main'}`}
              >
                <GitBranch
                  size={12}
                  className={gitStatus.clean ? 'text-emerald-600' : 'text-amber-600'}
                />
                <span className="font-mono text-[10px]">{gitStatus.branch || 'git'}</span>
                {!gitStatus.clean &&
                  (gitStatus.uiChangesCount > 0 ||
                    (gitStatus.allChangesCount && gitStatus.allChangesCount > 0)) && (
                    <span className="px-1 py-0.2 bg-amber-500 text-white rounded-full text-[9px] font-bold">
                      {gitStatus.uiChangesCount || gitStatus.allChangesCount}
                    </span>
                  )}
              </button>

              {/* Detected Changes -> Prominent Commit Button */}
              {!gitStatus.clean &&
                (gitStatus.uiChangesCount > 0 ||
                  (gitStatus.allChangesCount && gitStatus.allChangesCount > 0)) && (
                  <button
                    onClick={onOpenGitStatus}
                    className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-600 hover:bg-blue-700 text-white text-[11px] font-bold shadow-xs transition cursor-pointer"
                    title={t('header.uncommittedChanges')}
                  >
                    <GitCommit size={12} />
                    <span>커밋 ({gitStatus.uiChangesCount || gitStatus.allChangesCount})</span>
                  </button>
                )}

              {/* Unpushed Commits -> Push Button */}
              {gitStatus.ahead !== undefined && gitStatus.ahead > 0 && (
                <button
                  onClick={onOpenGitStatus}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-[11px] font-bold shadow-xs transition cursor-pointer"
                  title="Push"
                >
                  <Upload size={12} />
                  <span>Push ({gitStatus.ahead})</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
