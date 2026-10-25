import React, { useState, useEffect, useRef } from 'react';
import { VDomArtboard, VNode, EventTrigger, ChangeTweakAction, NavigateAction } from '../types/vdom';
import { VNodeRenderer } from './VNodeRenderer';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
  RotateCw,
  Sparkles,
  MoveDiagonal2,
  SlidersHorizontal
} from 'lucide-react';

export const MIN_PLAY_VIEWPORT_WIDTH = 240;
export const MIN_PLAY_VIEWPORT_HEIGHT = 240;

export interface ResolutionPresetItem {
  id: string;
  label: string;
  w?: number;
  h?: number;
  group: string;
}

export const PLAY_RESOLUTION_PRESETS: ResolutionPresetItem[] = [
  { id: 'responsive', label: '↔ 반응형 (외곽 드래그 자유 조절)', group: '반응형 / 원본' },
  { id: 'original', label: '아트보드 원본 크기', group: '반응형 / 원본' },
  // 데스크톱 / 노트북
  { id: '2560x1440', label: 'QHD 모니터 (2560 × 1440)', w: 2560, h: 1440, group: '데스크톱 / 노트북' },
  { id: '1920x1080', label: 'FHD 데스크톱 (1920 × 1080)', w: 1920, h: 1080, group: '데스크톱 / 노트북' },
  { id: '1600x1000', label: '스튜디오 와이드 (1600 × 1000)', w: 1600, h: 1000, group: '데스크톱 / 노트북' },
  { id: '1440x900', label: '표준 노트북 / MacBook (1440 × 900)', w: 1440, h: 900, group: '데스크톱 / 노트북' },
  { id: '1280x800', label: 'HD 노트북 (1280 × 800)', w: 1280, h: 800, group: '데스크톱 / 노트북' },
  // 태블릿
  { id: '1024x1366', label: 'iPad Pro 12.9" (1024 × 1366)', w: 1024, h: 1366, group: '태블릿' },
  { id: '834x1194', label: 'iPad Air / Pro 11" (834 × 1194)', w: 834, h: 1194, group: '태블릿' },
  { id: '768x1024', label: 'iPad Mini / 태블릿 (768 × 1024)', w: 768, h: 1024, group: '태블릿' },
  // 모바일
  { id: '430x932', label: 'iPhone 16 Pro Max (430 × 932)', w: 430, h: 932, group: '모바일' },
  { id: '393x852', label: 'iPhone 16 / 15 Pro (393 × 852)', w: 393, h: 852, group: '모바일' },
  { id: '412x915', label: 'Galaxy S24 Ultra (412 × 915)', w: 412, h: 915, group: '모바일' },
  { id: '375x667', label: '모바일 컴팩트 / SE (375 × 667)', w: 375, h: 667, group: '모바일' }
];

type ResizeDirection = 'e' | 'w' | 's' | 'se' | 'sw' | null;

interface PlayModalProps {
  artboards: VDomArtboard[];
  initialIndex?: number;
  isOpen: boolean;
  onClose: () => void;
}

