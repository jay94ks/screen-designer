import React, { useState, useEffect } from 'react';
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
  ZoomIn,
  ZoomOut,
  FolderOpen,
  GitBranch,
  GitCommit,
  Upload
} from 'lucide-react';
import { CanvasTool, Page, GitStatusInfo } from '../types';

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
  onToggleRightSidebar
}) => {
  const [activeMenu, setActiveMenu] = useState<'file' | 'edit' | 'view' | 'help' | null>(null);
  const [showPageMenu, setShowPageMenu] = useState(false);
  const [showZoomMenu, setShowZoomMenu] = useState(false);
  const [isMaximized, setIsMaximized] = useState(false);

  useEffect(() => {
    const api = (window as any).electronAPI;
    if (api?.onMaximizedChange) {
      api.onMaximizedChange((val: boolean) => setIsMaximized(val));
    }
    if (api?.isMaximized) {
      api.isMaximized().then((val: boolean) => setIsMaximized(val));
    }
  }, []);

  const handleMinimize = () => {
    const api = (window as any).electronAPI;
    if (api?.minimizeWindow) {
      api.minimizeWindow();
    }
  };

  const handleMaximize = () => {
    const api = (window as any).electronAPI;
    if (api?.maximizeWindow) {
      api.maximizeWindow();
    } else {
      setIsMaximized(!isMaximized);
    }
  };

  const handleClose = () => {
    const api = (window as any).electronAPI;
    if (api?.closeWindow) {
      api.closeWindow();
    } else {
      window.close();
    }
  };

  const handleHeaderMouseDown = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    if (
      target.closest('button') ||
      target.closest('input') ||
      target.closest('select') ||
      target.closest('.app-region-no-drag')
    ) {
      return;
    }
    const api = (window as any).electronAPI;
    if (!api?.dragWindow) return;

    let lastX = e.screenX;
    let lastY = e.screenY;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.screenX - lastX;
      const dy = moveEvent.screenY - lastY;
      lastX = moveEvent.screenX;
      lastY = moveEvent.screenY;
      api.dragWindow(dx, dy);
    };

    const handleMouseUp = () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
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
    handleMaximize();
  };

  const activePage = pages.find((p) => p.id === activePageId) || pages[0];

  const closeMenus = () => {
    setActiveMenu(null);
    setShowPageMenu(false);
    setShowZoomMenu(false);
  };

  return (
    <div className="flex flex-col shrink-0 select-none text-slate-700 text-xs shadow-xs relative z-30">
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
            title="레이어 / 에셋 패널 토글"
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
              title="문서 제목 수정"
            />
          </div>

          <div className="h-3.5 w-px bg-slate-300 mx-1" />

          {/* Page Dropdown Menu */}
          <div className="relative">
            <button
              onClick={() => setShowPageMenu(!showPageMenu)}
              className="flex items-center gap-1 px-2 py-0.5 rounded hover:bg-slate-200/60 text-slate-700 font-medium text-[11px] transition"
              title="페이지 전환 및 새 페이지 추가"
            >
              <span className="truncate max-w-[150px]">{activePage.name}</span>
              <ChevronDown size={11} className="text-slate-400 shrink-0" />
            </button>
            {showPageMenu && (
              <div
                onMouseLeave={() => setShowPageMenu(false)}
                className="absolute left-0 top-full mt-1 w-56 bg-white border border-slate-200 rounded-xl shadow-xl py-1 text-xs z-50 animate-in fade-in duration-75"
              >
                <div className="px-3 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  스토리보드 페이지 목록
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
                      {p.artboards?.length || 0} 보드
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
                  <span>+ 새 페이지 생성</span>
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 1-2. Center: Window Drag Handle Region */}
        <div
          className="flex-1 h-full flex items-center justify-center cursor-default app-region-drag select-none"
          title="창 이동 (드래그)"
        >
          <div className="w-8 h-1 bg-slate-200 rounded-full pointer-events-none hover:bg-slate-300 transition" />
        </div>

        {/* 1-3. Right: Action Buttons & Native Window Caption Controls */}
        <div className="flex items-center gap-1.5 app-region-no-drag" style={{ WebkitAppRegion: 'no-drag' } as any}>
          {/* Share Button */}
          <button
            onClick={onOpenShare}
            className="p-1 hover:bg-slate-200/60 rounded text-slate-600 transition"
            title="공유 및 임베드"
          >
            <Share2 size={13} />
          </button>

          {/* Independent Design System Studio Button */}
          {onOpenDesignSystem && (
            <button
              onClick={onOpenDesignSystem}
              className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 font-semibold text-[11px] shadow-2xs transition active:scale-95 whitespace-nowrap shrink-0"
              title="디자인 시스템 스튜디오 열기 (창 전체 화면 활용)"
            >
              <Palette size={12} className="text-indigo-600 shrink-0" />
              <span>디자인 시스템</span>
            </button>
          )}

          {/* Settings Button */}
          <button
            onClick={() => onOpenSettings('canvas')}
            className="p-1 hover:bg-slate-200/60 rounded text-slate-600 transition"
            title="환경 설정 (Preferences)"
          >
            <Settings size={13} />
          </button>

          {/* Right Sidebar Toggle */}
          <button
            onClick={onToggleRightSidebar}
            className={`p-1 rounded transition ${
              isRightSidebarOpen ? 'bg-indigo-100/80 text-indigo-700 font-bold' : 'text-slate-500 hover:bg-slate-200/60'
            }`}
            title="속성 / 코드 / Tweaks 패널 토글"
          >
            <PanelRight size={13} />
          </button>

          {/* Native Electron Window Caption Controls */}
          <div className="flex items-center h-9 ml-2 border-l border-slate-200 -mr-3 pl-1">
            <button
              onClick={handleMinimize}
              className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-200/80 hover:text-slate-800 transition"
              title="최소화"
            >
              <Minus size={12} />
            </button>
            <button
              onClick={handleMaximize}
              className="w-9 h-9 flex items-center justify-center text-slate-500 hover:bg-slate-200/80 hover:text-slate-800 transition"
              title={isMaximized ? '이전 크기로 복원' : '최대화'}
            >
              {isMaximized ? <Copy size={11} className="rotate-180" /> : <Square size={11} />}
            </button>
            <button
              onClick={handleClose}
              className="w-10 h-9 flex items-center justify-center text-slate-500 hover:bg-rose-600 hover:text-white transition"
              title="닫기"
            >
              <X size={13} />
            </button>
          </div>
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
        <div className="flex items-center text-[11px] font-medium text-slate-600">
          {/* File Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'file' ? null : 'file')}
              className={`px-2 py-1 rounded hover:bg-slate-100 ${
                activeMenu === 'file' ? 'bg-slate-100 font-bold text-slate-900' : ''
              }`}
            >
              파일 (File)
            </button>
            {activeMenu === 'file' && (
              <div
                onMouseLeave={closeMenus}
                className="absolute left-0 top-full mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-xl py-1 text-xs text-slate-700 z-50 animate-in fade-in duration-75"
              >
                <button
                  onClick={() => {
                    closeMenus();
                    onOpenNewFrame();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 flex justify-between"
                >
                  <span>새 프레임 추가</span>
                  <span className="text-[10px] text-slate-400 font-mono">F</span>
                </button>
                <button
                  onClick={() => {
                    closeMenus();
                    if (onOpenExport) onOpenExport();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 flex justify-between"
                >
                  <span>내보내기 (Export)</span>
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
                    <span>디자인 시스템 스튜디오</span>
                  </span>
                  <span className="text-[10px] text-indigo-600 font-bold bg-indigo-50 px-1.5 py-0.2 rounded border border-indigo-200">
                    전체 창
                  </span>
                </button>
                <button
                  onClick={() => {
                    closeMenus();
                    onOpenSettings('canvas');
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700"
                >
                  환경 설정 (Preferences)
                </button>
              </div>
            )}
          </div>

          {/* Edit Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'edit' ? null : 'edit')}
              className={`px-2 py-1 rounded hover:bg-slate-100 ${
                activeMenu === 'edit' ? 'bg-slate-100 font-bold text-slate-900' : ''
              }`}
            >
              편집 (Edit)
            </button>
            {activeMenu === 'edit' && (
              <div
                onMouseLeave={closeMenus}
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
              className={`px-2 py-1 rounded hover:bg-slate-100 ${
                activeMenu === 'view' ? 'bg-slate-100 font-bold text-slate-900' : ''
              }`}
            >
              보기 (View)
            </button>
            {activeMenu === 'view' && (
              <div
                onMouseLeave={closeMenus}
                className="absolute left-0 top-full mt-1 w-48 bg-white border border-slate-200 rounded-xl shadow-xl py-1 text-xs text-slate-700 z-50 animate-in fade-in duration-75"
              >
                <button
                  onClick={() => {
                    closeMenus();
                    onZoomChange(Math.min(2.0, zoom + 0.1));
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 flex justify-between"
                >
                  <span>확대 (Zoom In)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Ctrl++</span>
                </button>
                <button
                  onClick={() => {
                    closeMenus();
                    onZoomChange(Math.max(0.3, zoom - 0.1));
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 flex justify-between"
                >
                  <span>축소 (Zoom Out)</span>
                  <span className="text-[10px] text-slate-400 font-mono">Ctrl+-</span>
                </button>
                <button
                  onClick={() => {
                    closeMenus();
                    onZoomChange(1.0);
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 flex justify-between"
                >
                  <span>100% 크기로</span>
                  <span className="text-[10px] text-slate-400 font-mono">Ctrl+0</span>
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  onClick={() => {
                    closeMenus();
                    onToggleLeftSidebar();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 flex justify-between"
                >
                  <span>레이어 트리 패널 토글</span>
                  <span className="text-[10px] text-slate-400 font-mono">Alt+1</span>
                </button>
                <button
                  onClick={() => {
                    closeMenus();
                    onToggleRightSidebar();
                  }}
                  className="w-full text-left px-3 py-1.5 hover:bg-indigo-50 hover:text-indigo-700 flex justify-between"
                >
                  <span>속성 패널 토글</span>
                  <span className="text-[10px] text-slate-400 font-mono">Alt+2</span>
                </button>
              </div>
            )}
          </div>

          {/* Help Menu */}
          <div className="relative">
            <button
              onClick={() => setActiveMenu(activeMenu === 'help' ? null : 'help')}
              className={`px-2 py-1 rounded hover:bg-slate-100 ${
                activeMenu === 'help' ? 'bg-slate-100 font-bold text-slate-900' : ''
              }`}
            >
              도움말 (Help)
            </button>
            {activeMenu === 'help' && (
              <div
                onMouseLeave={closeMenus}
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
        </div>

        {/* 2-2. Center: Toolbox (Figma Style Canvas Tools) */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200/80 shadow-2xs">
          {[
            { id: 'select' as CanvasTool, icon: MousePointer, label: '선택 도구 (V)' },
            { id: 'hand' as CanvasTool, icon: Hand, label: '이동 도구 (H)' },
            { id: 'frame' as CanvasTool, icon: Hash, label: '새 프레임/아트보드 (F)' },
            { id: 'text' as CanvasTool, icon: Type, label: '텍스트 추가 (T)' },
            { id: 'rect' as CanvasTool, icon: Square, label: '사각형 추가 (R)' },
            { id: 'circle' as CanvasTool, icon: Circle, label: '원형 추가 (O)' }
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
                    onInsertNode('text', '새 텍스트', '텍스트를 입력하세요');
                    onSelectTool('select');
                  } else if (item.id === 'rect' && onInsertNode) {
                    onInsertNode('box', '새 사각형 박스');
                    onSelectTool('select');
                  } else if (item.id === 'circle' && onInsertNode) {
                    onInsertNode('circle', '새 원형 배지');
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

        {/* 2-3. Right: Interactive PLAY, Zoom, Navigator & Git Actions */}
        <div className="flex items-center gap-2">
          {/* Fullscreen Interactive PLAY Button */}
          <button
            onClick={onPlay}
            className="flex items-center gap-1.5 px-3 py-1 rounded-md bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition active:scale-95 text-xs shadow-xs"
            title="실시간 인터랙티브 프레젠테이션 모드 실행"
          >
            <Play size={12} className="fill-white" />
            <span>PLAY</span>
          </button>

          <div className="h-3.5 w-px bg-slate-200 mx-0.5" />

          {/* Zoom Controls (+ / - / %) */}
          <div className="flex items-center bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <button
              onClick={() => onZoomChange(Math.max(0.3, zoom - 0.1))}
              className="p-1 hover:bg-white rounded text-slate-500 transition"
              title="줌 아웃"
            >
              <ZoomOut size={12} />
            </button>
            <div className="relative">
              <button
                onClick={() => setShowZoomMenu(!showZoomMenu)}
                className="px-2 text-[11px] font-mono text-slate-700 flex items-center gap-0.5"
              >
                <span>{Math.round(zoom * 100)}%</span>
                <ChevronDown size={10} className="text-slate-400" />
              </button>
              {showZoomMenu && (
                <div
                  onMouseLeave={() => setShowZoomMenu(false)}
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
                    100%로 맞추기
                  </button>
                </div>
              )}
            </div>
            <button
              onClick={() => onZoomChange(Math.min(2.0, zoom + 0.1))}
              className="p-1 hover:bg-white rounded text-slate-500 transition"
              title="줌 인"
            >
              <ZoomIn size={12} />
            </button>
          </div>

          <div className="h-3.5 w-px bg-slate-200 mx-0.5" />

          {/* Screen / Artboard Navigator */}
          <div className="flex items-center gap-1 bg-slate-100 rounded-lg p-0.5 border border-slate-200">
            <span className="text-[11px] text-slate-500 px-2 font-mono">
              {totalCount > 0 ? `${totalCount}개 중 ${currentIndex + 1}번째` : '0개'}
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
                title={`Git 브랜치: ${gitStatus.branch || 'main'}`}
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
                    title="디자인 파일 변경 감지됨 - 클릭하여 Git 커밋/푸시 다이얼로그 열기"
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
                  title="원격 저장소에 푸시할 커밋이 있습니다."
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
