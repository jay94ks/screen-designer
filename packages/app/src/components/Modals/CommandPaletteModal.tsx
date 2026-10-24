import React, { useState, useEffect, useRef } from 'react';
import {
  Search,
  Command,
  Play,
  Palette,
  FolderGit2,
  Settings,
  Download,
  Plus,
  Maximize2,
  Grid,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Copy,
  Layout,
  Type,
  MousePointer,
  Square,
  FileCode,
  Sliders,
  ChevronRight,
  ArrowRight,
  CornerDownLeft,
  Sparkles,
  Layers
} from 'lucide-react';
import { Page, CanvasTool } from '../../types';
import { VDomArtboard, NodeType } from '../../types/vdom';

export interface CommandItem {
  id: string;
  title: string;
  subtitle?: string;
  category: 'action' | 'component' | 'navigation';
  icon: any;
  shortcut?: string;
  action: () => void;
}

interface CommandPaletteModalProps {
  isOpen: boolean;
  onClose: () => void;
  pages: Page[];
  artboards: VDomArtboard[];
  onSelectPage: (id: string) => void;
  onSelectArtboard: (id: string) => void;
  onInsertNode: (type: NodeType, name: string, content?: string) => void;
  onOpenNewFrame: () => void;
  onOpenPlay: () => void;
  onOpenDesignSystem: () => void;
  onOpenGit: () => void;
  onOpenSettings: () => void;
  onToggleGrid: () => void;
  onToggleRulers: () => void;
  onZoomReset: () => void;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onUndo: () => void;
  onRedo: () => void;
}

