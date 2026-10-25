import React, { useState, useEffect, useRef } from 'react';
import { VDomArtboard, VNode, EventTrigger, ChangeTweakAction, NavigateAction } from '../types/vdom';
import {
  inferCanvasRoleFromArtboard,
  evaluateArtboardResolution
} from '../utils/canvasRolesAndResolution';
import { VNodeRenderer } from './VNodeRenderer';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Zap,
  RotateCw,
  Sparkles,
  MoveDiagonal2,
  SlidersHorizontal,
  Eye,
  EyeOff
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
  { id: 'original', label: '장표 설계 원본 크기', group: '반응형 / 원본' },
  // 대화면 / 와이드
  { id: '2560x1440', label: '2560 × 1440 (QHD 울트라 와이드)', w: 2560, h: 1440, group: '대화면 / 와이드' },
  { id: '1920x1080', label: '1920 × 1080 (FHD 와이드 화면)', w: 1920, h: 1080, group: '대화면 / 와이드' },
  { id: '1600x1000', label: '1600 × 1000 (워크스페이스 16:10)', w: 1600, h: 1000, group: '대화면 / 와이드' },
  { id: '1440x900', label: '1440 × 900 (표준 메인 페이지)', w: 1440, h: 900, group: '대화면 / 와이드' },
  { id: '1280x800', label: '1280 × 800 (컴팩트 웹 화면)', w: 1280, h: 800, group: '대화면 / 와이드' },
  // 중형 / 분할 화면
  { id: '1024x768', label: '1024 × 768 (중형 가로 화면)', w: 1024, h: 768, group: '중형 / 분할 화면' },
  { id: '834x1194', label: '834 × 1194 (중형 세로 화면)', w: 834, h: 1194, group: '중형 / 분할 화면' },
  { id: '768x1024', label: '768 × 1024 (표준 분할 세로 뷰)', w: 768, h: 1024, group: '중형 / 분할 화면' },
  // 오버레이 / 소형 뷰
  { id: '640x480', label: '640 × 480 (모달 / 다이얼로그 뷰)', w: 640, h: 480, group: '오버레이 / 소형 뷰' },
  { id: '430x932', label: '430 × 932 (소형 와이드 세로 뷰)', w: 430, h: 932, group: '오버레이 / 소형 뷰' },
  { id: '390x844', label: '390 × 844 (소형 표준 세로 뷰)', w: 390, h: 844, group: '오버레이 / 소형 뷰' },
  { id: '360x640', label: '360 × 640 (소형 최소 세로 뷰)', w: 360, h: 640, group: '오버레이 / 소형 뷰' }
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
  const [autoSwitchByResolution, setAutoSwitchByResolution] = useState(true);
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
  const roleMeta = inferCanvasRoleFromArtboard(current);
  const resEval = evaluateArtboardResolution(current.resolutionRule, viewportW, viewportH);

  // Find alternative artboard that matches the current viewportW x viewportH if current doesn't match
  const matchingArtboards = artboards.filter((a) =>
    evaluateArtboardResolution(a.resolutionRule, viewportW, viewportH).matches
  );
  const restrictedMatchingArtboard = artboards.find(
    (a) =>
      a.id !== current.id &&
      a.resolutionRule?.enabled &&
      evaluateArtboardResolution(a.resolutionRule, viewportW, viewportH).matches
  );

  // Auto-switch to a resolution-matching artboard if autoSwitchByResolution is enabled and current is hidden
  useEffect(() => {
    if (!autoSwitchByResolution) return;
    if (!resEval.matches) {
      const candidate = restrictedMatchingArtboard || matchingArtboards[0];
      if (candidate && candidate.id !== current.id) {
        const nextIdx = artboards.findIndex((a) => a.id === candidate.id);
        if (nextIdx !== -1) {
          setIndex(nextIdx);
          showToast(`📐 해상도(${viewportW}×${viewportH}) 조건에 맞는 '${candidate.title}' 장표로 자동 전환됨`);
        }
      }
    }
  }, [viewportW, viewportH, autoSwitchByResolution]);

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
  const groups = ['반응형 / 원본', '대화면 / 와이드', '중형 / 분할 화면', '오버레이 / 소형 뷰'];

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-between p-4 select-none animate-in fade-in duration-150">
      {/* Top Floating Control Bar: Resolution Combobox + Direct W×H Inputs + Hotspots + Navigation */}
      <header className="min-h-12 bg-slate-900/95 border border-slate-700/80 rounded-2xl px-4 py-1.5 flex flex-wrap items-center gap-2.5 shadow-2xl z-[110] text-white max-w-full">
        {/* Active Artboard Title + Role Badge */}
        <div className="flex items-center gap-1.5 min-w-0">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
          <span className="px-1.5 py-0.5 rounded bg-indigo-500/20 border border-indigo-400/40 text-indigo-300 text-[10px] font-bold shrink-0">
            {roleMeta.shortLabel}
          </span>
          <span className="text-xs font-bold tracking-wide truncate max-w-[160px]" title={current.title}>
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

        {/* Resolution Condition Match Status & Auto-Switch Toggle */}
        <button
          type="button"
          onClick={() => setAutoSwitchByResolution((prev) => !prev)}
          className={`px-2 py-1 rounded-lg border text-[10px] font-bold flex items-center gap-1 whitespace-nowrap transition ${
            !resEval.matches
              ? 'bg-rose-500/20 border-rose-500/50 text-rose-300'
              : resEval.isRestricted
              ? 'bg-emerald-500/20 border-emerald-500/40 text-emerald-300'
              : 'bg-slate-800 border-slate-700 text-slate-300 hover:text-white'
          }`}
          title={`${resEval.reasonText} (클릭하여 해상도 조건별 장표 자동 전환 ${autoSwitchByResolution ? '끄기' : '켜기'})`}
        >
          {resEval.matches ? <Eye size={11} /> : <EyeOff size={11} />}
          <span>
            {resEval.isRestricted
              ? resEval.matches
                ? `조건 충족 (${resEval.badgeText})`
                : `조건 불일치 (${resEval.badgeText})`
              : `해상도 연동 ${autoSwitchByResolution ? 'ON' : 'OFF'}`}
          </span>
        </button>

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
            className={`w-full h-full bg-slate-950 rounded-2xl overflow-hidden shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)] border transition-colors flex flex-col ${
              !resEval.matches
                ? 'border-rose-500 ring-2 ring-rose-500/40'
                : resizingDir
                ? 'border-indigo-400 ring-2 ring-indigo-500/50'
                : isResponsive
                ? 'border-indigo-500/60'
                : 'border-slate-700'
            }`}
          >
            {/* Resolution Rule Hidden Warning Banner in Play Mode */}
            {!resEval.matches && (
              <div className="bg-rose-600/95 text-white px-4 py-2 text-xs font-bold flex items-center justify-between gap-3 shrink-0 z-30">
                <div className="flex items-center gap-2 truncate">
                  <EyeOff size={14} className="shrink-0" />
                  <span className="truncate">
                    이 장표는 [{resEval.summaryText}] 해상도 조건에서만 표시되도록 설정되어 현재({viewportW}×{viewportH}px)에서는 숨김 대상입니다.
                  </span>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  {matchingArtboards.length > 0 && matchingArtboards[0].id !== current.id && (
                    <button
                      type="button"
                      onClick={() => {
                        const targetIdx = artboards.findIndex((a) => a.id === matchingArtboards[0].id);
                        if (targetIdx !== -1) setIndex(targetIdx);
                      }}
                      className="px-2.5 py-1 rounded bg-white text-rose-700 hover:bg-rose-50 text-[11px] font-bold"
                    >
                      조건 충족 장표로 이동
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={() => {
                      const nextW = current.resolutionRule?.minWidth || current.resolutionRule?.maxWidth || current.width;
                      const nextH = current.resolutionRule?.minHeight || current.resolutionRule?.maxHeight || current.height;
                      setViewportW(nextW);
                      setViewportH(nextH);
                    }}
                    className="px-2.5 py-1 rounded bg-rose-900/60 hover:bg-rose-900 text-white border border-rose-300/40 text-[11px] font-bold"
                  >
                    허용 해상도로 맞춤 ({current.resolutionRule?.minWidth || current.resolutionRule?.maxWidth || current.width}px)
                  </button>
                </div>
              </div>
            )}

            <div className="w-full flex-1 overflow-auto">
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
