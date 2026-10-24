import React, { useState, useEffect } from 'react';
import { VDomArtboard, VNode, EventTrigger, ChangeTweakAction, NavigateAction } from '../types/vdom';
import { VNodeRenderer } from './VNodeRenderer';
import { X, Smartphone, Tablet, Monitor, ChevronLeft, ChevronRight, Play, Zap, ArrowRight, RotateCw } from 'lucide-react';

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
  const [deviceFrame, setDeviceFrame] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');
  const [playTweakMap, setPlayTweakMap] = useState<Record<string, Record<string, any>>>({});
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    if (isOpen) {
      setIndex(initialIndex);
      // Initialize tweak values for all artboards
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
  const width = deviceFrame === 'mobile' ? 390 : deviceFrame === 'tablet' ? 768 : 1200;
  const height = deviceFrame === 'mobile' ? 844 : deviceFrame === 'tablet' ? 900 : 800;

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

    // Fallback default action for click if no explicit custom event binding
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
    <div className="fixed inset-0 z-50 bg-slate-950/95 backdrop-blur-md flex flex-col items-center justify-between p-4 select-none animate-in fade-in duration-150">
      {/* Top Floating Control Bar */}
      <header className="h-12 bg-slate-900/90 border border-slate-700/80 rounded-full px-5 flex items-center gap-6 shadow-2xl z-50 text-white">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-xs font-bold tracking-wide">
            {current.title}
          </span>
          <span className="text-xs text-slate-400">
            ({index + 1} / {artboards.length})
          </span>
        </div>

        {/* Device Switcher */}
        <div className="flex items-center bg-slate-800 p-0.5 rounded-lg border border-slate-700">
          <button
            onClick={() => setDeviceFrame('mobile')}
            className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition ${
              deviceFrame === 'mobile' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Smartphone size={13} />
            <span>Mobile</span>
          </button>
          <button
            onClick={() => setDeviceFrame('tablet')}
            className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition ${
              deviceFrame === 'tablet' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Tablet size={13} />
            <span>Tablet</span>
          </button>
          <button
            onClick={() => setDeviceFrame('desktop')}
            className={`p-1.5 rounded-md text-xs flex items-center gap-1 transition ${
              deviceFrame === 'desktop' ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
            }`}
          >
            <Monitor size={13} />
            <span>Desktop</span>
          </button>
        </div>

        {/* Screen Navigator Buttons */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => setIndex((i) => Math.max(0, i - 1))}
            disabled={index <= 0}
            className="p-1 rounded hover:bg-slate-800 disabled:opacity-30"
          >
            <ChevronLeft size={16} />
          </button>
          <button
            onClick={() => setIndex((i) => Math.min(artboards.length - 1, i + 1))}
            disabled={index >= artboards.length - 1}
            className="p-1 rounded hover:bg-slate-800 disabled:opacity-30"
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
        <div className="fixed top-18 z-50 px-4 py-2 bg-slate-900/95 border border-amber-500/80 text-amber-300 rounded-full font-bold text-xs shadow-2xl flex items-center gap-2 animate-in fade-in slide-in-from-top-2">
          <Zap size={14} className="text-amber-400 fill-amber-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Interactive Device Sandbox */}
      <main className="flex-1 w-full flex items-center justify-center p-4 overflow-auto">
        <div
          className={`bg-slate-950 rounded-3xl shadow-2xl overflow-hidden border-8 border-slate-900 transition-all duration-200 relative ${
            deviceFrame === 'mobile' ? 'ring-1 ring-slate-800' : ''
          }`}
          style={{ width: `${width}px`, height: `${height}px` }}
        >
          {deviceFrame === 'mobile' && (
            <div className="h-6 bg-slate-900 w-full flex items-center justify-center shrink-0">
              <div className="w-24 h-4 bg-black rounded-b-xl" />
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
            />
          </div>
        </div>
      </main>

      <footer className="text-xs text-slate-500 py-1 font-mono">
        인터랙티브 모드 가동 중 · 화면 내 버튼 클릭 시 연결된 화면으로 전환 (좌/우 방향키 또는 Esc)
      </footer>
    </div>
  );
};