export const PlayModal: React.FC<PlayModalProps> = ({
  artboards,
  initialIndex = 0,
  isOpen,
  onClose
}) => {
  const [index, setIndex] = useState(initialIndex);
  const [resolutionPreset, setResolutionPreset] = useState<string>('responsive');
  const [viewportW, setViewportW] = useState<number>(1280);
  const [viewportH, setViewportH] = useState<number>(800);
  const [showHotspots, setShowHotspots] = useState(false);
  const [playTweakMap, setPlayTweakMap] = useState<Record<string, Record<string, any>>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [resizingDir, setResizingDir] = useState<ResizeDirection>(null);

  const resizeStartRef = useRef<{
    dir: ResizeDirection;
    startX: number;
    startY: number;
    startW: number;
    startH: number;
  }>({
    dir: null,
    startX: 0,
    startY: 0,
    startW: 1280,
    startH: 800
  });

  useEffect(() => {
    if (isOpen && artboards.length > 0) {
      const targetIdx = Math.min(Math.max(0, initialIndex), artboards.length - 1);
      setIndex(targetIdx);
      const board = artboards[targetIdx] || artboards[0];
      setViewportW(Math.max(MIN_PLAY_VIEWPORT_WIDTH, board.width || 1280));
      setViewportH(Math.max(MIN_PLAY_VIEWPORT_HEIGHT, board.height || 800));
      setResolutionPreset('responsive');

      const initialMap: Record<string, Record<string, any>> = {};
      for (const a of artboards) {
        initialMap[a.id] = { ...(a.tweakValues || {}) };
      }
      setPlayTweakMap(initialMap);
    }
  }, [isOpen, initialIndex, artboards]);

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(target.tagName)) {
        if (e.key === 'Escape') onClose();
        return;
      }
      if (e.key === 'ArrowLeft') {
        setIndex((i) => Math.max(0, i - 1));
      } else if (e.key === 'ArrowRight' || e.key === ' ') {
        setIndex((i) => Math.min(artboards.length - 1, i + 1));
      } else if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, artboards.length, onClose]);

  // Interactive Outer Frame Drag Resize Listener
  useEffect(() => {
    if (!resizingDir) return;

    const handleMouseMove = (e: MouseEvent) => {
      const { dir, startX, startY, startW, startH } = resizeStartRef.current;
      if (!dir) return;

      const dx = e.clientX - startX;
      const dy = e.clientY - startY;

      let nextW = startW;
      let nextH = startH;

      // Since the frame is centered in the flex container, dragging right/left edge adjusts width
      if (dir === 'e' || dir === 'se') {
        nextW = Math.max(MIN_PLAY_VIEWPORT_WIDTH, Math.min(3840, Math.round(startW + dx * 2)));
      } else if (dir === 'w' || dir === 'sw') {
        nextW = Math.max(MIN_PLAY_VIEWPORT_WIDTH, Math.min(3840, Math.round(startW - dx * 2)));
      }

      if (dir === 's' || dir === 'se' || dir === 'sw') {
        nextH = Math.max(MIN_PLAY_VIEWPORT_HEIGHT, Math.min(3840, Math.round(startH + dy)));
      }

      setViewportW(nextW);
      setViewportH(nextH);
    };

    const handleMouseUp = () => {
      setResizingDir(null);
      document.body.style.cursor = '';
      document.body.style.userSelect = '';
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [resizingDir]);

  if (!isOpen || artboards.length === 0) return null;

  const current = artboards[index] || artboards[0];
  const currentTweakValues = playTweakMap[current.id] || current.tweakValues || {};
  const isResponsive = resolutionPreset === 'responsive';

  const handlePresetChange = (presetId: string) => {
    setResolutionPreset(presetId);
    if (presetId === 'original') {
      setViewportW(Math.max(MIN_PLAY_VIEWPORT_WIDTH, current.width || 1280));
      setViewportH(Math.max(MIN_PLAY_VIEWPORT_HEIGHT, current.height || 800));
      return;
    }
    if (presetId === 'responsive') {
      return;
    }
    const found = PLAY_RESOLUTION_PRESETS.find((p) => p.id === presetId);
    if (found && found.w && found.h) {
      setViewportW(found.w);
      setViewportH(found.h);
    }
  };

  const handleStartResize = (dir: ResizeDirection, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (resolutionPreset !== 'responsive') {
      setResolutionPreset('responsive');
    }
    resizeStartRef.current = {
      dir,
      startX: e.clientX,
      startY: e.clientY,
      startW: viewportW,
      startH: viewportH
    };
    setResizingDir(dir);
    document.body.style.cursor =
      dir === 'e' || dir === 'w'
        ? 'ew-resize'
        : dir === 's'
        ? 'ns-resize'
        : dir === 'se'
        ? 'nwse-resize'
        : 'nesw-resize';
    document.body.style.userSelect = 'none';
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 2500);
  };

  const handleNodeEvent = (node: VNode, trigger: EventTrigger, e: React.MouseEvent) => {
    const nodeEvents = node.events || [];
    const matching = nodeEvents.filter((ev) => ev.trigger === trigger);

    if (matching.length > 0) {
      for (const ev of matching) {
        if (ev.action.type === 'change_tweak') {
          const action = ev.action as ChangeTweakAction;
          const twk = (current.tweaksSchema || []).find((t) => t.id === action.tweakId);
          const currentVal = currentTweakValues[action.tweakId];
          let nextVal = currentVal;

          if (action.operation === 'toggle') {
            nextVal = !currentVal;
          } else if (action.operation === 'cycle' && twk?.options && twk.options.length > 0) {
            const idx = twk.options.indexOf(String(currentVal));
            const nextIdx = (idx + 1) % twk.options.length;
            nextVal = twk.options[nextIdx];
          } else {
            nextVal = action.value;
          }

          setPlayTweakMap((prev) => ({
            ...prev,
            [current.id]: {
              ...(prev[current.id] || {}),
              [action.tweakId]: nextVal
            }
          }));

          showToast(`⚡ [${trigger}] Tweak '${action.tweakId}' 변경: ${String(nextVal)}`);
        } else if (ev.action.type === 'navigate') {
          const action = ev.action as NavigateAction;
          const targetIdx = artboards.findIndex((a) => a.id === action.targetArtboardId);
          if (targetIdx !== -1) {
            setIndex(targetIdx);
            const targetTitle = artboards[targetIdx].title;
            showToast(`🚀 [${trigger}] 장표 이동: '${targetTitle}'`);
          }
        }
      }
      return;
    }

    if (trigger === 'click') {
      handleDefaultNodeAction(node);
    }
  };

  const handleDefaultNodeAction = (node: VNode) => {
    if (node.id === 'node-s1-btn' || node.name?.includes('주문') || node.name?.includes('시작')) {
      if (artboards.length > 1) setIndex(1);
    } else if (
      node.id === 'node-s2-submit-btn' ||
      node.name?.includes('매수') ||
      node.name?.includes('완료') ||
      node.name?.includes('결제')
    ) {
      if (artboards.length > 2) setIndex(2);
    } else if (node.id === 'node-s3-home-btn' || node.name?.includes('홈')) {
      setIndex(0);
    }
  };

  // Group presets for clean <optgroup> rendering
  const groups = ['반응형 / 원본', '데스크톱 / 노트북', '태블릿', '모바일'];

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-between p-4 select-none animate-in fade-in duration-150">
      {/* Top Floating Control Bar: Resolution Combobox + Direct W×H Inputs + Hotspots + Navigation */}
      <header className="min-h-12 bg-slate-900/95 border border-slate-700/80 rounded-2xl px-4 py-1.5 flex flex-wrap items-center gap-3 shadow-2xl z-[110] text-white max-w-full">
        {/* Active Artboard Title */}
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="text-xs font-bold tracking-wide truncate max-w-[180px]" title={current.title}>
            {current.title}
          </span>
          <span className="text-xs text-slate-400 font-mono shrink-0">
            ({index + 1}/{artboards.length})
          </span>
        </div>

        <div className="w-px h-5 bg-slate-700/80" />

        {/* 1. Resolution Combination Combobox (Replaces hardcoded 3-device buttons) */}
        <div className="flex items-center gap-1.5">
          <SlidersHorizontal size={12} className="text-indigo-400 shrink-0" />
          <select
            value={resolutionPreset}
            onChange={(e) => handlePresetChange(e.target.value)}
            className="bg-slate-800 hover:bg-slate-750 border border-slate-700 rounded-lg px-2.5 py-1 text-xs font-semibold text-white focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer"
            title="해상도 조합 및 반응형 모드 선택"
          >
            {groups.map((grp) => (
              <optgroup key={grp} label={grp} className="bg-slate-900 text-slate-300">
                {PLAY_RESOLUTION_PRESETS.filter((p) => p.group === grp).map((p) => (
                  <option key={p.id} value={p.id} className="bg-slate-900 text-white">
                    {p.id === 'original'
                      ? `아트보드 원본 (${current.width} × ${current.height})`
                      : p.label}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
        </div>

        {/* 2. Direct Resolution Width × Height Numeric Inputs + Swap Button */}
        <div className="flex items-center gap-1 bg-slate-800/90 border border-slate-700 rounded-lg px-2 py-0.5">
          <span className="text-[10px] text-slate-400 font-mono">W</span>
          <input
            type="number"
            min={MIN_PLAY_VIEWPORT_WIDTH}
            max={3840}
            value={viewportW}
            onChange={(e) => {
              const val = Number(e.target.value);
              setViewportW(val);
              setResolutionPreset('responsive');
            }}
            onBlur={() => {
              if (viewportW < MIN_PLAY_VIEWPORT_WIDTH) setViewportW(MIN_PLAY_VIEWPORT_WIDTH);
            }}
            className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs font-mono font-bold text-indigo-300 text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
            title="가로 해상도 직접 입력 (최소 240px)"
          />
          <span className="text-xs text-slate-500 font-mono">×</span>
          <span className="text-[10px] text-slate-400 font-mono">H</span>
          <input
            type="number"
            min={MIN_PLAY_VIEWPORT_HEIGHT}
            max={3840}
            value={viewportH}
            onChange={(e) => {
              const val = Number(e.target.value);
              setViewportH(val);
              setResolutionPreset('responsive');
            }}
            onBlur={() => {
              if (viewportH < MIN_PLAY_VIEWPORT_HEIGHT) setViewportH(MIN_PLAY_VIEWPORT_HEIGHT);
            }}
            className="w-14 bg-slate-900 border border-slate-700 rounded px-1.5 py-0.5 text-xs font-mono font-bold text-indigo-300 text-center focus:outline-none focus:ring-1 focus:ring-indigo-500"
            title="세로 해상도 직접 입력 (최소 240px)"
          />
          <span className="text-[10px] text-slate-500 font-mono">px</span>

          {/* Swap W <-> H Button */}
          <button
            type="button"
            onClick={() => {
              const prevW = viewportW;
              setViewportW(viewportH);
              setViewportH(prevW);
              setResolutionPreset('responsive');
            }}
            className="ml-1 p-1 rounded hover:bg-slate-700 text-slate-400 hover:text-white transition"
            title="가로 ↔ 세로 해상도 맞바꾸기 (회전)"
          >
            <RotateCw size={12} />
          </button>
        </div>

        {/* Responsive Mode Badge Indicator */}
        {isResponsive && (
          <span className="px-2 py-0.5 rounded-full bg-indigo-500/20 border border-indigo-500/40 text-indigo-300 text-[10px] font-bold flex items-center gap-1 whitespace-nowrap">
            <MoveDiagonal2 size={10} />
            <span>외곽 드래그 조절 활성</span>
          </span>
        )}

        {/* Hotspot Hint Toggle */}
        <button
          onClick={() => setShowHotspots(!showHotspots)}
          className={`px-2.5 py-1 rounded-lg border transition text-xs flex items-center gap-1.5 whitespace-nowrap ${
            showHotspots
              ? 'bg-cyan-600 border-cyan-500 text-white font-bold shadow-xs animate-pulse'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
          }`}
          title="클릭 및 상호작용 가능한 요소 하이라이트 표시"
        >
          <Sparkles size={12} className={showHotspots ? 'text-cyan-200' : 'text-slate-400'} />
          <span>핫스팟</span>
        </button>

        {/* Screen Navigator Buttons */}
        <div className="flex items-center gap-1 border-l border-slate-700 pl-2">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index <= 0}
            className="p-1 rounded hover:bg-slate-800 disabled:opacity-30"
            title="이전 화면 (←)"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setIndex((i) => Math.min(artboards.length - 1, i + 1))}
            disabled={index >= artboards.length - 1}
            className="p-1 rounded hover:bg-slate-800 disabled:opacity-30"
            title="다음 화면 (→)"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        <button
          onClick={onClose}
          className="p-1.5 rounded-full hover:bg-slate-800 text-slate-400 hover:text-white transition"
          title="닫기 (Esc)"
        >
          <X size={16} />
        </button>
      </header>

      {/* Floating Interactive Toast Feedback */}
      {toastMessage && (
        <div className="fixed top-20 z-[120] px-4 py-2 bg-slate-900/95 border border-amber-500/80 text-amber-300 rounded-full font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Zap size={14} className="text-amber-400 fill-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Interactive Viewport Sandbox with Responsive Outer Drag Handles */}
      <main className="flex-1 w-full flex items-center justify-center p-6 overflow-auto relative">
        <div
          className="relative flex items-center justify-center"
          style={{
            width: `${Math.max(MIN_PLAY_VIEWPORT_WIDTH, viewportW)}px`,
            height: `${Math.max(MIN_PLAY_VIEWPORT_HEIGHT, viewportH)}px`,
            flexShrink: 0
          }}
        >
          {/* Viewport Content Container */}
          <div
            className={`w-full h-full bg-slate-950 rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border transition-colors ${
              resizingDir
                ? 'border-indigo-400 ring-2 ring-indigo-500/50'
                : isResponsive
                ? 'border-indigo-500/60'
                : 'border-slate-700'
            }`}
          >
            <div className="w-full h-full overflow-auto">
              <VNodeRenderer
                node={current.rootNode}
                selectedNodeId={null}
                onSelectNode={() => {}}
                onNodeAction={handleDefaultNodeAction}
                onNodeEvent={handleNodeEvent}
                tweakValues={currentTweakValues}
                interactive={true}
                isPlayMode={true}
                showHotspots={showHotspots}
              />
            </div>
          </div>

          {/* Outer Drag-to-Resize Handles (Active in Responsive Mode or hoverable anytime to trigger responsive resize) */}
          {/* 1. Right (East) Edge Handle */}
          <div
            onMouseDown={(e) => handleStartResize('e', e)}
            className={`absolute top-0 -right-3.5 w-3.5 h-full cursor-ew-resize flex items-center justify-center group z-50 ${
              isResponsive ? 'opacity-100' : 'opacity-60 hover:opacity-100'
            }`}
            title="우측 외곽을 드래그하여 가로(W) 해상도 조절"
          >
            <div
              className={`w-1.5 h-16 rounded-full transition-all ${
                resizingDir === 'e'
                  ? 'bg-indigo-400 h-24 scale-110'
                  : 'bg-slate-600 group-hover:bg-indigo-400 group-hover:h-20'
              }`}
            />
          </div>

          {/* 2. Left (West) Edge Handle */}
          <div
            onMouseDown={(e) => handleStartResize('w', e)}
            className={`absolute top-0 -left-3.5 w-3.5 h-full cursor-ew-resize flex items-center justify-center group z-50 ${
              isResponsive ? 'opacity-100' : 'opacity-60 hover:opacity-100'
            }`}
            title="좌측 외곽을 드래그하여 가로(W) 해상도 조절"
          >
            <div
              className={`w-1.5 h-16 rounded-full transition-all ${
                resizingDir === 'w'
                  ? 'bg-indigo-400 h-24 scale-110'
                  : 'bg-slate-600 group-hover:bg-indigo-400 group-hover:h-20'
              }`}
            />
          </div>

          {/* 3. Bottom (South) Edge Handle */}
          <div
            onMouseDown={(e) => handleStartResize('s', e)}
            className={`absolute -bottom-3.5 left-0 w-full h-3.5 cursor-ns-resize flex items-center justify-center group z-50 ${
              isResponsive ? 'opacity-100' : 'opacity-60 hover:opacity-100'
            }`}
            title="하단 외곽을 드래그하여 세로(H) 해상도 조절"
          >
            <div
              className={`h-1.5 w-16 rounded-full transition-all ${
                resizingDir === 's'
                  ? 'bg-indigo-400 w-24 scale-110'
                  : 'bg-slate-600 group-hover:bg-indigo-400 group-hover:w-20'
              }`}
            />
          </div>

          {/* 4. Bottom-Right (SE) Corner Handle */}
          <div
            onMouseDown={(e) => handleStartResize('se', e)}
            className="absolute -bottom-3.5 -right-3.5 w-5 h-5 rounded-md bg-indigo-600 hover:bg-indigo-500 border-2 border-white shadow-lg cursor-nwse-resize z-50 flex items-center justify-center transition-transform hover:scale-125"
            title="모서리를 드래그하여 가로×세로 해상도 자유 조절"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white pointer-events-none" />
          </div>

          {/* 5. Bottom-Left (SW) Corner Handle */}
          <div
            onMouseDown={(e) => handleStartResize('sw', e)}
            className="absolute -bottom-3.5 -left-3.5 w-5 h-5 rounded-md bg-indigo-600 hover:bg-indigo-500 border-2 border-white shadow-lg cursor-nesw-resize z-50 flex items-center justify-center transition-transform hover:scale-125"
            title="모서리를 드래그하여 가로×세로 해상도 자유 조절"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-white pointer-events-none" />
          </div>

          {/* Live Dimension HUD Badge during resize */}
          {resizingDir && (
            <div className="absolute bottom-4 right-4 bg-indigo-600/95 text-white font-mono text-xs font-bold px-3 py-1.5 rounded-xl shadow-2xl z-50 border border-indigo-300/50 pointer-events-none">
              {viewportW} × {viewportH} px
            </div>
          )}
        </div>
      </main>

      <footer className="text-xs text-slate-400 py-1 font-mono flex items-center gap-3">
        <span>
          현재 뷰포트: <strong className="text-indigo-300">{viewportW} × {viewportH} px</strong> · 외곽 핸들 드래그 또는 상단 입력창에서 해상도를 직접 조절하세요
        </span>
        {showHotspots && (
          <span className="text-cyan-400 font-semibold flex items-center gap-1">
            ● 핫스팟 힌트 켜짐
          </span>
        )}
      </footer>
    </div>
  );
};
