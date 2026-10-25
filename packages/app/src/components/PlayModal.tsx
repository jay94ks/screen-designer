import React, { useState, useEffect } from 'react';
import { VDomArtboard, VNode, EventTrigger, ChangeTweakAction, NavigateAction } from '../types/vdom';
import { VNodeRenderer } from './VNodeRenderer';
import {
  X,
  Smartphone,
  Tablet,
  Monitor,
  Maximize2,
  ChevronLeft,
  ChevronRight,
  Play,
  Zap,
  RotateCw,
  Sparkles
} from 'lucide-react';

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
  const [deviceFrame, setDeviceFrame] = useState<'iphone' | 'ipad' | 'macbook' | 'frameless'>('iphone');
  const [isLandscape, setIsLandscape] = useState(false);
  const [showHotspots, setShowHotspots] = useState(false);
  const [playTweakMap, setPlayTweakMap] = useState<Record<string, Record<string, any>>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIndex(initialIndex);
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

  if (!isOpen || artboards.length === 0) return null;

  const current = artboards[index] || artboards[0];
  const currentTweakValues = playTweakMap[current.id] || current.tweakValues || {};

  // Device Dimensions Calculation
  let baseW = 393;
  let baseH = 852;
  if (deviceFrame === 'iphone') {
    baseW = 393;
    baseH = 852;
  } else if (deviceFrame === 'ipad') {
    baseW = 820;
    baseH = 1180;
  } else if (deviceFrame === 'macbook') {
    baseW = 1200;
    baseH = 750;
  } else {
    baseW = current.width || 390;
    baseH = current.height || 844;
  }

  const finalW = (isLandscape && deviceFrame !== 'frameless') ? baseH : baseW;
  const finalH = (isLandscape && deviceFrame !== 'frameless') ? baseW : baseH;

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

  return (
    <div className="fixed inset-0 z-[110] bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-between p-4 select-none animate-in fade-in duration-150">
      {/* Top Floating Control Bar */}
      <header className="h-12 bg-slate-900/90 border border-slate-700/80 rounded-full px-5 flex items-center gap-5 shadow-2xl z-[110] text-white">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold tracking-wide">
            {current.title}
          </span>
          <span className="text-xs text-slate-400">
            ({index + 1} / {artboards.length})
          </span>
        </div>

        {/* Device Switcher (iPhone 16 Pro, iPad, MacBook, Frameless) */}
        <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          {[
            { id: 'iphone' as const, icon: Smartphone, label: 'iPhone' },
            { id: 'ipad' as const, icon: Tablet, label: 'iPad' },
            { id: 'macbook' as const, icon: Monitor, label: 'Mac' },
            { id: 'frameless' as const, icon: Maximize2, label: '원본' }
          ].map((d) => {
            const Icon = d.icon;
            const isActive = deviceFrame === d.id;
            return (
              <button
                key={d.id}
                onClick={() => setDeviceFrame(d.id)}
                className={`px-2 py-1 rounded-md text-xs flex items-center gap-1 transition ${
                  isActive
                    ? 'bg-indigo-600 text-white font-bold shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
                title={d.label}
              >
                <Icon size={12} />
                <span>{d.label}</span>
              </button>
            );
          })}
        </div>

        {/* Orientation Toggle (Portrait <-> Landscape) */}
        {deviceFrame !== 'frameless' && (
          <button
            onClick={() => setIsLandscape(!isLandscape)}
            className={`p-1.5 rounded-lg border transition text-xs flex items-center gap-1 ${
              isLandscape
                ? 'bg-indigo-600 border-indigo-500 text-white font-bold'
                : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
            }`}
            title="기기 화면 가로/세로 전환"
          >
            <RotateCw size={13} className={isLandscape ? 'rotate-90' : ''} />
            <span>{isLandscape ? '가로 (90°)' : '세로'}</span>
          </button>
        )}

        {/* Hotspot Hint Toggle */}
        <button
          onClick={() => setShowHotspots(!showHotspots)}
          className={`px-2.5 py-1 rounded-lg border transition text-xs flex items-center gap-1.5 ${
            showHotspots
              ? 'bg-cyan-600 border-cyan-500 text-white font-bold shadow-xs animate-pulse'
              : 'bg-slate-800 border-slate-700 text-slate-400 hover:text-white'
          }`}
          title="클릭 및 상호작용 가능한 요소 하이라이트 표시"
        >
          <Sparkles size={12} className={showHotspots ? 'text-cyan-200' : 'text-slate-400'} />
          <span>핫스팟 힌트</span>
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
        <div className="fixed top-18 z-[110] px-4 py-2 bg-slate-900/95 border border-amber-500/80 text-amber-300 rounded-full font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Zap size={14} className="text-amber-400 fill-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Interactive Device Sandbox */}
      <main className="flex-1 w-full flex items-center justify-center p-4 overflow-auto">
        <div
          className={`bg-slate-950 shadow-2xl overflow-hidden transition-all duration-200 relative ${
            deviceFrame === 'iphone'
              ? 'rounded-[50px] border-[12px] border-slate-900 ring-2 ring-slate-800 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.85)]'
              : deviceFrame === 'ipad'
              ? 'rounded-[32px] border-[14px] border-slate-900 ring-1 ring-slate-800 shadow-2xl'
              : deviceFrame === 'macbook'
              ? 'rounded-xl border border-slate-700 shadow-2xl'
              : 'rounded-2xl border border-slate-800'
          }`}
          style={{ width: `${finalW}px`, height: `${finalH}px` }}
        >
          {/* iPhone 16 Pro Dynamic Island & Home Bar Mockup */}
          {deviceFrame === 'iphone' && !isLandscape && (
            <>
              {/* Dynamic Island */}
              <div className="absolute top-3 left-1/2 -translate-x-1/2 w-28 h-7 bg-black rounded-full z-40 flex items-center justify-between px-3 pointer-events-none shadow-md">
                <div className="w-2.5 h-2.5 rounded-full bg-slate-950 border border-slate-800" />
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500/80 animate-pulse" />
              </div>
              {/* Bottom Home Indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 w-32 h-1 bg-white/40 rounded-full z-40 pointer-events-none" />
            </>
          )}

          {/* MacBook Top Window Chrome */}
          {deviceFrame === 'macbook' && (
            <div className="h-7 bg-slate-900 border-b border-slate-800 w-full flex items-center px-3 gap-1.5 shrink-0 select-none">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
              <span className="text-[10px] text-slate-400 font-mono mx-auto truncate">
                {current.title} — Screen Designer Preview
              </span>
            </div>
          )}

          <div className="w-full h-full overflow-y-auto">
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
      </main>

      <footer className="text-xs text-slate-500 py-1 font-mono flex items-center gap-3">
        <span>인터랙티브 모드 가동 중 · 화면 내 버튼 클릭 시 연결된 화면으로 전환 (좌/우 방향키 또는 Esc)</span>
        {showHotspots && (
          <span className="text-cyan-400 font-semibold flex items-center gap-1">
            ● 핫스팟 힌트 켜짐
          </span>
        )}
      </footer>
    </div>
  );
};