export const CommandPaletteModal: React.FC<CommandPaletteModalProps> = ({
  isOpen,
  onClose,
  pages,
  artboards,
  onSelectPage,
  onSelectArtboard,
  onInsertNode,
  onOpenNewFrame,
  onOpenPlay,
  onOpenDesignSystem,
  onOpenGit,
  onOpenSettings,
  onToggleGrid,
  onToggleRulers,
  onZoomReset,
  onZoomIn,
  onZoomOut,
  onUndo,
  onRedo
}) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      setQuery('');
      setSelectedIndex(0);
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [isOpen]);

  // Build Command Registry
  const commands: CommandItem[] = [
    // Actions & Views
    {
      id: 'act-play',
      title: '인터랙티브 프로토타입 실행 (Play Mode)',
      subtitle: '실제 모바일/데스크톱 뷰포트에서 클릭 및 인터랙션 테스트',
      category: 'action',
      icon: Play,
      shortcut: 'Ctrl+P',
      action: onOpenPlay
    },
    {
      id: 'act-design-system',
      title: '디자인 시스템 스튜디오 열기',
      subtitle: '45종 컴포넌트 기본값 설정 및 테마 토큰 관리',
      category: 'action',
      icon: Palette,
      shortcut: 'Alt+D',
      action: onOpenDesignSystem
    },
    {
      id: 'act-git',
      title: 'Git 변경사항 감지 & 커밋/푸시 다이얼로그',
      subtitle: '디자인 변경점 diff 뷰어 및 버전 관리',
      category: 'action',
      icon: FolderGit2,
      shortcut: 'Ctrl+G',
      action: onOpenGit
    },
    {
      id: 'act-new-frame',
      title: '새 스크린 프레임/아트보드 추가',
      subtitle: '모바일, 태블릿, 데스크톱 프리셋 선택',
      category: 'action',
      icon: Plus,
      shortcut: 'F',
      action: onOpenNewFrame
    },
    {
      id: 'act-rulers',
      title: '캔버스 눈금자 & 가이드라인 토글',
      subtitle: '픽셀 눈금자와 정렬 가이드라인 표시/숨김',
      category: 'action',
      icon: Maximize2,
      shortcut: 'Shift+R',
      action: onToggleRulers
    },
    {
      id: 'act-grid',
      title: '격자 배경 그리드 토글',
      subtitle: '24px 도트/그리드 배경 켜기/끄기',
      category: 'action',
      icon: Grid,
      action: onToggleGrid
    },
    {
      id: 'act-zoom-100',
      title: '화면 배율 100%로 맞추기',
      subtitle: '캔버스 배율 1.0 (100%) 원본 크기 복원',
      category: 'action',
      icon: ZoomIn,
      shortcut: 'Ctrl+0',
      action: onZoomReset
    },
    {
      id: 'act-zoom-in',
      title: '캔버스 확대 (Zoom In)',
      category: 'action',
      icon: ZoomIn,
      shortcut: 'Ctrl++',
      action: onZoomIn
    },
    {
      id: 'act-zoom-out',
      title: '캔버스 축소 (Zoom Out)',
      category: 'action',
      icon: ZoomOut,
      shortcut: 'Ctrl+-',
      action: onZoomOut
    },
    {
      id: 'act-undo',
      title: '실행 취소 (Undo)',
      category: 'action',
      icon: RotateCcw,
      shortcut: 'Ctrl+Z',
      action: onUndo
    },
    {
      id: 'act-settings',
      title: '환경 설정 (Preferences)',
      subtitle: '프로젝트 작업 폴더 경로, 테마, 캔버스 환경 설정',
      category: 'action',
      icon: Settings,
      shortcut: 'Ctrl+,',
      action: onOpenSettings
    },

    // Insert Common Components
    {
      id: 'comp-button',
      title: '컴포넌트 삽입: CTA 버튼 (Button)',
      subtitle: '<button> 인터랙션 버튼',
      category: 'component',
      icon: MousePointer,
      action: () => onInsertNode('button', '새 CTA 버튼', '버튼 클릭')
    },
    {
      id: 'comp-input',
      title: '컴포넌트 삽입: 텍스트 인풋 (Input)',
      subtitle: '<input> 텍스트 입력 필드',
      category: 'component',
      icon: Sliders,
      action: () => onInsertNode('input', '텍스트 인풋')
    },
    {
      id: 'comp-scroll',
      title: '컴포넌트 삽입: 스크롤 컨테이너 (Scroll Container)',
      subtitle: '<scroll> 마우스 휠 스크롤 영역',
      category: 'component',
      icon: Maximize2,
      action: () => onInsertNode('scroll-container', '스크롤 컨테이너')
    },
    {
      id: 'comp-dialog',
      title: '컴포넌트 삽입: 모달 다이얼로그 (Dialog)',
      subtitle: '<dialog> 팝업 모달 레이어',
      category: 'component',
      icon: Square,
      action: () => onInsertNode('dialog', '모달 다이얼로그')
    },
    {
      id: 'comp-card',
      title: '컴포넌트 삽입: 카드 컨테이너 (Card)',
      subtitle: '<card> 배경색 및 곡률이 적용된 박스',
      category: 'component',
      icon: Layout,
      action: () => onInsertNode('card', '새 카드 컨테이너')
    },
    {
      id: 'comp-heading',
      title: '컴포넌트 삽입: 대제목 (Heading)',
      subtitle: '<h2> 타이틀 텍스트',
      category: 'component',
      icon: Type,
      action: () => onInsertNode('heading', '대제목', '새 섹션 타이틀')
    },
    {
      id: 'comp-text',
      title: '컴포넌트 삽입: 본문 텍스트 (Paragraph)',
      subtitle: '<p> 일반 본문 단락',
      category: 'component',
      icon: Type,
      action: () => onInsertNode('text', '본문 텍스트', '여기에 텍스트를 입력하세요.')
    },
    {
      id: 'comp-badge',
      title: '컴포넌트 삽입: 상태 뱃지 (Badge)',
      subtitle: '<badge> 인라인 상태 라벨',
      category: 'component',
      icon: Sparkles,
      action: () => onInsertNode('badge', '상태 뱃지', 'NEW')
    },
    {
      id: 'comp-table',
      title: '컴포넌트 삽입: 데이터 테이블 (Table)',
      subtitle: '<table> 표 데이터 구조',
      category: 'component',
      icon: Layout,
      action: () => onInsertNode('table', '데이터 테이블')
    },

    // Navigation (Artboards & Pages)
    ...pages.map((p) => ({
      id: `nav-page-${p.id}`,
      title: `페이지 이동: ${p.name}`,
      subtitle: `${p.artboards?.length || 0}개의 아트보드 포함`,
      category: 'navigation' as const,
      icon: Layers,
      action: () => onSelectPage(p.id)
    })),

    ...artboards.map((a) => ({
      id: `nav-artboard-${a.id}`,
      title: `아트보드 이동: ${a.title}`,
      subtitle: `${a.viewport} (${a.width}×${a.height})`,
      category: 'navigation' as const,
      icon: Layout,
      action: () => onSelectArtboard(a.id)
    }))
  ];

  // Filter commands
  const filteredCommands = commands.filter((cmd) => {
    const q = query.toLowerCase().trim();
    if (!q) return true;
    return (
      cmd.title.toLowerCase().includes(q) ||
      (cmd.subtitle && cmd.subtitle.toLowerCase().includes(q)) ||
      (cmd.shortcut && cmd.shortcut.toLowerCase().includes(q))
    );
  });

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + filteredCommands.length) % Math.max(1, filteredCommands.length));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      const selected = filteredCommands[selectedIndex];
      if (selected) {
        onClose();
        selected.action();
      }
    } else if (e.key === 'Escape') {
      e.preventDefault();
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex items-start justify-center pt-24 p-4 animate-in fade-in duration-100 select-none"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col animate-in zoom-in-95 duration-150"
      >
        {/* Search Input Bar */}
        <div className="h-14 px-4 border-b border-slate-200 flex items-center gap-3 bg-slate-50/60 shrink-0">
          <Search size={18} className="text-slate-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            onKeyDown={handleKeyDown}
            placeholder="명령어, 컴포넌트, 페이지 또는 화면 검색... (Ctrl+K)"
            className="flex-1 bg-transparent text-sm text-slate-800 placeholder-slate-400 focus:outline-none font-medium"
          />
          <kbd className="px-2 py-0.5 text-[10px] font-mono text-slate-400 bg-slate-200/80 rounded border border-slate-300 shrink-0">
            ESC
          </kbd>
        </div>

        {/* Results List */}
        <div ref={listRef} className="max-h-[380px] overflow-y-auto p-2 space-y-1">
          {filteredCommands.length === 0 ? (
            <div className="p-8 text-center text-slate-400 text-xs">
              <Command size={24} className="mx-auto mb-2 opacity-40" />
              <span>'{query}'에 대한 명령어나 컴포넌트를 찾을 수 없습니다</span>
            </div>
          ) : (
            filteredCommands.map((cmd, idx) => {
              const isSelected = idx === selectedIndex;
              const Icon = cmd.icon;

              return (
                <div
                  key={cmd.id}
                  onClick={() => {
                    onClose();
                    cmd.action();
                  }}
                  onMouseEnter={() => setSelectedIndex(idx)}
                  className={`px-3 py-2.5 rounded-xl flex items-center justify-between cursor-pointer transition text-xs ${
                    isSelected
                      ? 'bg-indigo-600 text-white font-medium shadow-sm shadow-indigo-600/10'
                      : 'hover:bg-slate-100/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      <Icon size={14} />
                    </div>
                    <div className="truncate">
                      <div className="flex items-center gap-2">
                        <span className={`font-semibold ${isSelected ? 'text-white' : 'text-slate-900'}`}>
                          {cmd.title}
                        </span>
                        <span
                          className={`text-[9px] px-1.5 py-0.2 rounded font-mono ${
                            isSelected
                              ? 'bg-indigo-700/60 text-indigo-100'
                              : 'bg-slate-100 text-slate-500 border border-slate-200'
                          }`}
                        >
                          {cmd.category === 'action'
                            ? '액션'
                            : cmd.category === 'component'
                            ? '컴포넌트'
                            : '이동'}
                        </span>
                      </div>
                      {cmd.subtitle && (
                        <p className={`text-[10px] truncate ${isSelected ? 'text-indigo-100' : 'text-slate-400'}`}>
                          {cmd.subtitle}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2 shrink-0 ml-2">
                    {cmd.shortcut && (
                      <kbd
                        className={`px-1.5 py-0.5 text-[10px] font-mono rounded ${
                          isSelected ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500 border border-slate-200'
                        }`}
                      >
                        {cmd.shortcut}
                      </kbd>
                    )}
                    {isSelected && <CornerDownLeft size={13} className="text-indigo-200" />}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer Quick Keys Hint */}
        <div className="px-4 py-2 border-t border-slate-100 bg-slate-50/80 flex items-center justify-between text-[11px] text-slate-400 shrink-0">
          <div className="flex items-center gap-3 font-mono text-[10px]">
            <span>↑↓ 이동</span>
            <span>↵ 실행</span>
            <span>ESC 닫기</span>
          </div>
          <span className="text-[10px]">총 {filteredCommands.length}개 결과</span>
        </div>
      </div>
    </div>
  );
};
