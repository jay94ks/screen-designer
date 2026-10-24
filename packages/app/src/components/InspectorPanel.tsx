import React from 'react';
import { Sliders, MousePointer, Palette, CheckCircle2 } from 'lucide-react';

interface InspectorPanelProps {
  selectedElement: any | null;
  sliderOverrides: Record<string, any>;
  onSliderChange: (key: string, value: any) => void;
  designTokens: Record<string, string>;
  onTokenChange: (key: string, value: string) => void;
}

export const InspectorPanel: React.FC<InspectorPanelProps> = ({
  selectedElement,
  sliderOverrides,
  onSliderChange,
  designTokens,
  onTokenChange
}) => {
  const radius = sliderOverrides.borderRadius ?? 8;
  const paddingScale = sliderOverrides.paddingScale ?? 1;

  return (
    <aside className="w-80 border-l border-slate-800 bg-slate-900/95 flex flex-col shrink-0 h-full overflow-y-auto">
      {/* Panel Header */}
      <div className="p-4 border-b border-slate-800 flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-400">
          <Sliders size={14} className="text-blue-400" />
          <span>Live Inspector & Sliders</span>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* 1. Element Inspector Info */}
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <MousePointer size={13} className="text-blue-400" />
            <span>선택된 엘리먼트</span>
          </div>

          {selectedElement ? (
            <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 space-y-2 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-mono text-blue-400 font-bold uppercase">
                  &lt;{selectedElement.elementTag}&gt;
                </span>
                {selectedElement.elementId && (
                  <span className="text-[11px] text-slate-500 font-mono">
                    #{selectedElement.elementId}
                  </span>
                )}
              </div>

              {selectedElement.textSnippet && (
                <div className="text-slate-300 italic truncate bg-slate-900 p-1.5 rounded border border-slate-800/80">
                  "{selectedElement.textSnippet}"
                </div>
              )}

              <div className="text-[11px] text-slate-400 space-y-0.5 font-mono pt-1">
                <div>Font: {selectedElement.appliedStyles?.fontSize || '-'}</div>
                <div>Color: {selectedElement.appliedStyles?.color || '-'}</div>
                <div>Radius: {selectedElement.appliedStyles?.borderRadius || '-'}</div>
              </div>
            </div>
          ) : (
            <div className="p-4 text-center rounded-xl border border-dashed border-slate-800 text-xs text-slate-500">
              화면 속 아무 요소를 클릭하면 실시간 스타일 정보가 표시됩니다.
            </div>
          )}
        </div>

        {/* 2. Dynamic Sliders (Claude Design 스타일 실시간 파라미터 튜닝) */}
        <div className="space-y-4">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Sliders size={13} className="text-emerald-400" />
            <span>실시간 디자인 슬라이더 (0-Delay)</span>
          </div>

          {/* Border Radius Slider */}
          <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">모서리 곡률 (Border Radius)</span>
              <span className="font-mono text-blue-400 font-bold">{radius}px</span>
            </div>
            <input
              type="range"
              min="0"
              max="32"
              value={radius}
              onChange={(e) => onSliderChange('borderRadius', Number(e.target.value))}
              className="w-full accent-blue-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>

          {/* Padding Scale Slider */}
          <div className="space-y-1.5 bg-slate-950 p-3 rounded-xl border border-slate-800">
            <div className="flex justify-between text-xs">
              <span className="text-slate-400">여백 배율 (Padding Scale)</span>
              <span className="font-mono text-emerald-400 font-bold">{paddingScale}x</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2.0"
              step="0.1"
              value={paddingScale}
              onChange={(e) => onSliderChange('paddingScale', Number(e.target.value))}
              className="w-full accent-emerald-500 cursor-pointer h-1.5 bg-slate-800 rounded-lg"
            />
          </div>
        </div>

        {/* 3. Design Tokens (Colors) */}
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-300">
            <Palette size={13} className="text-indigo-400" />
            <span>브랜드 포인트 컬러</span>
          </div>

          <div className="grid grid-cols-5 gap-2 bg-slate-950 p-3 rounded-xl border border-slate-800">
            {['#3b82f6', '#10b981', '#f59e0b', '#ec4899', '#8b5cf6'].map((color) => (
              <button
                key={color}
                onClick={() => onTokenChange('primaryColor', color)}
                className="h-8 rounded-lg flex items-center justify-center transition transform active:scale-90"
                style={{ backgroundColor: color }}
              >
                {designTokens.primaryColor === color && (
                  <CheckCircle2 size={14} className="text-white drop-shadow" />
                )}
              </button>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
};
